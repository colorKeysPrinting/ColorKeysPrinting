'user strict';

import { combineReducers }  from 'redux';
import activeUser           from 'ducks/active_user/reducer';
import header               from 'ducks/header/reducer';
import jwt                  from 'ducks/jwt/reducer';
import orders               from 'ducks/orders/reducer';
import products             from 'ducks/products/reducer';
import ui                   from 'ducks/ui/reducer';
import users                from 'ducks/users/reducer';

const rootReducer = combineReducers({
    activeUser,
    header,
    jwt,
    orders,
    products,
    ui,
    users,
});

export default rootReducer;