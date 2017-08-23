'use strict';

import axios            from 'axios';
import Network          from 'libs/constants/network';

// /////////////////////////////////////
//             ACTION TYPES
// /////////////////////////////////////
export const ActionTypes = {
    CHANGE_LANGUAGE : 'sibi_ge_admin/ui/CHANGE_LANGUAGE',
    GO_HOME: 'sibi_ge_admin/ui/GO_HOME'
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

// /////////////////////////////////////
//             ASYNC CALLS
// /////////////////////////////////////