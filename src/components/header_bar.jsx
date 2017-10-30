import React                                from 'react';
import _                                    from 'lodash';
import { connect }                          from 'react-redux';
import { withRouter }                       from 'react-router';
import { withCookies }                      from 'react-cookie';
import { Link }                             from 'react-router-dom';
import Tabs, { TabPane }                    from 'rc-tabs';
import TabContent                           from 'rc-tabs/lib/TabContent';
import ScrollableInkTabBar                  from 'rc-tabs/lib/ScrollableInkTabBar';
import assets                               from 'libs/assets';

import { setActiveTab }                     from 'ducks/header/actions';
import { logout, getCurrentUser }           from 'ducks/active_user/actions';
import { getUsers, clearUsers }             from 'ducks/users/actions';
import { getOrders, clearOrders }           from 'ducks/orders/actions';

import Overlay                              from 'components/overlay';

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

        if (cookies.get('sibi-ge-admin')) {
            this.props.getCurrentUser();
        } else {
            history.push({ pathname: `/login`, prevPath: location.pathname });
        }
    }

    componentWillUpdate(nextProps) {
        const { cookies, history, location, activeUser, isLogout, activeTab, orders, users } = this.props;

        if (!_.isEqual(nextProps.isLogout, isLogout)) {
            this.props.logout();
        }

        if (cookies.get('sibi-ge-admin')) {
            if (!_.isEqual(nextProps.activeTab, activeTab) && activeTab !== '') {
                this.props.getUsers();
                this.props.getOrders();

            } else if (!orders.size || !users.size) {
                this.props.getUsers();
                this.props.getOrders();
            }

            if (!_.isEqual(nextProps.activeUser, activeUser)) {
                if (nextProps.activeUser.size > 0) {
                    if (location.prevPath && location.prevPath !== '/login') {
                        history.push({ pathname: location.prevPath })
                    } else if (location.pathname === '/login' || location.pathname === '/') {
                        history.push(`/orders`);
                    }
                } else {
                    cookies.remove('sibi-ge-admin');
                    history.push({ pathname: `/login`});
                }
            }
        } else {
            history.push({ pathname: `/login`, prevPath: location.pathname });
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
        this.props.clearOrders();
        this.props.clearUsers();
    }

    tabActions({ activeTab }) {
        const { history } = this.props;

        history.push(`/${activeTab}`);
        this.props.setActiveTab(activeTab);
    }

    render() {
        const { cookies, activeUser, location, isLogout, activeTab, orders, users } = this.props;
        const jwt = cookies.get('sibi-ge-admin');
        let pendingOrders = 0, pendingUsers = 0, activeTabs = { dashboard: '', orders: '', users: '', properties: '', products: '', new_order: '' };

        const isProcessOrder = (location.pathname !== '/process_order') ? false : true;

        if (jwt && activeUser.size > 0) {
            const permissions = activeUser.get('permissions').toJS();

            _.each(activeTabs, (value, key) => {
                if (key === 'dashboard' && permissions['']) {
                    activeTabs['dashboard'] = 'Dashboard';
                }

                if (key === 'orders' && (permissions['viewAllOrders'] || permissions['viewAllApprovedAndProcessedOrders'] || permissions['viewFundOrders'])) {
                    activeTabs['orders'] = 'Orders';
                    if (orders.size > 0) {
                        const orderStatus = (_.includes(activeUser.get('type'), 'manufacturer')) ? 'approved' : 'pending';

                        _.each(orders.toJS(), (order) => {
                            pendingOrders = ((order.orderStatus).toLowerCase() === orderStatus) ? pendingOrders + 1 : pendingOrders;
                        });
                    }
                }

                if (key === 'users' && (permissions['manageAllUsers'] || permissions['manageAllFundUsers'] || permissions['manageAllManufacturerUsers'] || permissions['manageSubordinateUsers'])) {
                    activeTabs['users'] = 'Users';

                    if (users.size > 0) {
                        _.each(users.toJS(), (user) => {
                            pendingUsers = ((user.type).toLowerCase() === 'pending') ? pendingUsers + 1 : pendingUsers;
                        });
                    }
                }

                if (key === 'properties' && (permissions['manageAllUsers'])) { // TODO: need to update this with the correct permissions
                    // activeTabs['properties'] = 'Properties';
                }

                if (key === 'products' && (permissions['viewAllProducts'] || permissions['manageAllProducts'] || permissions['manageFundPreferredProducts'] || permissions['manageFundProducts'])) {
                    // activeTabs['products'] = 'Products';
                }

                if (key === 'new_order' && permissions['createOrder']) {
                    activeTabs['new_order'] =  'New Order';
                }
            });
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
                                            ? <div className={`header-tab ${(activeTab === key) ? 'active' : ''}`}>Orders {(pendingOrders !== 0) ? <div id="order-badge" className="pending-badges" >{ pendingOrders }</div> : ''}</div>
                                            : <div className={`header-tab ${(activeTab === key) ? 'active' : ''}`}>Users {(pendingUsers !== 0) ? <div id="user-badge" className="pending-badges" >{ pendingUsers }</div> : ''}</div>;
                                    } else {
                                        name = <div className={`header-tab ${(activeTab === key) ? 'active' : ''}`}>{ name }</div>
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
                    { (jwt && activeUser.size > 0) ? <div onClick={() => this.showProfile()}>
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
    clearUsers,
    clearOrders
}

export default connect(select, actions, null, { withRef: true })(withRouter(withCookies(HeaderBar)));
