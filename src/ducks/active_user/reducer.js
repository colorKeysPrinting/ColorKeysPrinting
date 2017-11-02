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
    loginError: false,
    emailSent: false,
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

    case ActionTypes.RESET_SENT_EMAIL:
        console.log('reset sent email');
        state = state.set('emailSent', false);
        break;

    case ActionTypes.LOGIN_SUCCESS:
        if (!action.data.disabled) {
            state = state.set('activeUser', Immutable.fromJS(action.data));
            const maxAge = 24 * 60 * 60;

            cookies.set('sibi-ge-admin', { token: state.getIn(['activeUser','token']), email: state.getIn(['activeUser','email']), type: state.getIn(['activeUser','type']), trade: state.getIn(['activeUser','trade']) }, { path: '/', maxAge });

        } else {
            alert('Your account has been disabled!\nIf you find this to be an error please contact your fund');
            state = state.set('loginError', true);
        }
        break;

    case ActionTypes.LOGIN_ERROR:
        state = state.set('loginError', true);
        break;

    case ActionTypes.FORGOT_PASSWORD_SUCCESS:
        console.log('forgot password');
        if (action.data.emailSent) {
            alert("An email has been sent to reset your password");
        }

        state = state.set('emailSent', action.data.emailSent);
        break;

    case ActionTypes.PASSWORD_RESET_SUCCESS:
        console.log('password reset', action.email);
        break;

    case ActionTypes.GET_CURRENT_USER_SUCCESS:
        if (!action.data.disabled) {
            state = state.set('activeUser', Immutable.fromJS(action.data));

        } else {
            alert('Your account has been disabled!\nIf you find this to be an error please contact your fund');
            state = state.set('loginError', true);
        }
        break;

    default:
        return state;
    }
    return state;
};
