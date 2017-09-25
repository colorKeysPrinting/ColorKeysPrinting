import React                                                from 'react';
import _                                                    from 'lodash';
import { connect }                                          from 'react-redux';
import { withRouter }                                       from 'react-router';
import { Link }                                             from 'react-router-dom';
import moment                                               from 'moment';
import DayPickerInput                                       from 'react-day-picker/DayPickerInput';
import Loader                                               from 'react-loader';
import assets                                               from 'libs/assets';

import { getOrderById, processOrder, updateInstallDate, updateModelNumber }          from 'ducks/orders/actions';
import { triggerSpinner }                                   from 'ducks/ui/actions';

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
        const { location } = this.props;
        const reOrder = /orderId=(.*)/;

        const orderId = reOrder.exec(location.search)[1];

        if (orderId) {
            this.props.triggerSpinner({ isOn: true });
            this.props.getOrderById({ id: orderId });
        } else {
            alert('No orderId provided routing back to orders');
            this.props.history.push(`/login`);
        }
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
        let data;
        const order = this.props.order.toJS();
        const item = productsAndParts[this.state.outOfStock];

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
        const { order, spinner } = this.props;
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

                // const productsAndParts = productsAndDestinations.concat(order.partsAndDestinations);
                const productsAndParts = productsAndDestinations;

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

                        value = <div className="no-limit">
                            <DayPickerInput
                                value={formattedDay}
                                onDayChange={(day) => this.updateInstallDate({ day })}
                            />
                        </div>;

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
                        value = (myOrder.fund.pmOffices[0]) ? myOrder.fund.pmOffices[0].name : null;

                    } else if (key === 'phoneNumber'){
                        value = (myOrder.fund.pmOffices[0]) ? myOrder.fund.pmOffices[0].phoneNumber : null;

                    } else if (key === 'email') {
                        value = (myOrder.fund.pmOffices[0]) ? myOrder.fund.pmOffices[0].email : null;
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
                        <form className="process-order" onSubmit={(e) => {e.preventDefault(); this.processOrder();}}>
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
                        data={{occupancyCols}}
                    />
                    <MyTable
                        className="office-table"
                        type="officeDetails"
                        headers={officeHeaders}
                        data={{officeCols}}
                    />
                    <div className="product-table-wrapper">
                        { _.map(productsAndParts, (orderDetail, productIndex) => {
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
    order           : state.orders.get('order'),
    processSuccess  : state.orders.get('processSuccess'),
    spinner         : state.ui.get('spinner')
});

const actions = {
    getOrderById,
    processOrder,
    updateInstallDate,
    updateModelNumber,
    triggerSpinner
}

export default connect(select, actions, null, { withRef: true })(withRouter(ProcessOrderPage));
