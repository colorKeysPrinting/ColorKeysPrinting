'use strict';

import _                        from 'lodash';
import Immutable                from 'immutable';
import { Cookies }              from 'react-cookie';
import { ActionTypes }          from './actions';

// /////////////////////////////////////
//             REDUCER
// /////////////////////////////////////
const initialState = Immutable.fromJS({
    order: '',
    orders: [],
    zeroOrders: false
});

export default (state = initialState, action) => {

    switch (action.type) {
    case ActionTypes.CLEAR_ORDER:
        console.log('clear orders');
        state = state.set('order', '');
        state = state.set('orderProducts', []);
        break;

    case ActionTypes.GET_ORDER_BY_ID_SUCCESS:
        console.log('receiving order by ID', action.data);
        state = state.set('order', Immutable.fromJS(action.data));
        break;

    case ActionTypes.GET_ORDERS_SUCCESS:
        console.log('receiving orders', action.data);
        state = state.set('orders', Immutable.fromJS(action.data));
        state = state.set('zeroOrders', (_.size(action.data) <= 0) ? true : false );
        break;

    default:
        return state;
    }
    return state;
};
