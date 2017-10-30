import React                                from 'react';
import _                                    from 'lodash';
import { connect }                          from 'react-redux';
import { withCookies }                      from 'react-cookie';
import { withRouter }                       from 'react-router';
import moment                               from 'moment';
import SearchInput                          from 'react-search-input';

import filter                               from 'libs/filter';
import assets                               from 'libs/assets';

import { getOrders, approveOrder }          from 'ducks/orders/actions';
import { getFundProperties }                from 'ducks/properties/actions';
import { setActiveTab }                     from 'ducks/header/actions';

import MyTable                              from 'components/my_table';
import Overlay                              from 'components/overlay';
import Spinner                              from 'components/spinner';

class OrdersPage extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            alert: null,
            searchTerm: '',
            sortby: { column: '', isAsc: false }
        };

        this.handleAction = this.handleAction.bind(this);
        this.handleItem = this.handleItem.bind(this);
        this.orderBy = this.orderBy.bind(this);
    }

    componentWillMount() {
        const { activeTab, cookies } = this.props;

        if (cookies.get('sibi-ge-admin')) {
            this.props.getFundProperties();
        }

        this.props.setActiveTab('orders');
    }

    componentWillUpdate(nextProps) {
        if (!_.isEqual(nextProps.activeUser, this.props.activeUser)) {
            const path = (nextProps.activeUser.size > 0) ? `/orders` : `/login`;
            this.props.history.push(path);
        }
    }

    orderBy({ column }) {
        this.setState((prevState) => {
            const isAsc = (column === prevState.sortby.column && prevState.sortby.isAsc === 'asc') ? 'desc' : 'asc';

            return { sortby: { column, isAsc } };
        });
    }

    handleAction(type, order) {
        const { history, location } = this.props;
        let dialog;

        if (type === 'approve') {
            dialog = <div className="alert-box">
                <p>Are you sure you want to approve this order?</p>
                <div className="btn borderless" onClick={()=> this.setState({ alert: null }) } >Cancel</div>
                <div className="btn blue" onClick={()=> this.props.approveOrder({ id: order.id }) } >Approve</div>
            </div>

        } else if (type === 'process') {
            history.push({ pathname: `/process_order/${order.id}`, prevPath: location.pathname });
        }

        this.setState({
            alert: <Overlay type="alert" closeOverlay={()=>{this.setState({ alert: null }) }}>
                { dialog }
            </Overlay>
        });
    }

    handleItem(order) {
        const { history, activeUser } = this.props;
        const permissions = activeUser.get('permissions');

        const pathname = (order.orderStatus === 'Approved') ? (permissions.get('viewAllApprovedAndProcessedOrders') || permissions.get('processManufacturerOrders')) ? 'process_order' : 'order_details' : 'order_details';

        history.push(`/${pathname}/${order.id}`);
    }

    render() {
        const { cookies, spinner, activeUser, orders, fundProperties, zeroOrders } = this.props;
        const { searchTerm, sortby, alert } = this.state;
        let data;

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

        if (orders.size > 0 &&
            fundProperties.size > 0 &&
            activeUser.size > 0) {

            data = _.map(orders.toJS(), (order) => {
                const cols = {};
                const fundProperty = _.find(fundProperties.toJS(), ['id', order['fundPropertyId']]);

                _.each(headers, (value, key) => {
                    cols[key] = order[key];

                    if (key === 'id') {
                        cols[key] = order.id;

                    } else if (key === 'office') {
                        cols[key] = order.pmOffice.name;

                    } else if (key ==='propertyId') {
                        cols[key] = fundProperty.propertyUnitId;

                    } else if (key === 'address') {
                        cols[key] = `${fundProperty['addressLineOne']}, ${(fundProperty['addressLineTwo']) ? `${fundProperty['addressLineTwo']},` : ''} ${fundProperty['city']}, ${fundProperty['state']}, ${fundProperty['zipcode']}`;

                    } else if (key === 'occupied') {
                        cols[key] = (order[key]) ? 'Occupied' : 'Vacant';

                    } else if (key === 'userId') {
                        cols[key] = (order['user']) ? `${order.user.firstName} ${order.user.lastName}` : '';

                    } else if (key === 'createdAt') {
                        cols[key] = moment(new Date(order[key])).format('MMM DD, YYYY HH:MM');

                    } else if (key === 'action') {
                        const permissions = activeUser.get('permissions');
                        if (permissions.get('approveAllOrders') || permissions.get('approveFundOrders')) {
                            cols[key] = (order['orderStatus'] === 'Pending') ? 'approve' : '';

                        } else if (permissions.get('processManufacturerOrders')) {
                            cols[key] = (order['orderStatus'] === 'Approved') ? 'process' : '';
                        }
                    }
                });

                return cols;
            });

            _.each(headers, (header, key) => {
                headers[key] =  (key === 'id' || key === 'action') ? <div>{ header }</div> : <div onClick={() => this.orderBy({ column: key })} style={{cursor: 'pointer'}} >{ header }</div>;
            });

            // this maps the actual cost ammount back to totalCost
            if(searchTerm !== '') {
                data = _.map(data, (order) => {
                    order.totalCost = `${order.totalCost}`;
                    return order;
                });

                data = filter(searchTerm, KEYS_TO_FILTERS, data);
            }

            // this initially sets the "Pending" orders before everything and "Approved" orders at the end
            if (sortby.column !== '') {
                data = _.orderBy(data, [sortby.column], [sortby.isAsc]);
            }
        }

        return (
            <div>
                <div id="orders-page" className="container">
                    { (!zeroOrders && data) ? (
                        <div className="table-card">
                            <div className="card-header">
                                <h2>Orders</h2>
                                <div className="search-wrapper">
                                    <img src={assets('./images/icon-search.svg')} className="search-icon"/>
                                    <SearchInput className="search-input" onChange={(value) => this.setState({ searchTerm: value })} />
                                </div>
                            </div>
                            <MyTable
                                type="orders"
                                dataClassName="table-row-clickable"
                                headers={headers}
                                data={data}
                                sortby={(sortby.column !== '') ? sortby : { column: 'orderStatus', isAsc: 'asc' }}
                                handleAction={this.handleAction}
                                handleItem={this.handleItem}
                            />
                        </div>
                    ) : (
                        (zeroOrders) ? (
                            <div>
                                <h1>Order Status</h1>
                                <p>There are currently no orders to display</p>
                            </div>
                        ) : <Spinner />
                    ) }
                </div>
                { alert }
            </div>
        );
    }
}

const select = (state) => ({
    activeUser      : state.activeUser.get('activeUser'),
    orders          : state.orders.get('orders'),
    zeroOrders      : state.orders.get('zeroOrders'),
    fundProperties  : state.properties.get('fundProperties'),
    activeTab       : state.header.get('activeTab'),
});

const actions = {
    getFundProperties,
    approveOrder,
    setActiveTab
}

export default connect(select, actions, null, { withRef: true })(withRouter(withCookies(OrdersPage)));
