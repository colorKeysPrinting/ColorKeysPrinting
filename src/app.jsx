import 'babel-polyfill';
import React                            from 'react';
import ReactDOM                         from 'react-dom';
import { Provider }                     from 'react-redux';
import { CookiesProvider, Cookies }     from 'react-cookie';
import injectTapEventPlugin             from 'react-tap-event-plugin';
import es6Promise                       from 'es6-promise';
import { PropTypes }                    from 'prop-types';
import configureStore                   from './configure_store';
import jwt                              from './libs/loaders/jwt';
import routes                           from './routes';

import './styles/styles.scss';

// Polyfill es6 promises for IE
es6Promise.polyfill();

// Needed for onTouchTap
// Can go away when react 1.0 release
// Check this repo:
// https://github.com/zilverline/react-tap-event-plugin
injectTapEventPlugin();

class Root extends React.PureComponent {
    static propTypes = {
        store: PropTypes.object.isRequired
    };

    render() {
        const { store } = this.props;
        return (
            <CookiesProvider>
                <Provider store={store}>
                    { routes }
                </Provider>
            </CookiesProvider>
        );
    }
}

const store = configureStore();

let cookie = new Cookies();
cookie = cookie.get('sibi-ge-admin');

if (cookie) { // Setup JWT refresh
    jwt({ dispatch: store.dispatch, token: cookie.token });
}

ReactDOM.render(
    <Root store={store} />,
    document.getElementById('main-app')
);
