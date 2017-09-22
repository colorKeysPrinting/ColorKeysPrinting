'use strict';

import axios            from 'axios';
import Network          from 'libs/constants/network';

// /////////////////////////////////////
//             ACTION TYPES
// /////////////////////////////////////
export const ActionTypes = {
    CLEAR_PART : 'sibi_ge_admin/part/CLEAR_PART',
    NEW_PART : 'sibi_ge_admin/part/NEW_PART',
    GET_PART_BY_ID_SUCCESS : 'sibi_ge_admin/part/GET_PART_BY_ID_SUCCESS',
    // UPDATE_PART_SUCCESS : 'sibi_ge_admin/part/UPDATE_PART_SUCCESS',
    CREATE_PART_SUCCESS : 'sibi_ge_admin/part/CREATE_PART_SUCCESS',
}

// /////////////////////////////////////
//             LOCAL ACTIONS
// /////////////////////////////////////
export function clearPart() {
    return {
        type: ActionTypes.CLEAR_PART
    };
}

export function newPart() {
    return {
        type: ActionTypes.NEW_PART
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

export function createPart({ token, category, subCategory, product }) {
    return (dispatch) => {
        return axios({
            method  : Network.POST,
            url     : `${Network.DOMAIN}/createPart`,
            headers : {
                'x-auth-token': token,
                category,
                subCategory
            },
            data    : {
                ...product
            }
        })
            .then(payload => {
                dispatch({ type: ActionTypes.CREATE_PART_SUCCESS , ...payload });
            })
            .catch(error => {
                throw(error);
            });
    }
}

// export function updatePart({ token, category, subCategory, product }) {
//     return (dispatch) => {
//         return axios({
//             method  : Network.PATCH,
//             url     : `${Network.DOMAIN}/part/${subCategory.id}`,
//             headers : {
//                 'x-auth-token': token,
//                 category,
//                 subCategory: subCategory.name
//             },
//             data    : {
//                 ...product
//             }
//         })
//             .then(payload => {
//                 dispatch({ type: ActionTypes.UPDATE_PART_SUCCESS , ...payload });
//             })
//             .catch(error => {
//                 throw(error);
//             });
//     }
// }