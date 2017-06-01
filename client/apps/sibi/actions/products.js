'use strict';
import ActionTypes      from '../constants/action_types';

export function setActivePage(key, content) {
    return {
        type: ActionTypes.SET_ACTIVE_PAGE,
        key,
        content
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

export function createNewList(key, newItem) {
    return {
        type: ActionTypes.CREATE_NEW_LIST,
        key,
        newItem
    };
}

export function addToList(key, name, newItem) {
    return {
        type: ActionTypes.ADD_TO_LIST,
        key,
        name,
        newItem
    };
}