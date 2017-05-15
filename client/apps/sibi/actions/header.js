'use strict';
import ActionTypes  from '../constants/action_types';

export function goHome() {
    return {
        type: ActionTypes.HOME
    };
}

export function showPage(key) {
    return {
        type: ActionTypes.LOAD_PAGE,
        key
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