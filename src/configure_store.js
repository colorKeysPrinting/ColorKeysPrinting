
import { createStore, applyMiddleware }     from 'redux';
import thunk                                from 'redux-thunk';
import rootReducer                          from './root_reducer';
import { routerMiddleware }                 from 'react-router-redux';

export default (history) => {
  return createStore(
    rootReducer,
    applyMiddleware(
      thunk,
      routerMiddleware(history)
    )
  );
};