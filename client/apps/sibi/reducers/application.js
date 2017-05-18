'use strict';

import _                    from 'lodash';
import Immutable            from 'immutable';
import ActionTypes          from '../constants/action_types';

const initialState = Immutable.fromJS({ activeUser: {type: '', username: 'JohnDoe'}, activeTab: '', activeOverlay: '', overlayObj: false,
    fundsList: ['Associated fund', 'value fund', 'foo fund', 'Jolly fund'], locationList: ['petes place', 'lower towers', 'twin terrace'],
    tradeList: ['engineer', 'carpenter', 'fur trade'], entityList: ['business', 'apartment', '4 plex', 'douplex']
});

export default (state = initialState, action)=>{
    switch (action.type) {
        case ActionTypes.HOME:
            console.log('home');
            break;

        case ActionTypes.ACTIVATE_TAB:
            console.log(action.key);
            state = state.set('activeTab', action.key);
            break;

// **** LOGIN/CREATE USER SECTION
        case ActionTypes.LOGIN:
            console.log('login', action.username, action.password);
            state = state.set('activeOverlay', '');
            // TODO: call API function
            break;
        case ActionTypes.PASSWORD_RESET:
            console.log('password reset', action.email);
            state = state.set('activeOverlay', '');
            // TODO: call API function
            break;

        case ActionTypes.SIGNUP:
            console.log('signup');
            break;

        case ActionTypes.SIGN_UP_PAGE:
            console.log('signuppage');
            state = state.setIn(['activeUser', 'type'], 'signUp');
            break;

// **** OVERLAY SECTION
        case ActionTypes.SHOW_OVERLAY:
            console.log('show overlay', action.key);
            state = state.set('activeOverlay', action.key);

            if(action.obj) {
                state = state.set('overlayObj', action.obj);
            }
            break;

        case ActionTypes.CLOSE_OVERLAY:
            console.log('close overlay');
            state = state.set('activeOverlay', '');
            break;
        default:
    }

    return state;
};
