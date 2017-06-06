import wrapper  from './wrapper';

const actionTypes = [
// application
    "LOGIN", // TODO: change this to async, keep here during initial dev
    "LOGOUT", // TODO: change this to async, keep here during initial dev
    "SHOW_PRODUCT_DETAILS", // TODO: change this to async, keep here during initial dev
    "SHOW_OVERLAY",
    "SHOW_RADIO_OVERLAY",
    "CLOSE_OVERLAY",
    "CHANGE_LANGUAGE",
    "ADD_TO_TRUCK",

// header bar
    "GO_HOME",
    "SET_ACTIVATE_TAB",

// products
    "SET_ACTIVE_PAGE",
    "UPDATE_INFO_BAR",
    "CREATE_NEW_LIST", // needs to be a async call
    "ADD_TO_LIST", // needs to be a async call

// signup
    "UPLOAD_DOCUMENT",
    "ACCEPT_AGREEMENT",
];

// These types will receive a _DONE
const asyncActionTypes = [
// application
    "PASSWORD_RESET",
    "GET_STRIPE_TOKEN",
    "SUBMIT_SIGNUP",

// products
    "REMOVE_PRODUCT",
];

export default wrapper(actionTypes, asyncActionTypes);