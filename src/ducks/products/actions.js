'use strict';

import axios            from 'axios';
import Network          from 'libs/constants/network';

// /////////////////////////////////////
//             ACTION TYPES
// /////////////////////////////////////
export const ActionTypes = {
    CHECK_MODEL_NUM : 'sibi_ge_admin/products/CHECK_MODEL_NUM',
    PRODUCT_VERIFIED : 'sibi_ge_admin/products/PRODUCT_VERIFIED',
    PART_VERIFIED : 'sibi_ge_admin/products/PART_VERIFIED',
    RESET_VERIFIED : 'sibi_ge_admin/products/RESET_VERIFIED',
    GET_PRODUCTS_SUCCESS : 'sibi_ge_admin/products/GET_PRODUCTS_SUCCESS',
    GET_PRODUCT_CATEGORIES_SUCCESS : 'sibi_ge_admin/products/GET_PRODUCT_CATEGORIES_SUCCESS',
    GET_USER_PRODUCT_CATEGORIES_SUCCESS : 'sibi_ge_admin/products/GET_USER_PRODUCT_CATEGORIES_SUCCESS',
    GET_PRODUCTS_FOR_CATEGORY_SUCCESS : 'sibi_ge_admin/products/GET_PRODUCTS_FOR_CATEGORY_SUCCESS',
    GET_PRODUCTS_FOR_SUB_CATEGORY_SUCCESS : 'sibi_ge_admin/products/GET_PRODUCTS_FOR_SUB_CATEGORY_SUCCESS',
    GET_PARTS_SUCCESS : 'sibi_ge_admin/products/GET_PARTS_SUCCESS'
}

// /////////////////////////////////////
//             LOCAL ACTIONS
// /////////////////////////////////////
export function checkModelNum({ key, modelNumber }) {
    return {
        type: ActionTypes.CHECK_MODEL_NUM,
        key,
        modelNumber
    };
}

export function productVerified() {
    return {
        type: ActionTypes.PRODUCT_VERIFIED
    };
}

export function partVerified() {
    return {
        type: ActionTypes.PART_VERIFIED
    };
}

export function resetVerified() {
    return {
        type: ActionTypes.RESET_VERIFIED
    };
}
// /////////////////////////////////////
//             ASYNC CALLS
// /////////////////////////////////////
export function getProducts({ token }) {
    return (dispatch) => {
        return axios({
            method  : Network.GET,
            url     : `${Network.DOMAIN}/products`,
            headers : {
                'x-auth-token': token
            }
        })
            .then(payload => {
                dispatch({ type: ActionTypes.GET_PRODUCTS_SUCCESS , ...payload });
            })
            .catch(error => {
                throw(error);
            });
    }
}

export function getProductCategories() {
    return (dispatch) => {
        return axios({
            method  : Network.GET,
            url     : `${Network.DOMAIN}/productCategories`
        })
            .then(payload => {
                dispatch({ type: ActionTypes.GET_PRODUCT_CATEGORIES_SUCCESS , ...payload });
            })
            .catch(error => {
                throw(error);
            });
    }
}

export function getUserProductCategories({ token, category }) {
    return (dispatch) => {
        return axios({
            method  : Network.GET,
            url     : `${Network.DOMAIN}/productCategoriesForUser`,
            headers : {
                'x-auth-token': token,
                category
            }
        })
            .then(payload => {
                dispatch({ type: ActionTypes.GET_USER_PRODUCT_CATEGORIES_SUCCESS , ...payload });
            })
            .catch(error => {
                throw(error);
            });
    }
}

export function getProductsForCategory({ token, categoryId, category }) {
    return (dispatch) => {
        return axios({
            method  : Network.GET,
            url     : `${Network.DOMAIN}/productsForCategory?categoryId=${categoryId}`,
            headers : {
                'x-auth-token': token,
                category
            }
        })
            .then(payload => {
                dispatch({ type: ActionTypes.GET_PRODUCTS_FOR_CATEGORY_SUCCESS , ...payload });
            })
            .catch(error => {
                throw(error);
            });
    }
}

export function getProductsForSubCategory({ token, category, subCategory, subSubCategory }) {
    return (dispatch) => {
        const id = (subSubCategory) ? subSubCategory.id : subCategory.id;
        return axios({
            method  : Network.GET,
            url     : `${Network.DOMAIN}/productsForSubcategory?subcategoryId=${id}`,
            headers : {
                'x-auth-token': token,
                category,
                subCategory: subCategory.name,
                subSubCategory: (subSubCategory) ? subSubCategory.name : null
            }
        })
            .then(payload => {
                dispatch({ type: ActionTypes.GET_PRODUCTS_FOR_SUB_CATEGORY_SUCCESS , ...payload });
            })
            .catch(error => {
                throw(error);
            });
    }
}

export function getParts({ token }) {
    return (dispatch) => {
        return axios({
            method  : Network.GET,
            url     : `${Network.DOMAIN}/parts`,
            headers : {
                'x-auth-token': token
            }
        })
            .then(payload => {
                dispatch({ type: ActionTypes.GET_PARTS_SUCCESS , ...payload });
            })
            .catch(error => {
                throw(error);
            });
    }
}