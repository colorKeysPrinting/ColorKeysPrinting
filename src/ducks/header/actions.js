'use strict';

import Api                      from 'libs/network';

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
    // activeTab: products, features, support, orderHistory, warranties, reports, dashboard, rebates, dealers, funds, vendors
    return {
        type: ActionTypes.SET_ACTIVE_TAB,
        activeTab
    };
}

// /////////////////////////////////////
//             ASYNC CALLS
// /////////////////////////////////////
