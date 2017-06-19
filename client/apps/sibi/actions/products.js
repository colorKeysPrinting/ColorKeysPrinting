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

export function removeProduct(key, listName, modelNum, redirect) {
    return {
        type: ActionTypes.REMOVE_PRODUCT,
        key,
        listName,
        modelNum,
        redirect
    };
}

export function addToList(key, listName, modelNum) {
    return {
        type: ActionTypes.ADD_TO_LIST,
        key,
        listName,
        modelNum
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