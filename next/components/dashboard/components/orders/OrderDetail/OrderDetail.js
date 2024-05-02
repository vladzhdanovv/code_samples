import React, { useEffect } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { useRouter } from 'next/router';
import { useTranslation } from 'i18n';
import styled from 'styled-components';
import _get from 'lodash/get';

// Actions
import { fetchOrderIntegrationStatus, getOrder, updateOrder } from 'store/orders/actions';

// Components
import { OrderDetailsWrapper } from './order-details-wrapper';
import { Button } from 'components/commonBlocks/buttons';
import { StepsPage } from './steps/steps.page';
import { ExportOrderCsv } from './ExportOrderCsv';
import { Alert } from 'components/commonBlocks/Alert';
import Loader from 'components/commonBlocks/Loader';

// Constants
import { H3, RADIUS, SmallTagStyled, SPACINGS, COLORS, SECONDARY_SHADOW, NORMAL_SHADOW } from 'style/constants';

// Helpers
import { MIXINS } from 'style/helpers';
import { STORE_STATUSES } from 'utils/storeStatuses';
import {InfoNotification} from 'dashboard/components/components';


const Styled = {
    Header: styled.div`
      box-shadow: ${NORMAL_SHADOW}, ${SECONDARY_SHADOW};
      border-radius: ${RADIUS.XS};
    `,
    TitleRow: styled.div`
      display: flex;
      justify-content: space-between;
      ${MIXINS.border(COLORS.NEUTRAL._400, 'bottom')};
      padding-bottom: ${SPACINGS.S};
      padding-top: ${SPACINGS.S};
      padding-left: ${SPACINGS.M};
      padding-right: ${SPACINGS.S};

      ${H3} {
        color: ${COLORS.SECONDARY._1000};
        word-break: break-word;
      }
    `,
    Actions: styled.div`
      flex-shrink: 0;
    `,
    ReadOnlyNote: styled(InfoNotification)`
      margin: ${SPACINGS.M} 0;
    `,
};

export const OrderDetail = ({status, getOrder, order, updateOrder, accessGranted, fetchOrderIntegrationStatus}) => {
    const { t } = useTranslation(['workspace', 'dashboardTables', 'orderDetails', 'links', 'common']);
    const router = useRouter();

    const orderId = _get(router, 'query.orderId');

    useEffect(() => {
        const getOrderById = async(orderId) => {
            if (orderId) {
                await getOrder(orderId);
                await fetchOrderIntegrationStatus(orderId);
            }
        };

        getOrderById(orderId);

    }, [orderId]);

    const saveOrder = async (order) => {
        try {
            let data = {...order};
            if (data.products) {
                data.products = data.products.map(product => ({
                    ...product,
                    unit: product.unit.name
                }));
            }
            await updateOrder(data.id, data);
            await getOrder(data.id);
        } catch (e) /* istanbul ignore next */ {
            if (_get(e, 'payload.response.status') == 403) {
                Alert.error(`${_get(e, 'payload.response.data.requestStatus')}. ${_get(e, 'payload.response.data.message')}`);
            } else {
                Alert.error(t('common:someError'));
            }
            throw e;
        }
    };

    const cancel = async () => {
        await saveOrder({
            ...order,
            phase: 'canceled'
        });
        Alert.success(t('orderDetails:messages.canceled'));
    };

    return (
        <Loader withChild show={status === STORE_STATUSES.PENDING || !_get(order, 'id')}>
            <OrderDetailsWrapper order={order} availableChannels={accessGranted?.channels || []}>
                { !_get(order, 'factoryLocationCustomer.factoryLocation.isLogistic', false) && <Styled.ReadOnlyNote type='error' text={t('workspace:order.readOnlyNote')}/>}
                <Styled.Header>
                    <Styled.TitleRow>
                        <H3>{t('orderDetails:layout.title', order)} &nbsp;→&nbsp; {_get(order, 'factoryLocationCustomer.factoryCustomer.user.fullName')} </H3>
                        <Styled.Actions>
                            {_get(order, 'currentPhase.orderPhase.name') == 'canceled' ? <SmallTagStyled>{t('workspace:order.phases.canceled')}</SmallTagStyled> : <Button disabled={!_get(order, 'factoryLocationCustomer.factoryLocation.isLogistic', false)} data-id="cancel-button" color={'danger'} onClick={cancel} className='inline'>{t('orderDetails:buttons.cancelOrder')}</Button>}
                        </Styled.Actions>
                    </Styled.TitleRow>
                </Styled.Header>

                <Styled.Header>
                    <StepsPage
                        saveOrder={saveOrder}
                    />
                </Styled.Header>

                {_get(order, 'id', null) &&
                <Styled.Header>
                    <ExportOrderCsv orderId={order.id}/>
                </Styled.Header>
                }
            </OrderDetailsWrapper>
        </Loader>
    );
};

OrderDetail.propTypes = {
    order: PropTypes.object,
    status: PropTypes.string,
    getOrder: PropTypes.func,
    updateOrder: PropTypes.func,
    accessGranted: PropTypes.object,
    fetchOrderIntegrationStatus: PropTypes.func,
};

const mapStateToProps = state => ({
    user: state.auth.user,
    status: state.orders.status,
    order: state.orders.item,
    accessGranted: state.chat.session?.accessGranted
});

export default connect(mapStateToProps, {
    getOrder,
    updateOrder,
    fetchOrderIntegrationStatus
})(OrderDetail);
