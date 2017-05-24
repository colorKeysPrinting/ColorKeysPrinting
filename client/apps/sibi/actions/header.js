'use strict';
import ActionTypes      from '../constants/action_types';

export function goHome() {
    return {
        type: ActionTypes.HOME
    };
}

export function activateTab(key) {
    // activeTab: products, features, support, orderHistory, warranties, reports, dashboard, rebates, dealers, funds, vendors
    return {
        type: ActionTypes.ACTIVATE_TAB,
        key
    };
}

export function signUpPage() {
    return {
        type: ActionTypes.SIGNUP_PAGE
    };
}