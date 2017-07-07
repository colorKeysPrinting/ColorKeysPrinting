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
    "ADD_TO_TRUCK", // needs to be a async call
    "REMOVE_FROM_TRUCK", // needs to be a async call
    "UPDATE_TRUCK", // needs to be a async call

// header bar
    "GO_HOME",
    "SET_ACTIVATE_TAB",

// products
    "SET_ACTIVE_FILTERS",
    "UPDATE_INFO_BAR",
    "CREATE_NEW_LIST", // needs to be a async call
    "ADD_TO_COLLECTION", // needs to be a async call
    "REMOVE_PRODUCT", // needs to be a async call
    "REMOVE_COLLECTION", // needs to be a async call
    "CHECKING_INVENTORY", // needs to be a async call

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
    // "REMOVE_PRODUCT",
];

export default wrapper(actionTypes, asyncActionTypes);