'use strict';

import _                        from 'lodash';
import Immutable                from 'immutable';
import { Cookies }              from 'react-cookie';
import { ActionTypes }          from './actions';

// /////////////////////////////////////
//             REDUCER
// /////////////////////////////////////
const initialState = Immutable.fromJS({
    imageUploadSuccess: ''
});

export default (state = initialState, action) => {

    switch (action.type) {
    case ActionTypes.UPLOAD_IMAGES_S3_SUCCESS:
        console.log('receiving imageUploadSuccess');
        const re = /<Location>(.*)<\/Location>/
        const match = re.exec(action.data);

        state = state.set('imageUploadSuccess', Immutable.fromJS(match[1]));
        break;

    default:
        return state;
    }
    return state;
};
