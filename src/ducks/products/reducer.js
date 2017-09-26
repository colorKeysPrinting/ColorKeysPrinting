'use strict';

import _                        from 'lodash';
import Immutable                from 'immutable';
import { Cookies }              from 'react-cookie';
import { ActionTypes }          from './actions';

// /////////////////////////////////////
//             REDUCER
// /////////////////////////////////////
const initialState = Immutable.fromJS({
    products: {},
    parts: {},
    productsInCategory: {},
    productCategories: [],
    productSubCategories: [],
    productCategoryId: '',
    isProductVerified: false,
    isProductFound: false,
    isPartVerified: false,
    isPartFound: false
});

export default (state = initialState, action) => {
    let products, product, parts, part, index, category;

    switch (action.type) {
    case ActionTypes.CHECK_MODEL_NUM:
        if (action.key === 'product') {
            product = _.find(state.get('products').toJS(), ['sibiModelNumber', action.modelNumber]);
            const isFound = (product) ? true : false;
            state = state.set('isProductFound', isFound );
            state = state.set('isProductVerified', true );

        } else if (action.key === 'part') {
            part = _.find(state.get('parts').toJS(), ['modelNumber', action.modelNumber]);
            const isFound = (part) ? true : false;
            state = state.set('isPartFound', isFound);
            state = state.set('isPartVerified', true );
        }
        break;

    case ActionTypes.VERIFY_PRODUCT:
        state = state.set('isProductVerified', action.verified );
        break;

    case ActionTypes.VERIFY_PART:
        state = state.set('isPartVerified', action.verified );
        break;

    case ActionTypes.RESET_FOUND:
        state = state.set('isProductFound', false );
        state = state.set('isPartFound', false );
        break;

    case ActionTypes.GET_PRODUCTS_SUCCESS:
        console.log('receiving products', action.data);
        state = state.set('products', Immutable.fromJS(action.data));
        break;

    case ActionTypes.GET_PRODUCT_CATEGORIES_SUCCESS:
        console.log('receiving product categories', action.data);
        state = state.set('productCategories', Immutable.fromJS(action.data));
        break;

    case ActionTypes.GET_USER_PRODUCT_CATEGORIES_SUCCESS:
        console.log('receiving product categories for user', action.data);

        const subCategory = _.find(action.data, ['name', action.config.headers.category]).subcategories;
        state = state.set('productCategories', Immutable.fromJS(action.data));
        state = state.set('productSubCategories', Immutable.fromJS(subCategory));
        break;

    case ActionTypes.GET_PRODUCTS_FOR_CATEGORY_SUCCESS:
        console.log('receiving products for category', action.data);
        state = state.setIn(['productsInCategory', action.config.headers.category], Immutable.fromJS(action.data));
        break;

    case ActionTypes.GET_PRODUCTS_FOR_SUB_CATEGORY_SUCCESS:
        console.log('receiving products for sub category', action.data);
        if (action.config.headers.subSubCategory) {
            state = state.setIn(['productsInCategory', action.config.headers.category, action.config.headers.subCategory, action.config.headers.subSubCategory], Immutable.fromJS(action.data));
        } else {
            state = state.setIn(['productsInCategory', action.config.headers.category, action.config.headers.subCategory], Immutable.fromJS(action.data));
        }
        break;

    case ActionTypes.GET_PARTS_SUCCESS:
        console.log('receiving parts)');
        state = state.set('parts', Immutable.fromJS(action.data));
        break;

    default:
        return state;
    }
    return state;
};