'use strict';
import ActionTypes      from '../constants/action_types';

export function showOverlay(key, obj) {
    return {
        type: ActionTypes.SHOW_OVERLAY,
        key,
        obj
    };
}

export function showRadioOverlay(key, listType) {
    return {
        type: ActionTypes.SHOW_RADIO_OVERLAY,
        key,
        listType
    };
}

export function closeOverlay() {
    return {
        type: ActionTypes.CLOSE_OVERLAY
    };
}

export function login(username, password) {
    return {
        type: ActionTypes.LOGIN,
        username,
        password
    };
}

export function passwordReset(email) {
    return {
        type: ActionTypes.PASSWORD_RESET,
        email
    };
}

export function changeLanguage(language) {
    return {
        type: ActionTypes.CHANGE_LANGUAGE,
        language
    }
}

export function signUp(personDetails) {
    return {
        type: ActionTypes.SIGNUP,
        personDetails
    }
}