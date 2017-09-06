'use strict';

import axios            from 'axios';
import Network          from 'libs/constants/network';

// /////////////////////////////////////
//             ACTION TYPES
// /////////////////////////////////////
export const ActionTypes = {
    GET_PRODUCT_BY_ID_SUCCESS : 'sibi_ge_admin/products/GET_PRODUCT_BY_ID_SUCCESS',
    GET_PRODUCTS_SUCCESS : 'sibi_ge_admin/products/GET_PRODUCTS_SUCCESS',
    GET_PRODUCT_CATEGORIES_SUCCESS : 'sibi_ge_admin/products/GET_PRODUCT_CATEGORIES_SUCCESS',
    GET_PRODUCTS_FOR_CATEGORY_SUCCESS : 'sibi_ge_admin/products/GET_PRODUCTS_FOR_CATEGORY_SUCCESS',
    GET_PRODUCTS_FOR_SUB_CATEGORY_SUCCESS : 'sibi_ge_admin/products/GET_PRODUCTS_FOR_SUB_CATEGORY_SUCCESS',
    UPDATE_PRODUCT_SUCCESS : 'sibi_ge_admin/products/UPDATE_PRODUCT_SUCCESS',
    CREATE_PRODUCT_SUCCESS : 'sibi_ge_admin/products/CREATE_PRODUCT_SUCCESS',
    ARCHIVE_PRODUCT_SUCCESS : 'sibi_ge_admin/products/ARCHIVE_PRODUCT_SUCCESS',
    UNARCHIVE_PRODUCT_SUCCESS : 'sibi_ge_admin/products/UNARCHIVE_PRODUCT_SUCCESS',
}

// /////////////////////////////////////
//             LOCAL ACTIONS
// /////////////////////////////////////

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

export function getProductCategories({ token }) {
    return (dispatch) => {
        return axios({
            method  : Network.GET,
            url     : `${Network.DOMAIN}/productCategoriesForUser`,
            headers : {
                'x-auth-token': token
            }
        })
            .then(payload => {
                dispatch({ type: ActionTypes.GET_PRODUCT_CATEGORIES_SUCCESS , ...payload });
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

export function getProductsForSubCategory({ token, categoryId, category }) {
    return (dispatch) => {
        return axios({
            method  : Network.GET,
            url     : `${Network.DOMAIN}/productsForSubcategory?subcategoryId=${categoryId}`,
            headers : {
                'x-auth-token': token,
                category
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

export function updateProduct({ token, category, product }) {
    return (dispatch) => {
        return axios({
            method  : Network.PATCH,
            url     : `${Network.DOMAIN}/products/${product.id}`,
            headers : {
                'x-auth-token': token,
                category
            },
            data: {
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

export function createProduct({ token, category, product }) {
    return (dispatch) => {
        return axios({
            method  : Network.POST,
            url     : `${Network.DOMAIN}/createProduct`,
            headers : {
                'x-auth-token': token,
                category
            },
            data: {
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

export function archiveProduct({ token, category, id }) {
    return (dispatch) => {
        return axios({
            method  : Network.POST,
            url     : `${Network.DOMAIN}/products/${id}/archive`,
            headers : {
                'x-auth-token': token,
                category,
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

export function unarchiveProduct({ token, category, id }) {
    return (dispatch) => {
        return axios({
            method  : Network.POST,
            url     : `${Network.DOMAIN}/products/${id}/unarchive`,
            headers : {
                'x-auth-token': token,
                category,
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