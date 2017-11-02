'use strict';

import _                        from 'lodash';
import Immutable                from 'immutable';
import { Cookies }              from 'react-cookie';
import { ActionTypes }          from './actions';

// /////////////////////////////////////
//             REDUCER
// /////////////////////////////////////
const initialState = Immutable.fromJS({
    part: {}
});

export default (state = initialState, action) => {
    let product, part, index;

    switch (action.type) {
    case ActionTypes.CLEAR_PART:
        console.log('clearing part');
        state = state.set('part', {});
        break;

    case ActionTypes.NEW_PART:
        const modelNumber = state.getIn(['part','modelNumber']);
        part = {
            productCategoryId : action.productCategoryId,
            id                : '',
            description       : '',
            code              : '',
            imageUrl          : '',
            modelNumber       : (modelNumber) ? modelNumber : '',
            gePrice           : '',
            sibiPrice         : '',
            includedInManufacturerInstall : false

        }
        state = state.set('part', Immutable.fromJS(part));
        break;

    case ActionTypes.UPDATE:
        state = (action.isPart) ? state.updateIn(['part', action.key], value=>action.value) : state.set(action.key, action.value);
        break;

    case ActionTypes.GET_PART_BY_ID_SUCCESS:
        console.log('part reducer');
        state = state.set('part', Immutable.fromJS(action.data));
        break;

    default:
        return state;
    }
    return state;
};