'use strict';

import Api                      from 'libs/network';
import { Cookies }              from 'react-cookie';

// /////////////////////////////////////
//             ACTION TYPES
// /////////////////////////////////////
export const ActionTypes = {
    CLEAR_ORDER             : 'sibi_ge_admin/products/CLEAR_ORDER',
    GET_ORDER_BY_ID_SUCCESS : 'sibi_ge_admin/products/GET_ORDER_BY_ID_SUCCESS',
    GET_ORDERS_SUCCESS      : 'sibi_ge_admin/products/GET_ORDERS_SUCCESS',
}

// /////////////////////////////////////
//             LOCAL ACTIONS
// /////////////////////////////////////
export function clearOrder() {
    return {
        type: ActionTypes.CLEAR_ORDER
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
    }
}

export function getOrders() {
    return (dispatch, getState) => {
        const cookies = new Cookies();
        // TODO: need to test to make sure this is working correctly
        const endPointTypes = {};
        const userType = cookies.get('sibi-ge-admin').type;
        let type;
        switch(getState().activeUser.getIn(['activeUser','type']) || userType) {
        case 'superAdmin':
            type = 'ordersForSuperAdmin';
            break;
        case 'fundSuperAdmin':
        case 'fundOrdersAdmin':
            type = 'ordersForFund';
            break;
        case 'manufacturerSuperAdmin':
        case 'manufacturerOrdersAdmin':
            type = 'ordersForManufacturerAdmin';
            break;
        case 'manufacturerOrderProcessor':
            type = 'ordersForManufacturer';
            break;
        default:
            type = 'ordersForUser';
        }
        return Api({ url : `/${type}` })
            .then(payload => {
                dispatch({ type: ActionTypes.GET_ORDERS_SUCCESS , ...payload });
            })
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
                alert('Your order was approved.');
                dispatch(getOrderById({ id }));
                dispatch(getOrders());
            })
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
                dispatch(getOrderById({ id }));
                dispatch(getOrders());
            })
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
                dispatch(getOrderById({ id }));
            })
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
                dispatch(getOrderById({ id }));
            })
    }
}

export function createOrder() {
    return (dispatch) => {
        return Api({
            method  : 'post',
            url     : `/createOrder`,
        })
            .then(payload => {
                dispatch(getOrders());
            })
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
                alert('Your order has been processed.');
                dispatch(getOrderById({ id }));
                dispatch(getOrders());
            })
    }
}

export function removeOrder(id) {
    return (dispatch) => {
        return Api({
            method  : 'delete',
            url     : `/order/${id}`
        })
            .then(payload => {
                dispatch(getOrders());
            })
    }
}
