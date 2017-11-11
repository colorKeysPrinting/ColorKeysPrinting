'user strict';

import { combineReducers }  from 'redux';
import { routerReducer }    from 'react-router-redux';
import ui                   from 'ducks/ui/reducer';


const rootReducer = combineReducers({
    router: routerReducer,
    ui
});

export default rootReducer;
