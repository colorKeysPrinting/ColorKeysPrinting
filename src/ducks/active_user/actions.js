'use strict';

import axios            from 'axios';
import Network          from 'libs/constants/network';

// /////////////////////////////////////
//             ACTION TYPES
// /////////////////////////////////////
export const ActionTypes = {
    LOGOUT         : 'sibi_ge_admin/activeUser/LOGOUT',
    LOGIN_SUCCESS  : 'sibi_ge_admin/activeUser/LOGIN_SUCCESS',
    PASSWORD_RESET : 'sibi_ge_admin/activeUser/PASSWORD_RESET',
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

// /////////////////////////////////////
//             ASYNC CALLS
// /////////////////////////////////////
export function login({ email, password }) {
    return (dispatch) => {
        return axios({
            method: Network.POST,
            url: `${Network.DOMAIN}/adminsignin`,
            data: {
                email,
                password
            }
        })
            .then(payload => {
                dispatch({ type: ActionTypes.LOGIN_SUCCESS, ...payload });
            })
            .catch(error => {
                throw(error);
            });
    }
}

export function passwordReset({ token, password }) {
    return (dispatch) => {
        return axios({
            method: Network.POST,
            url: `${Network.DOMAIN}/reset`,
            data: {
                token,
                password
            }
        })
            .then(payload => {
                dispatch({ type: ActionTypes.PASSWORD_RESET, ...payload });
            })
            .catch(error => {
                throw(error);
            });
    }
}

export function getCurrentUser({ token }) {
    return (dispatch) => {
        return axios({
            method  : Network.GET,
            url     : `${Network.DOMAIN}/user`,
            headers : {
                'x-auth-token': token
            }
        })
            .then(payload => {
                dispatch({ type: ActionTypes.GET_CURRENT_USER_SUCCESS, ...payload });
            })
            .catch(error => {
                throw(error);
            });
    }
}