'use strict';
import ActionTypes      from '../constants/action_types';

export function addDocument(key, file) {
    return {
        type: ActionTypes.UPLOAD_DOCUMENT,
        key,
        file
    };
}

export function acceptAgreement(key, isChecked) {
    return {
        type: ActionTypes.ACCEPT_AGREEMENT,
        key,
        isChecked
    };
}

export function getStripeToken(obj) {
    return {
        type: ActionTypes.GET_STRIPE_TOKEN,
        obj
    };
}