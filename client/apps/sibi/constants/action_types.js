import wrapper  from './wrapper';

const actionTypes = [
// application
    "LOGIN", // TODO: this needs to go to asyncActionTypes so that we can call the server to login
    "SHOW_OVERLAY",
    "SHOW_RADIO_OVERLAY",
    "CLOSE_OVERLAY",
    "CHANGE_LANGUAGE",
    "SIGNUP",
    "ADD_TO_TRUCK",

// header bar
    "HOME",
    "SET_ACTIVATE_TAB",
    "SIGNUP_PAGE",

// products
    "SET_ACTIVE_PAGE",
    "UPDATE_INFO_BAR",
    "CREATE_NEW_LIST",
    "ADD_TO_LIST",
    "REMOVE_PRODUCT",

// signup
    "UPLOAD_DOCUMENT",
    "ACCEPT_AGREEMENT",
];

// These types will receive a _DONE
const asyncActionTypes = [
// application
    "PASSWORD_RESET",
    "GET_STRIPE_TOKEN"
];

export default wrapper(actionTypes, asyncActionTypes);