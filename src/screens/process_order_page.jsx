import React                                from 'react';
import _                                    from 'lodash';
import { connect }                          from 'react-redux';
import { withCookies }                      from 'react-cookie';
import { withRouter }                       from 'react-router';
import { Link }                             from 'react-router-dom';
import moment                               from 'moment';
import DayPickerInput                       from 'react-day-picker/DayPickerInput';
import Loader                               from 'react-loader';

import assets                               from 'libs/assets';

import { getOrderById, processOrder, updateInstallDate, updateModelNumber }          from 'ducks/orders/actions';
import { triggerSpinner }                   from 'ducks/ui/actions';
import { setActiveTab }                     from 'ducks/header/actions';

import MyTable                              from 'components/my_table';
import ProductTable                         from 'components/product_table';
import PartTable                            from 'components/part_table';

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
        const { history, location, cookies } = this.props;
        const reOrder = /orderId=(.*)/;
        const jwt = cookies.get('sibi-ge-admin');

        const orderId = reOrder.exec(location.search);

        if (jwt) {
            if (orderId[1]) {
                this.props.triggerSpinner({ isOn: true });
                this.props.getOrderById({ id: orderId[1] });
            } else {
                alert('No orderId provided routing back to orders');
                (location.prevPath) ? history.goBack() : history.push(`/login`);
            }
        }

        this.props.setActiveTab('orders');
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
            const myOrder = order.toJS();

            //TABLE HEADERS
            const userHeaders = {
                orderedBy: 'Ordered By',
                phoneNumber: 'Phone Number',
                email: 'Email',
                hotshotDelivery: 'Hot Shot Delivery',
                hotshotInstallDate: '',
                hotshotCode: ''
            };

            const occupancyHeaders = (myOrder.occupied) ? {
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
                code: 'Model # or Code #',
                qty: 'Qty',
                price: 'Cost'
            };

            if (!myOrder.processedAt) {
                const permissions = activeUser.get('permissions').toJS();
                const user = myOrder.createdByUser;

                userHeaders['hotshotInstallDate'] = (myOrder.isApplianceHotShotDelivery) ? 'Hot Shot Install Date' : 'Install Date';
                userHeaders['hotshotCode'] = (myOrder.isApplianceHotShotDelivery) ? 'Hot Shot Code' : '';

                const orderProcessHeading = {
                    accountNumber: (myOrder.pmOffice) ? myOrder.pmOffice.applianceGEAccountNumber : myOrder.fund.applianceGEAccountNumber,
                    fund: myOrder.fund.name,
                    address: `${myOrder.fundProperty.addressLineOne} ${myOrder.fundProperty.addressLineTwo} ${myOrder.fundProperty.addressLineThree}, ${myOrder.fundProperty.city}, ${myOrder.fundProperty.state}, ${myOrder.fundProperty.zipcode}`
                };

                const productsAndDestinations = [];
                _.each(myOrder.productsAndDestinations, (product) => {
                    productsAndDestinations.push(product);

                    _.each(product.includedParts, (part) => {
                        productsAndDestinations.push({...part, productOrderId: product.productOrderId});
                    });
                });

                const productsAndParts = productsAndDestinations.concat(myOrder.partsAndDestinations);

                // ***************** USER TABLE DATA *****************
                const userCols = {};
                _.each(userHeaders, (value, key) => {
                    value = order[key]
                    if (key === 'orderedBy') {
                        value = user.firstName + ' ' + user.lastName;

                    } else if (key === 'phoneNumber'){
                        value = user.phoneNumber;

                    } else if (key === 'email') {
                        value = user.email;

                    } else if (key === 'hotshotDelivery') {
                        value = (myOrder.isApplianceHotShotDelivery) ? 'Yes' : 'No';

                    } else if (key === 'hotshotInstallDate') {
                        const formattedDay = moment(myOrder.installDate).format('MM/DD/YYYY');
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
                        value = (myOrder.isApplianceHotShotDelivery) ? <div>{ myOrder.applianceHotShotCode }</div> : null;
                    }
                    userCols[key] = value;
                });

                // ***************** OCCUPANCY TABLE DATA *****************
                const occupancyCols = {};
                _.each(occupancyHeaders, (value, key) => {
                    value = order[key]

                    if (key === 'occupancy') {
                        value = (!myOrder.occupied) ? 'Unoccupied' : 'Occupied';
                    }

                    if (myOrder.occupied) {
                        if (key === 'tenantName'){
                            value = `${myOrder.tenantFirstName} ${myOrder.tenantLastName}`;

                        } else if (key === 'phoneNumber') {
                            value = myOrder.tenantPhone;

                        } else if (key === 'email') {
                            value = myOrder.tenantEmail;
                        }
                    } else {
                        if ( key === 'lockBox') {
                            value = `${myOrder.lockBoxCode}`;
                        }
                    }

                    occupancyCols[key] = value;
                });

                // ***************** OFFICE TABLE DATA *****************
                const officeCols = {};
                _.each(officeHeaders, (value, key) => {
                    value = order[key]
                    if (key === 'pmOffice') {
                        value = (myOrder.pmOffice) ? myOrder.pmOffice.name : null;

                    } else if (key === 'phoneNumber'){
                        value = (myOrder.pmOffice) ? myOrder.pmOffice.phoneNumber : null;

                    } else if (key === 'email') {
                        value = (myOrder.pmOffice) ? myOrder.pmOffice.email : null;
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
                            <h5>Subtotal: <span>${ myOrder.totalCost }</span></h5>
                            <h5>Sales Tax: <span>${ myOrder.salesTax }</span></h5>
                            <h5>Total: <span>${ (parseFloat(myOrder.totalCost) + parseFloat(myOrder.salesTax)).toFixed(2) }</span></h5>
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

            this.props.triggerSpinner({ isOn: false });
        }

        return (
            <Loader loaded={spinner} >
                <div id="process-orders-page">
                    <div className="container">
                        { orderPageData }
                    </div>
                </div>
            </Loader>
        );
    }
}

const select = (state) => ({
    spinner        : state.ui.get('spinner'),
    activeUser     : state.activeUser.get('activeUser'),
    order          : state.orders.get('order'),
    processSuccess : state.orders.get('processSuccess'),
});

const actions = {
    triggerSpinner,
    getOrderById,
    processOrder,
    updateInstallDate,
    updateModelNumber,
    triggerSpinner,
    setActiveTab,
}

export default connect(select, actions, null, { withRef: true })(withRouter(withCookies(ProcessOrderPage)));
