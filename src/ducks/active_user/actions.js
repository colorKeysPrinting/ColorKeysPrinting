'use strict';

import Api                      from 'libs/network';

// /////////////////////////////////////
//             ACTION TYPES
// /////////////////////////////////////
export const ActionTypes = {
    LOGOUT                   : 'sibi_ge_admin/activeUser/LOGOUT',
    RESET_LOGIN_ERROR        : 'sibi_ge_admin/activeUser/RESET_LOGIN_ERROR',
    RESET_SENT_EMAIL         : 'sibi_ge_admin/activeUser/RESET_SENT_EMAIL',
    LOGIN_SUCCESS            : 'sibi_ge_admin/activeUser/LOGIN_SUCCESS',
    LOGIN_ERROR              : 'sibi_ge_admin/activeUser/LOGIN_ERROR',
    FORGOT_PASSWORD_SUCCESS  : 'sibi_ge_admin/activeUser/FORGOT_PASSWORD_SUCCESS',
    PASSWORD_RESET_SUCCESS   : 'sibi_ge_admin/activeUser/PASSWORD_RESET_SUCCESS',
    GET_CURRENT_USER_SUCCESS : 'sibi_ge_admin/activeUser/GET_CURRENT_USER_SUCCESS',
}

// /////////////////////////////////////
//             LOCAL ACTIONS
// /////////////////////////////////////
export function logout() {
    return {
        type: ActionTypes.LOGOUT
    };
}

export function resetLoginError() {
    return {
        type: ActionTypes.RESET_LOGIN_ERROR
    };
}

export function resetSentEmail() {
    return {
        type: ActionTypes.RESET_SENT_EMAIL
    };
}

// /////////////////////////////////////
//             ASYNC CALLS
// /////////////////////////////////////
export function login({ email, password }) {
    return (dispatch) => {
        return Api({
            method  : 'post',
            url     : `/adminsignin`,
            data    : {
                email,
                password
            }
        })
            .then(payload => {
                dispatch({ type: ActionTypes.LOGIN_SUCCESS, ...payload });
            })
            .catch(error => {
                dispatch({ type: ActionTypes.LOGIN_ERROR, error });
            });
    }
}

export function forgotPassword({ email }) {
    return (dispatch) => {
        return Api({
            method  : 'post',
            url     : `/forgot`,
            data    : {
                email
            }
        })
            .then(payload => {
                dispatch({ type: ActionTypes.FORGOT_PASSWORD_SUCCESS, ...payload });
            })
            .catch(error => {
                alert(`Error: ${error.response.data.statusCode} - ${error.response.data.message}`);
                throw(error);
            });
    }
}

export function passwordReset({ password }) {
    return (dispatch) => {
        return Api({
            method  : 'post',
            url     : `/reset`,
            data    : {
                token,
                password
            }
        })
            .then(payload => {
                dispatch({ type: ActionTypes.PASSWORD_RESET_SUCCESS, ...payload });
            })
            .catch(error => {
                alert(`Error: ${error.response.data.statusCode} - ${error.response.data.message}`);
                throw(error);
            });
    }
}

export function getCurrentUser() {
    return (dispatch) => {
        return Api({ url : `/user` })
            .then(payload => {
                dispatch({ type: ActionTypes.GET_CURRENT_USER_SUCCESS, ...payload });
            })
            .catch(error => {
                alert(`Error: ${error.response.data.statusCode} - ${error.response.data.message}`);
                throw(error);
            });
    }
}