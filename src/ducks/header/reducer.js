'use strict';

import _                        from 'lodash';
import Immutable                from 'immutable';
import { Cookies }              from 'react-cookie';
import { ActionTypes }          from './actions';

// /////////////////////////////////////
//             REDUCER
// /////////////////////////////////////
const initialState = Immutable.fromJS({
    activeTab: ''
});

export default (state = initialState, action) => {
   
    switch (action.type) {
    case ActionTypes.SET_ACTIVE_TAB:
        console.log('activeTab', action.key);
        state = state.set('activeTab', action.key);
        break;
    
    default: 
        return state;
    }
    return state;
};
