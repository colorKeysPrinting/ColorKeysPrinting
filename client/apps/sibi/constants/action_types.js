import wrapper  from './wrapper';

const actionTypes = [
// application
    "SHOW_OVERLAY",
    "SHOW_RADIO_OVERLAY",
    "CLOSE_OVERLAY",
    "LOGIN",
    "PASSWORD_RESET",
    "CHANGE_LANGUAGE",
    "SIGNUP",

// header bar
    "HOME",
    "ACTIVATE_TAB",
    "SIGNUP_PAGE",

// products
    "ACTIVATE_PAGE",
    "SHOW_RADIO_OVERLAY",
    "UPDATE_INFO_BAR",
];

// These types will receive a _DONE
const asyncActionTypes = [
];

export default wrapper(actionTypes, asyncActionTypes);