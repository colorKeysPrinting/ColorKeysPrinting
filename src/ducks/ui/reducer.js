'use strict';

import _                        from 'lodash';
import Immutable                from 'immutable';
import { Cookies }              from 'react-cookie';
import { ActionTypes }          from './actions';

// /////////////////////////////////////
//             REDUCER
// /////////////////////////////////////
const initialState = Immutable.fromJS({ 
    currLanguage: 'English'
});

export default (state = initialState, action) => {
    
    switch (action.type) {
    case ActionTypes.CHANGE_LANGUAGE:
        console.log('change language: ', action.language);
        state = state.set('currLanguage', action.language);
        break;
    
    case ActionTypes.GO_HOME:
        console.log('going home');
        break;

    default:
        return state;
    }
    return state;
};
