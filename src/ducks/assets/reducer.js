'use strict';

import _                        from 'lodash';
import Immutable                from 'immutable';
import { Cookies }              from 'react-cookie';
import { ActionTypes }          from './actions';

// /////////////////////////////////////
//             REDUCER
// /////////////////////////////////////
const initialState = Immutable.fromJS({
    imageUploadURL: ''
});

export default (state = initialState, action) => {

    switch (action.type) {
    case ActionTypes.UPLOAD_IMAGES_S3_SUCCESS:
        const re = /<Location>(.*)<\/Location>/
        const imageURL = re.exec(action.data)[1];

        state = state.set('imageUploadURL', Immutable.fromJS({ type: action.key, imageURL }));
        break;

    default:
        return state;
    }
    return state;
};
