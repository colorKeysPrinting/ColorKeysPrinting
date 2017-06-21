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

export function removeProduct(key, listName, id, redirect) {
    return {
        type: ActionTypes.REMOVE_PRODUCT,
        key,
        listName,
        id,
        redirect
    };
}

export function addToList(key, listName, id) {
    return {
        type: ActionTypes.ADD_TO_LIST,
        key,
        listName,
        id
    };
}

export function createNewList(key, newItem) {
    return {
        type: ActionTypes.CREATE_NEW_LIST,
        key,
        newItem
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