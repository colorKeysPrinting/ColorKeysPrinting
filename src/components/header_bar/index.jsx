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
import { logout }               from 'ducks/active_user/actions';

import Tabs                     from './tabs';
import Overlay                  from 'components/overlay';

class HeaderBar extends React.Component {

    constructor(props) {
        super(props);

        this.state = { isSearch: false, isOpen: false };
        this.search = this.search.bind(this);
        this.showProfile = this.showProfile.bind(this);
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

        if (!_.isEqual(nextProps.isLogout, this.props.isLogout)) {
            this.props.logout();
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

    render() {
        let loginSection, profileOverlay, pendingUsers = 0, pendingOrders = 0;

        const activeUser = this.props.activeUser.toJS();
        const sibiLogo = assets('./images/SIBI_Logo.png');

        if (!activeUser.type || activeUser.type === 'signUp') {
            loginSection = <Link to={`/login`} className="btn submit-btn" >Login</Link>;

        } else {
            const profilePic = (this.props.activeUser.profilePic) ? assets(this.props.activeUser.profilePic) : assets('./images/icons-account.png');

            profileOverlay = (this.state.isOpen) ? <Overlay type="profile" closeOverlay={this.showProfile}>
                <div id="profile-container">
                    <div className="arrow-up"></div>
                    <div className="element" onClick={() => this.props.logout()} >Log out</div>
                </div>
            </Overlay> : null;

            loginSection = <div onClick={this.showProfile}>
                <img className="settings-icon" src={profilePic} alt="settingsButtons" width="40px" height="40px" className="profile-pic" />
            </div>;

            if (this.props.orders.size > 0 &&
                this.props.users.size > 0) {

                _.each(this.props.orders.toJS(), (order) => {
                    pendingOrders += ((order.orderStatus).toLowerCase() === 'pending') ? 1 : 0;
                });

                _.each(this.props.users.toJS(), (user) => {
                    pendingUsers += ((user.type).toLowerCase() === 'pending') ? 1 : 0;
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
                { profileOverlay }
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
