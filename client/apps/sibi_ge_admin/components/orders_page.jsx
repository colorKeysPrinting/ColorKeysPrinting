import React                    from 'react';
import _                        from 'lodash';
import { connect }              from 'react-redux';
import { browserHistory, Link } from 'react-router';
import { withCookies }          from 'react-cookie';
import dateformat               from 'dateformat';
import assets                   from '../libs/assets';

import { showOverlay }          from '../actions/application';
import { logout }               from '../actions/header';
import { getOrders, approveOrder }          from '../actions/products';
import { getUsers, getFundProperties }      from '../actions/users';

import MyTable                  from './common/my_table';

class OrdersPage extends React.Component {

    componentWillMount() {
        const { cookies } = this.props;
        const jwt = cookies.get('sibi-admin-jwt');

        if (jwt) {
            this.props.getUsers({ token: jwt.token });
            this.props.getFundProperties({ token: jwt.token });
            this.props.getOrders({ token: jwt.token, orders: (this.props.activeUser.type === 'superAdmin') ? 'ordersForSuperAdmin' : 'ordersForFund' });
        } else {
            console.log('TODO: trigger logout function *** no JWT ***');
        }
    }

    componentWillUpdate(nextProps) {
        // if (nextProps.activeUser) {
        //     const path = (nextProps.activeUser.size > 0) ? `/orders` : `/`;
        //     browserHistory.push(path);
        // }

        if (nextProps.isLogout) {
            this.props.logout();
        }
    }

    render() {
        let data = [];

        const { cookies } = this.props;
        const jwt = cookies.get('sibi-admin-jwt');
        const headers = { orderNumber: 'Order #', createdAt: 'Order Date', productsAndDestinations: 'Items', address: 'Property address', userId: 'Ordered by', email: 'Email', orderStatus: 'Status' };

        if (this.props.orders.size > 0 &&
            this.props.users.size > 0 &&
            this.props.fundProperties.size > 0) {

            const orders = this.props.orders.toJS();
            const users = this.props.users.toJS();
            const fundProperties = this.props.fundProperties.toJS();

            data = _.map(orders, (item) => {
                const cols = {};
                const user = _.find(users, ['id', item['userId']]);
                const fundProperty = _.find(fundProperties, ['id', item['fundPropertyId']]);

                _.each(headers, (value, key) => {
                    value = item[key];

                    if (key === 'userId') {
                        value = `${user['firstName']} ${user['lastName']}`;

                    } else if (key === 'email') {
                        value = user['email'];

                    } else if (key === 'productsAndDestinations') {
                        value = _.size(value);

                    } else if (key === 'address') {
                        value = `${fundProperty['addressLineOne']}, ${fundProperty['addressLineTwo']}, ${fundProperty['city']}, ${fundProperty['state']}, ${fundProperty['zipcode']}`;
                    } else if (key === 'createdAt') {
                        value = dateformat(new Date(value), 'mmmm dd, yyyy');
                    }
                    cols[key] = value;
                });

                return cols;
            });

            // this initially sets the "Pending" orders before everything and "Approved" orders at the end
            data = _.partition(data, ['orderStatus', 'Pending']);
            data = data[0].concat(data[1]);
            data = _.partition(data, ['orderStatus', 'Approved']);
            data = data[1].concat(data[0]);
        }

        return (
            <div id="orders-page" >
                <MyTable
                    type="orders"
                    token={jwt.token}
                    headers={headers}
                    data={data}
                    approveOrder={this.props.approveOrder}
                />
            </div>
        );
    }
}

const select = (state) => ({
    activeUser      : state.application.get('activeUser'),
    orders          : state.application.get('orders'),
    users           : state.application.get('users'),
    fundProperties  : state.application.get('fundProperties'),
});

export default connect(select, { getOrders, getUsers, getFundProperties, approveOrder }, null, { withRef: true })(withCookies(OrdersPage));