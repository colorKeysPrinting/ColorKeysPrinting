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
import { getUsers }                         from 'ducks/users/actions';
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
            sortby: { column: '', isAsc: false },
            headers: {
                id: '',
                office: 'PM Office',
                propertyId: 'Property ID',
                address: 'Property address',
                occupied: 'Occupancy',
                userId: 'Ordered by',
                geOrderNumber: 'GE Order #',
                createdAtDate : '',
                createdAt: 'Order Date',
                totalCost: 'Cost',
                orderStatus: 'Status',
                action: ''
            },
            KEYS_TO_FILTERS: ['propertyId','address','occupied','userId','geOrderNumber','createdAt','totalCost','orderStatus']
        };

        this.orderBy = this.orderBy.bind(this);
        this.handleAction = this.handleAction.bind(this);
        this.handleItem = this.handleItem.bind(this);
    }

    componentWillMount() {
        const { cookies } = this.props;

        if (cookies.get('sibi-ge-admin')) {
            this.setState({ spinner: true });
            this.props.getFundProperties();
            this.props.getUsers();
            this.props.getOrders();
        }

        this.props.setActiveTab('orders');
    }

    componentWillUpdate(nextProps) {
        const { history, activeUser, fundProperties, orders } = this.props;
        const { spinner } = this.state;

        if (!_.isEqual(nextProps.activeUser, activeUser)) {
            const path = (nextProps.activeUser.size > 0) ? `/orders` : `/login`;
            history.push(path);
        }

        if (nextProps.zeroOrders) {
            this.setState({ spinner: false });
        }

        if (nextProps.orders && nextProps.orders.size > 0) {
            if (spinner &&
                fundProperties.size > 0 &&
                activeUser.size > 0) {
                this.setState({ spinner: false });
            }
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
        const { zeroOrders, orders, activeUser, fundProperties } = this.props;
        const { searchTerm, sortby, alert, headers, KEYS_TO_FILTERS, spinner } = this.state;
        let data = [], headersObj = {};

        if (orders.size > 0 &&
            fundProperties.size > 0 &&
            activeUser.size > 0) {
            _.each(headers, (header, key) => {
                headersObj[key] =  (key === 'id' || key === 'action') ? <div>{ header }</div> : <div onClick={() => this.orderBy({ column: key })} style={{cursor: 'pointer'}} >{ header }</div>;
            });

            data = orders.map((order) => {
                const cols = {};
                const fundProperty = _.find(fundProperties.toJS(), ['id', order.get('fundPropertyId')]);

                _.each(headers, (value, key) => {
                    cols[key] = order.get(key);

                    if (key === 'id') {
                        cols[key] = order.get('id');

                    } else if (key === 'office') {
                        cols[key] = order.getIn(['pmOffice','name']);

                    } else if (key ==='propertyId') {
                        cols[key] = fundProperty.propertyUnitId;

                    } else if (key === 'address') {
                        cols[key] = `${fundProperty['addressLineOne']}, ${(fundProperty['addressLineTwo']) ? `${fundProperty['addressLineTwo']},` : ''} ${fundProperty['city']}, ${fundProperty['state']}, ${fundProperty['zipcode']}`;

                    } else if (key === 'occupied') {
                        cols[key] = (order.get(key)) ? 'Occupied' : 'Vacant';

                    } else if (key === 'userId') {
                        cols[key] = (order.get('user')) ? `${order.getIn(['user','firstName'])} ${order.getIn(['user','lastName'])}` : '';

                    } else if (key === 'createdAt') {
                        const date = new Date(order.get(key));
                        cols[`${key}Date`] = date;
                        cols[key] = moment(date).format('MMM DD, YYYY');

                    } else if (key === 'action') {
                        const permissions = activeUser.get('permissions');
                        if (permissions.get('approveAllOrders') || permissions.get('approveFundOrders')) {
                            cols[key] = (order.get('orderStatus') === 'Pending') ? 'approve' : '';

                        } else if (permissions.get('processManufacturerOrders')) {
                            cols[key] = (order.get('orderStatus') === 'Approved') ? 'process' : '';
                        }
                    }
                });

                return cols;
            }).toJS();

            // this maps the actual cost ammount back to totalCost
            if(searchTerm !== '') {
                data = _.map(data, (order) => {
                    order.totalCost = `${order.totalCost}`;
                    return order;
                });

                data = filter(searchTerm, KEYS_TO_FILTERS, data);
            }

            if (sortby.column !== '') {
                const column = (sortby.column === 'createdAt') ? 'createdAtDate' : sortby.column;
                data = _.orderBy(data, [sortby.column], [sortby.isAsc]);
            }
        }

        return (
            <div>
                <div id="orders-page" className="container">
                    {(spinner) ? <Spinner /> : (!zeroOrders && _.size(data) > 0) ? (
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
                                headers={headersObj}
                                data={data}
                                sortby={(sortby.column !== '') ? sortby : { column: 'orderStatus', isAsc: 'asc' }}
                                handleAction={this.handleAction}
                                handleItem={this.handleItem}
                            />
                        </div>
                    ) : (
                        <div>
                            <h1>Order Status</h1>
                            <p>There are currently no orders to display</p>
                        </div>
                    )}
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
    getUsers,
    getOrders,
    getFundProperties,
    approveOrder,
    setActiveTab
}

export default connect(select, actions, null, { withRef: true })(withRouter(withCookies(OrdersPage)));
