'use strict';

import _                        from 'lodash';
import Immutable                from 'immutable';
import { Cookies }              from 'react-cookie';
import { ActionTypes }          from './actions';

// /////////////////////////////////////
//             REDUCER
// /////////////////////////////////////
const initialState = Immutable.fromJS({
    product: {},
    products: {},
    parts: {},
    productsInCategory: {},
    productCategories: [],
    productSubCategories: [],
    productCategoryId: ''
});

export default (state = initialState, action) => {
    let products, index, category;

    switch (action.type) {
    case ActionTypes.CLEAR_PRODUCT:
        console.log('clearing product');
        state = state.set('product', {});
        break;

    case ActionTypes.GET_PRODUCT_BY_ID_SUCCESS:
        console.log('receiving product');
        state = state.set('product', Immutable.fromJS(action.data));
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
        state = state.setIn(['productsInCategory', action.config.headers.category, action.config.headers.subCategory], Immutable.fromJS(action.data));
        break;

    case ActionTypes.UPDATE_PRODUCT_SUCCESS:
        console.log('receiving updated product');
        products = state.getIn(['productsInCategory', action.config.headers.category, action.config.headers.subCategory]).toJS();
        index = _.findIndex(products, ['id', action.data.id]);
        products[index] = action.data;

        state = state.updateIn(['productsInCategory', action.config.headers.category, action.config.headers.subCategory], value => Immutable.fromJS(products));
        break;

    case ActionTypes.CREATE_PRODUCT_SUCCESS:
        console.log('created product', action.data);
        products = state.getIn(['productsInCategory', action.config.headers.category, action.config.headers.subCategory]).toJS();
        products.push(action.data);

        state = state.updateIn(['productsInCategory', action.config.headers.category, action.config.headers.subCategory], value => Immutable.fromJS(products));
        break;

    case ActionTypes.ARCHIVE_PRODUCT_SUCCESS:
        console.log('archive call back');
        products = state.getIn(['productsInCategory', action.config.headers.category, action.config.headers.subCategory]).toJS();
        index = _.findIndex(products, ['id', action.config.headers.id]);
        products[index].archived = action.data.archived;

        state = state.updateIn(['productsInCategory', action.config.headers.category, action.config.headers.subCategory], value => Immutable.fromJS(products));
        break;

    case ActionTypes.UNARCHIVE_PRODUCT_SUCCESS:
        console.log('unarchive call back');
        products = state.getIn(['productsInCategory', action.config.headers.category, action.config.headers.subCategory]).toJS();
        index = _.findIndex(products, ['id', action.config.headers.id]);
        products[index].archived = action.data.archived;

        state = state.updateIn(['productsInCategory', action.config.headers.category, action.config.headers.subCategory], value => Immutable.fromJS(products));
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