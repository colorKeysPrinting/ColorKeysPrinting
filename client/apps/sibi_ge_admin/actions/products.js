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

// *************** order section ***************
export function getOrders(token) {
    return {
        type    : ActionTypes.GET_ORDER_STATUS,
        method  : Network.GET,
        url     : `${Network.DOMAIN}/orderStatus`, // TODO: wrong api call, hasn't been created yet
        headers : {
            'x-auth-token': token
        }
    }
}

export function updateOrderStatus({ token, id, status }) {
    return {
        type    : ActionTypes.UPDATE_ORDER_STATUS,
        method  : Network.PATCH,
        url     : `${Network.DOMAIN}/orderStatus/${id}`,
        headers : {
            'x-auth-token': token
        },
        body: {
            status
        }
    }
}

export function removeOrder(token, id) {
    return {
        type    : ActionTypes.REMOVE_ORDER,
        method  : Network.DEL,
        url     : `${Network.DOMAIN}/createOrderStatus/${id}`,
        headers : {
            'x-auth-token': token
        }
    }
}

export function setActiveFilters(key, value) {
    return {
        type: ActionTypes.SET_ACTIVE_FILTERS,
        key,
        value
    }
}