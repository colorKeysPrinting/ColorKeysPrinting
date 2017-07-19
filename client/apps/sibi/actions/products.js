'use strict';
import ActionTypes      from '../constants/action_types';
import Network          from '../../../libs/constants/network';

// /////////////////////////////////////
//             ASYNC CALLS
// /////////////////////////////////////
export function getProducts() {
    return {
        type    : ActionTypes.GET_PRODUCTS,
        method  : Network.GET,
        url     : `${Network.DOMAIN}/products`,
        headers : {
            'x-auth-token': window.DEFAULT_JWT
        }
    }
}

export function getUserMatchups() {
    return {
        type    : ActionTypes.GET_USER_MATCHUPS,
        method  : Network.GET,
        url     : `${Network.DOMAIN}/matchups`,
        headers : {
            'x-auth-token': window.DEFAULT_JWT
        }
    }
}

export function createMatchup(matchup) {
    return {
        type: ActionTypes.CREATE_MATCHUP,
        method  : Network.POST,
        url     : `${Network.DOMAIN}/createMatchup`,
        headers : {
            'x-auth-token': window.DEFAULT_JWT
        },
        body    : {
            name: matchup.name,
            totalCost: matchup.totalCost,
            adminCreated: matchup.adminCreated,
            products: matchup.products
        }
    };
}

export function createList(list) {
    return {
        type: ActionTypes.CREATE_LIST,
        method  : Network.POST,
        url     : `${Network.DOMAIN}/createList`,
        headers : {
            'x-auth-token': window.DEFAULT_JWT
        },
        body    : {
            name: list.name,
            products: list.products
        }
    };
}

export function removeProduct(obj) {
    return {
        type: ActionTypes.REMOVE_PRODUCT,
        obj
    };
}

export function removeMatchup(id) {
    return {
        type: ActionTypes.REMOVE_MATCHUP,
        method  : Network.DEL,
        url     : `${Network.DOMAIN}/matchups/${id}`,
        headers : {
            'x-auth-token': window.DEFAULT_JWT
        }
    };
}

export function removeList(id) {
    return {
        type: ActionTypes.REMOVE_LIST,
        method  : Network.DEL,
        url     : `${Network.DOMAIN}/lists/${id}`,
        headers : {
            'x-auth-token': window.DEFAULT_JWT
        }
    };
}

export function updateMatchup(matchup) {
    return {
        type: ActionTypes.UPDATE_MATCHUP,
        method  : Network.PATCH,
        url     : `${Network.DOMAIN}/matchups/${matchup.id}`,
        headers : {
            'x-auth-token': window.DEFAULT_JWT
        },
        body    : {
            name: matchup.name,
            totalCost: matchup.totalCost,
            adminCreated: matchup.adminCreated,
            products: matchup.products
        }
    };
}

export function updateList(list) {
    return {
        type: ActionTypes.UPDATE_LIST,
        method  : Network.PATCH,
        url     : `${Network.DOMAIN}/lists/${list.id}`,
        headers : {
            'x-auth-token': window.DEFAULT_JWT
        },
        body    : {
            name: list.name,
            products: list.products
        }
    };
}




export function setActiveFilters(key, value) {
    return {
        type: ActionTypes.SET_ACTIVE_FILTERS,
        key,
        value
    }
}

export function updateInfoBar(key) {
    return {
        type: ActionTypes.UPDATE_INFO_BAR,
        key
    };
}

export function checkingInventory(product, location) {
    return {
        type: ActionTypes.CHECKING_INVENTORY,
        product,
        location
    };
}