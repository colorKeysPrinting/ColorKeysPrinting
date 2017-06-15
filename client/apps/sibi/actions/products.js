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

export function removeProduct(key, product) {
    return {
        type: ActionTypes.REMOVE_PRODUCT,
        key,
        product
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