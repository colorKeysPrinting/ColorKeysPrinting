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
    fundProperties: []
});

export default (state = initialState, action) => {
   
    switch (action.type) {
    case ActionTypes.GET_USERS_SUCCESS:
        console.log('receiving users');
        state = state.set('users', Immutable.fromJS(action.data));
        break;

    case ActionTypes.APPROVE_USER_SUCCESS:
        console.log('receiving approved user');
        const users = state.get('users').toJS();
        index = _.findIndex(users, ['id', action.data.id]);
        users[index] = action.data;

        state = state.set('users', Immutable.fromJS(users));
        break;
    
    case ActionTypes.DISABLE_USER_SUCCESS:
        console.log('receiving disable user');
        break;
    
    case ActionTypes.GET_FUNDS_SUCCESS:
        console.log('receiving funds');
        state = state.set('funds', Immutable.fromJS(action.data));
        break;

    case ActionTypes.GET_FUND_PROPERTIES_SUCCESS:
        console.log('receiving fund properties');
        state = state.set('fundProperties', Immutable.fromJS(action.data));
        break;

    default: 
        return state;
    }
    return state;
};
