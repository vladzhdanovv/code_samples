import React from 'react';

// Components
import OrderDetail from 'components/dashboard/components/orders/OrderDetail';

// Hoc
import isDashboardRouteAllowed from 'hoc/isDashboardRouteAllowed';

// Constants
import { commonNamespaces } from 'utils/constants';


// Components
import { DashboardLayout } from 'components/layouts/dashboard';

const OrdersDetail = (props) => (
    <DashboardLayout
        {...props}
        titleKey={'dashboard.orders'}
    >
        <OrderDetail/>
    </DashboardLayout>
);

OrdersDetail.getInitialProps = async () => {
    const namespacesRequired = [...commonNamespaces, 'dashboardLayout', 'dashboardTables'];
    return { namespacesRequired };
};

export default isDashboardRouteAllowed(OrdersDetail);
