'use strict';

import axios            from 'axios';
import ActionTypes      from 'actions/action_types';
import Network          from 'libs/constants/network';

// /////////////////////////////////////
//             helper functions
// /////////////////////////////////////
const getProductsSuccess = (payload) => {
    return {
        type: ActionTypes.GET_PRODUCTS_SUCCESS,
        ...payload
    }
}

const getProductCategoriesSuccess = (payload) => {
    return {
        type: ActionTypes.GET_PRODUCT_CATEGORIES_SUCCESS,
        ...payload
    }
}

const getProductsForCategorySuccess = (payload) => {
    return {
        type: ActionTypes.GET_PRODUCTS_FOR_CATEGORY_SUCCESS,
        ...payload
    }
}

const getProductsForSubCategorySuccess = (payload) => {
    return {
        type: ActionTypes.GET_PRODUCTS_FOR_SUB_CATEGORY_SUCCESS,
        ...payload
    }
}

const updateProductSuccess = (payload) => {
    return {
        type: ActionTypes.UPDATE_PRODUCT_SUCCESS,
        ...payload
    }
}

const createProductSuccess = (payload) => {
    return {
        type: ActionTypes.CREATE_PRODUCT_SUCCESS,
        ...payload
    }
}

const removeProductSuccess = (payload) => {
    return {
        type: ActionTypes.REMOVE_PRODUCT_SUCCESS,
        ...payload
    }
}

const getOrdersSuccess = (payload) => {
    return {
        type: ActionTypes.GET_ORDERS_SUCCESS,
        ...payload
    }
}

const approveOrderSuccess = (payload) => {
    return {
        type: ActionTypes.APPROVE_ORDER_SUCCESS,
        ...payload
    }
}

const updateOrderSuccess = (payload) => {
    return {
        type: ActionTypes.UPDATE_ORDER_SUCCESS,
        ...payload
    }
}

const createOrderSuccess = (payload) => {
    return {
        type: ActionTypes.CREATE_ORDER_SUCCESS,
        ...payload
    }
}

const removeOrderSuccess = (payload) => {
    return {
        type: ActionTypes.REMOVE_ORDER_SUCCESS,
        ...payload
    }
}

const setActiveFiltersSuccess = (payload) => {
    return {
        type: ActionTypes.SET_ACTIVE_FILTERS_SUCCESS,
        ...payload
    }
}


// /////////////////////////////////////
//             ASYNC CALLS
// /////////////////////////////////////

// *************** product section ***************
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
                dispatch(getProductsSuccess(payload));
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
                dispatch(getProductCategoriesSuccess(payload));
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
                dispatch(getProductsForCategorySuccess(payload));
            })
            .catch(error => {
                throw(error);
            });
    }
}

export function getProductsForSubCategory({ token, categoryId, category }) {
    console.log(category);
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
                dispatch(getProductsForSubCategorySuccess(payload));
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
            body: {
                ...product
            }
        })
            .then(payload => {
                dispatch(updateProductSuccess(payload));
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
            body: {
                ...product
            }
        })
            .then(payload => {
                dispatch(createProductSuccess(payload));
            })
            .catch(error => {
                throw(error);
            });
    }
}

export function removeProduct({ token, category, id }) {
    return (dispatch) => {
        return axios({
            method  : Network.DEL,
            url     : `${Network.DOMAIN}/products/${id}`,
            headers : {
                'x-auth-token': token,
                category
            }
        })
            .then(payload => {
                dispatch(removeProductSuccess(payload));
            })
            .catch(error => {
                throw(error);
            });
    }
}

// *************** order section ***************
export function getOrders({ token, orders }) {
    return (dispatch) => {
        return axios({
            method  : Network.GET,
            url     : `${Network.DOMAIN}/${orders}`,
            headers : {
                'x-auth-token': token
            }
        })
            .then(payload => {
                dispatch(getOrdersSuccess(payload));
            })
            .catch(error => {
                throw(error);
            });
    }
}

export function approveOrder({ token, id }) {
    return (dispatch) => {
        return axios({
            method  : Network.POST,
            url     : `${Network.DOMAIN}/order/${id}/approve`,
            headers : {
                'x-auth-token': token,
                orderId: id
            }
        })
            .then(payload => {
                dispatch(approveOrderSuccess(payload));
            })
            .catch(error => {
                throw(error);
            });
    }
}

export function updateOrder({ token, id, status }) {
    return (dispatch) => {
        return axios({
            method  : Network.PATCH,
            url     : `${Network.DOMAIN}/order/${id}`,
            headers : {
                'x-auth-token': token
            },
            body: {
                productsAndDestinations,
                fundPropertyId,
                tenantFirstName,
                tenantLastName,
                tenantPhone,
                tenantEmail,
                lockBoxCode,
                specialInstructions,
                customerPONumber,
                occupied,
                isApplianceHotShotDelivery,
                installDate,
                applianceDeliveryTime,
                installDate,
                applianceDeliveryTime
            }
        })
            .then(payload => {
                dispatch(updateOrderSuccess(payload));
            })
            .catch(error => {
                throw(error);
            });
    }
}

export function createOrder() {
    return (dispatch) => {
        return axios({
            method  : Network.POST,
            url     : `${Network.DOMAIN}/createOrder`,
            headers : {
                'x-auth-token': token
            }
        })
            .then(payload => {
                dispatch(createOrderSuccess(payload));
            })
            .catch(error => {
                throw(error);
            });
    }
}

export function removeOrder(token, id) {
    return (dispatch) => {
        return axios({
            method  : Network.DEL,
            url     : `${Network.DOMAIN}/order/${id}`,
            headers : {
                'x-auth-token': token
            }
        })
            .then(payload => {
                dispatch(removeOrderSuccess(payload));
            })
            .catch(error => {
                throw(error);
            });
    }
}

export function setActiveFilters(key, value) {
    return (dispatch) => {
        return axios({
            method  : Network.GET,
            url     : '',
            headers : {
                'x-auth-token': token
            }
        })
            .then(payload => {
                dispatch(setActiveFiltersSuccess(payload));
            })
            .catch(error => {
                throw(error);
            });
    }
}