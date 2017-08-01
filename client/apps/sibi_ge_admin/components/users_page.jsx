import React                    from 'react';
import _                        from 'lodash';
import { connect }              from 'react-redux';
import { browserHistory, Link } from 'react-router';
import { withCookies }          from 'react-cookie';
import assets                   from '../libs/assets';

import { showOverlay }          from '../actions/application';
import { logout }               from '../actions/header';
import { getOrders, updateOrderStatus }          from '../actions/products';

import MyTable                  from './common/my_table';

class UsersPage extends React.Component {

    componentWillMount() {
        const { cookies } = this.props;
        const jwt = cookies.get('sibi-admin-jwt');

        if (jwt) {
            this.props.getOrders(jwt.token);
        } else {
            console.log('TODO: trigger logout function *** no JWT ***');
        }
    }

    componentWillUpdate(nextProps) {
        if (nextProps.activeUser) {
            const path = (nextProps.activeUser.size > 0) ? `/users` : `/`;
            browserHistory.push(path);
        }

        if (nextProps.isLogout) {
            this.props.logout();
        }
    }

    render() {
        const { cookies } = this.props;
        const jwt = cookies.get('sibi-admin-jwt');

        return (
            <div id="orders-page" >
                <MyTable
                    type="users"
                    token={jwt.token}
                    headers={['Order #','Order Date','Items','Property address','Ordered by','Email','Status']}
                    data={this.props.orders}
                />
            </div>
        );
    }
}

const select = (state) => ({
    orders          : state.application.get('orders')
});

export default connect(select, { showOverlay, getOrders, updateOrderStatus }, null, { withRef: true })(withCookies(UsersPage));