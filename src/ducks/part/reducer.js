'use strict';

import _                        from 'lodash';
import Immutable                from 'immutable';
import { Cookies }              from 'react-cookie';
import { ActionTypes }          from './actions';

// /////////////////////////////////////
//             REDUCER
// /////////////////////////////////////
const initialState = Immutable.fromJS({
    part: {},
});

export default (state = initialState, action) => {
    let product, part, index;

    switch (action.type) {
    case ActionTypes.CLEAR_PRODUCT:
        console.log('clearing product');
        state = state.set('part', {});
        break;

    case ActionTypes.NEW_PART:
        part = {
            productCategoryId : '',
            id                : '',
            description       : '',
            code              : '',
            imageUrl          : '',
            modelNumber       : '',
            gePrice           : '',
            sibiPrice         : ''
        }
        state = state.set('part', Immutable.fromJS(part));
        break;

    case ActionTypes.GET_PART_BY_ID_SUCCESS:
        console.log('part reducer');
        break;

    case ActionTypes.CREATE_PART_SUCCESS:
        console.log('create part success');
        parts = state.get('parts').toJS();
        part = { isNew: true, ...action.data };

        parts.push(part);

        state = state.set('part', Immutable.fromJS(part));
        state = state.set('parts', Immutable.fromJS(parts));
        break;

    // case ActionTypes.UPDATE_PART_SUCCESS:
    //     console.log('update part success');
    //     product = state.get('product').toJS();
    //     index = _.findIndex(product.applianceAssociatedParts, ['id', action.data.id]);
    //     product.applianceAssociatedParts[index] = action.data;
    //     state = state.set('product', Immutable.fromJS(product));
    //     break;

    default:
        return state;
    }
    return state;
};