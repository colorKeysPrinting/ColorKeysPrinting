import React                                                from 'react';
import _                                                    from 'lodash';
import { connect }                                          from 'react-redux';
import { withRouter }                                       from 'react-router';
import { withCookies }                                      from 'react-cookie';
import moment                                               from 'moment';
import assets                                               from 'libs/assets';
import Iframe                                               from 'react-iframe';
import Loader                                               from 'react-loader';

import { logout }                                           from 'ducks/active_user/actions';
import { triggerSpinner }                                   from 'ducks/ui/actions';
import { getOrderById, approveOrder, clearOrder }           from 'ducks/orders/actions';
import { setActiveTab }                                     from 'ducks/header/actions';

import MyTable                                              from 'components/my_table';
import ProductTable                                         from 'components/product_table';
import PartTable                                            from 'components/part_table';

class OrderDetails extends React.Component {
    constructor(props) {
        super(props);

        this.state = { editOrder: false, orderProducts: {} };

        this.editOrder = this.editOrder.bind(this);
        this.handleAction = this.handleAction.bind(this);
    }

    componentWillMount() {
        const { cookies, location } = this.props;
        const jwt = cookies.get('sibi-admin-jwt');

        if (jwt && jwt.token !== '' && location) {
            const reOrder = /orderId=(.*)/;
            const orderId = reOrder.exec(location.search)[1];

            if (orderId) {
                this.props.getOrderById({ id: orderId });

            } else {
                alert('No orderId provided routing back to orders');
                this.props.history.push(`/order`);
            }
        } else {
            this.props.history.push(`/login`);
        }

        this.props.setActiveTab('orders');
    }

    componentWillUpdate(nextProps) {
        if (!_.isEqual(nextProps.order, this.props.order)) {
            this.props.triggerSpinner({ isOn: true });
        }
    }

    componentDidUpdate() {
        this.props.triggerSpinner({ isOn: false });
    }

    componentWillUnmount() {
        this.props.clearOrder();
    }

    editOrder({ orderId }) {
        this.setState({ editOrder: orderId });
    }

    handleAction({ orderId }) {
        console.log('user action:', orderId);
        const { cookies } = this.props;
        const jwt = cookies.get('sibi-admin-jwt');

        this.props.approveOrder({ token: jwt.token, id: orderId });
    }

    render() {
        let pageData, productsAndParts, productData;

        const productHeaders = {
            productDescription: '',
            address: 'Shipped to',
            qty: 'Qty',
            price: 'Cost'
        };

        const orderHeaders = {
            orderStatus: 'Order Status',
            orderNumber: 'Order Number',
            deliveryDate: 'Delivery Date',
            installTime: 'Preferred Install Time',
            occupied: 'Occupancy',
            lockBoxCode: '',
            createdBy: 'Ordered By',
            hotshotDelivery: 'Hot Shot Delivery'
        };

        if (this.props.order.size > 0) {
            const order = this.props.order.toJS();
            const user = order.orderUser;

            orderHeaders['hotshotInstallDate'] = (order.isApplianceHotShotDelivery) ? 'Hot Shot Install Date' : 'Install Date';
            orderHeaders['hotshotCode'] = (order.isApplianceHotShotDelivery) ? 'Hot Shot Code' : '';

            if (!this.state.editOrder) {
                const orderId = order.id;
                const orderStatus = order.orderStatus;

                // *************** product section ***************
                if (!order.processedAt) {
                    const productsAndDestinations = [];
                    _.each(order.productsAndDestinations, (product) => {
                        productsAndDestinations.push(product);

                        _.each(product.includedParts, (part) => {
                            productsAndDestinations.push({...part, productOrderId: product.productOrderId});
                        });
                    });

                    productData = productsAndDestinations.concat(order.partsAndDestinations);
                }

                productData = _.map(productData, (orderDetail, productIndex) => {
                    if (orderDetail.product) {
                        const address = <div className="no-limit">
                            <div>{`${order.fundProperty.addressLineOne} ${order.fundProperty.addressLineTwo} ${order.fundProperty.addressLineThree},`}</div>
                            <div>{`${order.fundProperty.city}, ${order.fundProperty.state}, ${order.fundProperty.zipcode}`}</div>
                        </div>;

                        return <ProductTable
                            key={`product${productIndex}`}
                            type="orderDetails"
                            productIndex={productIndex}
                            productHeaders={productHeaders}
                            product={orderDetail.product}
                            image={orderDetail.selectedColorInfo.imageUrl}
                            color={orderDetail.selectedColorInfo.color}
                            qty={(orderDetail.qty) ? orderDetail.qty : 1}
                            address={address}
                            price={orderDetail.ProductPrice.price}
                        />;
                    } else if (orderDetail.part) {
                        return <PartTable
                            key={`part${productIndex}`}
                            type="orderDetails"
                            productIndex={productIndex}
                            part={orderDetail.part}
                            qty={(orderDetail.qty) ? orderDetail.qty : 1}
                            price={orderDetail.PartPrice.price}
                        />;
                    }
                });

                // *************** order & tenant section ***************
                // **** order section
                orderHeaders.lockBoxCode = (order.lockBoxCode) ? 'Lockbox Code' : 'Tenant';
                const orderDetailsCols = {};
                _.each(orderHeaders, (value, key) => {
                    value = order[key]
                    if (key === 'orderStatus') {
                        value = order.orderStatus;

                    } else if (key === 'orderNumber'){
                        value = order.orderNumber;

                    } else if (key === 'deliveryDate') {
                        value = moment(order.installDate).format('MM/DD/YYYY');

                    } else if (key === 'installTime') {
                        value = (order.applianceDeliveryTime) ? order.applianceDeliveryTime : 'Not Specified';

                    } else if (key === 'occupied') {
                        value = (order.occupied === false) ? 'Unoccupied' : 'Occupied';

                    } else if (key === 'lockBoxCode') {
                        value = (order.lockBoxCode) ? order.lockBoxCode : `${order.tenantFirstName} ${order.tenantLastName}`;

                    } else if (key === 'createdBy') {
                        value = `${order.orderUser.firstName} ${order.orderUser.lastName}`;

                    } else if (key === 'hotshotDelivery') {
                        value = (order.isApplianceHotShotDelivery) ? 'Yes' : 'No';

                    } else if (key === 'hotshotInstallDate') {
                        value = moment(order.installDate).format('MM/DD/YYYY');

                    } else if (key === 'hotshotCode') {
                        value = (order.isApplianceHotShotDelivery) ? <div>{ order.applianceHotShotCode }</div> : null;
                    }

                    orderDetailsCols[key] = value;
                });
                const orderData = {orderDetailsCols};

                const orderPageHeading = {
                    address: `${order.fundProperty.addressLineOne} ${order.fundProperty.addressLineTwo} ${order.fundProperty.addressLineThree}, ${order.fundProperty.city}, ${order.fundProperty.state}, ${order.fundProperty.zipcode}`,
                    PM: order.fund.pmOffices[0].name
                };
                const buttonSection = (orderStatus == 'Pending') ? <div className="button-container pure-u-1-3">
                    <div className="btn blue" onClick={() => this.editOrder({ orderId })}>Edit</div>
                    <div className="btn blue" onClick={() => this.handleAction({ orderId })}>Approve</div>
                </div> : null;

                const detailsHeaderSection = <div className="details-header">
                    <div className="header-property pure-u-2-3">
                        <h2 className="property-address">{order.orderNumber}</h2>
                        <div className="property-manager">{orderPageHeading.address} ● PM Office: {orderPageHeading.PM}</div>
                    </div>
                    { buttonSection }
                </div>;

                // **** tenant section
                let tenantInfoTitle;
                let tenantInfoDetails;

                if (order.occupied) {
                    tenantInfoTitle = <tr>
                        <td><div className="table-header">Tenant Info: </div></td>
                    </tr>;

                    tenantInfoDetails = <tr>
                        <td><div>{`${order.tenantFirstName} ${order.tenantLastName}`} ∙ {order.tenantPhone} ∙ {order.tenantEmail}</div></td>
                    </tr>;

                } else {
                    tenantInfoTitle = <tr>
                        <td><div className="table-header">Delivery Contact: </div></td>
                        <td><div className="table-header">Phone Number: </div></td>
                    </tr>;

                    tenantInfoDetails = [
                        <tr key='tenantInfoDetails1'>
                            <td><div>{user.firstName} {user.lastName}</div></td>
                            <td><div>{user.phoneNumber}</div></td>
                        </tr>,
                        <tr key='tenantInfoDetails2'>
                            <td><div>{order.pmOffice.name}</div></td>
                            <td><div>{order.pmOffice.phoneNumber}</div></td>
                        </tr>
                    ];
                }

                const tenantInfoSection = <div className="tenant-info-table">
                    <table className="table">
                        <thead className="head">
                            { tenantInfoTitle }
                        </thead>
                        <tbody>
                            { tenantInfoDetails }
                        </tbody>
                    </table>
                </div>;

                // *************** order totals section ***************
                const orderTotalSection = <div className="cost-section">
                    <h5 className="cost-header">Order Summary </h5>
                    <div className="cost-row">
                        <h5>Sub Total: <span>${ order.totalCost }</span></h5>
                        <h5>Sales Tax: <span>${ order.salesTax }</span></h5>
                        <h5>Total: <span>${ (parseFloat(order.totalCost) + parseFloat(order.salesTax)).toFixed(2) }</span></h5>
                    </div>
                </div>;

                pageData = <div className="container">
                    { detailsHeaderSection }
                    <MyTable
                        className="order-details-table"
                        type="orderDetails"
                        headers={orderHeaders}
                        data={orderData}
                    />
                    { tenantInfoSection }
                    <div className="product-table-wrapper">
                        { productData }
                    </div>
                    { orderTotalSection }
                </div>;
            } else {
                const height = (window.innerHeight - 69);
                const width = window.innerWidth;

                pageData = <div style={{ position: 'absolute', top: '69px', height, width }}>
                    <Iframe
                        url={`https://sibi-ge-dev.netlify.com/edit/${this.state.editOrder}`}
                        width={`${width}`}
                        height={`${height}`}
                        position="relative"
                    />
                </div>;
            }
        }

        return (
            <Loader loaded={this.props.spinner} >
                <div id="order-details-page">
                    { pageData }
                </div>
            </Loader>
        );
    }
}

const select = (state) => ({
    order           : state.orders.get('order'),
    spinner         : state.ui.get('spinner')
});

const actions = {
    logout,
    triggerSpinner,
    getOrderById,
    approveOrder,
    clearOrder,
    setActiveTab
}

export default connect(select, actions, null, { withRef: true })(withRouter(withCookies(OrderDetails)));
