import wrapper  from './wrapper';

const actionTypes = [
    "HOME",
    "LOGIN",
    "SIGNUP",
    "LOAD_PAGE"

];

// These types will receive a _DONE
const asyncActionTypes = [
];

export default wrapper(actionTypes, asyncActionTypes);