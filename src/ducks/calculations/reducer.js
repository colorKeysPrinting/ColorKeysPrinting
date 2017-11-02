'use strict';

import _                        from 'lodash';
import Immutable                from 'immutable';
import { Cookies }              from 'react-cookie';
import { ActionTypes }          from './actions';

// /////////////////////////////////////
//             REDUCER
// /////////////////////////////////////
const initialState = Immutable.fromJS({
    salesTax: 0,
    orderCost: 0
});

export default (state = initialState, action) => {

    switch (action.type) {
    case ActionTypes.CALCLATE_ORDER_COST:
        console.log('calculating order cost');
        let orderCost;

        state = state.set('orderCost', Immutable.fromJS(orderCost));
        break;

    case ActionTypes.GET_SALES_TAX_SUCCESS:
        console.log('receiving salesTax');
        state = state.set('salesTax', Immutable.fromJS(action.data));
        break;

    default:
        return state;
    }
    return state;
};
