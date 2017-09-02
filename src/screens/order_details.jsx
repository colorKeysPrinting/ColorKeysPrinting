import React                                                from 'react';
import _                                                    from 'lodash';
import { connect }                                          from 'react-redux';
import { withRouter }                                       from 'react-router';
import { withCookies }                                      from 'react-cookie';
import dateformat                                           from 'dateformat';
import assets                                               from 'libs/assets';
import Iframe                                               from 'react-iframe';

import { logout }                                           from 'ducks/active_user/actions';
import { getOrderById, approveOrder, getProducts }          from 'ducks/orders/actions';
import { setActiveTab }                                     from 'ducks/header/actions';

import MyTable                                              from 'components/my_table';
import ProductTable                                         from 'components/product_table';
import PartTable                                            from 'components/part_table';

class OrderDetails extends React.Component {
    constructor(props) {
        super(props);

        this.state = { productsAndParts: '', editOrder: false };

        this.editOrder = this.editOrder.bind(this);
        this.handleAction = this.handleAction.bind(this);
    }

    componentWillMount() {
        const orderId = this.props.location.state;

        if (orderId) {
            this.props.getOrderById({ id: orderId });

        } else {
            console.log('TODO: trigger logout function *** no JWT ***');
        }

        this.props.setActiveTab('orders');
    }

    componentWillUpdate(nextProps) {
        if (!_.isEqual(nextProps.order, this.props.order)) {
            const order = nextProps.order.toJS();

            if (!order.processedAt) {
                const productsAndDestinations = [];
                _.each(order.productsAndDestinations, (product) => {
                    productsAndDestinations.push(product);

                    _.each(product.includedParts, (part) => {
                        productsAndDestinations.push({...part, productOrderId: product.productOrderId});
                    });
                });

                const productsAndParts = productsAndDestinations.concat(order.partsAndDestinations);

                this.setState({ productsAndParts });
            }
        }
    }

    componentWillUnmount() {
        this.setState({ productsAndParts: '' });
    }

    editOrder({ orderId }) {
        this.setState({ editOrder: orderId });
    }

    handleAction({orderId}) {
        console.log('user action:', orderId);
        const { cookies } = this.props;
        const jwt = cookies.get('sibi-admin-jwt');

        this.props.approveOrder({ token: jwt.token, id: orderId });
    }

    render() {
        let pageData;

        const { cookies } = this.props;
        const jwt = cookies.get('sibi-admin-jwt');

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
            createdBy: 'Ordered By'
        };

        if (this.props.order.size > 0) {
            const order = this.props.order.toJS();
            const user = order.orderUser;

            if (!this.state.editOrder) {
                const orderId = order.id;
                const orderStatus = order.orderStatus;
                const orderPageHeading = {
                    address: `${order.fundProperty.addressLineOne} ${order.fundProperty.addressLineTwo} ${order.fundProperty.addressLineThree}, ${order.fundProperty.city}, ${order.fundProperty.state}, ${order.fundProperty.zipcode}`,
                    PM: order.fund.pmOffices[0].name,
                    orderNumber: order.orderNumber
                };

                const tenantInfo = {
                    tenantName: `${order.tenantFirstName} ${order.tenantLastName}`,
                    tenantPhoneNumber: order.tenantPhone,
                    tenantEmail: order.tenantEmail
                }

                orderHeaders['lockBoxCode'] = (order.lockBoxCode) ? order.lockBoxCode : 'Tenant';

                const cols = {};
                _.each(orderHeaders, (value, key) => {
                    value = order[key]
                    if (key === 'orderStatus') {
                        value = order.orderStatus;

                    } else if (key === 'orderNumber'){
                        value = order.orderNumber;

                    } else if (key === 'deliveryDate') {
                        value = dateformat(order.installDate, 'mm/dd/yy');

                    } else if (key === 'installTime') {
                        value = order.applianceDeliveryTime ? order.applianceDeliveryTime : 'Not Specified';

                    } else if (key === 'occupied') {
                        value = (order['occupied'] === false) ? 'Unoccupied' : 'Occupied';

                    } else if (key === 'lockBoxCode') {
                        value = (order.lockBoxCode) ? order.lockBoxCode : `${order.tenantFirstName} ${order.tenantLastName}`;

                    } else if (key === 'createdBy') {
                        value = order.createdBy ? order.createdBy : 'Ordered By';
                    }

                    cols[key] = value;
                });
                const orderData = {cols};

                const productData = _.map(this.state.productsAndParts, (orderDetail, productIndex) => {
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

                const buttonSection = (orderStatus == 'Pending') ? <div className="button-container pure-u-1-3">
                    <div className="btn blue" onClick={() => this.editOrder({ orderId })}>Edit</div>
                    <div className="btn blue" onClick={() => this.handleAction({ orderId })}>Approve</div>
                </div>
                    : <div className="button-container pure-u-1-3"></div>;

                const detailsHeaderSection = <div className="details-header">
                    <div className="header-property pure-u-2-3">
                        <h2 className="property-address">{orderPageHeading.orderNumber}</h2>
                        <div className="property-manager">{orderPageHeading.address} ● PM Office: {orderPageHeading.PM}</div>
                    </div>
                    { buttonSection }
                </div>;

                let tenantInfoTitle;
                let tenantInfoDetails;
                if (order.occupied) {
                    tenantInfoTitle = <tr>
                        <td><div className="table-header">Tenant Info: </div></td>
                    </tr>;
                    tenantInfoDetails = <tr>
                        <td><div>{tenantInfo.tenantName} ∙ {tenantInfo.tenantPhoneNumber} ∙ {tenantInfo.tenantEmail}</div></td>
                    </tr>;
                } else {

                    tenantInfoTitle = <tr>
                        <td><div className="table-header">Delivery Contact: </div></td>
                        <td><div className="table-header">Phone Number: </div></td>
                    </tr>;

                    tenantInfoDetails = [
                        <tr>
                            <td><div>{user.firstName} {user.lastName}</div></td>
                            <td><div>{user.phoneNumber}</div></td>
                        </tr>,
                        <tr>
                            <td><div>{order.pmOffice.name}</div></td>
                            <td><div>{order.pmOffice.phoneNumber}</div></td>
                        </tr>
                    ];
                }

                const tenantInfoSection = <div id="admin-table">
                    <table className="table">
                        <thead className="head">
                            { tenantInfoTitle }
                        </thead>
                        <tbody>
                            { tenantInfoDetails }
                        </tbody>
                    </table>
                </div>;

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
                pageData = <Iframe
                    url={`https://sibi-ge-dev.netlify.com/edit/${this.state.editOrder}`}
                    width="100%"
                    height="100%"
                    allowFullScreen
                />;
            }


        }

        return (
            <div id="order-details-page">
                { pageData }
            </div>
        );
    }
}

const select = (state) => ({
    order           : state.orders.get('order')
});

const actions = {
    logout,
    approveOrder,
    getOrderById,
    setActiveTab
}

export default connect(select, actions, null, { withRef: true })(withRouter(withCookies(OrderDetails)));
