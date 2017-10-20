'user strict';

import { combineReducers }  from 'redux';
import activeUser           from 'ducks/active_user/reducer';
import header               from 'ducks/header/reducer';
import jwt                  from 'ducks/jwt/reducer';
import orders               from 'ducks/orders/reducer';
import products             from 'ducks/products/reducer';
import product              from 'ducks/product/reducer';
import properties           from 'ducks/properties/reducer';
import property             from 'ducks/property/reducer';
import part                 from 'ducks/part/reducer';
import ui                   from 'ducks/ui/reducer';
import users                from 'ducks/users/reducer';
import assets               from 'ducks/assets/reducer';
import calculations         from 'ducks/calculations/reducer';

const rootReducer = combineReducers({
    activeUser,
    header,
    jwt,
    orders,
    products,
    product,
    properties,
    property,
    part,
    ui,
    users,
    assets,
    calculations
});

export default rootReducer;
