import wrapper  from './wrapper';

const actionTypes = [
    "HOME",
    "LOGIN",
    "PASSWORD_RESET",
    "SIGNUP",
    "LOAD_PAGE",
    "SHOW_OVERLAY",
    "CLOSE_OVERLAY"
];

// These types will receive a _DONE
const asyncActionTypes = [
];

export default wrapper(actionTypes, asyncActionTypes);