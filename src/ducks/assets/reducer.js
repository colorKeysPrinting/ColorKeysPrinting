'use strict';

import _                        from 'lodash';
import Immutable                from 'immutable';
import { Cookies }              from 'react-cookie';
import { ActionTypes }          from './actions';

// /////////////////////////////////////
//             REDUCER
// /////////////////////////////////////
const initialState = Immutable.fromJS({
    preSignedURLs: '',
    imageUploadSuccess: [],
    imageUploadFailed: []
});

export default (state = initialState, action) => {

    switch (action.type) {
    case ActionTypes.GET_PRESIGNED_URLS_SUCCESS:
        console.log('receiving preSignedURLs');
        state = state.set('preSignedURLs', Immutable.fromJS(action.data.presignedUrlInfo));
        break;

    case ActionTypes.UPLOAD_IMAGES_S3_SUCCESS:
        console.log('receiving imageUploadSuccess');
        const imageUploadSuccess = state.get('imageUploadSuccess');
        imageUploadSuccess.push(action.data);
        state = state.set('imageUploadSuccess', Immutable.fromJS(imageUploadSuccess));
        break;

    case ActionTypes.UPLOAD_IMAGES_S3_FAILED:
        console.log('receiving imageUploadFailed');
        const imageUploadFailed = state.get('imageUploadFailed');
        imageUploadFailed.push(action.data);
        state = state.set('imageUploadFailed', Immutable.fromJS(imageUploadFailed));
        break;

    default:
        return state;
    }
    return state;
};
