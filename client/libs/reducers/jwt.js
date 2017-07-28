import { Cookies }                      from 'react-cookie';
import { Constants as JwtConstants }    from '../actions/jwt';

const initialState = { isLogout: false };

export default (state = initialState, action) => {
    switch (action.type) {

    case JwtConstants.REFRESH_JWT:
        // return action.payload.jwt;
        const _cookies = new Cookies();
        const jwt = _cookies.get('sibi-jwt');

        if (!jwt) {
            state = { ...state, isLogout: true };
        }
        break;

    default:
        return state;
    }

    return state;
};
