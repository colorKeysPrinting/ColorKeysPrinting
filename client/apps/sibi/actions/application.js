'use strict';
import ActionTypes      from '../constants/action_types';

export function showOverlay(key) {
    return {
        type: ActionTypes.SHOW_OVERLAY,
        key
    }
}

export function closeOverlay() {
    return {
        type: ActionTypes.CLOSE_OVERLAY
    }
}

export function login(username, password) {
    return {
        type: ActionTypes.LOGIN,
        username,
        password
    };
}


export function signUp() {
    return {
        type: ActionTypes.SIGNUP
    };
}