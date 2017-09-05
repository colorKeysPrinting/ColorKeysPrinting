import React                    from 'react';
import _                        from 'lodash';
import { connect }              from 'react-redux';
import { withRouter }           from 'react-router';
import { withCookies }          from 'react-cookie';
import { Link }                 from 'react-router-dom';
import assets                   from 'libs/assets';

import { getCurrentUser }       from 'ducks/active_user/actions';
import { getUsers }             from 'ducks/users/actions';
import { getOrders }            from 'ducks/orders/actions';
import { logout }               from 'ducks/active_user/actions';

import Tabs                     from './tabs';
import Overlay                  from 'components/overlay';

class HeaderBar extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            isSearch: false,
            isOpen: false
        };

        this.search = this.search.bind(this);
        this.showProfile = this.showProfile.bind(this);
        this.logout = this.logout.bind(this);
    }

    componentWillMount() {
        const { cookies } = this.props;

        if (this.props.location.pathname !== '/process_order') {
            const jwt = cookies.get('sibi-admin-jwt');

            if (jwt) {
                this.props.getCurrentUser({ token: jwt.token});
            } else {
                this.props.history.push(`/login`);
            }
        } else {
            cookies.remove('sibi-admin-jwt');
        }
    }

    componentWillUpdate(nextProps) {
        const { cookies, location } = this.props;
        const jwt = cookies.get('sibi-admin-jwt');

        if (!_.isEqual(nextProps.isLogout, this.props.isLogout)) {
            this.props.logout();
        }

        if (location.pathname !== '/process_order') {
            if (jwt) {
                if (!_.isEqual(nextProps.activeUser, this.props.activeUser)) {
                    if (nextProps.activeUser.size > 0) {

                        const pathname = (location.pathname === `/` || location.pathname === `/login`) ? `/orders` : location.pathname;
                        const search = (location.search) ? location.search : null;
                        this.props.history.push({ pathname, search });

                        this.props.getCurrentUser({ token: jwt.token});
                        this.props.getUsers({ token: jwt.token, type: nextProps.activeUser.toJS().type });
                        this.props.getOrders({ token: jwt.token, type: nextProps.activeUser.toJS().type });
                    } else {
                        cookies.remove('sibi-admin-jwt');
                        this.props.history.push(`/login`);
                    }
                }
            } else {
                this.props.history.push(`/login`);
            }
        } else {
            cookies.remove('sibi-admin-jwt');
        }
    }

    search(term) {
        console.log(term);
        this.props.search(term);
    }

    showProfile() {
        this.setState((prevState) => {
            const isOpen = (prevState.isOpen) ? false : true;
            return { isOpen };
        });
    }

    logout() {
        this.props.history.push(`/login`);
        this.props.logout();
    }

    render() {
        let headerContent, loginSection;
        const { cookies, isLogout } = this.props;
        const jwt = cookies.get('sibi-admin-jwt');

        if (jwt) {
            let pendingOrders = 0, pendingUsers = 0;

            const activeUser = this.props.activeUser.toJS();
            const profilePic = (activeUser.profilePic) ? assets(activeUser.profilePic) : assets('./images/icon-settings.svg');

            const profileOverlay = (this.state.isOpen) ? <Overlay type="profile" closeOverlay={this.showProfile}>
                <div id="profile-container">
                    <div className="arrow-up"></div>
                    <div className="element" onClick={this.logout} >Log Out</div>
                </div>
            </Overlay> : null;

            loginSection = <div onClick={this.showProfile}>
                <img className="settings-icon" src={profilePic} alt="settingsButtons" width="40px" height="40px" />
            </div>;

            if (this.props.orders.size > 0 &&
                this.props.users.size > 0) {

                _.each(this.props.orders.toJS(), (order) => {
                    pendingOrders = ((order.orderStatus).toLowerCase() === 'pending') ? pendingOrders + 1 : pendingOrders;
                });

                _.each(this.props.users.toJS(), (user) => {
                    pendingUsers = ((user.type).toLowerCase() === 'pending') ? pendingUsers + 1 : pendingUsers;
                });
            }

            // loginSection = (this.props.location.pathname !== `/login`) ? <Link to={`/login`} className="btn blue" >Login</Link> : null; // TODO when we add a home screen this will need to go back in somewhere

            headerContent = <div>
                <Tabs
                    type={activeUser.type}
                    activeTab={this.props.activeTab}
                    pendingOrders={pendingOrders}
                    pendingUsers={pendingUsers}
                />
                { profileOverlay }
            </div>;
        }

        return (
            <div id="header-bar">
                <img src={assets('./images/SIBI_Logo.png')} id="logo"/>
                <span className="logo-text">GE APP ADMIN</span>
                { headerContent }
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
    logout
}

export default connect(select, actions, null, { withRef: true })(withRouter(withCookies(HeaderBar)));
