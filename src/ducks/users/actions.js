'use strict';

import Api                      from 'libs/network';
import { Cookies }              from 'react-cookie';

// /////////////////////////////////////
//             ACTION TYPES
// /////////////////////////////////////
export const ActionTypes = {
    CLEAR_USERS              : 'sibi_ge_admin/users/CLEAR_USERS',
    GET_USERS_SUCCESS        : 'sibi_ge_admin/users/GET_USERS_SUCCESS',
    APPROVE_USER_SUCCESS     : 'sibi_ge_admin/users/APPROVE_USER_SUCCESS',
    AUTO_APPROVE_USER_ORDERS : 'sibi_ge_admin/users/AUTO_APPROVE_USER_ORDERS',
    DISABLE_USER_SUCCESS     : 'sibi_ge_admin/users/DISABLE_USER_SUCCESS',

}

// /////////////////////////////////////
//             LOCAL ACTIONS
// /////////////////////////////////////
export function clearUsers() {
    return {
        type: ActionTypes.CLEAR_USERS
    }
}

// /////////////////////////////////////
//             ASYNC CALLS
// /////////////////////////////////////
export function getUsers() {
    return (dispatch, getState) => {
        const cookies = new Cookies();
        const userType = cookies.get('sibi-ge-admin').type;
        const activeUser = getState().activeUser.getIn(['activeUser','type']);
        const type = (((activeUser) ? activeUser : userType) === 'superAdmin') ? 'usersForSuperAdmin' : 'usersForFund';

        return Api({ url : `/${type}` })
            .then(payload => {
                dispatch({ type: ActionTypes.GET_USERS_SUCCESS , ...payload });
            })
    }
}

export function approveUser({ id }) {
    return (dispatch) => {
        return Api({
            method  : 'post',
            url     : `/users/${id}/approve`
        })
            .then(payload => {
                dispatch({ type: ActionTypes.APPROVE_USER_SUCCESS , ...payload });
            })
    }
}

export function autoApproveUserOrders( { user, autoApprovedOrders }) {
    return (dispatch) => {
        autoApprovedOrders = (autoApprovedOrders) ? 'autoApproveOrders' : 'removeAutoApproveOrders' ;
        return Api({
            method  : 'post',
            url     : `/users/${user.id}/${autoApprovedOrders}`,
            data: {
                ...user
            }
        })
            .then(payload => {
                dispatch({ type: ActionTypes.AUTO_APPROVE_USER_ORDERS, ...payload});
            })
    }
}

export function disableUser({ id }) {
    return (dispatch) => {
        return Api({ url : `/users/${id}/disable` })
            .then(payload => {
                dispatch({ type: ActionTypes.DISABLE_USER_SUCCESS , ...payload });
            })
    }
}
