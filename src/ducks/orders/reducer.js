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
    orders: []
});

export default (state = initialState, action) => {
    let orders, index;

    switch (action.type) {
    case ActionTypes.GET_ORDER_BY_ID_SUCCESS:
        console.log('receiving order by ID', action.data);
        state = state.set('order', Immutable.fromJS(action.data));
        break;

    case ActionTypes.GET_ORDERS_SUCCESS:
        console.log('receiving orders', action.data);
        state = state.set('orders', Immutable.fromJS(action.data));
        break;

    case ActionTypes.APPROVE_ORDER_SUCCESS:
        console.log('approved order', action.data);
        orders = state.get('orders').toJS();
        index = _.findIndex(orders, ['id', action.config.headers.orderId]);
        orders[index] = action.data;

        state = state.set('order', Immutable.fromJS(action.data));
        state = state.set('orders', Immutable.fromJS(orders));
        break;

    case ActionTypes.UPDATE_ORDER_SUCCESS:
        console.log('update order', action.data);

        break;

    case ActionTypes.CREATE_ORDER_SUCCESS:
        console.log('create order', action.data);

        break;

    case ActionTypes.REMOVE_ORDER_SUCCESS:
        console.log('remove order', action.data);

        break;

    default:
        return state;
    }
    return state;
};
