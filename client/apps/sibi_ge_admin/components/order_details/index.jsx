import React                    from 'react';
import _                        from 'lodash';
import { connect }              from 'react-redux';
import { withRouter }           from 'react-router';
import { withCookies }          from 'react-cookie';
import assets                   from '../../libs/assets';

import { showOverlay }          from '../../actions/application';
import { logout }               from '../../actions/header';
import { getOrders, approveOrder }          from '../../actions/products';

import MyTable                  from '../common/my_table';

class OrderDetails extends React.Component {

    componentWillMount() {
        const { cookies } = this.props;
        const jwt = cookies.get('sibi-admin-jwt');

        if (jwt) {
            // this.props.getOrders(jwt.token);
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
        const { cookies } = this.props;
        const jwt = cookies.get('sibi-admin-jwt');

        const orderHeaders = { 
            id: '', 
            orderStatus: 'Order Status', 
            deliveryDate: 'Delivery Date', 
            installTime: 'Preferred Install Time', 
            occupied: 'Occupancy', 
            lockboxCode: 'Lockbox Code', 
            propertyManager: 'Property Manager' 
        };

        const productHeaders = {
            id: '',
            product: 'Product',
            address: 'Shipped to',
            qty: 'Qty',
            totalCost: 'Cost'
        };
        
        const order = this.props.router.state;

        const orderData = _.map(orderHeaders, (header) => {

        });

        const productData = _.map(productHeaders, (header) => {

        });

        return (
            <div id="orders-page" >
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
    products        : state.application.get('products')
});

const actions = {
    showOverlay, 
    logout, 
    approveOrder
}

export default connect(select, actions, null, { withRef: true })(withRouter(withCookies(OrderDetails)));