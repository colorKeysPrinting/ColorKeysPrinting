import React                                from 'react';
import _                                    from 'lodash';
import { connect }                          from 'react-redux';
import { withCookies }                      from 'react-cookie';
import { withRouter }                       from 'react-router';
import { Link }                             from 'react-router-dom';
import moment                               from 'moment';
import DayPickerInput                       from 'react-day-picker/DayPickerInput';

import assets                               from 'libs/assets';

import { clearOrder, getOrderById, processOrder, updateInstallDate, updateModelNumber }          from 'ducks/orders/actions';
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
            outOfStock: ''
        };

        this.update = this.update.bind(this);
        this.updateInstallDate = this.updateInstallDate.bind(this);
        this.updateModelNumber = this.updateModelNumber.bind(this);
        this.showOutOfStock = this.showOutOfStock.bind(this);
    }

    componentWillMount() {
        const { id } = this.props.match.params;
        const { history, location, cookies } = this.props;
        const jwt = cookies.get('sibi-ge-admin');

        if (jwt) {
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
            const order = nextProps.order.toJS();

            if (!order.processedAt) {
                this.setState({ installDate: nextProps.order.toJS().installDate });
            }
        }
    }

    update({ type, value }) {
        this.setState({ [type]: value });
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
        let orderPageData;

        if (order.size > 0) {

            //TABLE HEADERS
            const userHeaders = {
                orderedBy: 'Ordered By',
                phoneNumber: 'Phone Number',
                email: 'Email',
                hotshotDelivery: 'Hot Shot Delivery',
                hotshotInstallDate: '',
                hotshotCode: ''
            };

            const occupancyHeaders = (order.get('occupied')) ? {
                occupancy: 'Occupancy',
                tenantName: 'Tenant Name',
                phoneNumber: 'Phone Number',
                email: 'Email'
            } : {
                occupancy: 'Occupancy',
                lockBox: 'Lockbox Code'
            };

            const officeHeaders = {
                pmOffice: 'PM Office',
                phoneNumber: 'Phone Number',
                email: 'Email'
            };

            const productHeaders = {
                productDescription: '',
                code: 'Install Code',
                qty: 'Qty',
                price: 'Cost'
            };

            if (!order.get('processedAt')) {
                const permissions = activeUser.get('permissions').toJS();
                const user = order.get('createdByUser');

                userHeaders['hotshotInstallDate'] = (order.get('isApplianceHotShotDelivery')) ? 'Hot Shot Install Date' : 'Install Date';
                userHeaders['hotshotCode'] = (order.get('isApplianceHotShotDelivery')) ? 'Hot Shot Code' : '';

                const orderProcessHeading = {
                    accountNumber: (order.getIn(['pmOffice', 'applianceGEAccountNumber'])) ? order.getIn(['pmOffice', 'applianceGEAccountNumber']) : order.getIn(['fund','applianceGEAccountNumber']),
                    fund: order.getIn(['fund','name']),
                    address: `${order.getIn(['fundProperty', 'addressLineOne'])} ${order.getIn(['fundProperty','addressLineTwo'])} ${order.getIn(['fundProperty','addressLineThree'])}, ${order.getIn(['fundProperty','city'])}, ${order.getIn(['fundProperty','state'])}, ${order.getIn(['fundProperty','zipcode'])}`
                };

                const productsAndDestinations = [];
                _.each(order.get('productsAndDestinations').toJS(), (product) => {
                    productsAndDestinations.push(product);

                    _.each(product.includedParts, (part) => {
                        productsAndDestinations.push({...part, productOrderId: product.productOrderId});
                    });
                });

                const productsAndParts = productsAndDestinations.concat(order.get('partsAndDestinations'));

                // ***************** USER TABLE DATA *****************
                const userCols = {};
                _.each(userHeaders, (value, key) => {
                    value = order[key]
                    if (key === 'orderedBy') {
                        value = `${user.get('firstName')} ${user.get('lastName')}`;

                    } else if (key === 'phoneNumber'){
                        value = user.get('phoneNumber');

                    } else if (key === 'email') {
                        value = user.get('email');

                    } else if (key === 'hotshotDelivery') {
                        value = (order.get('isApplianceHotShotDelivery')) ? 'Yes' : 'No';

                    } else if (key === 'hotshotInstallDate') {
                        const formattedDay = moment(order.get('installDate')).format('MM/DD/YYYY');
                        if (permissions.updateAllOrders || permissions.updateFundOrders) {
                            value = <div className="no-limit">
                                <DayPickerInput
                                    value={formattedDay}
                                    onDayChange={(day) => this.updateInstallDate({ day })}
                                />
                            </div>;
                        } else {
                            value = <div className="no-limit">
                                <input type="text" value={formattedDay} disabled />
                            </div>;
                        }

                    } else if (key === 'hotshotCode') {
                        value = (order.get('isApplianceHotShotDelivery')) ? <div>{ order.get('applianceHotShotCode') }</div> : null;
                    }
                    userCols[key] = value;
                });

                // ***************** OCCUPANCY TABLE DATA *****************
                const occupancyCols = {};
                _.each(occupancyHeaders, (value, key) => {
                    value = order[key]

                    if (key === 'occupancy') {
                        value = (!order.get('occupied')) ? 'Unoccupied' : 'Occupied';
                    }

                    if (order.get('occupied')) {
                        if (key === 'tenantName'){
                            value = `${order.get('tenantFirstName')} ${order.get('tenantLastName')}`;

                        } else if (key === 'phoneNumber') {
                            value = order.get('tenantPhone');

                        } else if (key === 'email') {
                            value = order.get('tenantEmail');
                        }
                    } else {
                        if ( key === 'lockBox') {
                            value = `${order.get('lockBoxCode')}`;
                        }
                    }

                    occupancyCols[key] = value;
                });

                // ***************** OFFICE TABLE DATA *****************
                const officeCols = {};
                _.each(officeHeaders, (value, key) => {
                    value = order[key]
                    if (key === 'pmOffice') {
                        value = (order.get('pmOffice')) ? order.getIn(['pmOffice','name']) : null;

                    } else if (key === 'phoneNumber'){
                        value = (order.get('pmOffice')) ? order.get(['pmOffice','phoneNumber']) : null;

                    } else if (key === 'email') {
                        value = (order.get('pmOffice')) ? order.get(['pmOffice','email']) : null;
                    }
                    officeCols[key] = value;
                });

                // ***************** PRODUCTS TABLE DATA *****************
                orderPageData = <div>
                    <div className="page-header">
                        <div className="order-info">
                            <h2>GE Account #: <span>{ orderProcessHeading.accountNumber }</span></h2>
                            <h2>Fund: <span>{ orderProcessHeading.fund }</span></h2>
                            <h4>Ship-to Address: <span>{ orderProcessHeading.address }</span></h4>
                        </div>
                        {(permissions.viewAllApprovedAndProcessedOrders || permissions.processManufacturerOrders)
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
                        headers={occupancyHeaders}
                        data={{ occupancyCols }}
                    />
                    <MyTable
                        className="office-table"
                        type="officeDetails"
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
    activeUser     : state.activeUser.get('activeUser'),
    order          : state.orders.get('order'),
});

const actions = {
    clearOrder,
    getOrderById,
    processOrder,
    updateInstallDate,
    updateModelNumber,
    setActiveTab,
}

export default connect(select, actions, null, { withRef: true })(withRouter(withCookies(ProcessOrderPage)));
