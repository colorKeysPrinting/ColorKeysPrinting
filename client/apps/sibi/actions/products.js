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

export function removeProduct(key, listID, id, redirect) {
    return {
        type: ActionTypes.REMOVE_PRODUCT,
        key,
        listID,
        id,
        redirect
    };
}

export function removeList(listType, listID) {
    return {
        type: ActionTypes.REMOVE_LIST,
        listType,
        listID
    };
}

export function addToList(key, listID, id) {
    return {
        type: ActionTypes.ADD_TO_LIST,
        key,
        listID,
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