'use strict';

import _                        from 'lodash';
import Immutable                from 'immutable';
import { Cookies }              from 'react-cookie';
import { ActionTypes }          from './actions';

// /////////////////////////////////////
//             REDUCER
// /////////////////////////////////////
const initialState = Immutable.fromJS({
    users: [],
    zeroUsers: false
});

export default (state = initialState, action) => {
    let users, index;

    switch (action.type) {
    case ActionTypes.GET_USERS_SUCCESS:
        console.log('receiving users');
        state = state.set('users', Immutable.fromJS(action.data));
        state = state.set('zeroUsers', (_.size(action.data) <= 0) ? true : false );
        break;

    case ActionTypes.APPROVE_USER_SUCCESS:
        console.log('receiving approved user');
        users = state.get('users').toJS();
        index = _.findIndex(users, ['id', action.data.id]);
        users[index] = action.data;

        state = state.set('users', Immutable.fromJS(users));
        break;

    case ActionTypes.AUTO_APPROVE_USER_ORDERS:
        console.log('receiving auto approve user info');
        users = state.get('users').toJS();
        index = _.findIndex(users, ['id', action.data.id]);
        users[index] = action.data;

        state = state.set('users', Immutable.fromJS(users));
        break;

    case ActionTypes.DISABLE_USER_SUCCESS:
        console.log('receiving disable user');
        break;

    default:
        return state;
    }
    return state;
};
