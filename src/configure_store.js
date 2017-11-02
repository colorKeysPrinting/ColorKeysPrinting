
import { createStore, applyMiddleware, compose }    from 'redux';
import thunk                                        from 'redux-thunk';
import rootReducer                                  from './root_reducer';

export default function configureStore(initialState) {
    return createStore(
        rootReducer,
        initialState,
        compose (
            applyMiddleware(thunk)
        )
    );
}