import React                                from 'react';
import _                                    from 'lodash';
import { connect }                          from 'react-redux';
import { withCookies }                      from 'react-cookie';
import dateformat                           from 'dateformat';
import assets                               from 'libs/assets';

import { logout }                           from 'ducks/active_user/actions';
import { getOrders, approveOrder }          from 'ducks/orders/actions';
import { getUsers, getFundProperties }      from 'ducks/users/actions';
import { setActiveTab }                     from 'ducks/header/actions';
import InfoCard                             from 'components/info_card';

class DashboardPage extends React.Component {

    render() {
        return (
            <div id="dashboard-page" className="container">
                <InfoCard />
            </div>
        );
    }
}

const select = (state) => ({
    activeUser      : state.activeUser.get('activeUser'),
    orders          : state.orders.get('orders'),
    users           : state.users.get('users'),
    fundProperties  : state.users.get('fundProperties'),
});

const actions = {
    logout, 
    getOrders, 
    getUsers, 
    getFundProperties, 
    approveOrder,
    setActiveTab
}

export default connect(select, actions, null, { withRef: true })(withCookies(DashboardPage));
//asdfsad