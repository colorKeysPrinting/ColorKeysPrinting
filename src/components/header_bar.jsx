import React                    from 'react';
import _                        from 'lodash';
import { connect }              from 'react-redux';
import { withRouter }           from 'react-router';
import { withCookies }          from 'react-cookie';
import { Link }                 from 'react-router-dom';
import Tabs, { TabPane }        from 'rc-tabs';
import TabContent               from 'rc-tabs/lib/TabContent';
import ScrollableInkTabBar      from 'rc-tabs/lib/ScrollableInkTabBar';
import assets                   from 'libs/assets';

import { setActiveTab }         from 'ducks/header/actions';
import { logout, getCurrentUser }               from 'ducks/active_user/actions';
import { getUsers }             from 'ducks/users/actions';
import { getOrders }            from 'ducks/orders/actions';

import Overlay                  from 'components/overlay';

class HeaderBar extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            isSearch: false,
            isOpen: false
        };
        this.showProfile = this.showProfile.bind(this);
        this.logout = this.logout.bind(this);
        this.tabActions = this.tabActions.bind(this);
    }

    componentWillMount() {
        const { cookies, history, location } = this.props;
        const jwt = cookies.get('sibi-ge-admin');

        if (jwt) {
            this.props.getCurrentUser({ token: jwt.token});
        } else {
            history.push({ pathname: `/login`, prevPath: location.pathname, prevSearch: location.search });
        }
    }

    componentWillUpdate(nextProps) {
        const { cookies, history, location, activeUser, isLogout } = this.props;
        const jwt = cookies.get('sibi-ge-admin');

        if (!_.isEqual(nextProps.isLogout, isLogout)) {
            this.props.logout();
        }

        if (jwt) {
            if (!_.isEqual(nextProps.activeUser, activeUser)) {
                if (nextProps.activeUser.size > 0) {
                    this.props.getUsers({ token: jwt.token, type: nextProps.activeUser.get('type') });
                    this.props.getOrders({ token: jwt.token, type: nextProps.activeUser.get('type') });

                    if (location.prevPath && location.prevPath !== '/login') {
                        history.push({ pathname: location.prevPath, search: (location.prevSearch) ? location.prevSearch : null})
                    } else if (location.pathname === '/login' || location.pathname === '/') {
                        history.push(`/orders`);
                    }
                } else {
                    cookies.remove('sibi-ge-admin');
                    history.push({ pathname: `/login`});
                }
            }
        } else {
            history.push({ pathname: `/login`, prevPath: location.pathname, prevSearch: location.search });
        }
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

    tabActions({ activeTab }) {
        const { history } = this.props;

        history.push(`/${activeTab}`);
        this.props.setActiveTab(activeTab);
    }

    render() {
        const { cookies, activeUser, location, isLogout, activeTab, orders, users } = this.props;
        const jwt = cookies.get('sibi-ge-admin');
        let pendingOrders = 0, pendingUsers = 0, activeTabs = { dashboard: '', orders: '', users: '', products: '', new_order: '' };

        const isProcessOrder = (location.pathname !== '/process_order') ? false : true;

        if (jwt && activeUser.size > 0) {
            _.each(activeUser.get('permissions').toJS(), (value, key) => {
                if (key === '') {
                    activeTabs['dashboard'] = 'Dashboard';
                }

                if (key === 'viewAllOrders' || key === 'viewAllApprovedAndProcessedOrders' || key === 'viewFundOrders') {
                    activeTabs['orders'] = 'Orders';
                }

                if (key === 'manageAllUsers' || key === 'manageAllFundUsers' || key === 'manageAllManufacturerUsers' || key === 'manageSubordinateUsers') {
                    activeTabs['users'] = 'Users';
                }

                if (key === 'viewAllProducts' || key === 'manageAllProducts' || key === 'manageFundPreferredProducts' || key === 'manageFundProducts') {
                    // activeTabs['products'] = 'Products';
                }

                if (key === 'createOrder') {
                    activeTabs['new_order'] =  'New Order';
                }
            });

            if (orders.size > 0 &&
                users.size > 0) {

                _.each(orders.toJS(), (order) => {
                    pendingOrders = ((order.orderStatus).toLowerCase() === 'pending') ? pendingOrders + 1 : pendingOrders;
                });

                _.each(users.toJS(), (user) => {
                    pendingUsers = ((user.type).toLowerCase() === 'pending') ? pendingUsers + 1 : pendingUsers;
                });
            }
        }


        return (
            <div id="header-bar">
                <img src={assets('./images/sibi-logo.png')} id="logo"/>
                <span className="logo-text">GE APP ADMIN</span>
                { (jwt) ? <div>
                    <div id="header-tabs">
                        <Tabs
                            tabBarPosition="top"
                            activeKey={activeTab}
                            onChange={(activeTab) => this.tabActions({ activeTab })}
                            renderTabBar={()=><ScrollableInkTabBar onTabClick={(activeTab) => this.tabActions({ activeTab }) } />}
                            renderTabContent={()=><TabContent />}
                        >
                            { _.map(activeTabs, (name, key) => {
                                if (name !== '') {
                                    if (key === 'orders' || key === 'users') {
                                        name = (key === 'orders')
                                            ? <div className={`header-tab ${(activeTab === key) ? 'header-tab-active' : ''}`}>Orders {(pendingOrders !== 0) ? <div id="order-badge" className="pending-badges" >{ pendingOrders }</div> : ''}</div>
                                            : <div className={`header-tab ${(activeTab === key) ? 'header-tab-active' : ''}`}>Users {(pendingUsers !== 0) ? <div id="user-badge" className="pending-badges" >{ pendingUsers }</div> : ''}</div>;
                                    } else {
                                        name = <div className={`header-tab ${(activeTab === key) ? 'header-tab-active' : ''}`}>{ name }</div>
                                    }
                                    return <TabPane tab={name} key={key}></TabPane>
                                }
                            }) }
                        </Tabs>
                    </div>
                    { (this.state.isOpen) ? <Overlay type="profile" closeOverlay={this.showProfile}>
                        <div id="profile-container">
                            <div className="arrow-up"></div>
                            <div className="element" onClick={this.logout} >Log Out</div>
                        </div>
                    </Overlay> : null }
                </div> : null }
                <div className="login-section">
                    { (jwt) ? <div onClick={this.showProfile}>
                        <img className="settings-icon" src={(activeUser.get('profilePic')) ? assets(activeUser.get('profilePic')) : assets('./images/icon-settings.svg')} alt="settingsButtons" width="40px" height="40px" />
                    </div> : null }
                </div>
            </div>
        );
    }
}

const select = (state) => ({
    isLogout   : state.jwt.get('isLogout'),
    activeUser : state.activeUser.get('activeUser'),
    activeTab  : state.header.get('activeTab'),
    orders     : state.orders.get('orders'),
    users      : state.users.get('users')
});

const actions = {
    setActiveTab,
    logout,
    getCurrentUser,
    getUsers,
    getOrders,
}

export default connect(select, actions, null, { withRef: true })(withRouter(withCookies(HeaderBar)));
