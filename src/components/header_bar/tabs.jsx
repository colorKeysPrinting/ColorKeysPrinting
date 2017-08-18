import React                    from 'react';
import { Link }                 from 'react-router-dom';

export default class Tabs extends React.Component {

    render() {

        const tabs = {
            dashboard : <Link to={`/dashboard`} className={(this.props.activeTab === 'dashboard') ? 'active' : 'tabs'} >Dashboard</Link>,
            orders    : <Link to={`/orders`}    className={(this.props.activeTab === 'orders')    ? 'active' : 'tabs'} >Orders</Link>,
            products  : <Link to={`/products`}  className={(this.props.activeTab === 'products')  ? 'active' : 'tabs'} >Products</Link>,
            users     : <Link to={`/users`}     className={(this.props.activeTab === 'users')     ? 'active' : 'tabs'} >Users</Link>,
            newOrder  : <Link to={`/new_order`} className={(this.props.activeTab === 'newOrder')  ? 'active' : 'tabs'} >New Order</Link>
        };

        let activeTabs;

        switch (this.props.type) {
        case 'superAdmin':
            activeTabs = (<div className="header-tabs">
                { tabs['dashboard'] }
                { tabs['orders'] }
                { tabs['users'] }
                { tabs['products'] }
                { tabs['newOrder'] }
            </div>);
            break;

        case 'admin':
            activeTabs = (<div className="header-tabs">
                { tabs['orders'] }
                { tabs['users'] }
            </div>);
            break;

        default:
            activeTabs = <div></div>
        }

        return (
            <div className="links">
                { activeTabs }
            </div>
        );
    }
}
