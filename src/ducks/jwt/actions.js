'use strict';

import axios            from 'axios';
import Network          from 'libs/constants/network';

// /////////////////////////////////////
//             ACTION TYPES
// /////////////////////////////////////
export const ActionTypes = {
    REFRESH_JWT : 'sibi_ge_admin/jwt/REFRESH_JWT',
}

// /////////////////////////////////////
//             LOCAL ACTIONS
// /////////////////////////////////////
export function refreshJwt() {
    return {
        type   : ActionTypes.REFRESH_JWT,
    };
}

// /////////////////////////////////////
//             ASYNC CALLS
// /////////////////////////////////////