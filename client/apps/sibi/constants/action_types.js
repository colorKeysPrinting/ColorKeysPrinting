import wrapper  from './wrapper';

const actionTypes = [
    // application
    "SHOW_PRODUCT_DETAILS", // TODO: change this to async, keep here during initial dev
    "SHOW_OVERLAY",
    "CLOSE_OVERLAY",
    "CHANGE_LANGUAGE",

    // header bar
    "GO_HOME",
    "SET_ACTIVATE_TAB",

    // products
    "SET_ACTIVE_FILTERS",
    "UPDATE_INFO_BAR",
    "REMOVE_PRODUCT", // needs to be a async call
    "REMOVE_COLLECTION", // needs to be a async call
];

// These types will receive a _DONE
const asyncActionTypes = [
    // application
    "GET_TRADES",
    "GET_FUNDS",
    "GET_COMPANIES",
    "CREATE_COMPANY",
    "GET_ENTITY_TYPES",
    "GET_LOCATIONS",
    "CREATE_LOCATION",
    "LOGIN",
    "LOGOUT",
    "PASSWORD_RESET",

    // products
    "GET_PRODUCTS",
    "GET_USER_MATCHUPS",
    "CREATE_MATCHUP",
    "REMOVE_MATCHUP",
    "UPDATE_MATCHUP",
    "REMOVE_PRODUCT",
];

export default wrapper(actionTypes, asyncActionTypes);