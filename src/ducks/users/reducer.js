'use strict';

import _                        from 'lodash';
import Immutable                from 'immutable';
import { Cookies }              from 'react-cookie';
import { ActionTypes }          from './actions';

// /////////////////////////////////////
//             REDUCER
// /////////////////////////////////////
const initialState = Immutable.fromJS({
    user: {},
    users: [],
    zeroUsers: false
});

export default (state = initialState, action) => {
    let users, index;

    switch (action.type) {
    case ActionTypes.CLEAR_USERS:
        state = state.set('users', []);
        break;

    case ActionTypes.GET_USER_BY_ID_SUCCESS:
        console.log('receiving user', action.data);
        state = state.set('user', Immutable.fromJS(action.data));
        break;

    case ActionTypes.GET_USERS_SUCCESS:
        console.log('receiving users', action.data);
        state = state.set('users', Immutable.fromJS(action.data));
        state = state.set('zeroUsers', (_.size(action.data) <= 0) ? true : false );
        break;

    default:
        return state;
    }
    return state;
};
