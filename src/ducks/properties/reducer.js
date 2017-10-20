'use strict';

import _                        from 'lodash';
import Immutable                from 'immutable';
import { Cookies }              from 'react-cookie';
import { ActionTypes }          from './actions';

// /////////////////////////////////////
//             REDUCER
// /////////////////////////////////////
const initialState = Immutable.fromJS({
    funds: [],
    fundProperties: [],
    zeroProperties: false
});

export default (state = initialState, action) => {

    switch (action.type) {
    case ActionTypes.GET_FUNDS_SUCCESS:
        console.log('receiving funds');
        state = state.set('funds', Immutable.fromJS(action.data));
        break;

    case ActionTypes.GET_FUND_PROPERTIES_SUCCESS:
        console.log('receiving fund properties');
        state = state.set('fundProperties', Immutable.fromJS(action.data));
        state = state.set('zeroProperties', (_.size(action.data) <= 0) ? true : false );
        break;

    default:
        return state;
    }
    return state;
};