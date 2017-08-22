import React                    from 'react';
import { connect }              from 'react-redux';
import { withRouter }           from 'react-router';
import { Link }                 from 'react-router-dom';
import _                        from 'lodash';
import { withCookies }          from 'react-cookie';
import assets                   from 'libs/assets';

import { getCurrentUser }       from 'ducks/active_user/actions';
import { getUsers }             from 'ducks/users/actions';
import { getOrders }            from 'ducks/orders/actions';

import Tabs                     from './tabs';

class HeaderBar extends React.Component {

    constructor(props) {
        super(props);

        this.state = { isSearch: false };
        this.search = this.search.bind(this);
    }

    componentWillMount() {
        const { cookies } = this.props;
        const jwt = cookies.get('sibi-admin-jwt');

        if (jwt) {
            this.props.getCurrentUser(jwt.token);
        } else {
            console.log('TODO: trigger logout function *** no JWT ***');
        }
    }

    componentWillUpdate(nextProps) {
        if (!_.isEqual(nextProps.activeUser, this.props.activeUser)) {
            const path = (nextProps.activeUser.size > 0) ? `/orders` : `/`;
            this.props.history.push(path);

            if (nextProps.activeUser.size > 0) {
                const activeUser = nextProps.activeUser.toJS();
                const { cookies } = this.props;
                const jwt = cookies.get('sibi-admin-jwt');

                if (jwt && jwt.token !== '') {
                    this.props.getCurrentUser(jwt.token);
                    this.props.getUsers({ token: jwt.token });
                    this.props.getOrders({ token: jwt.token, type: activeUser.type });

                } else {
                    console.log('TODO: trigger logout function *** no JWT ***');
                }
            }
        }

        if (nextProps.isLogout) {
            this.props.logout();
        }
    }

    search(term) {
        console.log(term);
        this.props.search(term);
    }

    render() {
        let loginSection, pendingUsers = 0, pendingOrders = 0;

        const activeUser = this.props.activeUser.toJS();
        const sibiLogo = assets('./images/SIBI_Logo.png');

        if (!activeUser.type || activeUser.type === 'signUp') {
            loginSection = <Link to={`/login`} className="btn submit-btn" >Login</Link>;

        } else {
            loginSection = <Link to={{ pathname: `/profile`, state: { prevPath: this.props.location.pathname }}} >
                <img className="settings-icon" src={assets('./images/icon-settings.svg')} alt="settingsButtons" width="40px" height="40px" className="profile-pic" />
            </Link>;

            if (this.props.orders.size > 0 &&
                this.props.users.size > 0) {

                _.each(this.props.orders.toJS(), (order) => {
                    pendingOrders += 1;
                });

                _.each(this.props.users.toJS(), (users) => {
                    pendingUsers += 1;
                });
            }
        }

        return (
            <div id="header-bar">
                <img src={sibiLogo} id="logo"/>
                <Tabs
                    type={activeUser.type}
                    activeTab={this.props.activeTab}
                    pendingOrders={pendingOrders}
                    pendingUsers={pendingUsers}
                />
                <div className="login-section">
                    { loginSection }
                </div>
            </div>
        );
    }
}

const select = (state) => ({
    isLogout        : state.jwt.get('isLogout'),
    activeUser      : state.activeUser.get('activeUser'),
    activeTab       : state.header.get('activeTab'),
    orders          : state.orders.get('orders'),
    users           : state.users.get('users')
});

const actions = {
    getCurrentUser,
    getUsers,
    getOrders,
}

export default connect(select, actions, null, { withRef: true })(withRouter(withCookies(HeaderBar)));
