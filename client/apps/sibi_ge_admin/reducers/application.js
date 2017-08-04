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
    products: [],
    funds: [],
    fundProperties: [],
    isOrderDeleted: false
});

export default (state = initialState, action) => {

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

    case ActionTypes.CREATE_PRODUCTS_DONE:
        console.log('receiving products', action.payload);
        state = state.set('products', Immutable.fromJS(action.payload));
        break;

    case ActionTypes.REMOVE_PRODUCT_DONE:
        console.log('receiving products', action.payload);
        state = state.set('products', Immutable.fromJS(action.payload));
        break;

    case ActionTypes.REMOVE_PRODUCT_DONE:
        console.log('delete call back');

        const collectionType = action.obj.collectionType;
        const productId = (action.obj.productId) ? action.obj.productId : '';

        let myList = state.getIn(['activeUser', collectionType]).toJS();

        if (productId.toString()) {
            const collection = _.find(myList, ['id', action.obj.collectionId]);
            myList = _.remove(myList, (collection) => collection.id !== action.obj.collectionId);

            collection.products = _.remove(collection.products, (thisProductID) => parseInt(thisProductID) !== productId);

            myList.push(collection);

        } else {
            myList = _.remove(myList, (collection) => collection.id !== parseInt(action.obj.collectionId));
        }

        state = state.updateIn(['activeUser', collectionType], value => Immutable.fromJS(myList));
        state = state.set('activeOverlay', '');
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

    case ActionTypes.APPROVE_USER_DONE:
        console.log('receiving approved user');
        const users = state.get('users').toJS();
        const index = _.findIndex(users, ['id', action.original.headers.userId]);
        users[index].type = 'approved';

        state = state.set('users', Immutable.fromJS(users));
        break;
    
    case ActionTypes.GET_FUNDS_DONE:
        console.log('receiving funds');
        state = state.set('funds', Immutable.fromJS(action.payload));
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
