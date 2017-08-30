import React                                                from 'react';
import _                                                    from 'lodash';
import { connect }                                          from 'react-redux';
import { withRouter }                                       from 'react-router';
import { withCookies }                                      from 'react-cookie';
import moment                                               from 'moment';
import DayPickerInput                                       from 'react-day-picker/DayPickerInput';
import assets                                               from 'libs/assets';

import { logout }                                           from 'ducks/active_user/actions';
import { getOrderById, approveOrder, updateOrder }          from 'ducks/orders/actions';

import MyTable                                              from 'components/my_table';

// ************************************************************************************
//                              TO LOAD THE PAGE
//
//    http://localhost:3000/process_order?orderId=92f07c8d-2c65-48a3-bd68-62f1629d12be
//
// ************************************************************************************

// you'll need to run `npm install` to update your node_modules with moment and react-day-picker

// TODO: need to get the date picker to render it's calendar modal when you click on the input box (lines: 192 - 198)
// TODO: need to update styling for products table (lines: 257 - 346)

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
        this.updateOrderDate = this.updateOrderDate.bind(this);
        this.updateOrderProducts = this.updateOrderProducts.bind(this);
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
            this.setState({ installDate: nextProps.order.toJS().installDate });
        }
    }

    update({ type, value }) {
        this.setState({ [type]: value });
    }

    updateOrderDate({ day }) {
        const { cookies } = this.props;
        const jwt = cookies.get('sibi-admin-jwt');

        const order = this.props.order;
        order['installDate'] = (!_.isEqual(day, order.installDate)) ? day : order.installDate;

        console.log('send updated order');
        // this.props.updateOrder({ token: jwt.token, order });
    }

    updateOrderProducts() {
        const { cookies } = this.props;
        const jwt = cookies.get('sibi-admin-jwt');

        const order = this.props.order;

        _.each(order.productsAndDestinations, (product, index) => {
            if (this.state.outOfStock === index) {
                // TODO: need to update this information to match the endpoint for modelnumer (currently not created)
                const product = {
                    productId: 'required',
                    selectedProductInfo: {
                        color: '',
                        imageURL: ''
                    }
                }
                order.productsAndDestinations[index] = this.state.modelNumber;
            }
        });

        console.log('send updated order');
        // this.props.updateOrder({ token: jwt.token, order });
    }

    showOutOfStock({ index }) {
        this.setState({ outOfStock: index });
    }

    processOrder() {
        console.log('process order click')
    }

    render() {
        let detailsHeaderSection,
            userData,
            occupancyData,
            officeData,
            productsColGroup,
            productData,
            orderTotalSection;

        //TABLE HEADERS
        const userHeaders = {
            orderedBy: 'Ordered By',
            phoneNumber: 'Phone Number',
            email: 'Email',
            hotshotDelivery: 'HotShot Delivery',
            hotshotInstallDate: 'Hotshot Install Date',
            hotshotCode: 'HotShot Code'
        };

        const occupancyHeaders = {
            occupancy: 'Occupancy',
            tenantName: 'Tenant Name',
            phoneNumber: 'Phone Number',
            email: 'Email'
        };

        const officeHeaders = {
            pmOffice: 'PM Office',
            phoneNumber: 'Phone Number',
            email: 'Email'
        };

        const productHeaders = {
            productImage: 'Product',
            productDescription: '',
            // model: 'Model # or Code #',
            // qty: 'Qty',
            // price: 'Cost'
        };

        if (this.props.order.size > 0) {

            const order = this.props.order.toJS();
            const user = order.createdByUser;

            const orderProcessHeading = {
                accountNumber: (order.pmOffice.applianceGEAccountNumber) ? order.pmOffice.applianceGEAccountNumber : order.fund.applianceGEAccountNumber,
                fund: order.fund.name,
                address: `${order.fundProperty.addressLineOne} ${order.fundProperty.addressLineTwo} ${order.fundProperty.addressLineThree}, ${order.fundProperty.city}, ${order.fundProperty.state}, ${order.fundProperty.zipcode}`
            };

            //PAGE HEADER
            detailsHeaderSection = <div className="page-header">
                <div className="order-info">
                    <h2>Account #: <span>{ orderProcessHeading.accountNumber }</span></h2>
                    <h2>Fund: <span>{ orderProcessHeading.fund }</span></h2>
                    <h4>Ship-to Address: <span>{ orderProcessHeading.address }</span></h4>
                </div>
                <form className="process-order" onSubmit={(e) => {e.preventDefault(); this.processOrder();}}>
                    <div className="input-container">
                        <label htmlFor="processed-by">Processed By</label>
                        <input name="processed-by" type="text" value={this.state.processedBy} placeholder="Jane Doe" onChange={(e) => this.update({ type: 'processedBy', value: e.target.value })} required />
                        <label htmlFor="ge-order-number">GE Order Number</label>
                        <input name="ge-order-number" type="text" value={this.state.orderNumber} placeholder="1234-5678" onChange={(e) => this.update({ type: 'orderNumber', value: e.target.value })} required />
                    </div>
                    <input className="btn submit-btn" type="submit" value="Process Order" />
                </form>
            </div>

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
                    value = 'Yes';

                } else if (key === 'hotshotInstallDate') {
                    const formattedDay = moment(order.installDate).format('MM/DD/YYYY');

                    value = <DayPickerInput
                        value={formattedDay}
                        onDayChange={(day) => this.updateOrderDate(day)}
                    />;

                } else if (key === 'hotshotCode') {
                    value = 'NEED HOTSHOT CODE';
                }
                userCols[key] = value;
            });
            userData = { userCols };

            // ***************** OCCUPANCY TABLE DATA *****************
            const occupancyCols = {};
            _.each(occupancyHeaders, (value, key) => {
                value = order[key]

                if (key === 'occupancy') {
                    value = (!order['occupied']) ? 'Unoccupied' : 'Occupied';
                }

                if (order['occupied']) {
                    if (key === 'tenantName'){
                        value = `${order.tenantFirstName} ${order.tenantLastName}`;

                    } else if (key === 'phoneNumber') {
                        value = order.tenantPhone;

                    } else if (key === 'email') {
                        value = order.tenantEmail;
                    }
                }

                occupancyCols[key] = value;
            });
            occupancyData = {occupancyCols};

            // ***************** OFFICE TABLE DATA *****************
            const officeCols = {};
            _.each(officeHeaders, (value, key) => {
                value = order[key]
                if (key === 'pmOffice') {
                    value = order.pmOffice.name;

                } else if (key === 'phoneNumber'){
                    value = order.pmOffice.phoneNumber;

                } else if (key === 'email') {
                    value = 'NEED PM OFFICE EMAIL';
                }
                officeCols[key] = value;
            });
            officeData = {officeCols};

            // ***************** PRODUCTS TABLE DATA *****************
            productData = _.map(order.productsAndDestinations, (orderDetail, productIndex) => {
                // this is the full row for 1 product (orderDetail.product)
                const detail = orderDetail.product;

                let productCols = {};
                _.each(productHeaders, (value, key) => {
                    if (key === 'productImage') {
                        productCols[key] = <img src={orderDetail.selectedColorInfo.imageUrl} alt="productImg" height="100" width="auto" />;

                    } else {
                        // start of table instead of table
                        const productDetailHeaders = {
                            productDescription: '',
                            model: 'Model # or Code #',
                            qty: 'Qty',
                            price: 'Cost'
                        };

                        let productDetails = _.map(productDetailHeaders, (header, key) => {
                            let cols = {};
                            _.each(['model', 'outOfStock', 'install', 'remove', 'disconnect'], (row) => {
                                let value;
                                switch(key) {
                                case 'productDescription':
                                    debugger
                                    if (row === 'model') {
                                        value = detail.applianceDescription;

                                    } else if (row === 'outOfStock') {
                                        value = (this.state.outOfStock !== productIndex) ? <div className="btn submit-btn" onClick={() => this.showOutOfStock({ productIndex })} >Out of Stock?</div> : <div className="btn cancel-btn" onClick={() => this.showOutOfStock({ productIndex: '' })} >Cancel</div>;

                                    } else if (row === 'install') {
                                        value = (this.state.outOfStock !== productIndex) ? `Install Description: ${ detail.applianceInstallDescription }` : <form onSubmit={(e) => {e.preventDefault(); this.updateOrderProducts();}}>
                                            <label htmlFor="model-num-replace" >Enter Model # to replace product</label>
                                            <input name="model-num-replace" value={this.state.modelNumber} placeholder="GTE18GT" onChange={(e) => this.update({ type: 'modelNumber', value: e.target.value })} required />
                                            <input className="btn submit-btn" type="submit" value="Replace" />
                                        </form>;

                                    } else if (row === 'remove') {
                                        value = (this.state.outOfStock !== productIndex) ? `Remove Appliance Description: ${ detail.applianceRemovalDescription }` : '';

                                    } else if (row === 'disconnect') {
                                        value = (this.state.outOfStock !== productIndex) ? `Disconnect Fee: ${ '*** missing ***' }` : '';
                                    }
                                    cols[key] = value;
                                    break;

                                case 'model':
                                    debugger
                                    if (row === 'model') {
                                        value = `Model #${ detail.sibiModelNumber }`;

                                    } else if (row === 'outOfStock') {
                                        value = ''

                                    } else if (row === 'install') {
                                        value = `Install Code #${ detail.applianceInstallCode }`;

                                    } else if (row === 'remove') {
                                        value = `Remove Code #${ detail.applianceRemovalDescription }`;

                                    } else if (row === 'disconnect') {
                                        value = `Disconnect Code #${ '*** missing ***' }`;
                                    }

                                    value = (this.state.outOfStock !== productIndex) ? value : '';
                                    cols[key] = value;
                                    break;

                                case 'qty':
                                    debugger
                                    value = (row === 'model' && this.state.outOfStock !== productIndex) ? orderDetail.qty : '';
                                    cols[key] = value;
                                    break;

                                case 'price':
                                    debugger
                                    if (row === 'model') {
                                        value = orderDetail.ProductPrice.price;

                                    } else if (row === 'outOfStock') {
                                        value = '';

                                    } else if (row === 'install') {
                                        value = detail.applianceInstallPrice;

                                    } else if (row === 'remove') {
                                        value = detail.applianceRemovalPrice;

                                    } else if (row === 'disconnect') {
                                        value = 'missing';
                                    }

                                    value = (this.state.outOfStock !== productIndex) ? value : '';
                                    cols[key] = value;
                                    break;
                                }
                            });
                            return cols;
                        });

                        productCols[key] = <MyTable
                            className="product-details-table"
                            type="productDetails"
                            headers={productDetailHeaders}
                            data={productDetails}
                        />;
                    }
                });

                return productCols;
            });

            orderTotalSection = <div className="cost-section">
                <h4>Order Summary </h4>
                <div className="cost-row" >
                    <div><h4>Sub Total:</h4> ${ order.totalCost }</div>
                    <div><h4>Sales Tax:</h4> ${ order.salesTax }</div>
                    <div><h4>Total:</h4> ${ parseFloat(order.totalCost) + parseFloat(order.salesTax) }</div>
                </div>
            </div>;
        }

        return (
            <div id="process-orders-page">
                <div className="container">
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
                    <MyTable
                        className="product-table"
                        type="products"
                        headers={productHeaders}
                        data={productData}
                    />
                    { orderTotalSection }
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
    updateOrder
}

export default connect(select, actions, null, { withRef: true })(withRouter(withCookies(ProcessOrderPage)));
