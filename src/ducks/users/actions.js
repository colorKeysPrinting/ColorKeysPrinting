'use strict';

import axios            from 'axios';
import Network          from 'libs/constants/network';

// /////////////////////////////////////
//             ACTION TYPES
// /////////////////////////////////////
export const ActionTypes = {
    GET_USERS_SUCCESS : 'sibi_ge_admin/users/GET_USERS_SUCCESS',
    APPROVE_USER_SUCCESS : 'sibi_ge_admin/users/APPROVE_USER_SUCCESS',
    DISABLE_USER_SUCCESS : 'sibi_ge_admin/users/DISABLE_USER_SUCCESS',
    GET_FUNDS_SUCCESS : 'sibi_ge_admin/users/GET_FUNDS_SUCCESS',
    GET_FUND_PROPERTIES_SUCCESS : 'sibi_ge_admin/users/GET_FUND_PROPERTIES_SUCCESS',
}

// /////////////////////////////////////
//             LOCAL ACTIONS
// /////////////////////////////////////

// /////////////////////////////////////
//             ASYNC CALLS
// /////////////////////////////////////
export function getUsers({ token, users }) {
    return (dispatch) => {
        return axios({
            method  : Network.GET,
            url     : `${Network.DOMAIN}/usersForFund`,
            headers : {
                'x-auth-token': token
            }
        })
            .then(payload => {
                dispatch({ type: ActionTypes.GET_USERS_SUCCESS , ...payload });
            })
            .catch(error => {
                throw(error);
            });
    }
}

export function approveUser({ token, id }) {
    return (dispatch) => {
        return axios({
            method  : Network.POST,
            url     : `${Network.DOMAIN}/users/${id}/approve`,
            headers : {
                'x-auth-token': token
            }
        })
            .then(payload => {
                dispatch({ type: ActionTypes.APPROVE_USER_SUCCESS , ...payload });
            })
            .catch(error => {
                throw(error);
            });
    }
}

export function disableUser({ token, id }) {
    return (dispatch) => {
        return axios({
            method  : Network.GET,
            url     : `${Network.DOMAIN}/users/${id}/disable`,
            headers : {
                'x-auth-token': token
            }
        })
            .then(payload => {
                dispatch({ type: ActionTypes.DISABLE_USER_SUCCESS , ...payload });
            })
            .catch(error => {
                throw(error);
            });
    }
}

export function getFunds({ token, emailDomain }) {
    return (dispatch) => {
        return axios({
            method  : Network.GET,
            url     : `${Network.DOMAIN}/funds?fundEmailDomain=${emailDomain}`,
            headers : {
                'x-auth-token': token
            }
        })
            .then(payload => {
                dispatch({ type: ActionTypes.GET_FUNDS_SUCCESS , ...payload });
            })
            .catch(error => {
                throw(error);
            });
    }
}

export function getFundProperties({ token }) {
    return (dispatch) => {
        return axios({
            method  : Network.GET,
            url     : `${Network.DOMAIN}/fundsProperties`,
            headers : {
                'x-auth-token': token
            }
        })
            .then(payload => {
                dispatch({ type: ActionTypes.GET_FUND_PROPERTIES_SUCCESS , ...payload });
            })
            .catch(error => {
                throw(error);
            });
    }
}
