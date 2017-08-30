import React                                                from 'react';
import _                                                    from 'lodash';
import { connect }                                          from 'react-redux';
import { withRouter }                                       from 'react-router';
import { withCookies }                                      from 'react-cookie';
import dateformat                                           from 'dateformat';
import assets                                               from 'libs/assets';

import { logout }                                           from 'ducks/active_user/actions';
import { getOrderById, approveOrder, getProducts, getOrder } from 'ducks/orders/actions';
import { getUsers }                                         from 'ducks/users/actions';

import MyTable                                              from 'components/my_table';

class ProcessOrderPage extends React.Component {
    constructor(props) {
        super(props);

        this.state = { orderNumber: '', processedBy: '' };

        this.update = this.update.bind(this);
        this.processOrder = this.processOrder.bind(this);
    }

    componentWillMount() {
        const reOrder = /orderId=(.*)/;

        // const orderId = reOrder.exec(this.props.location.search)[1];

        // if (orderId) {
        //     this.props.getOrderById({ id: orderId });
        // } 
        this.props.getOrderById({ id: '3206bf49-9fc6-437e-b867-063ada21f005' });

    }

    update({ type, value}) {
        this.setState({ [type]: value });
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

        const orderId = '3206bf49-9fc6-437e-b867-063ada21f005';
        const { cookies } = this.props;
        const jwt = cookies.get('sibi-admin-jwt');

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
                address: `${order.fundProperty.addressLineOne} ${order.fundProperty.addressLineTwo} ${order.fundProperty.addressLineThree}, ${order.fundProperty.city}, ${order.fundProperty.state}, ${order.fundProperty.zipcode}`,
                fund: 'TODO: get fund name',
                accountNumber: (order.pmOffice.applianceGEAccountNumber) ? order.pmOffice.applianceGEAccountNumber : 'TODO: get fund account number'
            };

            //PAGE HEADER
            detailsHeaderSection = <div className="page-header">
                <div className="order-info">
                    <h2>Account #: <span>{ orderProcessHeading.accountNumber }</span></h2>
                    <h2>Fund: <span>{ orderProcessHeading.fund.name }</span></h2>
                    <h4>Ship-to Address: <span>{ orderProcessHeading.address }</span></h4>
                </div>
                <form className="process-order" onSubmit={this.processOrder}>
                    <div className="input-container">
                        <label htmlFor="processed-by">GE Order Number</label>
                        <input name="ge-order-number" type="text" value={this.state.orderNumber} placeholder="Jane Doe" onChange={(e) => this.update({ type: 'orderNumber', value: e.target.value })} required />

                        {/*}
                        <label htmlFor="processed-by">Processed By</label>
                        <input name="processed-by" type="text" value={this.state.processedBy} placeholder="Jane Doe" onChange={(e) => this.update({ type: 'processedBy', value: e.target.value })} required />
                        */}
                    </div>
                    <button className="blue">Process Order</button>
                </form>
            </div>

            // detailsHeaderSection = <div className="details-header">
            //     <div className="header-property pure-u-2-3">
            //         <div>
            //             <h2>Account #:</h2>
            //             <div>{ orderProcessHeading.accountNumber }</div>
            //         </div>
            //         <div>
            //             <h2>Fund:</h2>
            //             <div>{ orderProcessHeading.fund.name }</div>
            //         </div>
            //         <div>
            //             <h3>Ship-to Address:</h3>
            //             <div>{ orderProcessHeading.address }</div>
            //         </div>
            //     </div>
            //     <div className="button-container pure-u-1-3">
            //         <form onSubmit={this.processOrder}>
            //             <div>
            //                 <label htmlFor="processed-by">Processed By</label>
            //                 <input name="processed-by" type="text" value={this.state.processedBy} placeholder="Jane Doe" onChange={(e) => this.update({ type: 'processedBy', value: e.target.value })} required />
            //             </div>
            //             <div>
            //                 <label htmlFor="ge-order-number">GE Order Number</label>
            //                 <input name="ge-order-number" type="number" value={this.state.orderNumber} placeholder="Jane Doe" onChange={(e) => this.update({ type: 'orderNumber', value: e.target.value })} required />
            //             </div>

            //             <input className = "btn submit-btn fill" type="submit" value="Process Order" />
            //         </form>
            //     </div>
            // </div>;

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
                    value = dateformat(order.installDate, 'mm/dd/yy');

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
                    value = (order['occupied'] === false) ? 'Unoccupied' : 'Occupied';

                } else if (key === 'tenantName'){
                    value = order.tenantFirstName + ' ' + order.tenantLastName;

                } else if (key === 'phoneNumber') {
                    value = order.tenantPhone;

                } else if (key === 'email') {
                    value = order.tenantEmail;
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
            const productHeaderHTML = _.map(productHeaders, (header, key) => {
                if (key !== 'productImage') {
                    return <td>{ header }</td>
                }
            });

            productData = _.map(order.productsAndDestinations, (orderDetail) => {
                const detail = orderDetail.product;
                let productImage, productDetails;

                _.each(productHeaders, (value, key) => {
                    if (key === 'productImage') {
                        productImage = <table>
                            <thead className="head">
                                <tr className="table-row"><td>{ value }</td></tr>
                            </thead>
                            <tbody>
                                <tr className="table-row"><td><div><img src={detail.applianceColorsAndImages[0].imageUrl} alt="productImg" width="200" height="auto" /></div></td></tr>
                            </tbody>
                        </table>;

                    } else {
                        productDetails = <table>
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
                                <tr className="table-row"><td className="table-cell-details"><div className="btn submit-btn" onClick={() => console.log('change product model #')}>Out of Stock?</div></td></tr>
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
                    }
                })
                return (
                    <tr key={`orderDetails${orderDetail.fundPropertyId}`} className="table-row">
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
                            <col span="1" style={{ width: '10%'}} />
                            <col span="1" style={{ width: '90%'}} />
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
    order           : state.orders.get('order'),
    orders          : state.orders.get('orders'),
    users           : state.users.get('users'),
});

const actions = {
    logout,
    approveOrder,
    getOrderById,
    getOrder,
    getUsers
}

export default connect(select, actions, null, { withRef: true })(withRouter(withCookies(ProcessOrderPage)));
