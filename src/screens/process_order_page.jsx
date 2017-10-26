import React                                from 'react';
import _                                    from 'lodash';
import { connect }                          from 'react-redux';
import { withCookies }                      from 'react-cookie';
import { withRouter }                       from 'react-router';
import { Link }                             from 'react-router-dom';
import Iframe                               from 'react-iframe';
import moment                               from 'moment';
import DayPickerInput                       from 'react-day-picker/DayPickerInput';

import assets                               from 'libs/assets';
import { formatPhoneNumbers }               from 'libs/reformat';

import * as orderActions                    from 'ducks/orders/actions';
import { setActiveTab }                     from 'ducks/header/actions';

import MyTable                              from 'components/my_table';
import ProductTable                         from 'components/product_table';
import PartTable                            from 'components/part_table';
import Spinner                              from 'components/spinner';

class ProcessOrderPage extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            orderNumber: '',
            processedBy: '',
            modelNumber: '',
            outOfStock: '',
            editOrder: false,
            productsAndParts: {}
        };

        this.update = this.update.bind(this);
        this.editOrder = this.editOrder.bind(this);
        this.handleAction = this.handleAction.bind(this);
        this.updateInstallDate = this.updateInstallDate.bind(this);
        this.updateModelNumber = this.updateModelNumber.bind(this);
        this.showOutOfStock = this.showOutOfStock.bind(this);
    }

    componentWillMount() {
        const { id } = this.props.match.params;
        const { history, location, cookies } = this.props;

        if (cookies.get('sibi-ge-admin')) {
            if (id) {
                this.props.getOrderById({ id });
            } else {
                alert('No orderId provided routing back to orders');
                (location.prevPath) ? history.goBack() : history.push(`/login`);
            }
        }

        this.props.setActiveTab('orders');
    }

    componentWillUnmount() {
        this.props.clearOrder();
    }

    componentWillUpdate(nextProps) {
        if (!_.isEqual(nextProps.order, this.props.order)) {
            const order = nextProps.order;

            if (!order.get('processedAt')) {
                this.setState({ installDate: order.get('installDate') });
            }
        }
    }

    update({ type, value }) {
        this.setState({ [type]: value });
    }

    editOrder({ orderId }) {
        this.setState({ editOrder: orderId });
    }

    handleAction({ orderId }) {
        this.props.approveOrder({ id: orderId });
    }

    updateInstallDate({ day }) {
        const order = this.props.order.toJS();
        const newDate = day._d.toISOString();

        const installDate = (!_.isEqual(newDate, order.installDate)) ? newDate : order.installDate;

        this.props.updateInstallDate({ id: order.id, installDate });
    }

    updateModelNumber({ productsAndParts }) {
        const { outOfStock, modelNumber } = this.state;
        let data;
        const order = this.props.order.toJS();
        const item = productsAndParts[outOfStock];

        if (item.product) {
            // products
            data = { productOrderId: item.productOrderId, modelNumber };

        } else if (item.part) {
            if(!item.productOrderId) {
                // standalone parts
                data = { partOrderId: item.partOrderId, modelNumber };

            } else {
                // included parts
                data = { productOrderId: item.productOrderId, partId: item.partId, modelNumber };
            }
        }

        this.props.updateModelNumber({ id: order.id, data });
        this.setState({ outOfStock: '', modelNumber: '' });
    }

    showOutOfStock({ productIndex }) {
        this.setState({ outOfStock: productIndex });
    }

    render() {
        const { order, spinner, activeUser } = this.props;
        let orderPageData, tenantInfoTitle, tenantInfoDetails;

        if (order.size > 0) {
            if (!order.get('processedAt')) {
                const permissions = activeUser.get('permissions');
                const user = order.get('createdByUser');

                const productsAndDestinations = [];
                _.each(order.get('productsAndDestinations').toJS(), (product) => {
                    productsAndDestinations.push(product);

                    _.each(product.includedParts, (part) => {
                        productsAndDestinations.push({...part, productOrderId: product.productOrderId});
                    });
                });

                const productsAndParts = productsAndDestinations.concat(order.get('partsAndDestinations'));

                // ***************** USER TABLE DATA *****************
                const userHeaders = {
                    createdBy: 'Ordered By',
                    phoneNumber: 'Phone Number',
                    email: 'Email',
                    occupied: 'Occupancy'
                };

                (order.get('occupied')) ? (
                    userHeaders['tenantName'] = 'Tenant Name',
                    userHeaders['tenantPhone'] = 'Phone Number',
                    userHeaders['tenantEmail'] = 'Email'
                ) : (
                    userHeaders['lockBoxCode'] ='Lockbox Code'
                )

                const userCols = {};
                _.each(userHeaders, (value, key) => {
                    switch(key) {
                    case 'createdBy':
                        userCols[key] = `${user.get('firstName')} ${user.get('lastName')}`;
                        break;
                    case 'phoneNumber':
                        userCols[key] = (!_.isNull(user.get('phoneNumber'))) ? user.get('phoneNumber') : '';
                        break;
                    case 'email':
                        userCols[key] = (!_.isNull(user.get('email'))) ? user.get('email') : '';
                        break;
                    case 'occupied':
                        userCols[key] = (order.get(key)) ? 'Occupied' : 'Unoccupied';
                        break;
                    case 'tenantName':
                        userCols[key] = `${order.get('tenantFirstName')} ${order.get('tenantFirstName')}`
                        break;
                    default:
                        userCols[key] = (order.get(key)) ? order.get(key) : '';
                    }
                });

                // ***************** INSTALLER TABLE DATA *****************
                const installHeaders = {
                    applianceDeliveryTime: 'Preferred Install Time',
                    isApplianceHotShotDelivery: 'Hot Shot',
                    installDate: (order.get('isApplianceHotShotDelivery')) ? 'Hot Shot Install Date' : 'Install Date',
                }

                if (order.get('isApplianceHotShotDelivery')) { userHeaders['applianceHotShotCode'] = 'Hot Shot Code' }

                const installCols = {};
                _.each(installHeaders, (value, key) => {
                    switch(key){
                    case 'applianceDeliveryTime':
                        installCols[key] = (order.get(key)) ? order.get(key) : 'Not Specified';
                        break;
                    case 'isApplianceHotShotDelivery':
                        installCols[key] = (order.get(key)) ? 'Yes' : 'No';
                        break;
                    case 'installDate':
                        const formattedDay = moment(order.get(key)).format('MM/DD/YYYY');
                        installCols[key] = <div className="no-limit">{
                            (permissions.get('updateAllOrders') || permissions.get('updateFundOrders')) ? (
                                <DayPickerInput
                                    value={formattedDay}
                                    onDayChange={day => this.updateInstallDate({ day })}
                                />
                            ) : <input type="text" value={formattedDay} disabled />
                        }</div>
                        break;
                    default:
                        installCols[key] = (order.get(key)) ? order.get(key) : '';
                    }
                });

                // ***************** OFFICE TABLE DATA *****************
                const officeHeaders = {
                    phoneNumber: 'Phone Number',
                    email: 'Email'
                };

                const officeCols = {};
                _.each(officeHeaders, (value, key) => {
                    officeCols[key] = (order.get('pmOffice')) ? (order.getIn(['pmOffice', key])) ? order.getIn(['pmOffice', key]) : 'Not Provided' : null;
                });

                // ***************** PRODUCTS TABLE DATA *****************
// TODO: I ended here. need to also create table for installer info
                const productHeaders = {
                    productDescription: '',
                    code: 'Install Code',
                    address: 'Shipped to',
                    qty: 'Qty',
                    price: 'Cost'
                };

                orderPageData = <div>
                    <div className="page-header">
                        <div className="order-info">
                            <h2>Order: <span>*** update this ***</span></h2>
                            <h2>GE Account: <span>{ (order.getIn(['pmOffice', 'applianceGEAccountNumber'])) ? order.getIn(['pmOffice', 'applianceGEAccountNumber']) : order.getIn(['fund','applianceGEAccountNumber']) }</span></h2>
                            <h2>Fund: <span>{ order.getIn(['fund','name']) }</span></h2>
                            <h2>PM Office: <span>*** update this ***</span></h2>
                            <h4>Ship-to Address: <span>{ `${order.getIn(['fundProperty', 'addressLineOne'])} ${(!_.isNull(order.getIn(['fundProperty','addressLineTwo']))) ? `${order.getIn(['fundProperty','addressLineTwo'])},` : ''} ${(!_.isNull(order.getIn(['fundProperty','addressLineThree']))) ? `${order.getIn(['fundProperty','addressLineThree'])},` : ''} ${order.getIn(['fundProperty','city'])} ${order.getIn(['fundProperty','state'])} ${order.getIn(['fundProperty','zipcode'])}` }</span></h4>
                        </div>
                        {(permissions.get('viewAllApprovedAndProcessedOrders') || permissions.get('processManufacturerOrders'))
                            ? <form className="process-order" onSubmit={(e) => {e.preventDefault(); this.props.processOrder({ id: order.get('id'), processedByName: this.state.processedBy, geOrderNumber: this.state.orderNumber });}}>
                                <div className="input-container">
                                    <label htmlFor="processed-by">Processed By</label>
                                    <input name="processed-by" type="text" value={this.state.processedBy} placeholder="Name" onChange={(e) => this.update({ type: 'processedBy', value: e.target.value })} required />
                                </div>
                                <div className="input-container">
                                    <label htmlFor="ge-order-number">GE Order Number</label>
                                    <input name="ge-order-number" type="text" value={this.state.orderNumber} placeholder="Number" onChange={(e) => this.update({ type: 'orderNumber', value: e.target.value })} required />
                                </div>
                                <input className="btn blue" type="submit" value="Process Order" />
                            </form>
                            : null
                        }
                    </div>
                    <MyTable
                        className="user-table"
                        type="userDetails"
                        headers={userHeaders}
                        data={{ userCols }}
                    />
                    <MyTable
                        className="occupancy-table"
                        type="occupancyDetails"
                        headers={installHeaders}
                        data={{ installCols }}
                    />
                    <MyTable
                        className="office-table"
                        type="officeDetails"
                        titel="PM Office"
                        headers={officeHeaders}
                        data={{ officeCols }}
                    />
                    <div className="product-table-wrapper">
                        { _.map(productsAndParts, (orderDetail, productIndex) => {
                            if (orderDetail.product) {
                                const replacement = (orderDetail.selectedColorInfo.replacementManufacturerModelNumber) ? orderDetail.selectedColorInfo.replacementManufacturerModelNumber : false;
                                return <ProductTable
                                    key={`product${productIndex}`}
                                    type="processOrder"
                                    permissions={permissions}
                                    productIndex={productIndex}
                                    productHeaders={productHeaders}
                                    product={orderDetail.product}
                                    replacement={replacement}
                                    image={orderDetail.selectedColorInfo.imageUrl}
                                    manufacturerModelNumber={orderDetail.selectedColorInfo.manufacturerModelNumber}
                                    qty={(orderDetail.qty) ? orderDetail.qty : 1}
                                    installAppliance={orderDetail.installAppliance}
                                    removeOldAppliance={orderDetail.removeOldAppliance}
                                    price={orderDetail.ProductPrice.price}
                                    productsAndParts={productsAndParts}

                                    outOfStock={this.state.outOfStock}
                                    modelNumber={this.state.modelNumber}

                                    update={this.update}
                                    updateModelNumber={this.updateModelNumber}
                                    showOutOfStock={this.showOutOfStock}
                                />;
                            } else if (orderDetail.part) {
                                const replacement = (orderDetail.replacementModelNumber) ? orderDetail.replacementModelNumber : false;
                                return <PartTable
                                    key={`part${productIndex}`}
                                    type="processOrder"
                                    permissions={permissions}
                                    productIndex={productIndex}
                                    part={orderDetail.part}
                                    replacement={replacement}
                                    qty={(orderDetail.qty) ? orderDetail.qty : 1}
                                    price={orderDetail.PartPrice.price}
                                    productsAndParts={productsAndParts}

                                    outOfStock={this.state.outOfStock}
                                    modelNumber={this.state.modelNumber}

                                    update={this.update}
                                    updateModelNumber={this.updateModelNumber}
                                    showOutOfStock={this.showOutOfStock}
                                />;
                            }
                        })}
                    </div>
                    <div className="cost-section">
                        <h5 className="cost-header">Order Summary </h5>
                        <div className="cost-row">
                            <h5>Subtotal: <span>${ order.get('totalCost') }</span></h5>
                            <h5>Sales Tax: <span>${ order.get('salesTax') }</span></h5>
                            <h5>Total: <span>${ (parseFloat(order.get('totalCost')) + parseFloat(order.get('salesTax'))).toFixed(2) }</span></h5>
                        </div>
                    </div>
                </div>
            } else {
                orderPageData = <div>
                    <h2>Order Processed</h2>
                    <h4>Your order has been processed.</h4>
                    <h4>You can now close this tab.</h4>
                </div>;
            }
        }

        return (
            <div id="process-orders-page">
                <div className="container">
                    { orderPageData ? orderPageData : <Spinner/> }
                </div>
            </div>
        );
    }
}

const select = (state) => ({
    activeUser : state.activeUser.get('activeUser'),
    order      : state.orders.get('order'),
});

const actions = {
    ...orderActions,
    setActiveTab,
}

export default connect(select, actions, null, { withRef: true })(withRouter(withCookies(ProcessOrderPage)));
