'use strict';

import Api                      from 'libs/network';
import { Cookies }              from 'react-cookie';

// /////////////////////////////////////
//             ACTION TYPES
// /////////////////////////////////////
export const ActionTypes = {
    CLEAR_USERS              : 'sibi_ge_admin/users/CLEAR_USERS',
    GET_USER_BY_ID_SUCCESS   : 'sibi_ge_admin/users/GET_USER_BY_ID_SUCCESS',
    GET_USERS_SUCCESS        : 'sibi_ge_admin/users/GET_USERS_SUCCESS',
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
export function getUserById({ id }) {
    return (dispatch) => {
        return Api({ url : `/user/${id}` })
            .then(payload => {
                dispatch({ type: ActionTypes.GET_USER_BY_ID_SUCCESS , ...payload });
            })
    }
}

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
                dispatch(getUserById({ id }));
                dispatch(getUsers());
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
                dispatch(getUserById({ id }));
                dispatch(getUsers());
            })
    }
}

export function disableUser({ id }) {
    return (dispatch) => {
        return Api({ url : `/users/${id}/disable` })
            .then(payload => {
                dispatch(getUserById({ id }));
                dispatch(getUsers());
            })
    }
}
