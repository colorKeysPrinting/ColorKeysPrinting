import { Cookies }                      from 'react-cookie';

const initialState = { isLogout: false };

export default (state = initialState, action) => {
    switch (action.type) {
    case 'REFRESH_JWT':
        const _cookies = new Cookies();
        const jwt = _cookies.get('sibi-admin-jwt');

        if (!jwt) {
            state = { ...state, isLogout: true };
        }
        break;

    default:
        return state;
    }

    return state;
};
