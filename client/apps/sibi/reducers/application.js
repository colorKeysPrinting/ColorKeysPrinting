'use strict';

import _                    from 'lodash';
import Immutable            from 'immutable';
import ActionTypes          from '../constants/action_types';

const initialState = Immutable.fromJS({ activeUser: {type: '', username: 'JohnDoe'}, activeTab: '', activeOverlay: '' });

export default (state = initialState, action)=>{
    switch (action.type) {
        case ActionTypes.HOME:
            console.log('home');
            break;

        case ActionTypes.LOGIN:
            console.log('login', action.username, action.password);
            state = state.set('activeOverlay', '');
            break;

        case ActionTypes.SIGNUP:
            console.log('signup');
            break;

        case ActionTypes.LOAD_PAGE:
            console.log(action.key);
            let type = (action.key === 'truck') ? '' : action.key;

            state = state.set('activeTab', type);
            // TODO: need to change the active page that's being shown
            break;

        case ActionTypes.SHOW_OVERLAY:
            console.log('show overlay', action.key);
            state = state.set('activeOverlay', action.key);
            break;

        case ActionTypes.CLOSE_OVERLAY:
            console.log('close overlay');
            state = state.set('activeOverlay', '');
            break;

        default:
    }

    return state;
};
