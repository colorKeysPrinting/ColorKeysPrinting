'use strict';

import axios            from 'axios';
import ActionTypes      from 'actions/action_types';
import Network          from 'libs/constants/network';

export function logout() {
    return {
        type: ActionTypes.LOGOUT
    };
}

export function goHome() {
    return {
        type: ActionTypes.GO_HOME
    };
}

export function setActivateTab(key) {
    // activeTab: products, features, support, orderHistory, warranties, reports, dashboard, rebates, dealers, funds, vendors
    return {
        type: ActionTypes.SET_ACTIVATE_TAB,
        key
    };
}

// /////////////////////////////////////
//             helper functions
// /////////////////////////////////////
const getCurrentUserSuccess = (payload) => {
    return {
        type: ActionTypes.GET_CURRENT_USER_SUCCESS,
        ...payload
    }
}

// /////////////////////////////////////
//             ASYNC CALLS
// /////////////////////////////////////
export function getCurrentUser(token) {
    return (dispatch) => {
        return axios({
            method  : Network.GET,
            url     : `${Network.DOMAIN}/user`,
            headers : {
                'x-auth-token': token
            }
        })
            .then(payload => {
                dispatch(getCurrentUserSuccess(payload));
            })
            .catch(error => {
                throw(error);
            });
    }
}