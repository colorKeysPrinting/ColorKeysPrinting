'use strict';

import ActionTypes      from '../constants/action_types';
import Network          from '../../../libs/constants/network';

// /////////////////////////////////////
//             ASYNC CALLS
// /////////////////////////////////////
export function approveUser({ token, id }) {
    return {
        type    : ActionTypes.APPROVE_USER,
        method  : Network.POST,
        url     : `${Network.DOMAIN}/users/${id}/undisable`,
        headers : {
            'x-auth-token': token
        }
    };
}

export function disableUser({ token, id }) {
    return {
        type    : ActionTypes.DISABLE_USER,
        method  : Network.GET,
        url     : `${Network.DOMAIN}/users/${id}/disable`,
        headers : {
            'x-auth-token': token
        }
    };
}