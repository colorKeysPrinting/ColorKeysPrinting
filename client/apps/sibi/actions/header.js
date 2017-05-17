'use strict';
import ActionTypes      from '../constants/action_types';

export function goHome() {
    return {
        type: ActionTypes.HOME
    };
}

export function activateTab(key) {
    return {
        type: ActionTypes.ACTIVATE_TAB,
        key
    };
}

export function signUpPage() {
    return {
        type: ActionTypes.SIGN_UP_PAGE
    };
}