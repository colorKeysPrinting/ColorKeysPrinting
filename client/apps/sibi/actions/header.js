'use strict';
import ActionTypes      from '../constants/action_types';

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