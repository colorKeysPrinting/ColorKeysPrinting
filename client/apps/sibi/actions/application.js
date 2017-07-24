'use strict';

import ActionTypes      from '../constants/action_types';
import Network          from '../../../libs/constants/network';

export function showOverlay(overlay, obj) {
    return {
        type: ActionTypes.SHOW_OVERLAY,
        overlay,
        obj
    };
}

export function closeOverlay() {
    return {
        type: ActionTypes.CLOSE_OVERLAY
    };
}

export function changeLanguage(language) {
    return {
        type: ActionTypes.CHANGE_LANGUAGE,
        language
    }
}

// /////////////////////////////////////
//             ASYNC CALLS
// /////////////////////////////////////
export function login(email, password) {
    return {
        type   : ActionTypes.LOGIN,
        method : Network.POST,
        url    : `${Network.DOMAIN}/signin`,
        body   : {
            email,
            password
        }
    };
}

export function logout(username) {
    return {
        type: ActionTypes.LOGOUT,
        username
    };
}

export function passwordReset(email) {
    // needs to be a async call
    return {
        type: ActionTypes.PASSWORD_RESET,
        email
    };
}