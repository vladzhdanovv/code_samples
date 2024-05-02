import StackListRouter, {stackListRoutes} from './stackList/index.js';

const routes = {
    stackList: {
        prefix: '/cl',
        ...stackListRoutes,
    }
};

const router = [
    [routes.stackList.prefix, StackListRouter],
];

export default router;
