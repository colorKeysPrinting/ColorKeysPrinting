'use strict';

import ActionTypes      from '../constants/action_types';
import Network          from '../../../libs/constants/network';

// /////////////////////////////////////
//             ASYNC CALLS
// /////////////////////////////////////
// *************** product section ***************
export function getProducts(token) {
    return {
        type    : ActionTypes.GET_PRODUCTS,
        method  : Network.GET,
        url     : `${Network.DOMAIN}/products`,
        headers : {
            'x-auth-token': token
        }
    }
}

export function createProduct(token, product) {
    return {
        type    : ActionTypes.CREATE_PRODUCTS,
        method  : Network.POST,
        url     : `${Network.DOMAIN}/createProduct`,
        headers : {
            'x-auth-token': token
        },
        body: {
            product
        }
    }
}

export function removeProduct(obj) {
    return {
        type: ActionTypes.REMOVE_PRODUCT,
        obj
    };
}

export function setActiveFilters(key, value) {
    return {
        type: ActionTypes.SET_ACTIVE_FILTERS,
        key,
        value
    }
}