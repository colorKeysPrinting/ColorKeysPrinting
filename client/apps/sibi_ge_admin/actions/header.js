'use strict';

import ActionTypes      from '../constants/action_types';
import Network          from '../../../libs/constants/network';

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
//             ASYNC CALLS
// /////////////////////////////////////
export function getCurrentUser(token) {
    return {
        type    : ActionTypes.GET_CURRENT_USER,
        method  : Network.GET,
        url     : `${Network.DOMAIN}/user`,
        headers : {
            'x-auth-token': token
        }
    };
}