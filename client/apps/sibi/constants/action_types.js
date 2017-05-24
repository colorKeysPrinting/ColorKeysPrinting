import wrapper  from './wrapper';

const actionTypes = [
    "HOME",
    "LOGIN",
    "PASSWORD_RESET",
    "SIGNUP",
    "SIGNUP_PAGE",
    "ACTIVATE_TAB",
    "SHOW_OVERLAY",
    "CLOSE_OVERLAY",
    "CHANGE_LANGUAGE",
    "UPDATE_INFO_BAR",
    "ACTIVATE_PAGE",
];

// These types will receive a _DONE
const asyncActionTypes = [
];

export default wrapper(actionTypes, asyncActionTypes);