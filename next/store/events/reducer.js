import { success, error } from '@redux-requests/core';

// Actions types
import {
    SET_EVENT_PAGINATION,
    SET_EVENT_FILTERS,
    SET_EVENT_SORT,
    GET_EVENT_LIST,
    CREATE_EVENT,
    UPDATE_EVENT,
    DELETE_EVENT,
    GET_RECIPIENTS_LIST,
    SET_EVENT_DATA,
    SET_RECIPIENTS_PAGINATION,
    CLEAR_RECIPIENTS_LIST,
    REVERT_EVENT_TO_DRAFT,
    GET_EVENT_STATISTICS
} from './actions';

// Helpers
import { STORE_STATUSES } from 'utils/storeStatuses';
import { getException } from 'utils/reducerHelpers';
import { INITIAL_PAGINATION_DATA, paginationResultData, paginationState } from 'utils/paginationHelpers';

export const initialException = {
    errors: {},
    message: ''
};

export const initialState = {
    items: [],
    item: {},
    statistics: {},
    eventRecipients: {
        items: [],
        status: STORE_STATUSES.INIT,
        pagination: INITIAL_PAGINATION_DATA,
    },
    status: STORE_STATUSES.INIT,
    pagination: INITIAL_PAGINATION_DATA,
    filters: {},
    listQuery: {
        include: 'image,notificationTypes,activityLogEventsChatMessagesOpenedCount'
    },
    sort: {},
    exception: {
        message: null,
        errors: {},
    },
};


/**
 * @param {typeof initialState} state
 * @param {import('store/types').ReduxAction} action
 *
 * @returns {typeof initialState}
 */
export default (state = initialState, action) => {
    switch (action.type) {
        // falls through
        case GET_EVENT_LIST:
        case CREATE_EVENT:
        case REVERT_EVENT_TO_DRAFT: {
            return processReducer(state);
        }

        case SET_RECIPIENTS_PAGINATION: {
            const paginationData = paginationState(action, state.eventRecipients);
            return {
                ...state,
                eventRecipients: {
                    ...state.eventRecipients,
                    pagination: paginationData
                }
            };
        }

        case GET_RECIPIENTS_LIST: {
            return {
                ...state,
                eventRecipients: {
                    ...state.eventRecipients,
                    status: STORE_STATUSES.PENDING,
                }
            };
        }

        case SET_EVENT_PAGINATION: {
            return {
                ...state,
                pagination: paginationState(action, state)
            };
        }

        case SET_EVENT_FILTERS: {
            return {...state, filters: action.payload.data};
        }

        case SET_EVENT_SORT: {
            return {
                ...state,
                sort: {...action.payload.data}
            };
        }

        case SET_EVENT_DATA: {
            return {
                ...state,
                items: state.items.map(item => item.id === action.payload.data.id ? action.payload.data : item),
                item: action.payload.data
            };
        }

        case CLEAR_RECIPIENTS_LIST: {
            return {
                ...state,
                eventRecipients: initialState.eventRecipients
            };
        }

        case success(GET_EVENT_STATISTICS): {
            return {
                ...state,
                statistics: {
                    ...state.statistics,
                    [action.meta.eventId]: action.payload.data.data,
                }
            };
        }

        case success(GET_EVENT_LIST): {
            const actionData = action.payload.data.data;
            return paginationResultData(actionData, state);
        }

        case success(CREATE_EVENT): {
            return {
                ...state,
                item: {
                    ...action.payload.data.data,
                    isCopy: false
                },
                status: STORE_STATUSES.READY,
            };
        }

        case success(UPDATE_EVENT): {
            const data = action.payload.data.data;
            return {
                ...state,
                item: {
                    ...state.item,
                    ...data
                },
                status: STORE_STATUSES.READY,
            };
        }

        case success(DELETE_EVENT): {
            const eventId = action.meta.eventId;
            return {
                ...state,
                items: state.items.filter(item => item.id !== eventId),
                status: STORE_STATUSES.READY,
            };
        }

        case success(GET_RECIPIENTS_LIST): {
            const actionData = action.payload.data.data;
            const resultData = paginationResultData(actionData, state.eventRecipients);

            return {
                ...state,
                eventRecipients: {
                    ...state.eventRecipients,
                    ...resultData
                }
            };
        }

        case success(REVERT_EVENT_TO_DRAFT): {
            const actionData = action.payload.data.data;
            const items = state.items.map(item => item.id === actionData.id ? {...item, ...actionData} : item);

            return {
                ...state,
                items,
                status: STORE_STATUSES.READY
            };
        }

        case error(GET_EVENT_LIST):
        case error(CREATE_EVENT):
        case error(GET_RECIPIENTS_LIST):
        case error(REVERT_EVENT_TO_DRAFT): {
            return errorReducer(state, action);
        }

        default:
            return state;
    }
};


const errorReducer = (state = initialState, exception = {}) => {
    return getException(state, exception);
};

const processReducer = state => ({
    ...state,
    status: STORE_STATUSES.PENDING,
    exception: {...initialState.exception}
});
