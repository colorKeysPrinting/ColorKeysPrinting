'use strict';

import Api              from 'utils/network';

// /////////////////////////////////////
//             ACTION TYPES
// /////////////////////////////////////
export const ActionTypes = {
    CHANGE_LANGUAGE : 'sibi_ge_admin/ui/CHANGE_LANGUAGE',
    GO_HOME         : 'sibi_ge_admin/ui/GO_HOME',
    TRIGGER_SPINNER : 'sibi_ge_admin/ui/TRIGGER_SPINNER',
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

// /////////////////////////////////////
//             ASYNC CALLS
// /////////////////////////////////////