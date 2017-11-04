'user strict';

import { combineReducers }  from 'redux';
import header               from 'ducks/header/reducer';
import ui                   from 'ducks/ui/reducer';

const rootReducer = combineReducers({
    header,
    ui,
});

export default rootReducer;
