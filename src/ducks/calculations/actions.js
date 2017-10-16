'use strict';

import Api                      from 'libs/network';

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
        return Api({
            url     : `/salesTaxForOrder`,
            data    : {
                zipcode
            }
        })
            .then(payload => {
                dispatch({ type: ActionTypes.GET_SALES_TAX_SUCCESS , ...payload });
            })
            .catch(error => {
                alert(`Error: ${error.response.data.statusCode} - ${error.response.data.message}`);
                throw(error);
            });
    }
}