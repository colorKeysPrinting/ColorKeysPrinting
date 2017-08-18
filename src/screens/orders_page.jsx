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

import MyTable                              from 'components/my_table';

class OrdersPage extends React.Component {
    constructor(props) {
        super(props);

        this.state = { sortby: {column: '', isAsc: false } };

        this.handleAction = this.handleAction.bind(this);
        this.handleItem = this.handleItem.bind(this);
        this.orderBy = this.orderBy.bind(this);
    }

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

        this.props.setActiveTab('orders');
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

    orderBy({ column }) {
        this.setState((prevState) => {
            const isAsc = (column === prevState.sortby.column && prevState.sortby.isAsc !== 'asc') ? 'asc' : 'desc';
            const sortby = { column, isAsc };

            return { sortby };
        });
    }

    handleAction({ item }) {
        console.log('user action:', item.id);
        const { cookies } = this.props;
        const jwt = cookies.get('sibi-admin-jwt');

        this.props.approveOrder({ token: jwt.token, id: item.id });
    }

    handleItem({ item }) {
        console.log('item pressed', item);
        this.props.history.push({ pathname: '/order_details', state: { ... item } });
    }

    render() {
        let data = [];

        const { cookies } = this.props;
        const jwt = cookies.get('sibi-admin-jwt');
        const headers = {
            id: '',
            office: 'PM Office',
            propertyId: 'Property ID',
            address: 'Property address',
            occupied: 'Occupancy',
            userId: 'Ordered by',
            orderNumber: 'GE Order #',
            createdAt: 'Order Date',
            totalCost: 'Cost',
            orderStatus: 'Status',
            action: ''
        };

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

                    if (key === 'id') {
                        value = item.id;

                    } else if (key === 'office') {
                        value = user.fundLocation.city

                    } else if (key ==='propertyId') {
                        value = fundProperty.id;

                    } else if (key === 'address') {
                        value = `${fundProperty['addressLineOne']}, ${fundProperty['addressLineTwo']}, ${fundProperty['city']}, ${fundProperty['state']}, ${fundProperty['zipcode']}`;

                    } else if (key === 'occupied') {
                        value = (item[key]) ? 'Occupied' : 'Vacant';

                    } else if (key === 'userId') {
                        value = `${user['firstName']} ${user['lastName']}`;

                    } else if (key === 'createdAt') {
                        value = dateformat(new Date(value), 'mmmm dd, yyyy');

                    } else if (key === 'totalCost') {
                        value = `$ ${item[key]}`;

                    } else if (key === 'action') {
                        value = (item['orderStatus'] === 'Pending') ? 'approve' : '';
                    }

                    cols[key] = value;
                });

                return cols;
            });

            _.each(headers, (header, key) => {
                let value;

                if (key === 'id' || key === 'action') {
                    value = header;

                } else {
                    value = <div onClick={() => this.orderBy({ column: key })} style={{cursor: 'pointer'}} >{ header }</div>;
                }

                headers[key] = value;
            });

            // this initially sets the "Pending" orders before everything and "Approved" orders at the end
            if (this.state.sortby.column === '') {
                data = _.partition(data, ['orderStatus', 'Pending']);
                data = data[0].concat(data[1]);
                data = _.partition(data, ['orderStatus', 'Approved']);
                data = data[1].concat(data[0]);

            } else {
                data = _.orderBy(data, [this.state.sortby.column], [this.state.sortby.isAsc]);
            }
        }

        return (
            <div id="orders-page" >
                <div className="table-card">
                    <div className="card-header">
                        <h2>Orders</h2>
                        <div className="search-bar">
                        </div>
                    </div>
                    <MyTable
                        type="orders"
                        headers={headers}
                        data={data}
                        handleAction={this.handleAction}
                        handleItem={this.handleItem}
                    />
                </div>
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

const action = {
    logout,
    getOrders,
    getUsers, 
    getFundProperties,
    approveOrder,
    setActiveTab
}

export default connect(select, action, null, { withRef: true })(withCookies(OrdersPage));
