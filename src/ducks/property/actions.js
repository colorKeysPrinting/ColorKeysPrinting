'use strict';

import axios                    from 'axios';
import { getProperties }        from 'ducks/property/actions';

// /////////////////////////////////////
//             ACTION TYPES
// /////////////////////////////////////
export const ActionTypes = {
    CLEAR_PRODUCT : 'sibi_ge_admin/property/CLEAR_PRODUCT',
    NEW_PRODUCT : 'sibi_ge_admin/property/NEW_PRODUCT',
    UPDATE : 'sibi_ge_admin/property/UPDATE',
    ADD_COLOR_AND_IMAGE : 'sibi_ge_admin/property/ADD_COLOR_AND_IMAGE',
    REMOVE_COLOR_AND_IMAGE : 'sibi_ge_admin/property/REMOVE_COLOR_AND_IMAGE',
    REMOVE_PART_SUCCESS : 'sibi_ge_admin/property/REMOVE_PART_SUCCESS',
    ADD_VIDEO : 'sibi_ge_admin/property/ADD_VIDEO',
    REMOVE_VIDEO : 'sibi_ge_admin/property/REMOVE_VIDEO',
    ADD_FAQ : 'sibi_ge_admin/property/ADD_FAQ',
    REMOVE_FAQ : 'sibi_ge_admin/property/REMOVE_FAQ',
    GET_PRODUCT_BY_ID_SUCCESS : 'sibi_ge_admin/property/GET_PRODUCT_BY_ID_SUCCESS',
}

// /////////////////////////////////////
//             LOCAL ACTIONS
// /////////////////////////////////////
export function clearProduct() {
    return {
        type: ActionTypes.CLEAR_PRODUCT
    };
}

export function newProduct() {
    return {
        type: ActionTypes.NEW_PRODUCT
    };
}

export function update({ isProduct, categorySizes, key, value }) {
    return {
        type: ActionTypes.UPDATE,
        isProduct,
        categorySizes,
        key,
        value
    };
}

export function addColorAndImage() {
    return {
        type: ActionTypes.ADD_COLOR_AND_IMAGE,
    };
}

export function removeColorAndImage({ manufacturerModelNumber }) {
    return {
        type: ActionTypes.REMOVE_COLOR_AND_IMAGE,
        manufacturerModelNumber
    };
}

export function removePartLocal({ partId }) {
    return {
        type: ActionTypes.REMOVE_PART_SUCCESS,
        partId
    };
}

export function addVideo() {
    return {
        type: ActionTypes.ADD_VIDEO
    };
}

export function removeVideo({ index }) {
    return {
        type: ActionTypes.REMOVE_VIDEO,
        index
    };
}

export function addFAQ() {
    return {
        type: ActionTypes.ADD_FAQ
    };
}

export function removeFaq({ index }) {
    return {
        type: ActionTypes.REMOVE_FAQ,
        index
    };
}

// /////////////////////////////////////
//             ASYNC CALLS
// /////////////////////////////////////
export function getProductById({ id }) {
    return (dispatch) => {
        return Api({ url : `/products/${id}` })
            .then(payload => {
                dispatch({ type: ActionTypes.GET_PRODUCT_BY_ID_SUCCESS , ...payload });
            })
    }
}

export function createProductPart({ productId, partId }) {
    return (dispatch) => {
        return Api({
            method  : 'post',
            url     : `/createProductPart`,
            data    : {
                productId,
                partId
            }
        })
            .then(payload => {
                dispatch(getProductById({ id: productId }));
            })
    }
}

export function removePart({ productId, partId }) {
    return (dispatch) => {
        return Api({
            method  : 'delete',
            url     : `/productPart`,
            data    : {
                productId,
                partId
            }
        })
            .then(payload => {
                dispatch(getProductById({ id: productId }));
            })
    }
}