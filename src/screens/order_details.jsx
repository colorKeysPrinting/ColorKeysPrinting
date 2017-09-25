import React                                                from 'react';
import _                                                    from 'lodash';
import { connect }                                          from 'react-redux';
import { withRouter }                                       from 'react-router';
import { withCookies }                                      from 'react-cookie';
import moment                                               from 'moment';
import assets                                               from 'libs/assets';
import Iframe                                               from 'react-iframe';
import Loader                                               from 'react-loader';

import { formatPhoneNumbers }                               from 'libs/reformat';

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

        this.state = { editOrder: false, productsAndParts: {} };

        this.editOrder = this.editOrder.bind(this);
        this.handleAction = this.handleAction.bind(this);
    }

    componentWillMount() {
        const { cookies, location } = this.props;
        const jwt = cookies.get('sibi-admin-jwt');

        if (jwt) {
            const reOrder = /orderId=(.*)/;
            const orderId = reOrder.exec(location.search)[1];

            if (orderId) {
                this.props.triggerSpinner({ isOn: true });
                this.props.getOrderById({ id: orderId });

            } else {
                alert('No orderId provided routing back to orders');
                this.props.history.push(`/orders`);
            }
        } else {
            this.props.history.push(`/login`);
        }

        this.props.setActiveTab('orders');
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
        const { order, spinner } = this.props;
        let pageData, tenantInfoTitle, tenantInfoDetails;;

        const productHeaders = {
            productDescription: '',
            address: 'Shipped to',
            qty: 'Qty',
            price: 'Cost'
        };

        const orderHeaders = {
            orderStatus: 'Order Status',
            geOrderNumber: 'GE Order #',
            createdBy: 'Ordered By',
            occupied: 'Occupancy',
            lockBoxCode: '',
            installTime: 'Preferred Install Time',
            hotshotDelivery: 'Hot Shot',
            hotshotInstallDate: '',
            hotshotCode: '',
        };

        if (order.size > 0) {
            const myOrder = order.toJS();
            const user = myOrder.orderUser;

            orderHeaders['hotshotInstallDate'] = (myOrder.isApplianceHotShotDelivery) ? 'Hot Shot Install Date' : 'Install Date';
            orderHeaders['hotshotCode'] = (myOrder.isApplianceHotShotDelivery) ? 'Hot Shot Code' : '';

            if (!this.state.editOrder) {
                const orderStatus = myOrder.orderStatus;

                const orderPageHeading = {
                    address: `${myOrder.fundProperty.addressLineOne} ${myOrder.fundProperty.addressLineTwo} ${myOrder.fundProperty.addressLineThree}, ${myOrder.fundProperty.city}, ${myOrder.fundProperty.state}, ${myOrder.fundProperty.zipcode}`,
                    PM: myOrder.fund.pmOffices[0].name
                };

                const productsAndDestinations = [];
                _.each(myOrder.productsAndDestinations, (product) => {
                    productsAndDestinations.push(product);

                    _.each(product.includedParts, (part) => {
                        productsAndDestinations.push({...part, productOrderId: product.productOrderId});
                    });
                });

                const productsAndParts = productsAndDestinations.concat(myOrder.partsAndDestinations);

                if (myOrder.occupied) {
                    const formatTenantPhone = formatPhoneNumbers(myOrder.tenantPhone);
                    tenantInfoTitle = <tr>
                        <td><div className="table-header">Tenant Info: </div></td>
                    </tr>;

                    tenantInfoDetails = <tr>
                        <td><div>{`${myOrder.tenantFirstName} ${myOrder.tenantLastName}`} ∙ {formatTenantPhone} ∙ {myOrder.tenantEmail}</div></td>
                    </tr>;

                } else {
                    const formatUserPhone = (user.phoneNumber) ? formatPhoneNumbers(user.phoneNumber) : '';
                    const formatOfficePhone = (myOrder.pmOffice) ? formatPhoneNumbers(myOrder.pmOffice.phoneNumber) : '';
                    const pmOfficeName = (myOrder.pmOffice) ? myOrder.pmOffice.name : orderPageHeading.PM;

                    tenantInfoTitle = <tr>
                        <td><div className="table-header">Delivery Contact: </div></td>
                        <td><div className="table-header">Phone Number: </div></td>
                    </tr>;

                    tenantInfoDetails = [
                        <tr key='tenantInfoDetails1'>
                            <td><div>{user.firstName} {user.lastName}</div></td>
                            <td><div>{formatUserPhone}</div></td>
                        </tr>,
                        <tr key='tenantInfoDetails2'>
                            <td><div>{pmOfficeName}</div></td>
                            <td><div>{formatOfficePhone}</div></td>
                        </tr>
                    ];
                }

                const orderDetailsCols = {};
                orderHeaders.lockBoxCode = (myOrder.lockBoxCode) ? 'Lockbox Code' : 'Tenant';
                _.each(orderHeaders, (value, key) => {
                    value = order[key]
                    if (key === 'orderStatus') {
                        value = myOrder.orderStatus;

                    } else if (key === 'geOrderNumber'){
                        value = myOrder.geOrderNumber;

                    } else if (key === 'installTime') {
                        value = (myOrder.applianceDeliveryTime) ? myOrder.applianceDeliveryTime : 'Not Specified';

                    } else if (key === 'occupied') {
                        value = (myOrder.occupied === false) ? 'Unoccupied' : 'Occupied';

                    } else if (key === 'lockBoxCode') {
                        value = (myOrder.lockBoxCode) ? myOrder.lockBoxCode : `${myOrder.tenantFirstName} ${myOrder.tenantLastName}`;

                    } else if (key === 'createdBy') {
                        value = `${myOrder.orderUser.firstName} ${myOrder.orderUser.lastName}`;

                    } else if (key === 'hotshotDelivery') {
                        value = (myOrder.isApplianceHotShotDelivery) ? 'Yes' : 'No';

                    } else if (key === 'hotshotInstallDate') {
                        value = moment(myOrder.installDate).format('MM/DD/YYYY');

                    } else if (key === 'hotshotCode') {
                        value = (myOrder.isApplianceHotShotDelivery) ? myOrder.applianceHotShotCode : null;
                    }

                    orderDetailsCols[key] = value;
                });

                pageData = <div className="container">
                    <div className="details-header">
                        <div className="header-property pure-u-2-3">
                            <h2 className="order-number">Order: { myOrder.orderNumber }</h2>
                            <div className="property-manager">{orderPageHeading.address} ● PM Office: {orderPageHeading.PM}</div>
                        </div>
                        { (orderStatus == 'Pending') ? <div className="button-container pure-u-1-3">
                            <div className="btn blue" onClick={() => this.editOrder({ orderId: myOrder.id })}>Edit</div>
                            <div className="btn blue" onClick={() => this.handleAction({ orderId: myOrder.id })}>Approve</div>
                        </div> : null }
                    </div>
                    <MyTable
                        className="order-details-table"
                        type="orderDetails"
                        headers={orderHeaders}
                        data={{orderDetailsCols}}
                    />
                    <div className="tenant-info-table">
                        <table className="table">
                            <thead className="head">
                                { tenantInfoTitle }
                            </thead>
                            <tbody>
                                { tenantInfoDetails }
                            </tbody>
                        </table>
                    </div>
                    <div className="product-table-wrapper">
                        { _.map(productsAndParts, (orderDetail, productIndex) => {
                            if (orderDetail.product) {
                                const address = <div className="no-limit">
                                    <div>{`${myOrder.fundProperty.addressLineOne} ${myOrder.fundProperty.addressLineTwo} ${myOrder.fundProperty.addressLineThree},`}</div>
                                    <div>{`${myOrder.fundProperty.city}, ${myOrder.fundProperty.state}, ${myOrder.fundProperty.zipcode}`}</div>
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
                                    installAppliance={orderDetail.installAppliance}
                                    removeOldAppliance={orderDetail.removeOldAppliance}
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
                        }) }
                    </div>
                    <div>
                        {(myOrder.isApplianceHotShotDelivery) ? <div className="cost-section" >
                            <h5 style={{right: '8%', position: 'absolute', margin: '-6px' }}>Hotshot Delivery: <span>${ myOrder.applianceHotShotPrice }</span></h5>
                        </div> : null}
                        <div className="cost-section">
                            <h5 className="cost-header">Order Summary </h5>
                            <div className="cost-row">
                                <h5>Subtotal: <span>${ myOrder.subTotalCost }</span></h5>
                                <h5>Sales Tax: <span>${ myOrder.salesTax }</span></h5>
                                <h5>Total: <span>${ myOrder.totalCost }</span></h5>
                            </div>
                        </div>
                    </div>
                </div>;
            } else {
                const height = (window.innerHeight - 69);
                const width = window.innerWidth;

                pageData = <div style={{ position: 'absolute', top: '69px', height, width }}>
                    <Iframe
                        url={`${process.env.ORDER_URL}/edit/${this.state.editOrder}`}
                        width={`${width}`}
                        height={`${height}`}
                        position="relative"
                    />
                </div>;
            }

            this.props.triggerSpinner({ isOn: false });
        }

        return (
            <Loader loaded={spinner} >
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
