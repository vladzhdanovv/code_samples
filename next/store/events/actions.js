import { makeQueryString } from 'utils/helpers';
import { initialState } from './reducer';
import get from 'lodash/get';


export const SET_EVENT_PAGINATION = 'SET_EVENT_PAGINATION';
export const setEventsPagination = data => ({
    type: SET_EVENT_PAGINATION,
    payload: {
        data
    }
});

export const SET_EVENT_FILTERS = 'SET_EVENT_FILTERS';
export const setEventsFilter = data => {
    return {
        type: SET_EVENT_FILTERS,
        payload: {
            data
        }
    };
};

export const SET_EVENT_SORT = 'SET_EVENT_SORT';
export const setEventsSort = data => ({
    type: SET_EVENT_SORT,
    payload: {
        data
    }
});

export const GET_EVENT_LIST = 'GET_EVENT_LIST';
export const getEventsList = ({ factoryId }) => (dispatch, getState) => {
    const currentState = getState();
    const store = currentState.events ?? initialState;
    const paginationString = makeQueryString(store.pagination);
    const queryString = makeQueryString(store.listQuery);
    const sortString = makeQueryString(store.sort);
    const filtersString = makeQueryString(store.filters, 'filter');

    let queryParts = [paginationString, queryString, sortString, filtersString].filter(Boolean);

    return dispatch({
        type: GET_EVENT_LIST,
        payload: {
            request: {
                method: 'GET',
                url: `factories/${factoryId}/seo-events?${queryParts.join('&')}`
            }
        }
    });
};

export const CREATE_EVENT = 'CREATE_EVENT';
export const createEvent = (factoryId, data) => (dispatch) => dispatch({
    type: CREATE_EVENT,
    payload: {
        request: {
            method: 'POST',
            url: `factories/${factoryId}/seo-events`,
            data
        }
    },
    meta: {
        onSuccess: async (payload) => {
            await dispatch(getEventsList({ factoryId }));

            return payload;
        },
    },
});

export const UPDATE_EVENT = 'UPDATE_EVENT';
export const updateEvent = (eventId, data) => (dispatch) => dispatch({
    type: UPDATE_EVENT,
    payload: {
        request: {
            method: 'PATCH',
            url: `seo-events/${eventId}`,
            data
        }
    },
    meta: {
        onSuccess: async (payload) => {
            await dispatch(getEventsList({ factoryId: payload.data.data.factoryId }));

            return payload;
        },
    },
});

export const DELETE_EVENT = 'DELETE_EVENT';
export const deleteEvent = (eventId) => (dispatch) => dispatch({
    type: DELETE_EVENT,
    meta: {
        eventId
    },
    payload: {
        request: {
            method: 'DELETE',
            url: `seo-events/${eventId}`
        }
    }
});

export const GET_EVENT_STATISTICS = 'GET_EVENT_STATISTICS';
export const getEventStatistics = (eventId) => (dispatch) => dispatch({
    type: GET_EVENT_STATISTICS,
    meta: {
        eventId
    },
    payload: {
        request: {
            method: 'GET',
            url: `seo-events/${eventId}/activity-log-events/statistics`
        }
    }
});

export const GET_RECIPIENTS_LIST = 'GET_RECIPIENTS_LIST';
export const getRecipientsList = (factoryId, data) => (dispatch, getState) =>{
    const currentState = getState();
    const paginationData = get(currentState, 'events.eventRecipients.pagination', initialState.eventRecipients.pagination);
    const payloadData = {
        ...data,
        perPage: paginationData.perPage,
        page: paginationData.page
    };

    return dispatch({
        type: GET_RECIPIENTS_LIST,
        payload: {
            request: {
                method: 'POST',
                url: `/factories/${factoryId}/seo-events/recipients`,
                data: payloadData
            }
        }
    });
} ;

export const SET_RECIPIENTS_PAGINATION = 'SET_RECIPIENTS_PAGINATION';
export const setRecipientsPagination = data => ({
    type: SET_RECIPIENTS_PAGINATION,
    payload: {
        data
    }
});

export const CLEAR_RECIPIENTS_LIST = 'CLEAR_RECIPIENTS_LIST';
export const clearRecipientsList = () => ({
    type: CLEAR_RECIPIENTS_LIST,
});

export const SET_EVENT_DATA = 'SET_EVENT_DATA';
export const setEventData = (data) => ({
    type: SET_EVENT_DATA,
    payload: {
        data
    }
});

export const REVERT_EVENT_TO_DRAFT = 'REVERT_EVENT_TO_DRAFT';
export const revertEventToDraft = (id) => (dispatch) => dispatch({
    type: REVERT_EVENT_TO_DRAFT,
    payload: {
        request: {
            method: 'PATCH',
            url: `seo-events/${id}/draft`,
        }
    }
});

export const GET_EVENT_DESCRIPTION_PREVIEW = 'GET_DESCRIPTION_PREVIEW';
export const getEventDescriptionPreview = (marketingEventId, data) => (dispatch) => dispatch({
    type: GET_EVENT_DESCRIPTION_PREVIEW,
    payload: {
        request: {
            method: 'POST',
            url: `seo-events/${marketingEventId}/html`,
            data
        }
    }
});
