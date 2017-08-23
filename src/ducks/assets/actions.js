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
export function getPresignedUrls({ types }) {
    return (dispatch) => {
        return axios({
            method  : Network.POST,
            url     : `${Network.DOMAIN}/imageUploadUrl`,
            body    : {
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

export function uploadImagesS3({ url, image }) {
    return (dispatch) => {
        return axios({
            method  : Network.PUT,
            url,
            data    : {
                image
            }
        })
            .then(payload => {
                dispatch({ type: ActionTypes.UPLOAD_IMAGES_S3_SUCCESS , ...payload });
            })
            .catch(error => {
                dispatch({ type: ActionTypes.UPLOAD_IMAGES_S3_FAILED , ...payload });
                throw(error);
            });
    }
}