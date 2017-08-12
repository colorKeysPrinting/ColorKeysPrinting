'use strict';

import _                        from 'lodash';
import Immutable                from 'immutable';
import { Cookies }              from 'react-cookie';
import ActionTypes              from 'actions/action_types';

const initialState = Immutable.fromJS({ currLanguage: 'English',
    activeUser: {},
    activeTab: '',
    orders: [],
    users: [],
    products: {},
    funds: [],
    fundProperties: [],
    productCategories: [],
    isOrderDeleted: false
});

export default (state = initialState, action) => {
    let products, index;
    
    switch (action.type) {
    case ActionTypes.GET_CURRENT_USER_SUCCESS:
        const settings = {
            language: 'English'
        };

        state = state.set('activeUser', Immutable.fromJS({ ...action.data, settings }));
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
    case ActionTypes.LOGIN_SUCCESS:
        console.log('login: ', action.data);

        // state = state.set('activeOverlay', '');

        if (action.data.id) {
            if (!action.data.disabled) {
                const settings = {
                    language: 'English'
                };

                state = state.set('activeUser', Immutable.fromJS({ ...action.data, settings }));
                const maxAge = 24 * 60 * 60; // one day in seconds
                // const maxAge = 60; // one min in seconds

                const cookies = new Cookies();
                cookies.set('sibi-admin-jwt', { token: action.data.token, email: action.data.email }, { path: '/', maxAge });

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

        const cookies = new Cookies();
        cookies.set('sibi-admin-jwt', { token: '', email: '' }, { path: '/' });
        break;

    case ActionTypes.PASSWORD_RESET:
        console.log('password reset', action.email);
        state = state.set('activeOverlay', '');
        // TODO: call API function
        break;

    // ********************** PRODUCT ACTIONS **********************
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
        state = state.setIn(['products', action.original.headers.category], Immutable.fromJS(action.data));
        break;

    case ActionTypes.GET_PRODUCTS_FOR_SUB_CATEGORY_SUCCESS:
        console.log('receiving products for sub category', action.data);
        state = state.setIn(['products', action.original.headers.category], Immutable.fromJS(action.data));
        break;
    
    case ActionTypes.UPDATE_PRODUCTS_SUCCESS:
        console.log('receiving updated product');
        products = state.getIn(['products', action.original.headers.category]).toJS();
        index = _.findIndex(products, ['id', action.data.id]);
        products[index] = action.data;
        
        state = state.updateIn(['products', action.original.headers.category], value => Immutable.fromJS(products));
        break;

    case ActionTypes.CREATE_PRODUCTS_SUCCESS:
        console.log('created product', action.data);
        state = state.set('products', Immutable.fromJS(action.data));
        break;

    //  case'REMOVE_PRODUCT_SUCCESS':
    //     console.log('removed products', action.data);
    //     state = state.set('products', Immutable.fromJS(action.data));
    //     break;

    case ActionTypes.REMOVE_PRODUCT_SUCCESS:
        console.log('delete call back');
        products = state.getIn(['products', action.original.headers.category]).toJS();
        products = _.remove(products, (product) => { return product.id === action.data.id });
        
        state = state.updateIn(['products', action.original.headers.category], value => Immutable.fromJS(products));
        break;

    case ActionTypes.GET_ORDERS_SUCCESS:
        console.log('receiving orders', action.data);
        state = state.set('orders', Immutable.fromJS(action.data));
        break;

    case ActionTypes.APPROVE_ORDER_SUCCESS:
        console.log('approved order', action.data);
        const orders = state.get('orders').toJS();
        index = _.findIndex(orders, ['id', action.original.headers.orderId]);
        orders[index] = action.data;

        state = state.set('orders', Immutable.fromJS(orders));
        break;

    case ActionTypes.UPDATE_ORDER_SUCCESS:
        console.log('update order', action.data);

        break;

    case ActionTypes.CREATE_ORDER_SUCCESS:
        console.log('create order', action.data);

        break;

    case ActionTypes.REMOVE_ORDER_SUCCESS:
        console.log('remove order', action.data);

        break;

    case ActionTypes.GET_USERS_SUCCESS:
        console.log('receiving users');
        state = state.set('users', Immutable.fromJS(action.data));
        break;

    case ActionTypes.APPROVE_USER_SUCCESS:
        console.log('receiving approved user');
        const users = state.get('users').toJS();
        index = _.findIndex(users, ['id', action.data.id]);
        users[index] = action.data;

        state = state.set('users', Immutable.fromJS(users));
        break;
    
    case ActionTypes.GET_FUNDS_SUCCESS:
        console.log('receiving funds');
        state = state.set('funds', Immutable.fromJS(action.data));
        break;

    case ActionTypes.GET_FUND_PROPERTIES_SUCCESS:
        console.log('receiving fund properties');
        state = state.set('fundProperties', Immutable.fromJS(action.data));
        break;

    default:
        return state;
    }
    return state;
};
