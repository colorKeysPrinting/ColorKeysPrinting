'use strict';

import axios            from 'axios';
import Network          from 'libs/constants/network';

// /////////////////////////////////////
//             ACTION TYPES
// /////////////////////////////////////
export const ActionTypes = {
    GET_ORDER_BY_ID_SUCCESS : 'sibi_ge_admin/products/GET_ORDER_BY_ID_SUCCESS',
    GET_ORDERS_SUCCESS : 'sibi_ge_admin/products/GET_ORDERS_SUCCESS',
    APPROVE_ORDER_SUCCESS : 'sibi_ge_admin/products/APPROVE_ORDER_SUCCESS',
    UPDATE_ORDER_SUCCESS : 'sibi_ge_admin/products/UPDATE_ORDER_SUCCESS',
    UPDATE_INSTALL_DATE_SUCCESS: 'sibi_ge_admin/products/UPDATE_INSTALL_DATE_SUCCESS',
    UPDATE_MODEL_NUMBER_SUCCESS: 'sibi_ge_admin/products/UPDATE_MODEL_NUMBER_SUCCESS',
    CREATE_ORDER_SUCCESS : 'sibi_ge_admin/products/CREATE_ORDER_SUCCESS',
    PROCESS_ORDER_SUCCESS: 'sibi_ge_admin/products/PROCESS_ORDER_SUCCESS',
    REMOVE_ORDER_SUCCESS : 'sibi_ge_admin/products/REMOVE_ORDER_SUCCESS',
}

// /////////////////////////////////////
//             LOCAL ACTIONS
// /////////////////////////////////////

// /////////////////////////////////////
//             ASYNC CALLS
// /////////////////////////////////////
export function getOrderById({ token, id }) {
    return (dispatch) => {
        return axios({
            method  : Network.GET,
            url     : `${Network.DOMAIN}/order/${id}`,
            headers : {
                'x-auth-token': token
            }
        })
            .then(payload => {
                dispatch({ type: ActionTypes.GET_ORDER_BY_ID_SUCCESS , ...payload });
            })
            .catch(error => {
                throw(error);
            });
    }
}

export function getOrders({ token, type }) {
    return (dispatch) => {
        type = (type === 'superAdmin') ? 'ordersForSuperAdmin' : 'ordersForFund';
        return axios({
            method  : Network.GET,
            url     : `${Network.DOMAIN}/${type}`,
            headers : {
                'x-auth-token': token
            }
        })
            .then(payload => {
                dispatch({ type: ActionTypes.GET_ORDERS_SUCCESS , ...payload });
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
                dispatch({ type: ActionTypes.APPROVE_ORDER_SUCCESS , ...payload });
            })
            .catch(error => {
                throw(error);
            });
    }
}

export function updateOrder({ token, order }) {
    return (dispatch) => {
        return axios({
            method  : Network.PATCH,
            url     : `${Network.DOMAIN}/order/${id}`,
            headers : {
                'x-auth-token': token
            },
            data: {
                ...order
            }
        })
            .then(payload => {
                dispatch({ type: ActionTypes.UPDATE_ORDER_SUCCESS , ...payload });
            })
            .catch(error => {
                throw(error);
            });
    }
}

export function updateInstallDate ({ id, installDate }) {
    return (dispatch) => {
        return axios({
            method  : Network.POST,
            url     : `${Network.DOMAIN}/order/${id}/updateInstallDate`,
            data: {
                installDate
            }
        })
            .then(payload => {
                dispatch({ type: ActionTypes.UPDATE_INSTALL_DATE_SUCCESS , ...payload });
            })
            .catch(error => {
                throw(error);
            });
    }
}

export function updateModelNumber ({ id, productOrderId, manufacturerModelNumber }) {
    return (dispatch) => {
        return axios({
            method  : Network.POST,
            url     : `${Network.DOMAIN}/order/${id}/addReplacementModel`,
            data: {
                productOrderId,
                manufacturerModelNumber
            }
        })
            .then(payload => {
                dispatch({ type: ActionTypes.UPDATE_MODEL_NUMBER_SUCCESS , ...payload });
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
                dispatch({ type: ActionTypes.CREATE_ORDER_SUCCESS , ...payload });
            })
            .catch(error => {
                throw(error);
            });
    }
}

export function processOrder({ id, processedByName, geOrderNumber }) {
    return (dispatch) => {
        return axios({
            method  : Network.POST,
            url     : `${Network.DOMAIN}/order/${id}/process`,
            data    : {
                processedByName,
                geOrderNumber
            }
        })
            .then(payload => {
                dispatch({ type: ActionTypes.PROCESS_ORDER_SUCCESS , ...payload });
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
                dispatch({ type: ActionTypes.REMOVE_ORDER_SUCCESS , ...payload });
            })
            .catch(error => {
                throw(error);
            });
    }
}
