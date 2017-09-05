'use strict';

import _                        from 'lodash';
import Immutable                from 'immutable';
import { Cookies }              from 'react-cookie';
import { ActionTypes }          from './actions';

// /////////////////////////////////////
//             REDUCER
// /////////////////////////////////////
const initialState = Immutable.fromJS({
    activeUser: {},
    loginError: false
});

export default (state = initialState, action) => {
    const cookies = new Cookies();

    switch (action.type) {
    case ActionTypes.LOGOUT:
        console.log('logging out');
        state = state.set('activeUser', {});
        break;

    case ActionTypes.RESET_LOGIN_ERROR:
        console.log('reset login error');
        state = state.set('loginError', false);
        break;


    case ActionTypes.LOGIN_SUCCESS:
        console.log('login: ', action.data);

        if (!action.data.disabled) {
            state = state.set('activeUser', Immutable.fromJS({ ...action.data }));
            const maxAge = 24 * 60 * 60; // one day in seconds
            // const maxAge = 60; // one min in seconds

            cookies.set('sibi-admin-jwt', { token: action.data.token, email: action.data.email, type: action.data.type }, { path: '/', maxAge });

        } else {
            alert('Your account has been disabled!\nIf you find this to be an error please contact your fund');
            state = state.set('loginError', true);
        }
        break;

    case ActionTypes.LOGIN_ERROR:
        console.log('login error');
        alert('Could not find a Username and Password combination matching the provided');
        state = state.set('loginError', true);
        break;

    case ActionTypes.PASSWORD_RESET:
        console.log('password reset', action.email);
        state = state.set('activeOverlay', '');
        // TODO: call API function
        break;

    case ActionTypes.GET_CURRENT_USER_SUCCESS:
        state = state.set('activeUser', Immutable.fromJS({ ...action.data }));
        break;

    default:
        return state;
    }
    return state;
};
