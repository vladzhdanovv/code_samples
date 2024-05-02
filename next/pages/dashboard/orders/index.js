import React from 'react';
import {routeList} from 'routes';

// Hoc
import isDashboardRouteAllowed from 'hoc/isDashboardRouteAllowed';

// Constants
import { commonNamespaces } from 'utils/constants';

// Components
import OrdersList from 'components/dashboard/components/orders/OrdersList';

// Actions
import { fetchConfigs } from 'store/configs/actions';

const Orders = (props) => {
    const pageName = routeList.workspaceDashboardOrders.page;
    const detailsPageName = routeList.workspaceDashboardOrderDetail.page;

    return (
        <OrdersList
            {...props}
            pageName={pageName}
            detailsPageName={detailsPageName}
        />
    );
};


Orders.getInitialProps = async ({reduxStore}) => {
    const namespacesRequired = [...commonNamespaces, 'dashboardLayout', 'dashboardTables'];
    await reduxStore.dispatch(fetchConfigs(['order-phases', 'prohibis-integration-statuses']));

    return { namespacesRequired };
};

export default isDashboardRouteAllowed(Orders);
