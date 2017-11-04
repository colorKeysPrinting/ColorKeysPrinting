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

class HeaderBar extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            isSearch: false,
            isOpen: false
        };

        this.tabActions = this.tabActions.bind(this);
    }

    componentWillUpdate(nextProps) {
        const { cookies, history, location, activeUser, isLogout, activeTab, orders, users } = this.props;
    }

    tabActions({ activeTab }) {
        const { history } = this.props;

        history.push(`/${activeTab}`);
        this.props.setActiveTab(activeTab);
    }

    render() {
        const { cookies, location, activeTab } = this.props;
        let pendingOrders = 0, pendingUsers = 0, activeTabs = { dashboard: '', orders: '', users: '', properties: '', products: '', new_order: '' };

        return (
            <div id="header-bar">
            </div>
        );
    }
}

const select = (state) => ({
});

const actions = {
}

export default connect(select, actions, null, { withRef: true })(withRouter(withCookies(HeaderBar)));
