'use strict';

import axios            from 'axios';
import Network          from 'libs/constants/network';

// /////////////////////////////////////
//             ACTION TYPES
// /////////////////////////////////////
export const ActionTypes = {
    UPLOAD_IMAGE_SUCCESS: 'sibi_ge_admin/ui/UPLOAD_IMAGE_SUCCESS'
}

// /////////////////////////////////////
//             LOCAL ACTIONS
// /////////////////////////////////////

// /////////////////////////////////////
//             ASYNC CALLS
// /////////////////////////////////////
export function uploadImage({ file }) {
    return (dispatch) => {
        return axios({
            method: Network.POST,
            url: `${Network.DOMAIN}/uploadImage`,
            headers : {
                'x-auth-token': token
            },
            data: {
                file
            }
        })
            .then(payload => {
                dispatch({ type: ActionTypes.UPLOAD_IMAGE_SUCCESS, ...payload });
            })
            .catch(error => {
                throw(error);
            });
    }
}