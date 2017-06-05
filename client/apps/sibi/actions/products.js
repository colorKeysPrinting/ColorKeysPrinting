'use strict';
import ActionTypes      from '../constants/action_types';

export function setActivePage(key, content) {
    return {
        type: ActionTypes.SET_ACTIVE_PAGE,
        key,
        content
    };
}

export function showSelectedProject(product) {
    return {
        type: ActionTypes.SHOW_SELECTED_PROJECT,
        product
    };
}

// /////////////////////////////////////
//             ASYNC CALLS
// /////////////////////////////////////
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

export function showProductDetails(product) {
    return {
        type: ActionTypes.SHOW_PRODUCT_DETAILS,
        product
    }
}