'use strict';

import axios                    from 'axios';
import Network                  from 'libs/constants/network';
import { getProducts, getParts }    from 'ducks/product/actions';

// /////////////////////////////////////
//             ACTION TYPES
// /////////////////////////////////////
export const ActionTypes = {
    CLEAR_PRODUCT : 'sibi_ge_admin/product/CLEAR_PRODUCT',
    NEW_PRODUCT : 'sibi_ge_admin/product/NEW_PRODUCT',
    UPDATE : 'sibi_ge_admin/product/UPDATE',
    ADD_COLOR_AND_IMAGE : 'sibi_ge_admin/product/ADD_COLOR_AND_IMAGE',
    REMOVE_COLOR_AND_IMAGE : 'sibi_ge_admin/product/REMOVE_COLOR_AND_IMAGE',
    REMOVE_PART_SUCCESS : 'sibi_ge_admin/product/REMOVE_PART_SUCCESS',
    ADD_VIDEO : 'sibi_ge_admin/product/ADD_VIDEO',
    REMOVE_VIDEO : 'sibi_ge_admin/product/REMOVE_VIDEO',
    ADD_FAQ : 'sibi_ge_admin/product/ADD_FAQ',
    REMOVE_FAQ : 'sibi_ge_admin/product/REMOVE_FAQ',
    GET_PRODUCT_BY_ID_SUCCESS : 'sibi_ge_admin/product/GET_PRODUCT_BY_ID_SUCCESS',
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

export function update({ isProduct, key, value }) {
    return {
        type: ActionTypes.UPDATE,
        isProduct,
        key,
        value
    };
}

export function addColorAndImage() {
    return {
        type: ActionTypes.ADD_COLOR_AND_IMAGE,
    };
}

export function removeColorAndImage({ color }) {
    return {
        type: ActionTypes.REMOVE_COLOR_AND_IMAGE,
        color
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
export function getProductById({ token, id }) {
    return (dispatch) => {
        return axios({
            method  : Network.GET,
            url     : `${Network.DOMAIN}/products/${id}`,
            headers : {
                'x-auth-token': token
            }
        })
            .then(payload => {
                dispatch({ type: ActionTypes.GET_PRODUCT_BY_ID_SUCCESS , ...payload });
            })
            .catch(error => {
                throw(error);
            });
    }
}

export function createProductPart({ token, productId, partId }) {
    return (dispatch) => {
        return axios({
            method  : Network.POST,
            url     : `${Network.DOMAIN}/createProductPart`,
            headers : {
                'x-auth-token': token
            },
            data    : {
                productId,
                partId
            }
        })
            .then(payload => {
                dispatch(getProductById({ token, id: productId }));
                dispatch(getParts({ token }));
            })
            .catch(error => {
                throw(error);
            });
    }
}

export function removePart({ token, productId, partId }) {
    return (dispatch) => {
        return axios({
            method  : Network.DEL,
            url     : `${Network.DOMAIN}/productPart`,
            headers : {
                'x-auth-token': token
            },
            data    : {
                productId,
                partId
            }
        })
            .then(payload => {
                dispatch(getProductById({ token, id: productId }));
            })
            .catch(error => {
                throw(error);
            });
    }
}