'use strict';
import ActionTypes      from '../constants/action_types';


// /////////////////////////////////////
//             ASYNC CALLS
// /////////////////////////////////////
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