'use strict';

import ActionTypes      from 'constants/action_types';
import Network          from 'libs/constants/network';

// /////////////////////////////////////
//             ASYNC CALLS
// /////////////////////////////////////

export function getUsers({ token, users }) {
    return {
        type    : ActionTypes.GET_USERS,
        method  : Network.GET,
        url     : `${Network.DOMAIN}/usersForFund`,
        headers : {
            'x-auth-token': token
        }
    }
}

export function approveUser({ token, id }) {
    return {
        type    : ActionTypes.APPROVE_USER,
        method  : Network.POST,
        url     : `${Network.DOMAIN}/users/${id}/approve`,
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

export function getFunds({ token, emailDomain }) {
    return {
        type    : ActionTypes.GET_FUNDS,
        method  : Network.GET,
        url     : `${Network.DOMAIN}/funds?fundEmailDomain=${emailDomain}`,
        headers : {
            'x-auth-token': token
        }
    }
}

export function getFundProperties({ token }) {
    return {
        type    : ActionTypes.GET_FUND_PROPERTIES,
        method  : Network.GET,
        url     : `${Network.DOMAIN}/fundsProperties`,
        headers : {
            'x-auth-token': token
        }
    }
}