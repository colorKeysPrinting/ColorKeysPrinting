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
import { setActiveTab }                                     from 'ducks/header/actions';

import MyTable                                              from 'components/my_table';

class ProcessOrderPage extends React.Component {
    constructor(props) {
        super(props);

    }

    componentWillMount() {
        const { cookies } = this.props;
        const jwt = cookies.get('sibi-admin-jwt');
        const orderId = '3206bf49-9fc6-437e-b867-063ada21f005';

        if (jwt && orderId) {
            this.props.getOrderById({ token: jwt.token, id: orderId });
            this.props.getUsers({ token: jwt.token });
        } else {
            console.log('TODO: trigger logout function *** no JWT ***');
        }

        this.props.setActiveTab('orders');
    }

    render() {
        let userData, occupancyData, officeData;

        const { cookies } = this.props;
        const jwt = cookies.get('sibi-admin-jwt');

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

        if (this.props.order.size > 0 && this.props.users.size > 0) {
            console.log("GOT USERS AND ORDER");
            const order = this.props.order.toJS();
            const user = _.find(this.props.users.toJS(), ['id', order.userId]);
            console.log(order);
            console.log(user);

            //USER TABLE DATA
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
                    value = "Yes";

                } else if (key === 'hotshotInstallDate') {
                    value = dateformat(order.installDate, 'mm/dd/yy');

                } else if (key === 'hotshotCode') {
                    value = "NEED HOTSHOT CODE";
                }
                userCols[key] = value;
            });
            userData = {userCols};

            //OCCUPANCY TABLE DATA
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

            //OFFICE TABLE DATA
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
        }

        return (
            <div id="process-orders-page">
                <div className="container">
                    <MyTable
                        tableClass="user-table"
                        type="userDetails"
                        headers={userHeaders}
                        data={userData}
                    />
                    <MyTable
                        tableClass="occupancy-table"
                        type="occupancyDetails"
                        headers={occupancyHeaders}
                        data={occupancyData}
                    />
                    <MyTable
                        tableClass="office-table"
                        type="officeDetails"
                        headers={officeHeaders}
                        data={officeData}
                    />
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
    getUsers,
    setActiveTab
}

export default connect(select, actions, null, { withRef: true })(withRouter(withCookies(ProcessOrderPage)));
