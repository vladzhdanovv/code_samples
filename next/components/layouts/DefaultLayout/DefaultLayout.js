import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import ScrollableAnchor from 'react-scrollable-anchor';
import { useTranslation } from 'i18n';
import Styles from './styles';

// Components
import Header from '../parts/Header/DefaultHeader';
import Footer from '../parts/Footer';
import Content from 'components/layouts/parts/AppContent';
import ReAuthPopup from '../../commonBlocks/ReAuthPopup/ReAuthPopup';

// Helpers
import { stringContainPart } from 'utils/helpers';

export const DefaultLayout = ({
    notFound,
    router,
    children,
    headerMode,
    isWorkspaceLanding,
    forceFooter,
    landingHeader,
    forceHeader,
    isErrorPage,
    color
}) => {
    const { t } = useTranslation('links');
    const displayFooterExcept = [
        t('links:recovery'),
        t('links:quote'),
        t('links:workspace'),
        t('links:workspace.invite-code'),
    ];

    const displayFooter = forceFooter ? true : !stringContainPart(router.asPath, displayFooterExcept);
    return (
        <Styles
            isDisplayFooter={displayFooter}
        >
            <div className={'layout-main-wrapper'}>
                <ScrollableAnchor id={'page-header'}>
                    <div>
                        <Header
                            color={color}
                            landingHeader={landingHeader}
                            forceHeader={forceHeader}
                            notFound={notFound}
                            mode={headerMode}
                            router={router}
                            isWorkspaceLanding={isWorkspaceLanding}
                            isErrorPage={isErrorPage}
                        />
                    </div>
                </ScrollableAnchor>
                <Content hidden={false}>{children}</Content>
                <ReAuthPopup />
                {displayFooter && <Footer mode={headerMode} />}
            </div>
        </Styles>
    );
};

DefaultLayout.propTypes = {
    notFound: PropTypes.bool,
    router: PropTypes.object,
    children: PropTypes.node,
    headerMode: PropTypes.string,
    color: PropTypes.string,
    isWorkspaceLanding: PropTypes.bool,
    landingHeader: PropTypes.bool,
    forceFooter: PropTypes.bool,
    forceHeader: PropTypes.bool,
    isErrorPage: PropTypes.bool,
};

DefaultLayout.defaultProps = {
    notFound: false,
    router: {},
    headerMode: '',
    isWorkspaceLanding: false,
    forceFooter: false,
    forceHeader: false,
    isErrorPage: false,
};

const mapStateToProps = ({ auth }) => ({
    isAuthenticated: auth.isAuthenticated,
    status: auth.status,
    user: auth.user,
});

export default connect(mapStateToProps, null)(DefaultLayout);
