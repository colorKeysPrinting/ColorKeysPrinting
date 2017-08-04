'use strict';

import { browserHistory }       from 'react-router';
import _                        from 'lodash';
import Immutable                from 'immutable';
import { Cookies }              from 'react-cookie';
import ActionTypes              from '../constants/action_types';

const initialState = Immutable.fromJS({ currLanguage: 'English',
    activeUser: {},
    activeTab: '',
    activeOverlay: '',
    overlayObj: false,
    orders: [],
    users: [],
    products: {},
    fundProperties: [],
    productCategories: [],
    isOrderDeleted: false
});

export default (state = initialState, action) => {
    let products;
    
    switch (action.type) {
    case ActionTypes.GET_CURRENT_USER_DONE:
        const settings = {
            language: 'English'
        };

        state = state.set('activeUser', Immutable.fromJS({ ...action.payload, settings }));
        break;

    case ActionTypes.GO_HOME:
        console.log('going home');
        break;

    case ActionTypes.SET_ACTIVATE_TAB:
        console.log('activeTab', action.key);
        state = state.set('activeTab', action.key);
        break;

    case ActionTypes.CHANGE_LANGUAGE:
        console.log('change language: ', action.language);
        state = state.set('currLanguage', action.language);
        break;

    // ********************** LOGIN/CREATE USER SECTION **********************
    case ActionTypes.LOGIN_DONE:
        console.log('login: ', action.payload);

        state = state.set('activeOverlay', '');

        if (action.payload.id) {
            if (!action.payload.disabled) {
                const settings = {
                    language: 'English'
                };

                state = state.set('activeUser', Immutable.fromJS({ ...action.payload, settings }));
                const maxAge = 24 * 60 * 60; // one day in seconds
                // const maxAge = 60; // one min in seconds

                const _cookies = new Cookies();
                _cookies.set('sibi-admin-jwt', { token: action.payload.token, email: action.payload.email }, { path: '/', maxAge });

            } else {
                alert('Your account has been disabled!\nIf you find this to be an error please contact your fund');
            }
        } else {
            alert('Could not find a Username and Password combination matching the provided');
        }
        break;

    case ActionTypes.LOGOUT:
        console.log('logging out');

        state = state.set('activeUser', Immutable.fromJS({}));
        state = state.set('activeOverlay', '');
        break;

    case ActionTypes.PASSWORD_RESET:
        console.log('password reset', action.email);
        state = state.set('activeOverlay', '');
        // TODO: call API function
        break;

    // ********************** OVERLAY SECTION **********************
    case ActionTypes.SHOW_OVERLAY:
        console.log('show overlay', action.overlay);
        state = state.set('activeOverlay', action.overlay);

        // normal case
        if (action.obj) {
            state = state.set('overlayObj', action.obj);
        }

        break;

    case ActionTypes.CLOSE_OVERLAY:
        console.log('close overlay');
        state = state.set('activeOverlay', '');
        break;

    // ********************** PRODUCT ACTIONS **********************
    case ActionTypes.GET_PRODUCTS_DONE:
        console.log('receiving products', action.payload);
        state = state.set('products', Immutable.fromJS(action.payload));
        break;
    
    case ActionTypes.GET_PRODUCT_CATEGORIES_DONE:
        console.log('receiving product categories', action.payload);
        state = state.set('productCategories', Immutable.fromJS(action.payload[0].subcategories));
        break;

    case ActionTypes.GET_PRODUCTS_FOR_CATEGORY_DONE:
        console.log('receiving products for category', action.payload);
        state = state.setIn(['products', action.original.headers.category], Immutable.fromJS(action.payload));
        break;

    case ActionTypes.GET_PRODUCTS_FOR_SUB_CATEGORY_DONE:
        console.log('receiving products for sub category', action.payload);
        state = state.setIn(['products', action.original.headers.category], Immutable.fromJS(action.payload));
        break;
    
    case ActionTypes.UPDATE_PRODUCTS_DONE: 
        console.log('receiving updated product');
        products = state.getIn(['products', action.original.headers.category]).toJS();
        const index = _.findIndex(products, ['id', action.payload.id]);
        products[index] = action.payload;
        
        state = state.updateIn(['products', action.original.headers.category], value => products);
        break;

    case ActionTypes.CREATE_PRODUCTS_DONE:
        console.log('created product', action.payload);
        state = state.set('products', Immutable.fromJS(action.payload));
        break;

    // case ActionTypes.REMOVE_PRODUCT_DONE:
    //     console.log('removed products', action.payload);
    //     state = state.set('products', Immutable.fromJS(action.payload));
    //     break;

    case ActionTypes.REMOVE_PRODUCT_DONE:
        console.log('delete call back');
        products = state.getIn(['products', action.original.headers.category]).toJS();
        products = _.remove(products, (product) => { return product.id === action.payload.id });
        
        state = state.updateIn(['products', action.original.headers.category], value => products);
        break;

    case ActionTypes.GET_ORDERS_DONE:
        console.log('receiving orders', action.payload);
        // state = state.set('isOrderDeleted', false);
        state = state.set('orders', Immutable.fromJS(action.payload));
        break;

    case ActionTypes.APPROVE_ORDER_DONE:
        console.log('approved order', action.payload);

        break;

    case ActionTypes.UPDATE_ORDER_DONE:
        console.log('update order', action.payload);

        break;

    case ActionTypes.CREATE_ORDER_DONE:
        console.log('create order', action.payload);

        break;

    case ActionTypes.REMOVE_ORDER_DONE:
        console.log('remove order', action.payload);

        break;

    case ActionTypes.GET_USERS_DONE:
        console.log('receiving users');
        state = state.set('users', Immutable.fromJS(action.payload));
        break;

    case ActionTypes.GET_FUND_PROPERTIES_DONE:
        console.log('receiving fund properties');
        state = state.set('fundProperties', Immutable.fromJS(action.payload));
        break;

    default:
        return state;
    }
    return state;
};
