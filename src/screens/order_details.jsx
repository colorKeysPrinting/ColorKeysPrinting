import React                                from 'react';
import _                                    from 'lodash';
import { connect }                          from 'react-redux';
import { withRouter }                       from 'react-router';
import { withCookies }                      from 'react-cookie';
import moment                               from 'moment';
import assets                               from 'libs/assets';
import Iframe                               from 'react-iframe';

import { formatPhoneNumbers }               from 'libs/reformat';

import { logout }                           from 'ducks/active_user/actions';
import { getOrderById, approveOrder, clearOrder } from 'ducks/orders/actions';
import { setActiveTab }                     from 'ducks/header/actions';

import MyTable                              from 'components/my_table';
import ProductTable                         from 'components/product_table';
import PartTable                            from 'components/part_table';
import Spinner                              from 'components/spinner';

class OrderDetails extends React.Component {
    constructor(props) {
        super(props);

        this.state = { editOrder: false, productsAndParts: {} };

        this.editOrder = this.editOrder.bind(this);
        this.handleAction = this.handleAction.bind(this);
    }

    componentWillMount() {
        const { id } = this.props.match.params;
        const { cookies, history, location } = this.props;

        if (cookies.get('sibi-ge-admin')) {
            if (id) {
                this.props.getOrderById({ id });

            } else {
                alert('No orderId provided routing back to orders');
                history.push(`/orders`);
            }
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
        this.props.approveOrder({ id: orderId });
    }

    render() {
        const { order, spinner, activeUser } = this.props;
        let pageData, tenantInfoTitle, tenantInfoDetails;;
        const height = (window.innerHeight - 69);
        const width = window.innerWidth;

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
            const user = order.get('createdByUser');
            const permissions = activeUser.get('permissions');

            orderHeaders['hotshotInstallDate'] = (order.get('isApplianceHotShotDelivery')) ? 'Hot Shot Install Date' : 'Install Date';
            orderHeaders['hotshotCode'] = (order.get('isApplianceHotShotDelivery')) ? 'Hot Shot Code' : '';

            if (!this.state.editOrder) {
                const orderStatus = order.get('orderStatus');

                const orderPageHeading = {
                    address: `${order.getIn(['pmOffice','addressLineOne'])} ${(!_.isNull(order.getIn(['pmOffice','addressLineTwo']))) ? `${order.getIn(['pmOffice','addressLineTwo'])},` : ''} ${(!_.isNull(order.getIn(['pmOffice','addressLineThree']))) ? `${order.getIn(['pmOffice','addressLineThree'])},` : ''}, ${order.getIn(['pmOffice','city'])}, ${order.getIn(['pmOffice','state'])}, ${order.getIn(['pmOffice','zipcode'])}`,
                    PM: order.getIn(['pmOffice','name'])
                };

                const productsAndDestinations = [];
                _.each(order.get('productsAndDestinations').toJS(), (product) => {
                    productsAndDestinations.push(product);

                    _.each(product.includedParts, (part) => {
                        productsAndDestinations.push({...part, productOrderId: product.productOrderId});
                    });
                });

                const productsAndParts = productsAndDestinations.concat(order.get('partsAndDestinations'));

                if (order.get('occupied')) {
                    const formatTenantPhone = formatPhoneNumbers(order.get('tenantPhone'));
                    tenantInfoTitle = <tr>
                        <td><div className="table-header">Tenant Info: </div></td>
                    </tr>;

                    tenantInfoDetails = <tr>
                        <td><div>{`${order.get('tenantFirstName')} ${order.get('tenantLastName')}`} ∙ {formatTenantPhone} ∙ {(!_.isNull(order.get('tenantEmail'))) ? order.get('tenantEmail') : ''}</div></td>
                    </tr>;

                } else {
                    const formatUserPhone = (user.get('phoneNumber')) ? formatPhoneNumbers(user.get('phoneNumber')) : '';
                    const formatOfficePhone = (order.get('pmOffice')) ? formatPhoneNumbers(order.getIn(['pmOffice','phoneNumber'])) : '';
                    const pmOfficeName = (order.get('pmOffice')) ? order.getIn(['pmOffice','name']) : orderPageHeading.PM;

                    tenantInfoTitle = <tr>
                        <td><div className="table-header">Delivery Contact: </div></td>
                        <td><div className="table-header">Phone Number: </div></td>
                    </tr>;

                    tenantInfoDetails = [
                        <tr key='tenantInfoDetails1'>
                            <td><div>{user.get('firstName')} {user.get('lastName')}</div></td>
                            <td><div>{formatUserPhone}</div></td>
                        </tr>,
                        <tr key='tenantInfoDetails2'>
                            <td><div>{pmOfficeName}</div></td>
                            <td><div>{formatOfficePhone}</div></td>
                        </tr>
                    ];
                }

                const orderDetailsCols = {};
                orderHeaders.lockBoxCode = (order.get('lockBoxCode')) ? 'Lockbox Code' : 'Tenant';
                _.each(orderHeaders, (value, key) => {
                    value = order[key]
                    if (key === 'orderStatus') {
                        value = order.get('orderStatus');

                    } else if (key === 'geOrderNumber'){
                        value = order.get('geOrderNumber');

                    } else if (key === 'installTime') {
                        value = (order.get('applianceDeliveryTime')) ? order.get('applianceDeliveryTime') : 'Not Specified';

                    } else if (key === 'occupied') {
                        value = (order.get('occupied') === false) ? 'Unoccupied' : 'Occupied';

                    } else if (key === 'lockBoxCode') {
                        value = (order.get('lockBoxCode')) ? order.get('lockBoxCode') : `${order.get('tenantFirstName')} ${order.get('tenantLastName')}`;

                    } else if (key === 'createdBy') {
                        value = `${order.getIn(['orderUser','firstName'])} ${order.getIn(['orderUser','lastName'])}`;

                    } else if (key === 'hotshotDelivery') {
                        value = (order.get('isApplianceHotShotDelivery')) ? 'Yes' : 'No';

                    } else if (key === 'hotshotInstallDate') {
                        value = moment(order.get('installDate')).format('MM/DD/YYYY');

                    } else if (key === 'hotshotCode') {
                        value = (order.get('isApplianceHotShotDelivery')) ? order.get('applianceHotShotCode') : '';
                    }

                    orderDetailsCols[key] = value;
                });

                pageData = <div className="container">
                    <div className="details-header">
                        <div className="header-property pure-u-2-3">
                            <h2 className="order-number">Order: { order.get('orderNumber') }</h2>
                            <div className="property-manager">{ orderPageHeading.address } ● PM Office: { orderPageHeading.PM }</div>
                        </div>
                        { (orderStatus == 'Pending') ? <div className="button-container pure-u-1-3">
                            { (permissions.get('updateAllOrders') || permissions.get('updateFundOrders') || permissions.get('updateFundOrdersPriorToApproval'))
                                ? <div className="btn blue" onClick={() => this.editOrder({ orderId: order.get('id') })}>Edit</div>
                                : null }
                            { (permissions.get('viewAllApprovedAndProcessedOrders') || permissions.get('approveAllOrders') || permissions.get('approveFundOrders'))
                                ? <div className="btn blue" onClick={() => this.handleAction({ orderId: order.get('id') })}>Approve</div>
                                : null }
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
                                const replacement = (orderDetail.selectedColorInfo.replacementManufacturerModelNumber) ? orderDetail.selectedColorInfo.replacementManufacturerModelNumber : false;
                                const address = <div className="no-limit">
                                    <div>{`${order.getIn(['fundProperty','addressLineOne'])} ${(!_.isNull(order.getIn(['fundProperty','addressLineTwo']))) ? `${order.getIn(['fundProperty','addressLineTwo'])},` : ''} ${(!_.isNull(order.getIn(['fundProperty','addressLineThree']))) ? `${order.getIn(['fundProperty','addressLineThree'])},` : ''}`}</div>
                                    <div>{`${order.getIn(['fundProperty','city'])}, ${order.getIn(['fundProperty','state'])}, ${order.getIn(['fundProperty','zipcode'])}`}</div>
                                </div>;

                                return <ProductTable
                                    key={`product${productIndex}`}
                                    type="orderDetails"
                                    productIndex={productIndex}
                                    productHeaders={productHeaders}
                                    product={orderDetail.product}
                                    replacement={replacement}
                                    image={orderDetail.selectedColorInfo.imageUrl}
                                    manufacturerModelNumber={orderDetail.selectedColorInfo.manufacturerModelNumber}
                                    color={orderDetail.selectedColorInfo.color}
                                    qty={(orderDetail.qty) ? orderDetail.qty : 1}
                                    installAppliance={orderDetail.installAppliance}
                                    removeOldAppliance={orderDetail.removeOldAppliance}
                                    address={address}
                                    price={orderDetail.ProductPrice.price}
                                />;
                            } else if (orderDetail.part) {
                                const replacement = (orderDetail.replacementModelNumber) ? orderDetail.replacementModelNumber : false;
                                return <PartTable
                                    key={`part${productIndex}`}
                                    type="orderDetails"
                                    productIndex={productIndex}
                                    part={orderDetail.part}
                                    replacement={replacement}
                                    qty={(orderDetail.qty) ? orderDetail.qty : 1}
                                    price={orderDetail.PartPrice.price}
                                />;
                            }
                        }) }
                    </div>
                    <div>
                        {(order.get('isApplianceHotShotDelivery')) ? <div className="cost-section" >
                            <h5 style={{right: '8%', position: 'absolute', margin: '-6px' }}>Hot Shot Delivery: <span>${ (!_.isNull(order.get('applianceHotShotPrice'))) ? order.get('applianceHotShotPrice') : '' }</span></h5>
                        </div> : null}
                        <div className="cost-section">
                            <h5 className="cost-header">Order Summary </h5>
                            <div className="cost-row">
                                <h5>Subtotal: <span>${ order.get('subTotalCost') }</span></h5>
                                <h5>Sales Tax: <span>${ order.get('salesTax') }</span></h5>
                                <h5>Total: <span>${ order.get('totalCost') }</span></h5>
                            </div>
                        </div>
                    </div>
                </div>;
            } else {
                pageData = <div style={{ position: 'absolute', top: '69px', height, width }}>
                    <Iframe
                        url={`${process.env.ORDER_URL}/edit/${this.state.editOrder}`}
                        width={`${width}`}
                        height={`${height}`}
                        position="relative"
                    />
                </div>;
            }
        }

        return (
            <div id="order-details-page">
                { (pageData) ? pageData : <Spinner/> }
            </div>
        );
    }
}

const select = (state) => ({
    order      : state.orders.get('order'),
    activeUser : state.activeUser.get('activeUser'),
});

const actions = {
    logout,
    getOrderById,
    approveOrder,
    clearOrder,
    setActiveTab
}

export default connect(select, actions, null, { withRef: true })(withRouter(withCookies(OrderDetails)));
