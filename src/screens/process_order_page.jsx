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
            model: 'Model # or Code #',
            qty: 'Qty',
            price: 'Cost'
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
                    value = 'Yes';

                } else if (key === 'hotshotInstallDate') {
                    const formattedDay = moment(order.installDate).format('MM/DD/YYYY');

                    value = <div className="no-limit">
                        <DayPickerInput
                            value={formattedDay}
                            onDayChange={(day) => this.updateOrderDate(day)}
                        />
                    </div>;

                } else if (key === 'hotshotCode') {
                    value = <div>{'NEED HOTSHOT CODE'}</div>;
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
                        value = <div>{order.tenantPhone}</div>;

                    } else if (key === 'email') {
                        value = <div>{order.tenantEmail}</div>;
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
                    value = <div>{order.pmOffice.name}</div>;

                } else if (key === 'phoneNumber'){
                    value = <div>{order.pmOffice.phoneNumber}</div>;

                } else if (key === 'email') {
                    value = <div>{'NEED PM OFFICE EMAIL'}</div>;
                }
                officeCols[key] = value;
            });
            officeData = {officeCols};

            // ***************** PRODUCTS TABLE DATA *****************
            const productHeaderHTML = _.map(productHeaders, (header, key) => {
                if (key !== 'productImage') {
                    return <td key={`orderDetails-${key}`}>{ header }</td>
                }
            });

            productData = _.map(order.productsAndDestinations, (orderDetail, index) => {
                const detail = orderDetail.product;
                let productImage, productDetails;

                _.each(productHeaders, (value, key) => {
                    if (key === 'productImage') {
                        productImage = <table>
                            <thead className="head">
                                <tr className="table-row"><td>{ value }</td></tr>
                            </thead>
                            <tbody>
                                <tr className="table-row">
                                    <td>
                                        <div><img src={orderDetail.selectedColorInfo.imageUrl} alt="productImg" width="150" height="auto" /></div>
                                    </td>
                                </tr>
                            </tbody>
                        </table>;

                    } else {
                        const productTable = <table>
                            <colgroup>
                                <col span="1" style={{ width: '45%'}} />
                                <col span="1" style={{ width: '35%'}} />
                                <col span="1" style={{ width: '10%'}} />
                                <col span="1" style={{ width: '10%'}} />
                            </colgroup>
                            <thead className="head">
                                <tr className="table-row">
                                    { productHeaderHTML }
                                </tr>
                            </thead>
                            <tbody>
                                <tr className="table-row">
                                    <td className="table-cell-title">{ detail.applianceDescription }</td>
                                    <td className="table-cell-details">Model #{ detail.sibiModelNumber }</td>
                                    <td className="table-cell-details">{ orderDetail.qty }</td>
                                    <td className="table-cell-details">${ orderDetail.ProductPrice.price }</td>
                                </tr>
                                <tr className="table-row"><td className="table-cell-details"><div className="btn submit-btn" onClick={() => this.showOutOfStock({ index })} >Out of Stock?</div></td></tr>
                                <tr className="table-row">
                                    <td className="table-cell-details">Install Description: { detail.applianceInstallDescription }</td>
                                    <td className="table-cell-details">Install Code #{ detail.applianceInstallCode }</td>
                                    <td className="table-cell-details"></td>
                                    <td className="table-cell-details">${ detail.applianceInstallPrice }</td>
                                </tr>
                                <tr className="table-row">
                                    <td className="table-cell-details">Remove Appliance Description: { detail.applianceRemovalDescription }</td>
                                    <td className="table-cell-details">Remove Code #{ detail.applianceRemovalDescription }</td>
                                    <td className="table-cell-details"></td>
                                    <td className="table-cell-details">${ detail.applianceRemovalPrice }</td>
                                </tr>
                                <tr className="table-row">
                                    <td className="table-cell-details">Disconnect Fee: </td>
                                    <td className="table-cell-details">Disconnect Code #{  }</td>
                                    <td className="table-cell-details"></td>
                                    <td className="table-cell-details">${  }</td>
                                </tr>
                            </tbody>
                        </table>;

                        const outOfStock = <table>
                            <thead className="head">
                                <tr className="table-row">
                                    <td></td>
                                    <td></td>
                                </tr>
                            </thead>
                            <tbody>
                                <tr>
                                    <td className="table-cell-title">{ detail.applianceDescription }</td>
                                </tr>
                                <tr>
                                    <td className="btn cancel-btn" onClick={() => this.showOutOfStock({ index: '' })} >Cancel</td>
                                </tr>
                                <tr>
                                    <td>
                                        <form onSubmit={(e) => {e.preventDefault(); this.updateOrderProducts();}}>
                                            <label htmlFor="model-num-replace" >Enter Model # to replace product</label>
                                            <input name="model-num-replace" value={this.state.modelNumber} placeholder="GTE18GT" onChange={(e) => this.update({ type: 'modelNumber', value: e.target.value })} required />
                                            <input className="btn submit-btn" type="submit" value="Replace" />
                                        </form>
                                    </td>
                                </tr>
                            </tbody>
                        </table>;

                        productDetails = (this.state.outOfStock === index) ? outOfStock : productTable;
                    }
                });

                return (
                    <tr key={`orderDetails-${orderDetail.fundPropertyId}`} className="table-row">
                        <td>{ productImage }</td>
                        <td>{ productDetails }</td>
                    </tr>
                );
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
                    <table className="table" >
                        <colgroup>
                            <col span="1" style={{ width: '15%'}} />
                            <col span="1" style={{ width: '100%'}} />
                        </colgroup>
                        <tbody>
                            { productData }
                        </tbody>
                    </table>
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
