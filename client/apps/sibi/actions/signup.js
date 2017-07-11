'use strict';
import ActionTypes      from '../constants/action_types';
import Network          from '../../../libs/constants/network';

export function addDocument(key, file) {
    return {
        type: ActionTypes.UPLOAD_DOCUMENT,
        key,
        file
    };
}

export function acceptAgreement(key, isChecked) {
    return {
        type: ActionTypes.ACCEPT_AGREEMENT,
        key,
        isChecked
    };
}

// /////////////////////////////////////
//             ASYNC CALLS
// /////////////////////////////////////
export function getCompanies() {
    return {
        type    : ActionTypes.GET_COMPANIES,
        method  : Network.GET,
        url     : `${Network.DOMAIN}/locations`
    }
}

export function getLocations() {
    return {
        type    : ActionTypes.GET_LOCATIONS,
        method  : Network.GET,
        url     : `${Network.DOMAIN}/trades`
    }
}

export function getTrades() {
    return {
        type    : ActionTypes.GET_TRADES,
        method  : Network.GET,
        url     : `${Network.DOMAIN}/trades`
    }
}

export function signUp(personDetails) {
    return {
        type    : ActionTypes.SIGNUP,
        method  : Network.POST,
        url     : `${Network.DOMAIN}/signup`,
        body : {
            type        : 'admin',
            firstName   : personDetails.name.first,
            lastName    : personDetails.name.last,
            email       : personDetails.email,
            password    : personDetails.password,
            tradeId     : personDetails.trade.id,
            fundId      : personDetails.fund.id,
            companyId   : personDetails.company.id
        }
    }
}