import React                                                from 'react';
import _                                                    from 'lodash';
import { connect }                                          from 'react-redux';
import { withRouter }                                       from 'react-router';
import { withCookies }                                      from 'react-cookie';
import dateformat                                           from 'dateformat';
import assets                                               from 'libs/assets';

import { logout }                                           from 'ducks/active_user/actions';
import { getOrderById, approveOrder, getProducts, getOrder} from 'ducks/orders/actions';
import { setActiveTab }                                     from 'ducks/header/actions';

import MyTable                                              from 'components/my_table';

class OrderDetails extends React.Component {
    constructor(props) {
        super(props);

        this.handleAction = this.handleAction.bind(this);
    }

    componentWillMount() {
        const { cookies } = this.props;
        const jwt = cookies.get('sibi-admin-jwt');
        const orderId = this.props.location.state.id;

        if (jwt && orderId) {
            this.props.getOrderById({token: jwt.token, id: orderId});
        } else {
            console.log('TODO: trigger logout function *** no JWT ***');
        }

        this.props.setActiveTab('orders');
    }

    componentWillUpdate(nextProps) {

        if (nextProps.isLogout) {
            this.props.logout();
        }
    }

    handleAction({orderId}) {
        console.log('user action:', orderId);
        const { cookies } = this.props;
        const jwt = cookies.get('sibi-admin-jwt');

        this.props.approveOrder({ token: jwt.token, id: orderId });
    }

    render() {
        let productData, orderData, tenantInfoSection, detailsHeaderSection;

        const { cookies } = this.props;
        const jwt = cookies.get('sibi-admin-jwt');

        const productHeaders = {
            productImage: 'Product',
            productDescription: '',
            address: 'Shipped to',
            qty: 'Qty',
            price: 'Cost'
        };

        const orderHeaders = {
            orderStatus: 'Order Status',
            orderNumber: 'Order Number',
            deliveryDate: 'Delivery Date',
            installTime: 'Preferred Install Time',
            occupied: 'Occupancy',
            lockBoxCode: '',
            createdBy: 'Ordered By'
        };

        if (this.props.order.size > 0) {
            const order = this.props.order.toJS();

            const orderId = order.id
            const orderStatus = order.orderStatus
            const orderPageHeading = {
                address: `${order.fundProperty.addressLineOne} ${order.fundProperty.addressLineTwo} ${order.fundProperty.addressLineThree}, ${order.fundProperty.city}, ${order.fundProperty.state}, ${order.fundProperty.zipcode}`,
                PM: order.pmOffice.name,
                orderNumber: order.orderNumber
            };
            const tenantInfo = {
                tenantName: `${order.tenantFirstName} ${order.tenantLastName}`,
                tenantPhoneNumber: order.tenantPhone,
                tenantEmail: order.tenantEmail
            }

            orderHeaders['lockBoxCode'] = (order.lockBoxCode) ? order.lockBoxCode : 'Tenant';

            const cols = {};
            _.each(orderHeaders, (value, key) => {
                value = order[key]
                if (key === 'orderStatus') {
                    value = order.orderStatus;

                } else if (key === 'orderNumber'){
                    value = order.orderNumber;

                }else if (key === 'deliveryDate') {
                    value = dateformat(order.installDate, 'mm/dd/yy');

                } else if (key === 'installTime') {
                    value = order.applianceDeliveryTime ? order.applianceDeliveryTime : 'Not Specified';

                } else if (key === 'occupied') {
                    value = (order['occupied'] === false) ? 'Unoccupied' : 'Occupied';

                } else if (key === 'lockBoxCode') {
                    value = (order.lockBoxCode) ? order.lockBoxCode : `${order.tenantFirstName} ${order.tenantLastName}`;

                } else if (key === 'createdBy') {
                    value = order.createdBy ? order.createdBy : 'Ordered By';
                }

                cols[key] = value;
            });

            orderData = {cols};

            productData = _.map(order.productsAndDestinations, (orderDetail) => {
                const detail = orderDetail.product;

                const cols = {};
                _.each(productHeaders, (value, key) => {

                    value = detail[key];

                    if (key === 'productImage') {
                        value = <img className="productImage" src={detail.applianceColorsAndImages[0].imageUrl} alt="productImg" />;

                    } else if (key === 'productDescription') {
                        value = <div className="no-limit">
                            <div className="table-cell-title">{ detail.applianceDescription }</div>
                            <div className="table-cell-details">{ `SIBI Model Number: ${detail.sibiModelNumber}` }</div>
                            <div className="table-cell-details">{ `Manufacturer's Model Number ${detail.manufacturerModelNumber}` }</div>
                            <div className="table-cell-details">{ `Colors: ${detail.selectProductColor}` }</div>
                            <div className="table-cell-details">{ `Fuel Type: ${detail.applianceFuelType}` }</div>
                            <div className="table-cell-details">{ `Width: ${detail.applianceWidth}` }</div>
                            <div className="table-cell-details">{ `Height: ${detail.applianceHeight}` }</div>
                            <div className="table-cell-details">{ `Depth: ${detail.applianceDepth}` }</div>
                            <div className="table-cell-details">{ `Install Instructions: ${(detail.applianceInstallDescription) ? detail.applianceInstallDescription : 'Not Specified'}` }</div>
                            <div className="table-cell-details">{ `Remove Old Appliance: ${(detail.applianceRemovalDescription) ? detail.applianceRemovalDescription : 'Not Specified'}` }</div>
                        </div>;

                    } else if (key === 'address') {
                        value = <div className="no-limit">
                            <div>{`${order.fundProperty.addressLineOne} ${order.fundProperty.addressLineTwo} ${order.fundProperty.addressLineThree},`}</div>
                            <div>{`${order.fundProperty.city}, ${order.fundProperty.state}, ${order.fundProperty.zipcode}`}</div>
                        </div>;

                    } else if (key === 'qty') {
                        value = orderDetail.qty;

                    } else if (key === 'price') {
                        value = '$' + orderDetail.ProductPrice.price;
                    }

                    cols[key] = value;
                })
                return cols;
            });

            const buttonSection = (orderStatus == 'Pending') ? <div className="button-container pure-u-1-3">
                    <div className="btn submit-btn">Edit</div>
                    <div className="btn submit-btn" onClick={() => this.handleAction({orderId})}>Approve</div>
                </div>
                : <div className="button-container pure-u-1-3"></div>;

            detailsHeaderSection = <div className="details-header">
                  <div className="header-property pure-u-2-3">
                      <h2 className="property-address">{orderPageHeading.orderNumber}</h2>
                      <div className="property-manager">{orderPageHeading.address} ● PM Office: {orderPageHeading.PM}</div>
                  </div>
                { buttonSection }
            </div>;

            tenantInfoSection = <div id="admin-table">
                <table className="table">
                    <thead className="head">
                        <tr>
                            <td><div className="table-header">Tenant Info: </div></td>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td><div> {tenantInfo.tenantName} ∙ {tenantInfo.tenantPhoneNumber} ∙ {tenantInfo.tenantEmail}</div></td>
                        </tr>
                    </tbody>
                </table>
            </div>;
        }

        return (
            <div id="orders-page" >
                <div className="container">

                    { detailsHeaderSection }
                    <MyTable
                        type="orderDetails"
                        headers={orderHeaders}
                        data={orderData}
                    />
                    { tenantInfoSection }
                    <MyTable
                        type="productDetails"
                        headers={productHeaders}
                        data={productData}
                    />
                </div>
            </div>
        );
    }
}

const select = (state) => ({
    isLogout       : state.jwt.get('isLogout'),
    order          : state.orders.get('order'),
    orders         : state.orders.get('orders')
});

const actions = {
    logout,
    approveOrder,
    getOrderById,
    getOrder,
    setActiveTab
}

export default connect(select, actions, null, { withRef: true })(withRouter(withCookies(OrderDetails)));
