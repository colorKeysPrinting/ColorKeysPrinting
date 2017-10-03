import React                    from 'react';
import { Link }                 from 'react-router-dom';

export default class Tabs extends React.Component {

    render() {

        const pendingOrders = (this.props.pendingOrders !== 0) ? <div id="order-badge" className="pending-badges" >{this.props.pendingOrders}</div> : null;
        const pendingUsers = (this.props.pendingUsers !== 0) ? <div id="user-badge" className="pending-badges" >{this.props.pendingUsers}</div> : null;

        const tabs = {
            // dashboard : <Link to={`/dashboard`} className={(this.props.activeTab === 'dashboard') ? 'active' : 'tabs'} >Dashboard</Link>,
            orders    : <Link to={`/orders`}    className={(this.props.activeTab === 'orders')    ? 'active' : 'tabs'} >Orders { pendingOrders }</Link>,
            // products  : <Link to={`/products`}  className={(this.props.activeTab === 'products')  ? 'active' : 'tabs'} >Products</Link>,
            users     : <Link to={`/users`}     className={(this.props.activeTab === 'users')     ? 'active' : 'tabs'} >Users { pendingUsers }</Link>,
            newOrder  : <Link to={`/new_order`} className={(this.props.activeTab === 'newOrder')  ? 'active' : 'tabs'} >New Order</Link>
        };

        let activeTabs;

        switch (this.props.type) {
        case 'superAdmin':
            activeTabs = [
                tabs['dashboard'],
                tabs['orders'],
                tabs['users'],
                tabs['products'],
                tabs['newOrder'],
            ];
            break;

        case 'fundSuperAdmin':
            activeTabs = [
                tabs['orders'],
                tabs['users'],
                tabs['newOrder'],
            ];
            break;

        case 'fundOrdersAdmin':
            activeTabs = [
                tabs['orders'],
                tabs['users'],
                tabs['newOrder'],
            ];
            break;

        case 'manufacturerSuperAdmin':
            activeTabs = [
                tabs['orders'],
                tabs['users'] ,
                tabs['newOrder'],
            ];
            break;

        case 'manufacturerOrdersAdmin':
            activeTabs = [
                tabs['orders'],
                tabs['users'] ,
                tabs['newOrder'],
            ];
            break;

        case 'manufacturerOrderProcessor':
            activeTabs = [
                tabs['orders'],
                tabs['users'] ,
                tabs['newOrder'],
            ];
            break;
        default:
            activeTabs = null;
        }

        return (
            <div className="links">
                <div className="header-tabs">
                    { activeTabs }
                </div>
            </div>
        );
    }
}
