import React, { useEffect } from 'react';
import { connect } from 'react-redux';
import { i18n, useTranslation } from 'i18n';
import { getRouteByName, Router, setParams } from 'routes';
import PropTypes from 'prop-types';

// Components
import { ListBasicPage } from 'components/layouts/list.basic-page';
import { DashboardLayout } from 'components/layouts/dashboard';
import { Alert } from 'components/commonBlocks/Alert';

// Helpers
import { fetchItems, onListFilterChange } from 'utils/listHelper';
import isDashboardRouteAllowed from 'hoc/isDashboardRouteAllowed';
import { errorReason } from 'utils/fileHelper';

// Actions
import {
    factoriesList,
    deleteFactory,
    setFactoriesFilters,
    setFactoriesSort,
    setFactoriesPagination
} from 'store/factories/actions';

// Configs
import { getFactoriesListConfigs } from 'components/dashboard/components/factories/factories-list.configs';
import { filtersConfig } from 'utils/filtersConfig';


const FactoriesListPage = (props) => {
    const { t } = useTranslation(['jobsList', 'workspace', 'dashboardTables', 'quote']);
    const { router, pageName, setPagination, setFilters, getList, deleteFactory, status, pagination, factories,
        detailsPageName, setSort } = props;

    useEffect(()=>{
        (async () => await fetchFactories(router.query, true))();
    },[]);

    const onFilterChange = async (type, value) => {
        const filterTypes = ['search', 'order', 'perPage', 'sort'];
        await onListFilterChange(type, value, pageName, filterTypes, fetchFactories);
    };

    const fetchFactories = async (query = {}, isPaginationReloaded = false) => {
        await fetchItems(query, {
            getList,
            setSort,
            setFilters,
            setPagination
        }, isPaginationReloaded);
    };

    const onFactoryClick = (item) => {
        const detailsRoute = getRouteByName(detailsPageName);
        if (!detailsRoute) {
            return;
        }

        const detailsPath = detailsRoute.patterns[i18n.language];
        const asPath = setParams(detailsPath, (k) => k === 'factoryId' ? item.id : '');
        Router.pushRoute(`/${asPath}`);
    };

    const onDeleteFactoryClick = async (item) => {
        try {
            await deleteFactory(item.id);
            await fetchFactories(router.query);
            Alert.success(t('workspace:dashboard.deleteFactory.successMessage'));
        } catch (e) {
            Alert.error(errorReason(e) || t('common:someError'));
        }
    };

    const getListConfigs = () => {
        return getFactoriesListConfigs({
            t,
            onFactoryClick,
            onDeleteFactoryClick
        });
    };

    const getFiltersConfigs = () => {
        const orderBy = ['createdAt', 'name'];
        const settings = {
            pagination: {},
            sort: {orderBy},
        };

        return filtersConfig(router.query, onFilterChange, settings, t);
    };

    return (
        <DashboardLayout {...props} pageTitleKeys={props.pageTitleKeys}>
            <ListBasicPage
                title={t('workspace:factoriesList.overview')}
                status={status}
                items={factories}
                listConfigs={getListConfigs()}
                filtersConfigs={getFiltersConfigs()}
                pagination={pagination}
                setPagination={setPagination}
                router={router}
                onFilterChange={onFilterChange}
            />
        </DashboardLayout>
    );
};

FactoriesListPage.propTypes = {
    router: PropTypes.object,
    pagination: PropTypes.object,
    factories: PropTypes.array,
    pageName: PropTypes.string,
    detailsPageName: PropTypes.string,
    status: PropTypes.string,
    setFilters: PropTypes.func,
    setPagination: PropTypes.func,
    getList: PropTypes.func,
    deleteFactory: PropTypes.func,
    setSort: PropTypes.func,
    pageTitleKeys: PropTypes.array
};

const mapStateToProps = state => ({
    factories: state.factories.items,
    activeFactory: state.factories.activeFactory,
    categories: state.configs.jobCategories,
    pagination: state.factories.pagination,
    filters: state.factories.filters,
    status: state.factories.status,
});

const mapDispatchToProps = dispatch => ({
    setPagination: data => dispatch(setFactoriesPagination(data)),
    getList: () => dispatch(factoriesList()),
    deleteFactory: id => dispatch(deleteFactory(id)),
    setFilters: data => dispatch(setFactoriesFilters(data)),
    setSort: data => dispatch(setFactoriesSort(data))
});

export default connect(mapStateToProps, mapDispatchToProps)(isDashboardRouteAllowed(FactoriesListPage));
