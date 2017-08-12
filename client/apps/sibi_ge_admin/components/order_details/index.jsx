import React                    from 'react';
import _                        from 'lodash';
import { connect }              from 'react-redux';
import { withRouter }           from 'react-router';
import { withCookies }          from 'react-cookie';
import dateformat               from 'dateformat';
import assets                   from '../../libs/assets';

import { showOverlay }          from '../../actions/application';
import { logout }               from '../../actions/header';
import { getOrderById, approveOrder, getProducts, getOrder}          from '../../actions/products';

import MyTable                  from '../common/my_table';

// function Header() {
//
//   return (
//     <div>
//
//     </div>
//   )
// }


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
        if (nextProps.activeUser) {
            const path = (nextProps.activeUser.size > 0) ? `/order_details` : `/`;
            browserHistory.push(path);
        }

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
        function Header() {
          return(
            <div className="details-header">
              <div className="header-property">
                <div className="property-address">{orderDetailsPageHeading.orderNumber}</div>
                <div className="property-manager">{orderDetailsPageHeading.address} ● PM Office: {orderDetailsPageHeading.PM}</div>
              </div>
              {orderStatus == "Pending" ?
                <div className="button-container">
                  <div className="button">Edit</div>
                  <div className="button" onClick={() => this.handleAction({orderId})}>Approve</div>
                </div>
              : <div className="button-container"></div>
              }
            </div>

          )
        }

        function TenantInfo() {
          return (
            <div className="box">
              <div className="title">Tenant Info: </div>
              <div className="body"> {tenantInfo.tenantName ? tenantInfo.tenantName : "...coming soon"} ∙ {tenantInfo.tenantPhoneNumber ? tenantInfo.tenantPhoneNumber : "...coming soon"} ∙ {tenantInfo.tenantEmail ? tenantInfo.tenantEmail : "...coming soon"}</div>
            </div>
          )
        }

        let productData = [];
        let orderData = [];
        let orderDetailsPageHeading = {};
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

        if (this.props.order.size > 0 && this.props.orders.size) {
          // ORDERDETAILS WILL BE GENERATED FROM THE GETORDERBYID FUNCTION
          // ORDER WILL BE GENERATED FROM THE GETORDER FUNCTION

          const orderDetails = this.props.order.toJS();
          const order = _.find(this.props.orders.toJS(), ['id', this.props.location.state.id])
          console.log('ORDER DETAILS', orderDetails, 'ORDER', order);

          orderId = order.id
          orderStatus = orderDetails.orderStatus
          orderDetailsPageHeading = {
            address: order.fundProperty.addressLineOne + " " + order.fundProperty.addressLineTwo + " " + order.fundProperty.addressLineThree + ", " + order.fundProperty.city + ", " + order.fundProperty.state + ", " + order.fundProperty.zipcode,
            PM: "...order.fundLocation",
            orderNumber: orderDetails.orderNumber
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
              lockBoxCode: (order.lockBoxCode ? 'Lockbox Code' : 'Tenant'),
              orderedBy: 'Ordered By'
          };

          const cols = {};

          _.each(orderHeaders, (value, key) => {
              value = orderDetails[key]
              if (key === 'orderStatus') {
                value = orderDetails.orderStatus;

              } else if (key === 'orderNumber'){
                value = orderDetails.orderNumber;

              }else if (key === 'deliveryDate') {
                value = orderDetails.installDate;
                value = dateformat(orderDetails.installDate, "mm/dd/yy");

              } else if (key === 'installTime') {
                value = orderDetails.applianceDeliveryTime ? order.applianceDeliveryTime : "Not Specified";

              } else if (key === 'occupied') {
                value = (order['occupied'] === false) ? 'Unoccupied' : 'Occupied';

              } else if (key === 'lockBoxCode') {
                value = order.lockBoxCode ? order.lockBoxCode : '...Coming Soon';

              } else if (key === 'orderedBy') {
                value = '...order.orderedBy' ;
              }

              cols[key] = value;
          });

        orderData = {cols};


          productData = _.map(orderDetails.productsAndDestinations, (orderDetail) => {
              const detail = orderDetail.product

              console.log('DETAIL', detail);

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
                <Header />
                <MyTable
                    type="orderDetails"
                    headers={orderHeaders}
                    data={orderData}
                />
                <TenantInfo />
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
    order          : state.application.get('order'),
    orders         : state.application.get('orders')
});

const actions = {
    showOverlay,
    logout,
    approveOrder,
    getOrderById,
    getOrder
}

export default connect(select, actions, null, { withRef: true })(withRouter(withCookies(OrderDetails)));
