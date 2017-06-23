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

export function removeList(listType, collectionID) {
    return {
        type: ActionTypes.REMOVE_LIST,
        listType,
        collectionID
    };
}

export function addToList(listType, collectionID, productID) {
    return {
        type: ActionTypes.ADD_TO_LIST,
        listType,
        collectionID,
        productID
    };
}

export function createNewList(listType, listName, productID) {
    return {
        type: ActionTypes.CREATE_NEW_LIST,
        listType,
        listName,
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