import React from 'react';
import { routeList } from 'routes';

// Components
import FactoriesListPage from 'components/dashboard/components/pages/factories-list.page';

// Constants
import { commonNamespaces } from 'utils/constants';

// Helpers
import isDashboardRouteAllowed from 'hoc/isDashboardRouteAllowed';

const Factories = (props) => {
    const detailsPageName = routeList.workspaceDashboardFactoryDetails.page;
    const pageName = routeList.workspaceDashboardFactories.page;

    return (
        <FactoriesListPage
            {...props}
            detailsPageName={detailsPageName}
            pageName={pageName}
        />
    );
};

Factories.getInitialProps = async () => {
    const namespacesRequired = [...commonNamespaces, 'dashboardLayout', 'dashboardTables', 'workspace'];
    return {
        namespacesRequired
    };
};

export default isDashboardRouteAllowed(Factories);
