import _            from 'lodash';

const actions = [
    // application
    'PASSWORD_RESET',

    // header
    'LOGOUT',
    'GO_HOME',
    'SET_ACTIVATE_TAB',

    // jwt
    'REFRESH_JWT',

    // products
    'SET_ACTIVE_FILTERS',
];

// these actions will be appended with a _SUCCESS to be used on return calls 
const asycActions = [
    // application
    'LOGIN',
    
    // header
    'GET_CURRENT_USER',

    // products
    'GET_PRODUCTS',
    'GET_PRODUCT_CATEGORIES',
    'GET_PRODUCTS_FOR_CATEGORY',
    'GET_PRODUCTS_FOR_SUB_CATEGORY',
    'UPDATE_PRODUCTS',
    'CREATE_PRODUCTS',
    'ARCHIVE_PRODUCT',
    'REMOVE_PRODUCT',
    'GET_ORDERS',
    'APPROVE_ORDER',
    'UPDATE_ORDER',
    'CREATE_ORDER',
    'REMOVE_ORDER',

    // users
    'GET_USERS',
    'APPROVE_USER',
    'DISABLE_USER',
    'GET_FUNDS',
    'GET_FUND_PROPERTIES',
]

// //////////////////////////////////////////////
// 
//  action types creator
// 
// //////////////////////////////////////////////

let types = _.reduce(actions, (result, key) => {
    result[key] = key;
    return result;
}, {});

const SUCCESS = '_SUCCESS';

types = _.reduce(asycActions, (result, key) => {
    result[`${key}${SUCCESS}`] = `${key}${SUCCESS}`;
    return result;
}, types);

export default { ...types };