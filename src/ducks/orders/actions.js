'use strict';

import axios            from 'axios';
import Network          from 'libs/constants/network';

// /////////////////////////////////////
//             ACTION TYPES
// /////////////////////////////////////
export const ActionTypes = {
    GET_ORDERS_SUCCESS : 'sibi_ge_admin/products/GET_ORDERS_SUCCESS',
    APPROVE_ORDER_SUCCESS : 'sibi_ge_admin/products/APPROVE_ORDER_SUCCESS',
    UPDATE_ORDER_SUCCESS : 'sibi_ge_admin/products/UPDATE_ORDER_SUCCESS',
    CREATE_ORDER_SUCCESS : 'sibi_ge_admin/products/CREATE_ORDER_SUCCESS',
    REMOVE_ORDER_SUCCESS : 'sibi_ge_admin/products/REMOVE_ORDER_SUCCESS',
}

// /////////////////////////////////////
//             LOCAL ACTIONS
// /////////////////////////////////////

// /////////////////////////////////////
//             ASYNC CALLS
// /////////////////////////////////////
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

export function updateOrder({ token, id, status }) {
    return (dispatch) => {
        return axios({
            method  : Network.PATCH,
            url     : `${Network.DOMAIN}/order/${id}`,
            headers : {
                'x-auth-token': token
            },
            data: {
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
                dispatch({ type: ActionTypes.UPDATE_ORDER_SUCCESS , ...payload });
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