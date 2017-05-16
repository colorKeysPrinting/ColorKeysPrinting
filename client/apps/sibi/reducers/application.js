'use strict';

import _                    from 'lodash';
import Immutable            from 'immutable';
import ActionTypes          from '../constants/action_types';

const initialState = Immutable.fromJS({ activeUser: {type: 'sibi', username: 'JohnDoe'}, activeTab: '' });

export default (state = initialState, action)=>{
    switch (action.type) {
        case ActionTypes.HOME:
            console.log('home');
            break;

        case ActionTypes.LOGIN:
            console.log('login', action.username, action.password);
            break;

        case ActionTypes.SIGNUP:
            console.log('signup');
            break;

        case ActionTypes.LOAD_PAGE:
            console.log(action.key);
            // TODO: need to change the active page that's being shown
            state = state.set('activeTab', action.key);
            break;
        default:
    }

    return state;
};
