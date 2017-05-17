import wrapper  from './wrapper';

const actionTypes = [
    "HOME",
    "LOGIN",
    "PASSWORD_RESET",
    "SIGNUP",
    "SIGN_UP_PAGE",
    "ACTIVATE_TAB",
    "SHOW_OVERLAY",
    "CLOSE_OVERLAY"
];

// These types will receive a _DONE
const asyncActionTypes = [
];

export default wrapper(actionTypes, asyncActionTypes);