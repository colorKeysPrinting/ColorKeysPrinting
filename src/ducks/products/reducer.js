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
    productCategories: []
});

export default (state = initialState, action) => {
    let products, index, category;
    
    switch (action.type) {
    case ActionTypes.GET_PRODUCTS_SUCCESS:
        console.log('receiving products', action.data);
        state = state.set('products', Immutable.fromJS(action.data));
        break;
        
    case ActionTypes.GET_PRODUCT_CATEGORIES_SUCCESS:
        console.log('receiving product categories', action.data);
        state = state.set('productCategories', Immutable.fromJS(action.data[0].subcategories));
        break;
        
    case ActionTypes.GET_PRODUCTS_FOR_CATEGORY_SUCCESS:
        console.log('receiving products for category', action.data);
        state = state.setIn(['products', action.config.headers.category], Immutable.fromJS(action.data));
        break;
        
    case ActionTypes.GET_PRODUCTS_FOR_SUB_CATEGORY_SUCCESS:
        console.log('receiving products for sub category', action.data);
        state = state.setIn(['products', action.config.headers.category], Immutable.fromJS(action.data));
        break;
        
    case ActionTypes.UPDATE_PRODUCT_SUCCESS:
        console.log('receiving updated product');
        products = state.getIn(['products', action.config.headers.category]).toJS();
        index = _.findIndex(products, ['id', action.data.id]);
        products[index] = action.data;
        
        state = state.updateIn(['products', action.config.headers.category], value => Immutable.fromJS(products));
        break;
        
    case ActionTypes.CREATE_PRODUCT_SUCCESS:
        console.log('created product', action.data);
        state = state.set('products', Immutable.fromJS(action.data));
        break;
        
    case ActionTypes.ARCHIVE_PRODUCT_SUCCESS:
        console.log('delete call back');
        products = state.getIn(['products', action.config.headers.category]).toJS();
        products = _.remove(products, (product) => { return product.id === action.data.id });
        
        state = state.updateIn(['products', action.config.headers.category], value => Immutable.fromJS(products));
        break;

    default:
        return state;
    }
    return state;
};