'use strict';

import axios            from 'axios';
import Network          from 'libs/constants/network';

// /////////////////////////////////////
//             ACTION TYPES
// /////////////////////////////////////
export const ActionTypes = {
    UPLOAD_IMAGES_S3_SUCCESS: 'sibi_ge_admin/ui/UPLOAD_IMAGES_S3_SUCCESS',
    UPLOAD_IMAGES_S3_FAILED: 'sibi_ge_admin/ui/UPLOAD_IMAGES_S3_FAILED'
}

// /////////////////////////////////////
//             LOCAL ACTIONS
// /////////////////////////////////////

// /////////////////////////////////////
//             ASYNC CALLS
// /////////////////////////////////////
const uploadImageS3 = ({ url, type, formData }) => {
    return (dispatch) => {
        const options = {
            headers: {
                'Content-Type': type
            }
        };

        return axios.post(url, formData, options)
            .then(payload => {
                dispatch({ type: ActionTypes.UPLOAD_IMAGES_S3_SUCCESS, ...payload });
            })
            .catch(error => {
                alert('Image Failed to upload please click "Add" to try again\nor please try again later');
                throw(error);
            });
    }
}

export function uploadImage({ token, type, imageFile }) {
    return (dispatch) => {
        const imageType = type.split('/');
        const urlInfo = [{ type: imageType[0], fileType: imageType[1] }];
        return axios({
            method: Network.POST,
            url: `${Network.DOMAIN}/getPresignedUrl`,
            headers : {
                'x-auth-token': token
            },
            data: {
                urlInfo
            }
        })
            .then(payload => {
                const data = payload.data.presignedUrlInfo[0];

                let formData = new FormData();
                _.each(data.params, (value, key) => {
                    formData.append(key, value);
                });
                formData.append('file', imageFile);

                const url = data.upload_url.replace(/https/, 'http');

                dispatch(uploadImageS3({ url, type, formData }));
            })
            .catch(error => {
                throw(error);
            });
    }
}

