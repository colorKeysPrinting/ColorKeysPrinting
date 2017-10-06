import React                                from 'react';
import _                                    from 'lodash';
import { connect }                          from 'react-redux';
import { withCookies }                      from 'react-cookie';
import { withRouter }                       from 'react-router';
import moment                               from 'moment';
import SearchInput                          from 'react-search-input';
import Loader                               from 'react-loader';

import filter                               from 'libs/filter';
import assets                               from 'libs/assets';

import { triggerSpinner }                   from 'ducks/ui/actions';
import { getOrders, approveOrder }          from 'ducks/orders/actions';
import { getUsers, getFundProperties }      from 'ducks/users/actions';
import { setActiveTab }                     from 'ducks/header/actions';

import MyTable                              from 'components/my_table';
import Overlay                              from 'components/overlay';

class OrdersPage extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            alert: null,
            searchTerm: '',
            sortby: { column: '', isAsc: false }
        };

        this.update = this.update.bind(this);
        this.handleAction = this.handleAction.bind(this);
        this.handleItem = this.handleItem.bind(this);
        this.orderBy = this.orderBy.bind(this);
    }

    componentWillMount() {
        const { cookies } = this.props;
        const jwt = cookies.get('sibi-admin-jwt');

        if (jwt) {
            this.props.triggerSpinner({ isOn: true });
            this.props.getFundProperties({ token: jwt.token });
            this.props.getUsers({ token: jwt.token, type: jwt.type });
            this.props.getOrders({ token: jwt.token, type: jwt.type });
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

    handleAction({ token,  type, item }) {
        const { history, location } = this.props;
        let dialog;

        if (type === 'approve') {
            dialog = <div className="alert-box">
                <p>Are you sure you want to approve this order?</p>
                <div className="btn borderless" type="submit" value="Cancel" onClick={()=> this.setState({ alert: null }) } >Cancel</div>
                <div className="btn blue" type="submit" value="Approve" onClick={()=> this.props.approveOrder({ token, id: item.id }) } >Approve</div>
            </div>

        } else if (type === 'process') {
            history.push({ pathname: `/process_order`, prevPath: location.pathname, search: `orderId=${item.id}` });
        }

        this.setState({
            alert: <Overlay type="alert" closeOverlay={()=>{this.setState({ alert: null }) }}>
                { dialog }
            </Overlay>
        });
    }

    handleItem({ item }) {
        console.log('item pressed', item);
        this.props.triggerSpinner({ isOn: true });
        this.props.history.push({ pathname: `/order_details`, search: `orderId=${item.id}` });
    }

    render() {
        let data = {};

        const { cookies } = this.props;
        const jwt = cookies.get('sibi-admin-jwt');
        const headers = {
            id: '',
            office: 'PM Office',
            propertyId: 'Property ID',
            address: 'Property address',
            occupied: 'Occupancy',
            userId: 'Ordered by',
            geOrderNumber: 'GE Order #',
            createdAt: 'Order Date',
            totalCost: 'Cost',
            orderStatus: 'Status',
            action: ''
        };

        const KEYS_TO_FILTERS = ['propertyId','address','occupied','userId','geOrderNumber','createdAt','totalCost','orderStatus'];

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
                        value = fundProperty.propertyUnitId;

                    } else if (key === 'address') {
                        value = `${fundProperty['addressLineOne']}, ${fundProperty['addressLineTwo']}, ${fundProperty['city']}, ${fundProperty['state']}, ${fundProperty['zipcode']}`;

                    } else if (key === 'occupied') {
                        value = (item[key]) ? 'Occupied' : 'Vacant';

                    } else if (key === 'userId') {
                        value = `${user['firstName']} ${user['lastName']}`;

                    } else if (key === 'geOrderNumber') {
                        value = item[key];

                    } else if (key === 'createdAt') {
                        value = moment(new Date(value)).format('MMM DD, YYYY HH:MM');

                    } else if (key === 'totalCost') {
                        value = parseFloat(item[key]);

                    } else if (key === 'orderStatus') {
                        value = item[key];

                    } else if (key === 'action') {
                        value = (item['orderStatus'] === 'Pending') ? 'approve' : '';
                        // value = (item['orderStatus'] === 'Approved') ? 'process' : value;
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
                data = _.partition(data, ['orderStatus', 'Processed']);
                data[0] = _.orderBy(data[0], ['createdAt'], ['desc']); // sorts orderStatus pending w/ orderDate
                data = data[0].concat(data[1]);

                data = _.partition(data, ['orderStatus', 'Pending']);
                data[0] = _.orderBy(data[0], ['createdAt'], ['desc']); // sorts orderStatus pending w/ orderDate
                data = data[0].concat(data[1]);

                data = _.partition(data, ['orderStatus', 'Approved']);
                data[0] = _.orderBy(data[0], ['createdAt'], ['desc']); // sorts orderStatus pending w/ orderDate
                data = data[1].concat(data[0]);

            } else {
                data = _.orderBy(data, [this.state.sortby.column], [this.state.sortby.isAsc]);
            }

            this.props.triggerSpinner({ isOn: false });
        }

        const sortBy = (this.state.sortby.column !== '') ? this.state.sortby : { column: 'orderStatus', isAsc: 'asc' };

        return (
            <Loader loaded={this.props.spinner} >
                <div id="orders-page" className="container">
                    <div className="table-card">
                        <div className="card-header">
                            <h2>Orders</h2>
                            <div className="search-wrapper">
                                <img src={assets('./images/icon-search.svg')} className="search-icon"/>
                                <SearchInput className="search-input" onChange={(value) => this.update({ type: 'searchTerm', value })} />
                            </div>
                        </div>
                        <MyTable
                            token={jwt.token}
                            type="orders"
                            dataClassName="table-row-clickable"
                            headers={headers}
                            data={data}
                            sortby={sortBy}
                            handleAction={this.handleAction}
                            handleItem={this.handleItem}
                        />
                    </div>
                </div>
                { this.state.alert }
            </Loader>
        );
    }
}

const select = (state) => ({
    spinner         : state.ui.get('spinner'),
    activeUser      : state.activeUser.get('activeUser'),
    orders          : state.orders.get('orders'),
    users           : state.users.get('users'),
    fundProperties  : state.users.get('fundProperties'),
});

const actions = {
    triggerSpinner,
    getOrders,
    getUsers,
    getFundProperties,
    approveOrder,
    setActiveTab
}

export default connect(select, actions, null, { withRef: true })(withRouter(withCookies(OrdersPage)));
