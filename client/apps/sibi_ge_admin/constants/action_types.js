import wrapper  from './wrapper';

const actionTypes = [
    // application
    'SHOW_OVERLAY',
    'CLOSE_OVERLAY',
    'CHANGE_LANGUAGE',

    // header bar
    'LOGOUT',
    'GO_HOME',
    'SET_ACTIVATE_TAB'
];

// These types will receive a _DONE
const asyncActionTypes = [
    // application
    'LOGIN',
    'PASSWORD_RESET',

    // header
    'GET_CURRENT_USER',

    // signup
    'GET_COMPANIES',
    'CREATE_COMPANY',
    'GET_LOCATIONS',
    'CREATE_LOCATION',
    'GET_TRADES',
    'GET_ENTITY_TYPES',
    'GET_FUNDS',
    'SIGNUP',

    // products
    'GET_PRODUCTS',
    'GET_PRODUCT_CATEGORIES',
    'GET_PRODUCTS_FOR_CATEGORY',
    'GET_PRODUCTS_FOR_SUB_CATEGORY',
    'CREATE_PRODUCTS',
    'REMOVE_PRODUCT',
    'GET_ORDERS',
    'APPROVE_ORDER',
    'UPDATE_ORDER',
    'CREATE_ORDER',,
    'REMOVE_ORDER',
    'GET_USERS',
    'GET_FUND_PROPERTIES',
    'SET_ACTIVE_FILTERS', // currently not hooked up
];

export default wrapper(actionTypes, asyncActionTypes);