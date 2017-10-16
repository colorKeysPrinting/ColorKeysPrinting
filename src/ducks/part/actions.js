'use strict';

import axios                    from 'axios';
import { createProductPart, getProductById, update }    from 'ducks/product/actions';
import { getParts }             from 'ducks/products/actions';

// /////////////////////////////////////
//             ACTION TYPES
// /////////////////////////////////////
export const ActionTypes = {
    CLEAR_PART : 'sibi_ge_admin/part/CLEAR_PART',
    NEW_PART : 'sibi_ge_admin/part/NEW_PART',
    UPDATE : 'sibi_ge_admin/part/UPDATE',
    GET_PART_BY_ID_SUCCESS : 'sibi_ge_admin/part/GET_PART_BY_ID_SUCCESS'
}

// /////////////////////////////////////
//             LOCAL ACTIONS
// /////////////////////////////////////
export function clearPart() {
    return {
        type: ActionTypes.CLEAR_PART
    };
}

export function newPart({ productCategoryId }) {
    return {
        type: ActionTypes.NEW_PART,
        productCategoryId
    };
}

export function updatePartLocal({ isPart, key, value }) {
    return {
        type: ActionTypes.UPDATE,
        isPart,
        key,
        value
    };
}

// /////////////////////////////////////
//             ASYNC CALLS
// /////////////////////////////////////
export function getPartById({ id }) {
    return (dispatch) => {
        return Api({ url : `/parts/${id}` })
            .then(payload => {
                dispatch({ type: ActionTypes.GET_PART_BY_ID_SUCCESS , ...payload });
            })
            .catch(error => {
                alert(`Error: ${error.response.data.statusCode} - ${error.response.data.message}`);
                throw(error);
            });
    }
}

export function createPart({ part, productId }) {
    return (dispatch) => {
        return Api({
            method  : 'post',
            url     : `/createPart`,
            data    : {
                ...part
            }
        })
            .then(payload => {
                (productId) ? dispatch(createProductPart({ productId, partId: payload.data.id })) : dispatch(getParts());
                if (!productId) {
                    dispatch(update({ isProduct: true, key: 'applianceAssociatedParts', value: payload.data }));
                }
            })
            .catch(error => {
                alert(`Error: ${error.response.data.statusCode} - ${error.response.data.message}`);
                throw(error);
            });
    }
}

export function updatePart({ part, productId }) {
    return (dispatch) => {
        return Api({
            method  : 'patch',
            url     : `/parts/${part.id}`,
            data    : {
                ...part
            }
        })
            .then(payload => {
                dispatch(getParts());
                dispatch(getProductById({ id: productId }))
            })
            .catch(error => {
                alert(`Error: ${error.response.data.statusCode} - ${error.response.data.message}`);
                throw(error);
            });
    }
}