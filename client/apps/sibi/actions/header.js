'use strict';

import ActionTypes      from '../constants/action_types';

export function goHome() {
    return {
        type: ActionTypes.GO_HOME
    };
}

export function setActivateTab(key) {
    // activeTab: products, features, support, orderHistory, warranties, reports, dashboard, rebates, dealers, funds, vendors
    return {
        type: ActionTypes.SET_ACTIVATE_TAB,
        key
    };
}