'use strict';

import Api                      from 'utils/network';

// /////////////////////////////////////
//             ACTION TYPES
// /////////////////////////////////////
export const ActionTypes = {
    SET_ACTIVE_TAB  : 'sibi_ge_admin/activeUser/SET_ACTIVE_TAB',
}

// /////////////////////////////////////
//             LOCAL ACTIONS
// /////////////////////////////////////
export function setActiveTab(activeTab) {
    return {
        type: ActionTypes.SET_ACTIVE_TAB,
        activeTab
    };
}

// /////////////////////////////////////
//             ASYNC CALLS
// /////////////////////////////////////
