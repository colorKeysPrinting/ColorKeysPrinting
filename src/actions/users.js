'use strict';

import axios            from 'axios';
import ActionTypes      from 'actions/action_types';
import Network          from 'libs/constants/network';

// /////////////////////////////////////
//             helper functions
// /////////////////////////////////////
const getUsersSuccess = (payload) => {
    return {
        type: ActionTypes.GET_USERS_SUCCESS,
        ...payload
    }
}
const approveUserSuccess = (payload) => {
    return {
        type: ActionTypes.APPROVE_USER_SUCCESS,
        ...payload
    }
}
const disableUserSuccess = (payload) => {
    return {
        type: ActionTypes.DISABLE_USER_SUCCESS,
        ...payload
    }
}
const getFundsSuccess = (payload) => {
    return {
        type: ActionTypes.GET_FUNDS_SUCCESS,
        ...payload
    }
}
const getFundPropertiesSuccess = (payload) => {
    return {
        type: ActionTypes.GET_FUND_PROPERTIES_SUCCESS,
        ...payload
    }
}

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
                dispatch(getUsersSuccess(payload));
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
                dispatch(approveUserSuccess(payload));
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
                dispatch(disableUserSuccess(payload));
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
                dispatch(getFundsSuccess(payload));
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
                dispatch(getFundPropertiesSuccess(payload));
            })
            .catch(error => {
                throw(error);
            });
    }
}