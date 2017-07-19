import wrapper  from './wrapper';

const actionTypes = [
// application
    "SHOW_PRODUCT_DETAILS", // TODO: change this to async, keep here during initial dev
    "SHOW_OVERLAY",
    "SHOW_RADIO_OVERLAY",
    "CLOSE_OVERLAY",
    "CHANGE_LANGUAGE",
    "ADD_TO_TRUCK", // needs to be a async call
    "REMOVE_FROM_TRUCK", // needs to be a async call
    "UPDATE_TRUCK", // needs to be a async call

// header bar
    "GO_HOME",
    "SET_ACTIVATE_TAB",

// products
    "SET_ACTIVE_FILTERS",
    "UPDATE_INFO_BAR",
    "REMOVE_PRODUCT", // needs to be a async call
    "REMOVE_COLLECTION", // needs to be a async call
    "CHECKING_INVENTORY", // needs to be a async call

// signup
    "ADD_DOCUMENT",
    "ACCEPT_AGREEMENT",
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
    "SIGNUP",
    "PASSWORD_RESET",

// products
    "GET_PRODUCTS",
    "GET_USER_MATCHUPS",
    "GET_USER_LISTS",
    "CREATE_MATCHUP",
    "CREATE_LIST",
    "REMOVE_MATCHUP",
    "REMOVE_LIST",
    "UPDATE_MATCHUP",
    "UPDATE_LIST",
    "REMOVE_PRODUCT",
];

export default wrapper(actionTypes, asyncActionTypes);