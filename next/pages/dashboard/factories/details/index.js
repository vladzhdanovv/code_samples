import React from 'react';

// Actions
import {
    getFactory,
    getFactoryMembers,
} from 'store/factories/actions';
import { fetchConfigs } from 'store/configs/actions';

// Components
import { DashboardLayout } from 'components/layouts/dashboard';
import FactoryDetailsComponent from 'components/dashboard/components/pages/factory-details.page';

// Constants
import {commonNamespaces} from 'utils/constants';

// Helpers
import isDashboardRouteAllowed from 'hoc/isDashboardRouteAllowed';

const FactoryDetails = (props) => (
    <DashboardLayout {...props}>
        <FactoryDetailsComponent />
    </DashboardLayout>
);

FactoryDetails.getInitialProps = async (ctx) => {
    const { reduxStore, query } = ctx;
    const { factoryId } = query;

    await reduxStore.dispatch(fetchConfigs(['job-categories']));
    await reduxStore.dispatch(getFactory(factoryId));
    await reduxStore.dispatch(getFactoryMembers(factoryId));

    const namespacesRequired = [...commonNamespaces, 'dashboardLayout', 'dashboardTables', 'workspace'];

    return { namespacesRequired };
};

export default isDashboardRouteAllowed(FactoryDetails);

