'use strict';

import axios                    from 'axios';
import Network                  from 'libs/constants/network';
import { createProductPart, getParts }    from 'ducks/product/actions';

// /////////////////////////////////////
//             ACTION TYPES
// /////////////////////////////////////
export const ActionTypes = {
    CLEAR_PART : 'sibi_ge_admin/part/CLEAR_PART',
    NEW_PART : 'sibi_ge_admin/part/NEW_PART',
    UPDATE : 'sibi_ge_admin/part/UPDATE',
    GET_PART_BY_ID_SUCCESS : 'sibi_ge_admin/part/GET_PART_BY_ID_SUCCESS',
    CREATE_PART_SUCCESS : 'sibi_ge_admin/part/CREATE_PART_SUCCESS',
    UPDATE_PART_SUCCESS : 'sibi_ge_admin/part/UPDATE_PART_SUCCESS',
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
export function getPartById({ token, id }) {
    return (dispatch) => {
        return axios({
            method  : Network.GET,
            url     : `${Network.DOMAIN}/part/${id}`,
            headers : {
                'x-auth-token': token
            }
        })
            .then(payload => {
                dispatch({ type: ActionTypes.GET_PART_BY_ID_SUCCESS , ...payload });
            })
            .catch(error => {
                throw(error);
            });
    }
}

export function createPart({ token, part, productId }) {
    return (dispatch) => {
        return axios({
            method  : Network.POST,
            url     : `${Network.DOMAIN}/createPart`,
            headers : {
                'x-auth-token': token
            },
            data    : {
                ...part
            }
        })
            .then(payload => {
                (productId) ? dispatch(createProductPart({ token, productId, partId: payload.data.id })) : dispatch(getParts({ token }));
                if (!productId) {
                    dispatch({ type: ActionTypes.CREATE_PART_SUCCESS , partId: payload.data.id });
                }
            })
            .catch(error => {
                throw(error);
            });
    }
}

export function updatePart({ token, part }) {
    return (dispatch) => {
        return axios({
            method  : Network.PATCH,
            url     : `${Network.DOMAIN}/part/${part.id}`,
            headers : {
                'x-auth-token': token
            },
            data    : {
                ...part.toJS()
            }
        })
            .then(payload => {
                dispatch(getParts({ token }));
            })
            .catch(error => {
                throw(error);
            });
    }
}