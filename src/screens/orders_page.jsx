import React                                from 'react';
import _                                    from 'lodash';
import { connect }                          from 'react-redux';
import { withCookies }                      from 'react-cookie';
import { withRouter }                       from 'react-router';
import dateformat                           from 'dateformat';
import SearchInput                          from 'react-search-input';
import filter                               from 'libs/filter';

import { logout }                           from 'ducks/active_user/actions';
import { triggerSpinner }                   from 'ducks/ui/actions';
import { getOrders, approveOrder }          from 'ducks/orders/actions';
import { getUsers, getFundProperties }      from 'ducks/users/actions';
import { setActiveTab }                     from 'ducks/header/actions';

import MyTable                              from 'components/my_table';

class OrdersPage extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            searchTerm: '',
            sortby: { column: '', isAsc: false }
        };

        this.update = this.update.bind(this);
        this.handleAction = this.handleAction.bind(this);
        this.handleItem = this.handleItem.bind(this);
        this.orderBy = this.orderBy.bind(this);
    }

    componentWillMount() {
        const { cookies, activeUser } = this.props;
        const jwt = cookies.get('sibi-admin-jwt');

        if (jwt && jwt.token !== '') {
            this.props.getFundProperties({ token: jwt.token });
            this.props.getUsers({ token: jwt.token, type: activeUser.toJS().type });
            this.props.getOrders({ token: jwt.token, type: activeUser.toJS().type });
        } else {
            this.props.history.push(`/login`);
        }

        this.props.setActiveTab('orders');
    }

    componentWillUpdate(nextProps) {
        if (!_.isEqual(nextProps.activeUser, this.props.activeUser)) {
            const path = (nextProps.activeUser.size > 0) ? `/orders` : `/login`;
            this.props.history.push(path);
        }
    }

    update({ type, value }) {
        this.setState({ [type]: value });
    }

    orderBy({ column }) {
        this.setState((prevState) => {
            const isAsc = (column === prevState.sortby.column && prevState.sortby.isAsc === 'asc') ? 'desc' : 'asc';
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
        this.props.triggerSpinner({ isOn: false });
        this.props.history.push('/order_details', item.id);
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

        const KEYS_TO_FILTERS = ['propertyId','address','occupied','userId','orderNumber','createdAt','totalCost','orderStatus'];

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
                        value = user.fundLocation.city;

                    } else if (key ==='propertyId') {
                        value = fundProperty.id;

                    } else if (key === 'address') {
                        value = `${fundProperty['addressLineOne']}, ${fundProperty['addressLineTwo']}, ${fundProperty['city']}, ${fundProperty['state']}, ${fundProperty['zipcode']}`;

                    } else if (key === 'occupied') {
                        value = (item[key]) ? 'Occupied' : 'Vacant';

                    } else if (key === 'userId') {
                        value = `${user['firstName']} ${user['lastName']}`;

                    } else if (key === 'orderNumber') {
                        value = item[key];

                    } else if (key === 'createdAt') {
                        value = dateformat(new Date(value), 'mmmm dd, yyyy');

                    } else if (key === 'totalCost') {
                        value = parseFloat(item[key]);

                    } else if (key === 'orderStatus') {
                        value = item[key];

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
                    value = <div>{header}</div>;

                } else {
                    value = <div onClick={() => this.orderBy({ column: key })} style={{cursor: 'pointer'}} >{ header }</div>;
                }

                headers[key] = value;
            });

            // this initially sets the "Pending" orders before everything and "Approved" orders at the end
            if(this.state.searchTerm !== '') {
                data = _.map(data, (item) => {
                    item.totalCost = `${item.totalCost}`;
                    return item;
                });

                data = filter(this.state.searchTerm, KEYS_TO_FILTERS, data);
            }

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
            <div id="orders-page" className="container">
                <div className="table-card">
                    <div className="card-header">
                        <h2>Orders</h2>
                        <div className="search-bar">
                            <SearchInput onChange={(value) => this.update({ type: 'searchTerm', value })} />
                        </div>
                    </div>
                    <MyTable
                        type="orders"
                        dataClassName="table-row-clickable"
                        headers={headers}
                        data={data}
                        sortby={this.state.sortby}
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

const actions = {
    logout,
    triggerSpinner,
    getOrders,
    getUsers,
    getFundProperties,
    approveOrder,
    setActiveTab
}

export default connect(select, actions, null, { withRef: true })(withRouter(withCookies(OrdersPage)));
