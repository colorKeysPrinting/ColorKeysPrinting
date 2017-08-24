'use strict';

import axios            from 'axios';
import Network          from 'libs/constants/network';

// /////////////////////////////////////
//             ACTION TYPES
// /////////////////////////////////////
export const ActionTypes = {
    CALCLATE_ORDER_COST: 'sibi_ge_admin/calculations/CALCLATE_ORDER_COST',
    GET_SALES_TAX_SUCCESS: 'sibi_ge_admin/calculations/GET_SALES_TAX_SUCCESS',
}

// /////////////////////////////////////
//             LOCAL ACTIONS
// /////////////////////////////////////
export function calclateOrderCost({ order }) {
    return {
        type: ActionTypes.CALCLATE_ORDER_COST,
        order
    }
}

// /////////////////////////////////////
//             ASYNC CALLS
// /////////////////////////////////////
export function getSalesTax({ zipcode }) {
    return (dispatch) => {
        return axios({
            method  : Network.GET,
            url     : `${Network.DOMAIN}/salesTaxForOrder`,
            data    : {
                zipcode
            }
        })
            .then(payload => {
                dispatch({ type: ActionTypes.GET_SALES_TAX_SUCCESS , ...payload });
            })
            .catch(error => {
                throw(error);
            });
    }
}