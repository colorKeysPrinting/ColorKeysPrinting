'use strict';
import ActionTypes      from '../constants/action_types';

export function activePage(key) {
    return {
        type: ActionTypes.ACTIVATE_PAGE,
        key
    };
}

export function showRadioOverlay(key,) {
    return {
        type: ActionTypes.SHOW_RADIO_OVERLAY,
        key,
        modelNum,
        mouseCoord
    };
}

export function updateInfoBar(key) {
    return {
        type: ActionTypes.UPDATE_INFO_BAR,
        key
    };
}

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