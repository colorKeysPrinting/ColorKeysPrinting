'use strict';

import _                        from 'lodash';
import Immutable                from 'immutable';
import { Cookies }              from 'react-cookie';
import { ActionTypes }          from './actions';

// /////////////////////////////////////
//             REDUCER
// /////////////////////////////////////
const initialState = Immutable.fromJS({ 
    isLogout: false
});

export default (state = initialState, action) => {
    const cookies = new Cookies();
    const jwt = cookies.get('sibi-admin-jwt');

    switch (action.type) {
    case ActionTypes.REFRESH_JWT:

        if (!jwt) {
            state = state.set('isLogout', Immutable.fromJS(true));
        }
        break;

    default:
        return state;
    }

    return state;
};
