import React                                                from 'react';
import _                                                    from 'lodash';
import { connect }                                          from 'react-redux';
import { withRouter }                                       from 'react-router';
import { withCookies }                                      from 'react-cookie';
import dateformat                                           from 'dateformat';
import assets                                               from 'libs/assets';

import { logout }                                           from 'ducks/active_user/actions';
import { getOrderById, approveOrder, getProducts }          from 'ducks/orders/actions';
import { setActiveTab }                                     from 'ducks/header/actions';

import MyTable                                              from 'components/my_table';
import ProductTable                                         from 'components/product_table';
import PartTable                                            from 'components/part_table';

class OrderDetails extends React.Component {
    constructor(props) {
        super(props);

        this.state = { productsAndParts: '' };

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
            productImage: 'Product',
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
                {/* <div className="btn blue">Edit</div> */}
                <div className="btn blue" onClick={() => this.handleAction({orderId})}>Approve</div>
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
                <div className="cost-row" ><h4>Sub Total:</h4> ${ order.subTotalCost }</div>
                <div className="cost-row" ><h4>Sales Tax:</h4> ${ order.salesTax }</div>
                <div className="cost-row" ><h4>Total:</h4> ${ order.totalCost }</div>
            </div>;

            pageData = <div>
                { detailsHeaderSection }
                <MyTable
                    type="orderDetails"
                    headers={orderHeaders}
                    data={orderData}
                />
                { tenantInfoSection }
                { productData }
                { orderTotalSection }
            </div>
        }

        return (
            <div id="orders-page">
                <div className="container">
                    { pageData }
                </div>
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
