'use strict';

import ActionTypes      from 'actions/action_types';

export function refreshJwt() {
    return {
        type   : ActionTypes.REFRESH_JWT,
    };
}
