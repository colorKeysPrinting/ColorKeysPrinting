'use strict';
import ActionTypes      from '../constants/action_types';

export function showOverlay(key, obj) {
    return {
        type: ActionTypes.SHOW_OVERLAY,
        key,
        obj
    };
}

export function showRadioOverlay(key, listType, id) {
    return {
        type: ActionTypes.SHOW_RADIO_OVERLAY,
        key,
        listType,
        id
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

export function addToTruck(item) {
    return {
        type: ActionTypes.ADD_TO_TRUCK,
        item
    }
}

// /////////////////////////////////////
//             ASYNC CALLS
// /////////////////////////////////////
export function login(username, password) {
    return {
        type: ActionTypes.LOGIN,
        username,
        password
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

export function getStripeToken(obj) {
    // needs to be a async call
    return {
        type: ActionTypes.GET_STRIPE_TOKEN,
        obj
    };
}

export function signUp(personDetails) {
    return {
        type: ActionTypes.SUBMIT_SIGNUP,
        personDetails
    }
}