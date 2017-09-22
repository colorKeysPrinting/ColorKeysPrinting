'use strict';

import axios            from 'axios';
import Network          from 'libs/constants/network';

// /////////////////////////////////////
//             ACTION TYPES
// /////////////////////////////////////
export const ActionTypes = {
    CLEAR_PRODUCT : 'sibi_ge_admin/product/CLEAR_PRODUCT',
    CREATE_NEW_PRODUCT : 'sibi_ge_admin/product/CREATE_NEW_PRODUCT',
    NEW_PRODUCT : 'sibi_ge_admin/product/NEW_PRODUCT',
    UPDATE : 'sibi_ge_admin/product/UPDATE',
    UPDATE_IMAGE : 'sibi_ge_admin/product/UPDATE_IMAGE',
    ADD_COLOR_AND_IMAGE : 'sibi_ge_admin/product/ADD_COLOR_AND_IMAGE',
    REMOVE_COLOR_AND_IMAGE : 'sibi_ge_admin/product/REMOVE_COLOR_AND_IMAGE',
    ADD_VIDEO : 'sibi_ge_admin/product/ADD_VIDEO',
    REMOVE_VIDEO : 'sibi_ge_admin/product/REMOVE_VIDEO',
    ADD_FAQ : 'sibi_ge_admin/product/ADD_FAQ',
    REMOVE_FAQ : 'sibi_ge_admin/product/REMOVE_FAQ',

    RESET_MODEL_NUMBER_CHANGE : 'sibi_ge_admin/product/RESET_MODEL_NUMBER_CHANGE',

    GET_PRODUCT_BY_ID_SUCCESS : 'sibi_ge_admin/product/GET_PRODUCT_BY_ID_SUCCESS',
    CREATE_PRODUCT_PART_SUCCESS : 'sibi_ge_admin/product/CREATE_PRODUCT_PART_SUCCESS',
    ARCHIVE_PRODUCT_SUCCESS : 'sibi_ge_admin/product/ARCHIVE_PRODUCT_SUCCESS',
    UNARCHIVE_PRODUCT_SUCCESS : 'sibi_ge_admin/products/UNARCHIVE_PRODUCT_SUCCESS',
    REMOVE_PART_SUCCESS : 'sibi_ge_admin/products/REMOVE_PART_SUCCESS',
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

export function updateProduct({ token, category, subCategory, product }) {
    return (dispatch) => {
        return axios({
            method  : Network.PATCH,
            url     : `${Network.DOMAIN}/products/${subCategory.id}`,
            headers : {
                'x-auth-token': token,
                category,
                subCategory: subCategory.name
            },
            data    : {
                ...product
            }
        })
            .then(payload => {
                dispatch({ type: ActionTypes.UPDATE_PRODUCT_SUCCESS , ...payload });
            })
            .catch(error => {
                throw(error);
            });
    }
}

export function createProduct({ token, category, subCategory, product }) {
    return (dispatch) => {
        return axios({
            method  : Network.POST,
            url     : `${Network.DOMAIN}/createProduct`,
            headers : {
                'x-auth-token': token,
                category,
                subCategory
            },
            data    : {
                ...product
            }
        })
            .then(payload => {
                dispatch({ type: ActionTypes.CREATE_PRODUCT_SUCCESS , ...payload });
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
                'x-auth-token': token,
                productId,
                partId
            },
            data    : {
                productId,
                partId
            }
        })
            .then(payload => {
                dispatch({ type: ActionTypes.CREATE_PRODUCT_PART_SUCCESS , ...payload });
            })
            .catch(error => {
                throw(error);
            });
    }
}

export function archiveProduct({ token, category, subCategory, subSubCategory, id }) {
    return (dispatch) => {
        return axios({
            method  : Network.POST,
            url     : `${Network.DOMAIN}/products/${id}/archive`,
            headers : {
                'x-auth-token': token,
                category,
                subCategory,
                subSubCategory,
                id
            }
        })
            .then(payload => {
                dispatch({ type: ActionTypes.ARCHIVE_PRODUCT_SUCCESS , ...payload });
            })
            .catch(error => {
                throw(error);
            });
    }
}

export function unarchiveProduct({ token, category, subCategory, subSubCategory, id }) {
    return (dispatch) => {
        return axios({
            method  : Network.POST,
            url     : `${Network.DOMAIN}/products/${id}/unarchive`,
            headers : {
                'x-auth-token': token,
                category,
                subCategory,
                subSubCategory,
                id
            }
        })
            .then(payload => {
                dispatch({ type: ActionTypes.UNARCHIVE_PRODUCT_SUCCESS , ...payload });
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
                'x-auth-token': token,
                productId,
                partId
            },
            data    : {
                productId,
                partId
            }
        })
            .then(payload => {
                dispatch({ type: ActionTypes.REMOVE_PART_SUCCESS , ...payload });
            })
            .catch(error => {
                throw(error);
            });
    }
}