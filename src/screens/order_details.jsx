import React                                from 'react';
import _                                    from 'lodash';
import { connect }                          from 'react-redux';
import { browserHistory, Link }             from 'react-router';
import { withCookies }                      from 'react-cookie';
import assets                               from 'libs/assets';

import { logout }                           from 'ducks/active_user/actions';
import { getOrders, updateOrderStatus }     from 'ducks/orders/actions';
import { setActiveTab }                     from 'ducks/header/actions';

import MyTable                              from 'components/my_table';

class OrderDetails extends React.Component {

    componentWillMount() {
        const { cookies } = this.props;
        const jwt = cookies.get('sibi-admin-jwt');

        if (jwt) {
            this.props.getOrders(jwt.token);
        } else {
            console.log('TODO: trigger logout function *** no JWT ***');
        }

        this.props.setActiveTab('orders');
    }

    componentWillUpdate(nextProps) {
        if (nextProps.activeUser) {
            const path = (nextProps.activeUser.size > 0) ? `/orders` : `/`;
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
                    type="orders"
                    token={jwt.token}
                    headers={['Order #','Order Date','Items','Property address','Ordered by','Email','Status']}
                    data={this.props.orders}
                />
            </div>
        );
    }
}

const select = (state) => ({
    orders          : state.orders.get('orders')
});

export default connect(select, { getOrders, updateOrderStatus, setActiveTab }, null, { withRef: true })(withCookies(OrderDetails));