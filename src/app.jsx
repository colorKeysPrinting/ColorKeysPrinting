import 'babel-polyfill';
import React                            from 'react';
import { render }                       from 'react-dom';
import { Provider }                     from 'react-redux';
import { ConnectedRouter }              from 'react-router-redux';
import createHistory                    from 'history/createBrowserHistory';
import { polyfill }                     from 'es6-promise';
import { PropTypes }                    from 'prop-types';
import configureStore                   from './configure_store';
import Routes                           from './routes';

import './styles/styles.scss';

// Polyfill es6 promises for IE
polyfill();

const history = createHistory();
const store = configureStore(history);

render(
    <Provider store={store}>
        <ConnectedRouter history={history}>
            <Routes />
        </ConnectedRouter>
    </Provider>,
    document.getElementById('main-app')
);
