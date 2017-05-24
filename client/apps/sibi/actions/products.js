'use strict';
import ActionTypes      from '../constants/action_types';

export function activePage(key) {
    return {
        type: ActionTypes.ACTIVATE_PAGE,
        key
    };
}