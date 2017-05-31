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
    "ACTIVATE_TAB",
    "SIGNUP_PAGE",

// products
    "ACTIVATE_PAGE",
    "SHOW_RADIO_OVERLAY",
    "UPDATE_INFO_BAR",
    "UPLOAD_DOCUMENT",
    "ACCEPT_AGREEMENT",
];

// These types will receive a _DONE
const asyncActionTypes = [
// application
    "PASSWORD_RESET",
// products
    "GET_STRIPE_TOKEN"
];

export default wrapper(actionTypes, asyncActionTypes);