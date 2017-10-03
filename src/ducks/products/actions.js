'use strict';

import axios            from 'axios';
import Network          from 'libs/constants/network';
import { createProductPart } from 'ducks/product/actions';

// /////////////////////////////////////
//             ACTION TYPES
// /////////////////////////////////////
export const ActionTypes = {
    CHECK_MODEL_NUM : 'sibi_ge_admin/products/CHECK_MODEL_NUM',
    VERIFY_PRODUCT : 'sibi_ge_admin/products/VERIFY_PRODUCT',
    VERIFY_PART : 'sibi_ge_admin/products/VERIFY_PART',
    RESET_FOUND : 'sibi_ge_admin/products/RESET_FOUND',
    GET_PRODUCTS_SUCCESS : 'sibi_ge_admin/products/GET_PRODUCTS_SUCCESS',
    GET_PRODUCT_CATEGORIES_SUCCESS : 'sibi_ge_admin/products/GET_PRODUCT_CATEGORIES_SUCCESS',
    GET_USER_PRODUCT_CATEGORIES_SUCCESS : 'sibi_ge_admin/products/GET_USER_PRODUCT_CATEGORIES_SUCCESS',
    GET_PRODUCTS_FOR_CATEGORY_SUCCESS : 'sibi_ge_admin/products/GET_PRODUCTS_FOR_CATEGORY_SUCCESS',
    GET_PRODUCTS_FOR_SUB_CATEGORY_SUCCESS : 'sibi_ge_admin/products/GET_PRODUCTS_FOR_SUB_CATEGORY_SUCCESS',
    GET_PARTS_SUCCESS : 'sibi_ge_admin/products/GET_PARTS_SUCCESS',
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

export function verifyProduct({ verified }) {
    return {
        type: ActionTypes.VERIFY_PRODUCT,
        verified
    };
}

export function verifyPart({ verified }) {
    return {
        type: ActionTypes.VERIFY_PART,
        verified
    };
}

export function resetFound() {
    return {
        type: ActionTypes.RESET_FOUND
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

export function updateProduct({ token, category, product }) {
    return (dispatch) => {
        return axios({
            method  : Network.PATCH,
            url     : `${Network.DOMAIN}/products/${product.id}`,
            headers : {
                'x-auth-token': token
            },
            data    : {
                ...product
            }
        })
            .then(payload => {
                dispatch(getUserProductCategories({ token, category }));
            })
            .catch(error => {
                throw(error);
            });
    }
}

export function createProduct({ token, category, product, applianceAssociatedParts }) {
    return (dispatch) => {
        return axios({
            method  : Network.POST,
            url     : `${Network.DOMAIN}/createProduct`,
            headers : {
                'x-auth-token': token
            },
            data    : {
                ...product
            }
        })
            .then(payload => {
                if (_.size(applianceAssociatedParts) > 0) {
                    _.each(applianceAssociatedParts, part => {
                        dispatch(createProductPart({token, productId: payload.data.id, partId: part.id}));
                    })
                }

                dispatch(getUserProductCategories({ token, category }));
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

export function archiveProduct({ token, category, id }) {
    return (dispatch) => {
        return axios({
            method  : Network.POST,
            url     : `${Network.DOMAIN}/products/${id}/archive`,
            headers : {
                'x-auth-token': token
            }
        })
            .then(payload => {
                dispatch(getUserProductCategories({ token, category }));
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
                'x-auth-token': token
            }
        })
            .then(payload => {
                dispatch(getUserProductCategories({ token, category }));
            })
            .catch(error => {
                throw(error);
            });
    }
}