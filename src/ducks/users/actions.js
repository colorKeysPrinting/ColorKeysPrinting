'use strict';

import Api                      from 'libs/network';

// /////////////////////////////////////
//             ACTION TYPES
// /////////////////////////////////////
export const ActionTypes = {
    GET_USERS_SUCCESS : 'sibi_ge_admin/users/GET_USERS_SUCCESS',
    APPROVE_USER_SUCCESS : 'sibi_ge_admin/users/APPROVE_USER_SUCCESS',
    AUTO_APPROVE_USER_ORDERS: 'sibi_ge_admin/users/AUTO_APPROVE_USER_ORDERS',
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
export function getUsers({ type }) {
    return (dispatch) => {
        type = (type === 'superAdmin') ? 'usersForSuperAdmin' : 'usersForFund';
        return Api({ url : `/${type}` })
            .then(payload => {
                dispatch({ type: ActionTypes.GET_USERS_SUCCESS , ...payload });
            })
            .catch(error => {
                alert(`Error: ${error.response.data.statusCode} - ${error.response.data.message}`);
                throw(error);
            });
    }
}

export function approveUser({ id }) {
    return (dispatch) => {
        return Api({
            method  : 'post',
            url     : `/users/${id}/approve`
        })
            .then(payload => {
                dispatch({ type: ActionTypes.APPROVE_USER_SUCCESS , ...payload });
            })
            .catch(error => {
                alert(`Error: ${error.response.data.statusCode} - ${error.response.data.message}`);
                throw(error);
            });
    }
}

export function autoApproveUserOrders( { user, autoApprovedOrders }) {
    return (dispatch) => {
        autoApprovedOrders = (autoApprovedOrders) ? 'autoApproveOrders' : 'removeAutoApproveOrders' ;
        return Api({
            method  : 'post',
            url     : `/users/${user.id}/${autoApprovedOrders}`,
            data: {
                ...user
            }
        })
            .then(payload => {
                dispatch({ type: ActionTypes.AUTO_APPROVE_USER_ORDERS, ...payload});
            })
            .catch(error => {
                alert(`Error: ${error.response.data.statusCode} - ${error.response.data.message}`);
                throw(error);
            })
    }
}

export function disableUser({ id }) {
    return (dispatch) => {
        return Api({ url : `/users/${id}/disable` })
            .then(payload => {
                dispatch({ type: ActionTypes.DISABLE_USER_SUCCESS , ...payload });
            })
            .catch(error => {
                alert(`Error: ${error.response.data.statusCode} - ${error.response.data.message}`);
                throw(error);
            });
    }
}

export function getFunds({ emailDomain }) {
    return (dispatch) => {
        return Api({ url : `/funds?fundEmailDomain=${emailDomain}` })
            .then(payload => {
                dispatch({ type: ActionTypes.GET_FUNDS_SUCCESS , ...payload });
            })
            .catch(error => {
                alert(`Error: ${error.response.data.statusCode} - ${error.response.data.message}`);
                throw(error);
            });
    }
}

export function getFundProperties() {
    return (dispatch) => {
        return Api({ url : `/fundsProperties` })
            .then(payload => {
                dispatch({ type: ActionTypes.GET_FUND_PROPERTIES_SUCCESS , ...payload });
            })
            .catch(error => {
                alert(`Error: ${error.response.data.statusCode} - ${error.response.data.message}`);
                throw(error);
            });
    }
}
