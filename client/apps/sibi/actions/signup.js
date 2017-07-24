'use strict';

import ActionTypes      from '../constants/action_types';
import Network          from '../../../libs/constants/network';

export function addDocument(fileType, file) {
    return {
        type: ActionTypes.ADD_DOCUMENT,
        fileType,
        file
    };
}

export function acceptAgreement(fileType, isChecked) {
    return {
        type: ActionTypes.ACCEPT_AGREEMENT,
        fileType,
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
        url     : `${Network.DOMAIN}/companies`
    };
}

export function createCompany(company) {
    return {
        type    : ActionTypes.CREATE_COMPANY,
        method  : Network.POST,
        url     : `${Network.DOMAIN}/createCompany`,
        body    : {
            name: company.name,
            phoneNumber: company.phoneNumber,
            faxNumber: company.faxNumber || null,
            entityTypeId: company.entityTypeId,
            federalTaxPin: company.federalTaxPin,
            requestedLaborRate: company.requestedLaborRate,
            approvedLaborRate: company.approvedLaborRate,
            dealerAccountNumber: company.dealerAccountNumber,
            locationId: company.locationId
        }
    };
}

export function getLocations() {
    return {
        type    : ActionTypes.GET_LOCATIONS,
        method  : Network.GET,
        url     : `${Network.DOMAIN}/locations`
    };
}

export function createLocation(location) {
    return {
        type    : ActionTypes.CREATE_LOCATION,
        method  : Network.POST,
        url     : `${Network.DOMAIN}/createLocation`,
        body    : {
            name: location.name || null,
            addressLineOne: location.addressLineOne,
            addressLineTwo: location.addressLineTwo || null,
            addressLineThree: location.addressLineThree || null,
            city: location.city,
            state: location.state,
            zipcode: location.zipcode,
        }
    }
}

export function getTrades() {
    return {
        type    : ActionTypes.GET_TRADES,
        method  : Network.GET,
        url     : `${Network.DOMAIN}/trades`
    };
}

export function getEntityTypes() {
    console.log('need to add this api call');
    return {
        type    : ActionTypes.GET_ENTITY_TYPES,
        method  : Network.GET,
        url     : `${Network.DOMAIN}/entityTypes`
    };
}

export function getFunds() {
    return {
        type    : ActionTypes.GET_FUNDS,
        method  : Network.GET,
        url     : `${Network.DOMAIN}/funds`
    };
}

export function signup(person) {
    return {
        type    : ActionTypes.SIGNUP,
        method  : Network.POST,
        url     : `${Network.DOMAIN}/signup`,
        body : {
            type            : 'vendor',
            firstName       : person.firstName,
            lastName        : person.lastName,
            email           : person.email,
            password        : person.password,
            tradeId         : person.tradeId,
            fundId          : person.fundId,
            fundLocationId  : person.locationId,
            companyId       : person.companyId,
            // payment         : person.stripeToken,
            // docs            : person.docs // TODO: need the api updated to handle doc files
        }
    };
}