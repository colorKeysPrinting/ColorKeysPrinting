import React                    from 'react';
import _                        from 'lodash';
import { connect }              from 'react-redux';
import { withRouter }           from 'react-router';
import { withCookies }          from 'react-cookie';
import assets                   from '../../libs/assets';

import { showOverlay }          from '../../actions/application';
import { logout }               from '../../actions/header';
import { getOrderById, approveOrder, getProducts}          from '../../actions/products';

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

    render() {
        const styles = {
          header: {
            color: "red",
            fontSize: "40px"
          }
        }

        let productData = [];
        let orderData = [];
        let orderDetailsHeading = ' ';

        const { cookies } = this.props;
        const jwt = cookies.get('sibi-admin-jwt');

        const orderHeaders = {
            // id: 'ID',
            orderStatus: 'Order Status',
            deliveryDate: 'Delivery Date',
            installTime: 'Preferred Install Time',
            occupied: 'Occupancy',
            lockboxCode: 'Lockbox Code',
            propertyManager: 'Property Manager'
        };

        const productHeaders = {
            productImage: 'Product',
            productDescription: '',
            address: 'Shipped to',                sd  f                                                                     
            qty: 'Qty',
            price: 'Cost'
        };

        if (this.props.order.size > 0) {
          const order = this.props.order.toJS();


          orderDetailsHeader = order.fundProperty.addressLineOne + " " + order.fundProperty.addressLineTwo + " " + order.fundProperty.addressLineThree + ", " + order.fundProperty.city + ", " + order.fundProperty.state + ", " + order.fundProperty.zipcode

          console.log('ORDER', order);
          const products = order.productsAndDestinations

          const cols = {};

          _.each(orderHeaders, (value, key) => {
              value = order[key]
              if (key === 'orderStatus') {
                value = order.orderStatus ;
              } else if (key === 'deliveryDate') {
                value = order.installDate;
              } else if (key === 'installTime') {
                value = order.applianceDeliveryTime;
              } else if (key === 'occupied') {
                value = (order['occupied'] === false) ? 'Vacant' : 'Occupied';
              } else if (key === 'lockboxCode') {
                value = order.lockBoxCode;
              } else if (key === 'propertyManager') {
                value = 'Property Manager' ;
              }
              cols[key] = value;
          });

        orderData = {cols};


          productData = _.map(products, (product) => {
              const cols = {};

              product = _.find(this.props.products.toJS(), ['id', product.productId])
              console.log('PRODUCT AFTER FIND', product);
              _.each(productHeaders, (value,key) => {

                value = product[key];

                if (key === 'productImage') {
                    value = product.applianceColorsAndImages[0].imageUrl;

                } else if (key === 'productDescription') {
                    value = [
                    product.applianceDescription,
                    "SIBI Model Number: " + product.sibiModelNumber,
                    "Manufacturer's Model Number" + product.manufacturerModelNumber,
                    // "Colors: " + product.color,
                    "Fuel Type: " + product.applianceFuelType,
                    "Width: " + product.applianceWidth,
                    "Height: " + product.applianceHeight,
                    "Depth: " + product.applianceDepth,
                    "Install Instructions: ",
                    "Remove Old Appliance: "
                    ]

                } else if (key === 'address') {
                    value = [
                    order.fundProperty.addressLineOne + " " + order.fundProperty.addressLineTwo + " " + order.fundProperty.addressLineThree + ",",
                    order.fundProperty.city + ", " + order.fundProperty.state + ", " + order.fundProperty.zipcode
                  ]

                } else if (key === 'qty') {
                    value = '##';

                } else if (key === 'price') {
                    value = product.price;
                }

                cols[key] = value;
              })
              return cols;
          });
        }

        console.log('PD',productData);
        return (
            <div id="orders-page" >
                {/* <Header
                  data = {orderAddress}
                /> */}
                <div className="details-header">
                  <div className="header-property">
                    <div className="property-address">Order: {orderDetailsHeading}</div>
                    <div className="property-manager">PM Office: Coming Soon</div>
                  </div>
                  <div className="button-container">
                    <div className="button">Edit</div>
                    <div className="button">Approve Order</div>
                  </div>
                </div>
                <MyTable
                    type="orderDetails"
                    headers={orderHeaders}
                    data={orderData}
                />
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
    order          : state.application.get('order')
});

const actions = {
    showOverlay,
    logout,
    approveOrder,
    getOrderById
}

export default connect(select, actions, null, { withRef: true })(withRouter(withCookies(OrderDetails)));
