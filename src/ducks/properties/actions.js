'use strict';

import Api                      from 'libs/network';

// /////////////////////////////////////
//             ACTION TYPES
// /////////////////////////////////////
export const ActionTypes = {
    GET_FUNDS_SUCCESS           : 'sibi_ge_admin/properties/GET_FUNDS_SUCCESS',
    GET_FUND_PROPERTIES_SUCCESS : 'sibi_ge_admin/properties/GET_FUND_PROPERTIES_SUCCESS',
    GET_PROPERTIES_SUCCESS      : 'sibi_ge_admin/properties/GET_PROPERTIES_SUCCESS',
}

// /////////////////////////////////////
//             LOCAL ACTIONS
// /////////////////////////////////////

// /////////////////////////////////////
//             ASYNC CALLS
// /////////////////////////////////////
export function getFunds() {
    return (dispatch, getState) => {
        const email = (getState().activeUser.getIn(['activeUser','email'])).toLowerCase();
        const match = email.match(/^.*@(.+)$/)

        return Api({ url : `/funds?fundEmailDomain=${match[1]}` })
            .then(payload => {
                dispatch({ type: ActionTypes.GET_FUNDS_SUCCESS , ...payload });
            })
    }
}

export function getFundProperties() {
    return (dispatch) => {
        return Api({ url : `/fundsProperties` })
            .then(payload => {
                dispatch({ type: ActionTypes.GET_FUND_PROPERTIES_SUCCESS , ...payload });
            })
    }
}

export function getProperties() {
    return (dispatch) => {
        return Api({ url : `/properties` })
            .then(payload => {
                dispatch({ type: ActionTypes.GET_PROPERTIES_SUCCESS , ...payload });
            })
    }
}

export function createProperty({ property }) {
    return (dispatch) => {
        return Api({
            method  : 'post',
            url     : `/properties`,
            data    : {
                ...property
            }
        })
            .then(payload => {
                dispatch(getFundProperties());
            })
    }
}

export function archiveProperty({ id }) {
    return (dispatch) => {
        return Api({
            method  : 'post',
            url     : `/properties/${id}/archive`
        })
            .then(payload => {
                dispatch(getFundProperties());
            })
    }
}

export function unarchiveProperty({ id }) {
    return (dispatch) => {
        return Api({
            method  : 'post',
            url     : `/properties/${id}/unarchive`
        })
            .then(payload => {
                dispatch(getFundProperties());
            })
    }
}