'use strict';

import Api              from 'libs/network';

// /////////////////////////////////////
//             ACTION TYPES
// /////////////////////////////////////
export const ActionTypes = {
    CHANGE_LANGUAGE : 'sibi_ge_admin/ui/CHANGE_LANGUAGE',
    GO_HOME         : 'sibi_ge_admin/ui/GO_HOME',
    TRIGGER_SPINNER : 'sibi_ge_admin/ui/TRIGGER_SPINNER',
    SET_TRADE       : 'sibi_ge_admin/ui/SET_TRADE',
}

// /////////////////////////////////////
//             LOCAL ACTIONS
// /////////////////////////////////////
export function changeLanguage(language) {
    return {
        type: ActionTypes.CHANGE_LANGUAGE,
        language
    };
}

export function goHome() {
    return {
        type: ActionTypes.GO_HOME
    };
}

export function triggerSpinner(isActive) {
    return {
        type: ActionTypes.TRIGGER_SPINNER,
        isActive
    }
}

export function setTrade({ trade }) {
    return {
        type: ActionTypes.SET_TRADE,
        trade
    }
}

// /////////////////////////////////////
//             ASYNC CALLS
// /////////////////////////////////////