'use strict';

import Api                      from 'libs/network';
import { createProductPart }    from 'ducks/product/actions';

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
export function getProducts() {
    return (dispatch) => {
        return Api({ url : `/products` })
            .then(payload => {
                dispatch({ type: ActionTypes.GET_PRODUCTS_SUCCESS , ...payload });
            })
            .catch(error => {
                alert(`Error: ${error.response.data.statusCode} - ${error.response.data.message}`);
                throw(error);
            });
    }
}

export function updateProduct({ category, product }) {
    return (dispatch) => {
        return Api({
            method  : 'patch',
            url     : `/products/${product.id}`,
            data    : {
                ...product
            }
        })
            .then(payload => {
                dispatch(getUserProductCategories({ category }));
            })
            .catch(error => {
                alert(`Error: ${error.response.data.statusCode} - ${error.response.data.message}`);
                throw(error);
            });
    }
}

export function createProduct({ category, product, applianceAssociatedParts }) {
    return (dispatch) => {
        return Api({
            method  : 'post',
            url     : `/createProduct`,
            data    : {
                ...product
            }
        })
            .then(payload => {
                if (_.size(applianceAssociatedParts) > 0) {
                    _.each(applianceAssociatedParts, part => {
                        dispatch(createProductPart({productId: payload.data.id, partId: part.id}));
                    })
                }

                dispatch(getUserProductCategories({ category }));
            })
            .catch(error => {
                alert(`Error: ${error.response.data.statusCode} - ${error.response.data.message}`);
                throw(error);
            });
    }
}

export function getProductCategories() {
    return (dispatch) => {
        return Api({ url : `/productCategories` })
            .then(payload => {
                dispatch({ type: ActionTypes.GET_PRODUCT_CATEGORIES_SUCCESS , ...payload });
            })
            .catch(error => {
                alert(`Error: ${error.response.data.statusCode} - ${error.response.data.message}`);
                throw(error);
            });
    }
}

export function getUserProductCategories({ category }) {
    return (dispatch) => {
        return Api({
            url     : `/productCategoriesForUser`,
            headers : {
                category
            }
        })
            .then(payload => {
                dispatch({ type: ActionTypes.GET_USER_PRODUCT_CATEGORIES_SUCCESS , ...payload });
            })
            .catch(error => {
                alert(`Error: ${error.response.data.statusCode} - ${error.response.data.message}`);
                throw(error);
            });
    }
}

export function getProductsForCategory({ categoryId, category }) {
    return (dispatch) => {
        return Api({
            url     : `/productsForCategory?categoryId=${categoryId}`,
            headers : {
                category
            }
        })
            .then(payload => {
                dispatch({ type: ActionTypes.GET_PRODUCTS_FOR_CATEGORY_SUCCESS , ...payload });
            })
            .catch(error => {
                alert(`Error: ${error.response.data.statusCode} - ${error.response.data.message}`);
                throw(error);
            });
    }
}

export function getProductsForSubCategory({ category, subCategory, subSubCategory }) {
    return (dispatch) => {
        const id = (subSubCategory) ? subSubCategory.id : subCategory.id;
        return Api({
            url     : `/productsForSubcategory?subcategoryId=${id}`,
            headers : {
                category,
                subCategory: subCategory.name,
                subSubCategory: (subSubCategory) ? subSubCategory.name : null
            }
        })
            .then(payload => {
                dispatch({ type: ActionTypes.GET_PRODUCTS_FOR_SUB_CATEGORY_SUCCESS , ...payload });
            })
            .catch(error => {
                alert(`Error: ${error.response.data.statusCode} - ${error.response.data.message}`);
                throw(error);
            });
    }
}

export function getParts() {
    return (dispatch) => {
        return Api({ url : `/parts` })
            .then(payload => {
                dispatch({ type: ActionTypes.GET_PARTS_SUCCESS , ...payload });
            })
            .catch(error => {
                alert(`Error: ${error.response.data.statusCode} - ${error.response.data.message}`);
                throw(error);
            });
    }
}

export function archiveProduct({ category, id }) {
    return (dispatch) => {
        return Api({
            method  : 'post',
            url     : `/products/${id}/archive`
        })
            .then(payload => {
                dispatch(getUserProductCategories({ category }));
            })
            .catch(error => {
                alert(`Error: ${error.response.data.statusCode} - ${error.response.data.message}`);
                throw(error);
            });
    }
}

export function unarchiveProduct({ category, id }) {
    return (dispatch) => {
        return Api({
            method  : 'post',
            url     : `/products/${id}/unarchive`
        })
            .then(payload => {
                dispatch(getUserProductCategories({ category }));
            })
            .catch(error => {
                alert(`Error: ${error.response.data.statusCode} - ${error.response.data.message}`);
                throw(error);
            });
    }
}