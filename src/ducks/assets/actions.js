'use strict';

import axios            from 'axios';
import Network          from 'libs/constants/network';

// /////////////////////////////////////
//             ACTION TYPES
// /////////////////////////////////////
export const ActionTypes = {
    GET_PRESIGNED_URLS_SUCCESS: 'sibi_ge_admin/ui/GET_PRESIGNED_URLS_SUCCESS',
    UPLOAD_IMAGES_S3_SUCCESS: 'sibi_ge_admin/ui/UPLOAD_IMAGES_S3_SUCCESS',
    UPLOAD_IMAGES_S3_FAILED: 'sibi_ge_admin/ui/UPLOAD_IMAGES_S3_FAILED'
}

// /////////////////////////////////////
//             LOCAL ACTIONS
// /////////////////////////////////////

// /////////////////////////////////////
//             ASYNC CALLS
// /////////////////////////////////////
export function getPresignedUrls({ token, types }) {
    return (dispatch) => {
        return axios({
            method  : Network.POST,
            url     : `${Network.DOMAIN}/getPresignedUrl`,
            headers : {
                'x-auth-token': token
            },
            data    : {
                urlInfo: types
            }
        })
            .then(payload => {
                dispatch({ type: ActionTypes.GET_PRESIGNED_URLS_SUCCESS , ...payload });
            })
            .catch(error => {
                throw(error);
            });
    }
}

export function uploadImagesS3({ url, type, file }) {
    return (dispatch) => {
        const options = {
            headers : {
                'Content-Type': type
            }
        };

        return axios.put(url, file, options)
            .then(payload => {
                dispatch({ type: ActionTypes.UPLOAD_IMAGES_S3_SUCCESS , ...payload });
            })
            .catch(error => {
                throw(error);
            });
    }
}