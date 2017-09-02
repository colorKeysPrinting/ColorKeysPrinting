import React                                                from 'react';
import _                                                    from 'lodash';
import { connect }                                          from 'react-redux';
import { withRouter }                                       from 'react-router';
import { Link }                                             from 'react-router-dom';
import moment                                               from 'moment';
import DayPickerInput                                       from 'react-day-picker/DayPickerInput';
import assets                                               from 'libs/assets';

import { getOrderById, processOrder, updateInstallDate, updateModelNumber }          from 'ducks/orders/actions';

import MyTable                                              from 'components/my_table';
import ProductTable                                         from 'components/product_table';
import PartTable                                            from 'components/part_table';

// ************************************************************************************
//                              TO LOAD THE PAGE
//
//    http://localhost:3000/process_order?orderId=beb36893-494f-4a09-ae7b-f4955ff5e641
//
// ************************************************************************************

// TODO: need to get the date picker to render it's calendar modal when you click on the input box (lines: 192 - 198)

class ProcessOrderPage extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            orderNumber: '',
            processedBy: '',
            modelNumber: '',
            outOfStock: '',
            productsAndParts: []
        };

        this.update = this.update.bind(this);
        this.updateInstallDate = this.updateInstallDate.bind(this);
        this.updateModelNumber = this.updateModelNumber.bind(this);
        this.showOutOfStock = this.showOutOfStock.bind(this);
        this.processOrder = this.processOrder.bind(this);
    }

    componentWillMount() {
        const reOrder = /orderId=(.*)/;

        const orderId = reOrder.exec(this.props.location.search)[1];

        if (orderId) {
            this.props.getOrderById({ id: orderId });
        }
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

                this.setState({ installDate: nextProps.order.toJS().installDate, productsAndParts });
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

    updateModelNumber() {
        let data;
        const order = this.props.order.toJS();
        const item = this.state.productsAndParts[this.state.outOfStock];

        if (item.product) {
            // products
            data = { productOrderId: item.productOrderId, modelNumber: this.state.modelNumber };

        } else if (item.part) {
            if(!item.productOrderId) {
                // standalone parts
                data = { partOrderId: item.partOrderId, modelNumber: this.state.modelNumber };

            } else {
                // included parts
                data = { productOrderId: item.productOrderId, partId: item.partId, modelNumber: this.state.modelNumber };
            }
        }

        this.props.updateModelNumber({ id: order.id, data });
        this.setState({ outOfStock: '', modelNumber: '' });
    }

    showOutOfStock({ productIndex }) {
        this.setState({ outOfStock: productIndex });
    }

    processOrder() {
        const order = this.props.order.toJS();

        this.props.processOrder({ id: order.id, processedByName: this.state.processedBy, geOrderNumber: this.state.orderNumber });
    }

    render() {
        let orderPageData;

        if (this.props.order.size > 0) {
            const order = this.props.order.toJS();

            //TABLE HEADERS
            const userHeaders = {
                orderedBy: 'Ordered By',
                phoneNumber: 'Phone Number',
                email: 'Email',
                hotshotDelivery: 'HotShot Delivery',
                hotshotInstallDate: '',
                hotshotCode: ''
            };

            const occupancyHeaders = (order.occupied) ? {
                occupancy: 'Occupancy',
                tenantName: 'Tenant Name',
                phoneNumber: 'Phone Number',
                email: 'Email'
            } : {
                occupancy: 'Occupancy',
                lockBox: 'Lock Box Code'
            };

            const officeHeaders = {
                pmOffice: 'PM Office',
                phoneNumber: 'Phone Number',
                email: 'Email'
            };

            if (!order.processedAt) {
                const user = order.createdByUser;

                userHeaders['hotshotInstallDate'] = (order.isApplianceHotShotDelivery) ? 'HotShot Install Date' : 'Install Date';
                userHeaders['hotshotCode'] = (order.isApplianceHotShotDelivery) ? 'HotShot Code' : '';

                const orderProcessHeading = {
                    accountNumber: (order.pmOffice.applianceGEAccountNumber) ? order.pmOffice.applianceGEAccountNumber : order.fund.applianceGEAccountNumber,
                    fund: order.fund.name,
                    address: `${order.fundProperty.addressLineOne} ${order.fundProperty.addressLineTwo} ${order.fundProperty.addressLineThree}, ${order.fundProperty.city}, ${order.fundProperty.state}, ${order.fundProperty.zipcode}`
                };

                //PAGE HEADER
                const detailsHeaderSection = <div className="page-header">
                    <div className="order-info">
                        <h2>Account #: <span>{ orderProcessHeading.accountNumber }</span></h2>
                        <h2>Fund: <span>{ orderProcessHeading.fund }</span></h2>
                        <h4>Ship-to Address: <span>{ orderProcessHeading.address }</span></h4>
                    </div>
                    <form className="process-order" onSubmit={(e) => {e.preventDefault(); this.processOrder();}}>
                        <div className="input-container">
                            <label htmlFor="processed-by">Processed By</label>
                            <input name="processed-by" type="text" value={this.state.processedBy} placeholder="Jane Doe" onChange={(e) => this.update({ type: 'processedBy', value: e.target.value })} required />
                        </div>
                        <div className="input-container">
                            <label htmlFor="ge-order-number">GE Order Number</label>
                            <input name="ge-order-number" type="text" value={this.state.orderNumber} placeholder="1234-5678" onChange={(e) => this.update({ type: 'orderNumber', value: e.target.value })} required />
                        </div>
                        <input className="btn blue" type="submit" value="Process Order" />
                    </form>
                </div>

                // ***************** USER TABLE DATA *****************
                const userCols = {};
                _.each(userHeaders, (value, key) => {
                    value = order[key]
                    if (key === 'orderedBy') {
                        value = user.firstName + ' ' + user.lastName;

                    } else if (key === 'phoneNumber'){
                        value = <div>{user.phoneNumber}</div>;

                    } else if (key === 'email') {
                        value = user.email;

                    } else if (key === 'hotshotDelivery') {
                        value = (order.isApplianceHotShotDelivery) ? 'Yes' : 'No';

                    } else if (key === 'hotshotInstallDate') {
                        const formattedDay = moment(order.installDate).format('MM/DD/YYYY');

                        value = <div className="no-limit">
                            <DayPickerInput
                                value={formattedDay}
                                onDayChange={(day) => this.updateInstallDate({ day })}
                            />
                        </div>;

                    } else if (key === 'hotshotCode') {
                        value = (order.isApplianceHotShotDelivery) ? <div>{ order.applianceHotShotCode }</div> : null;
                    }
                    userCols[key] = value;
                });
                const userData = { userCols };

                // ***************** OCCUPANCY TABLE DATA *****************
                const occupancyCols = {};
                _.each(occupancyHeaders, (value, key) => {
                    value = order[key]

                    if (key === 'occupancy') {
                        value = (!order.occupied) ? 'Unoccupied' : 'Occupied';
                    }

                    if (order.occupied) {
                        if (key === 'tenantName'){
                            value = `${order.tenantFirstName} ${order.tenantLastName}`;

                        } else if (key === 'phoneNumber') {
                            value = <div>{order.tenantPhone}</div>;

                        } else if (key === 'email') {
                            value = <div>{order.tenantEmail}</div>;
                        }
                    } else {
                        if ( key === 'lockBox') {
                            value = `${order.lockBoxCode}`;
                        }
                    }

                    occupancyCols[key] = value;
                });
                const occupancyData = {occupancyCols};

                // ***************** OFFICE TABLE DATA *****************
                const officeCols = {};
                _.each(officeHeaders, (value, key) => {
                    value = order[key]
                    if (key === 'pmOffice') {
                        value = <div>{ order.pmOffice.name }</div>;

                    } else if (key === 'phoneNumber'){
                        value = <div>{ order.pmOffice.phoneNumber }</div>;

                    } else if (key === 'email') {
                        value = <div>{ order.pmOffice.email }</div>;
                    }
                    officeCols[key] = value;
                });
                const officeData = {officeCols};

                // ***************** PRODUCTS TABLE DATA *****************
                const productHeaders = {
                    productDescription: '',
                    code: 'Model # or Code #',
                    qty: 'Qty',
                    price: 'Cost'
                };

                const productData = _.map(this.state.productsAndParts, (orderDetail, productIndex) => {
                    if (orderDetail.product) {
                        const replacement = (orderDetail.selectedColorInfo.replacementManufacturerModelNumber) ? orderDetail.selectedColorInfo.replacementManufacturerModelNumber : false;
                        return <ProductTable
                            key={`product${productIndex}`}
                            type="processOrder"
                            productIndex={productIndex}
                            productHeaders={productHeaders}
                            product={orderDetail.product}
                            replacement={replacement}
                            image={orderDetail.selectedColorInfo.imageUrl}
                            qty={(orderDetail.qty) ? orderDetail.qty : 1}
                            price={orderDetail.ProductPrice.price}

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
                            productIndex={productIndex}
                            part={orderDetail.part}
                            replacement={replacement}
                            qty={(orderDetail.qty) ? orderDetail.qty : 1}
                            price={orderDetail.PartPrice.price}

                            outOfStock={this.state.outOfStock}
                            modelNumber={this.state.modelNumber}

                            update={this.update}
                            updateModelNumber={this.updateModelNumber}
                            showOutOfStock={this.showOutOfStock}
                        />;
                    }
                });

                const orderTotalSection = <div className="cost-section">
                    <h5 className="cost-header">Order Summary </h5>
                    <div className="cost-row">
                        <h5>Sub Total: <span>${ order.totalCost }</span></h5>
                        <h5>Sales Tax: <span>${ order.salesTax }</span></h5>
                        <h5>Total: <span>${ (parseFloat(order.totalCost) + parseFloat(order.salesTax)).toFixed(2) }</span></h5>
                    </div>
                </div>;

                orderPageData = <div>
                    { detailsHeaderSection }
                    <MyTable
                        className="user-table"
                        type="userDetails"
                        headers={userHeaders}
                        data={userData}
                    />
                    <MyTable
                        className="occupancy-table"
                        type="occupancyDetails"
                        headers={occupancyHeaders}
                        data={occupancyData}
                    />
                    <MyTable
                        className="office-table"
                        type="officeDetails"
                        headers={officeHeaders}
                        data={officeData}
                    />
                    <div className="product-table-wrapper">
                        { productData }
                    </div>
                    { orderTotalSection }
                </div>
            } else {
                orderPageData = <div>
                    <h1>Order Processed</h1>
                    <h4>Your order has been processed.</h4>
                </div>;
            }
        }

        return (
            <div id="process-orders-page">
                <div className="container">
                    { orderPageData }
                </div>
            </div>
        );
    }
}

const select = (state) => ({
    order           : state.orders.get('order'),
    processSuccess  : state.orders.get('processSuccess')
});

const actions = {
    getOrderById,
    processOrder,
    updateInstallDate,
    updateModelNumber
}

export default connect(select, actions, null, { withRef: true })(withRouter(ProcessOrderPage));
