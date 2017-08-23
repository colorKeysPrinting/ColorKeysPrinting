
import { createStore, applyMiddleware, compose }    from 'redux';
import thunk                                        from 'redux-thunk';
import { createLogger }                             from 'redux-logger';
import rootReducer                                  from './root_reducer';

const middleware = [ thunk ];
if (process.env.NODE_ENV !== 'production') {
    middleware.push(createLogger());
}

export default function configureStore(initialState) {
    return createStore(
        rootReducer,
        initialState,
        compose (
            applyMiddleware(...middleware)
        )
    );
}