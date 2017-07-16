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

export function setActiveFilters(key, value) {
    return {
        type: ActionTypes.SET_ACTIVE_FILTERS,
        key,
        value
    }
}

export function removeProduct(obj) {
    return {
        type: ActionTypes.REMOVE_PRODUCT,
        obj
    };
}

export function removeCollection(collectionType, collectionID) {
    return {
        type: ActionTypes.REMOVE_COLLECTION,
        collectionType,
        collectionID
    };
}

export function addToCollection(collectionType, collectionID, productID) {
    return {
        type: ActionTypes.ADD_TO_COLLECTION,
        collectionType,
        collectionID,
        productID
    };
}

export function createNewCollection(collectionType, collectionName, productID) {
    return {
        type: ActionTypes.CREATE_NEW_LIST,
        collectionType,
        collectionName,
        productID
    };
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