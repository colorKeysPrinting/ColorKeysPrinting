'use strict';

import axios            from 'axios';
import ActionTypes      from 'actions/action_types';
import Network          from 'libs/constants/network';

export function changeLanguage(language) {
    return {
        type: ActionTypes.CHANGE_LANGUAGE,
        language
    }
}

// /////////////////////////////////////
//             ASYNC CALLS
// /////////////////////////////////////
export function login({ email, password }) {
    return (dispatch) => {
        return axios({
            method: Network.POST,
            url: `${Network.DOMAIN}/adminsignin`,
            data: {
                email,
                password
            }
        })
            .then(user => {
                dispatch(loginSuccess(user));
            })
            .catch(error => {
                throw(error);
            });
    }
}

const loginSuccess = (user) => {
    return {
        type: ActionTypes.LOGIN_SUCCESS,
        ...user
    }
}

export function passwordReset({ email }) {
    // needs to be a async call
    return {
        type: ActionTypes.PASSWORD_RESET,
        email
    };
}