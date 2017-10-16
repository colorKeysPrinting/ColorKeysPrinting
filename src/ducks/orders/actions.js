'use strict';

import Api                      from 'libs/network';

// /////////////////////////////////////
//             ACTION TYPES
// /////////////////////////////////////
export const ActionTypes = {
    CLEAR_ORDER             : 'sibi_ge_admin/products/CLEAR_ORDER',
    GET_ORDER_BY_ID_SUCCESS : 'sibi_ge_admin/products/GET_ORDER_BY_ID_SUCCESS',
    GET_ORDERS_SUCCESS      : 'sibi_ge_admin/products/GET_ORDERS_SUCCESS',
    APPROVE_ORDER_SUCCESS   : 'sibi_ge_admin/products/APPROVE_ORDER_SUCCESS',
    UPDATE_ORDER_SUCCESS    : 'sibi_ge_admin/products/UPDATE_ORDER_SUCCESS',
    UPDATE_INSTALL_DATE_SUCCESS: 'sibi_ge_admin/products/UPDATE_INSTALL_DATE_SUCCESS',
    UPDATE_MODEL_NUMBER_SUCCESS: 'sibi_ge_admin/products/UPDATE_MODEL_NUMBER_SUCCESS',
    CREATE_ORDER_SUCCESS    : 'sibi_ge_admin/products/CREATE_ORDER_SUCCESS',
    PROCESS_ORDER_SUCCESS   : 'sibi_ge_admin/products/PROCESS_ORDER_SUCCESS',
    REMOVE_ORDER_SUCCESS    : 'sibi_ge_admin/products/REMOVE_ORDER_SUCCESS',
}

// /////////////////////////////////////
//             LOCAL ACTIONS
// /////////////////////////////////////
export function clearOrder() {
    return {
        type: ActionTypes.CLEAR_ORDER
    }
}

const configureOrderProduct = ({ order }) => {
    return {
        type: ActionTypes.CONFIGURE_ORDER_PRODUCT,
        order
    }
}

// /////////////////////////////////////
//             ASYNC CALLS
// /////////////////////////////////////
export function getOrderById({ id }) {
    return (dispatch) => {
        return Api({ url : `/order/${id}` })
            .then(payload => {
                dispatch({ type: ActionTypes.GET_ORDER_BY_ID_SUCCESS , ...payload });
            })
            .catch(error => {
                alert(`Unable to Load Order ${id} \nError: ${error.message}`);
                throw(error);
            });
    }
}

export function getOrders({ type }) {
    return (dispatch) => {
        const endPointTypes = {};
        switch(type) {
        case 'superAdmin':
        case 'manufacturerSuperAdmin':
            type = 'ordersForSuperAdmin';
            break;
        case '':
            type = 'ordersForFund';
            break;
        default:
            type = 'ordersForFund';
        }
        return Api({ url : `/${type}` })
            .then(payload => {
                dispatch({ type: ActionTypes.GET_ORDERS_SUCCESS , ...payload });
            })
            .catch(error => {
                alert(`Unable to Load Orders \nError: ${error.message}`);
                throw(error);
            });
    }
}

export function approveOrder({ id }) {
    return (dispatch) => {
        return Api({
            method  : 'post',
            url     : `/order/${id}/approve`,
            headers : {
                orderId: id
            }
        })
            .then(payload => {
                dispatch({ type: ActionTypes.APPROVE_ORDER_SUCCESS , ...payload });
            })
            .catch(error => {
                alert(`Unable to Approve Order \nError: ${error.message}`);
                throw(error);
            });
    }
}

export function updateOrder({ order }) {
    return (dispatch) => {
        return Api({
            method  : 'patch',
            url     : `/order/${id}`,
            data    : {
                ...order
            }
        })
            .then(payload => {
                dispatch({ type: ActionTypes.UPDATE_ORDER_SUCCESS , ...payload });
            })
            .catch(error => {
                alert(`Unable to Update Order \nError: ${error.message}`);
                throw(error);
            });
    }
}

export function updateInstallDate ({ id, installDate }) {
    return (dispatch) => {
        return Api({
            method  : 'patch',
            url     : `/order/${id}/updateInstallDate`,
            data    : {
                installDate
            }
        })
            .then(payload => {
                dispatch({ type: ActionTypes.UPDATE_INSTALL_DATE_SUCCESS , ...payload });
            })
            .catch(error => {
                alert(`Unable to Update Install Date \nError: ${error.message}`);
                throw(error);
            });
    }
}

export function updateModelNumber ({ id, data }) {
    return (dispatch) => {
        return Api({
            method  : 'post',
            url     : `/order/${id}/addReplacementModel`,
            data    : {
                ...data
            }
        })
            .then(payload => {
                dispatch({ type: ActionTypes.UPDATE_MODEL_NUMBER_SUCCESS , ...payload });
            })
            .catch(error => {
                alert(`Unable to Update Model # \nError: ${error.message}`);
                throw(error);
            });
    }
}

export function createOrder() {
    return (dispatch) => {
        return Api({
            method  : 'post',
            url     : `/createOrder`,
        })
            .then(payload => {
                dispatch({ type: ActionTypes.CREATE_ORDER_SUCCESS , ...payload });
            })
            .catch(error => {
                alert(`Unable to Create Order \nError: ${error.message}`);
                throw(error);
            });
    }
}

export function processOrder({ id, processedByName, geOrderNumber }) {
    return (dispatch) => {
        return Api({
            method  : 'post',
            url     : `/order/${id}/process`,
            data    : {
                processedByName,
                geOrderNumber
            }
        })
            .then(payload => {
                dispatch({ type: ActionTypes.PROCESS_ORDER_SUCCESS , ...payload });
            })
            .catch(error => {
                alert(`Unable to Process Order \nError: ${error.message}`);
                throw(error);
            });
    }
}

export function removeOrder(id) {
    return (dispatch) => {
        return Api({
            method  : 'delete',
            url     : `/order/${id}`
        })
            .then(payload => {
                dispatch({ type: ActionTypes.REMOVE_ORDER_SUCCESS , ...payload });
            })
            .catch(error => {
                alert(`Unable to Remove Order \nError: ${error.message}`);
                throw(error);
            });
    }
}
