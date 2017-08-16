import React                                                from 'react';
import _                                                    from 'lodash';
import { connect }                                          from 'react-redux';
import { withRouter }                                       from 'react-router';
import { withCookies }                                      from 'react-cookie';
import dateformat                                           from 'dateformat';
import assets                                               from 'libs/assets';

import { logout }                                           from 'ducks/active_user/actions';
import { getOrderById, approveOrder, getProducts, getOrder} from 'ducks/orders/actions';

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
    }

    componentWillUpdate(nextProps) {
        // if (nextProps.activeUser) {
        //     const path = (nextProps.activeUser.size > 0) ? `/order_details` : `/`;
        //     browserHistory.push(path);
        // }
        //
        // if (nextProps.isLogout) {
        //     this.props.logout();
        // }
    }

    handleAction({orderId}) {
        console.log('user action:', orderId);
        const { cookies } = this.props;
        const jwt = cookies.get('sibi-admin-jwt');

        this.props.approveOrder({ token: jwt.token, id: orderId });
    }

    render() {
        let productData = [];
        let orderData = [];
        let orderPageHeading = {};
        let orderStatus = '';
        let orderId = '';
        let tenantInfo = {};

        const { cookies } = this.props;
        const jwt = cookies.get('sibi-admin-jwt');

        let orderHeaders = {};

        const productHeaders = {
            productImage: 'Product',
            productDescription: '',
            address: 'Shipped to',
            qty: 'Qty',
            price: 'Cost'
        };

        if (this.props.order) {
            const order = this.props.order;

            orderId = order.id
            orderStatus = order.orderStatus
            orderPageHeading = {
                address: order.fundProperty.addressLineOne + " " + order.fundProperty.addressLineTwo + " " + order.fundProperty.addressLineThree + ", " + order.fundProperty.city + ", " + order.fundProperty.state + ", " + order.fundProperty.zipcode,
                PM: order.pmOffice.name,
                orderNumber: order.orderNumber
            };
            tenantInfo = {
                tenantName: order.tenantFirstName + " " + order.tenantLastName,
                tenantPhoneNumber: order.tenantPhone,
                tenantEmail: order.tenantEmail
            }

            orderHeaders = {
                orderStatus: 'Order Status',
                orderNumber: 'Order Number',
                deliveryDate: 'Delivery Date',
                installTime: 'Preferred Install Time',
                occupied: 'Occupancy',
                lockBoxCode: (order.lockBoxCode ? order.lockBoxCode : 'Tenant'),
                createdBy: 'Ordered By'
            };

            const cols = {};

            _.each(orderHeaders, (value, key) => {
                value = order[key]
                if (key === 'orderStatus') {
                    value = order.orderStatus;

                } else if (key === 'orderNumber'){
                    value = order.orderNumber;

                }else if (key === 'deliveryDate') {
                    value = order.installDate;
                    value = dateformat(order.installDate, "mm/dd/yy");

                } else if (key === 'installTime') {
                    value = order.applianceDeliveryTime ? order.applianceDeliveryTime : "Not Specified";

                } else if (key === 'occupied') {
                    value = (order['occupied'] === false) ? 'Unoccupied' : 'Occupied';

                } else if (key === 'lockBoxCode') {
                    value = order.lockBoxCode ? order.lockBoxCode : (order.tenantFirstName + " " + order.tenantLastName);

                } else if (key === 'createdBy') {
                    value = order.createdBy ? order.createdBy : 'Ordered By';
                }

                cols[key] = value;
            });

            orderData = {cols};


            productData = _.map(order.productsAndDestinations, (orderDetail) => {
                const detail = orderDetail.product

                const cols = {};

                _.each(productHeaders, (value,key) => {

                    value = detail[key];

                    if (key === 'productImage') {
                        value = detail.applianceColorsAndImages[0].imageUrl;

                    } else if (key === 'productDescription') {
                        value = [
                            detail.applianceDescription,
                            "SIBI Model Number: " + detail.sibiModelNumber,
                            "Manufacturer's Model Number" + detail.manufacturerModelNumber,
                            "Colors: detail.selectProductColor",
                            "Fuel Type: " + detail.applianceFuelType,
                            "Width: " + detail.applianceWidth,
                            "Height: " + detail.applianceHeight,
                            "Depth: " + detail.applianceDepth,
                            "Install Instructions: " + (detail.applianceInstallDescription ? detail.applianceInstallDescription : "Not Specified"),
                            "Remove Old Appliance: " + (detail.applianceRemovalDescription ? detail.applianceRemovalDescription : "Not Specified")
                        ]

                    } else if (key === 'address') {
                        value = [
                            order.fundProperty.addressLineOne + " " + order.fundProperty.addressLineTwo + " " + order.fundProperty.addressLineThree + ",",
                            order.fundProperty.city + ", " + order.fundProperty.state + ", " + order.fundProperty.zipcode
                        ]

                    } else if (key === 'qty') {
                        value = orderDetail.qty;

                    } else if (key === 'price') {
                        value = "$" + orderDetail.ProductPrice.price;
                    }

                    cols[key] = value;
                })
                return cols;
            });
        }

        return (
            <div id="orders-page" >
                <div className="details-header">
                    <div className="header-property">
                        <div className="property-address">{orderPageHeading.orderNumber}</div>
                        <div className="property-manager">{orderPageHeading.address} ● PM Office: {orderPageHeading.PM}</div>
                    </div>
                    {orderStatus == "Pending" ?
                        <div className="button-container">
                            <div className="button">Edit</div>
                            <div className="button" onClick={() => this.handleAction({orderId})}>Approve</div>
                        </div>
                        : <div className="button-container"></div>
                    }
                </div>;
                <MyTable
                    type="orderDetails"
                    headers={orderHeaders}
                    data={orderData}
                />
                <div className="box">
                    <div className="title">Tenant Info: </div>
                    <div className="body"> {tenantInfo.tenantName} ∙ {tenantInfo.tenantPhoneNumber} ∙ {tenantInfo.tenantEmail}</div>
                </div>
                <MyTable
                    type="productDetails"
                    headers={productHeaders}
                    data={productData}
                />
            </div>
        );
    }
}

const select = (state) => ({
    order          : state.orders.get('order'),
    orders         : state.orders.get('orders')
});

const actions = {
    logout,
    approveOrder,
    getOrderById,
    getOrder
}

export default connect(select, actions, null, { withRef: true })(withRouter(withCookies(OrderDetails)));
