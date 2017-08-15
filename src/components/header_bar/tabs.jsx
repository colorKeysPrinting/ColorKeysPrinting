import React                    from 'react';
import { Link }                 from 'react-router-dom';

export default class Tabs extends React.Component {

    render() {
        const styles = {
            header: {
                display: 'inline-flex'
            },
            tabSection: {
                width: '400px',
                margin: '0 auto'
            }
        };

        const tabs = {
            orders   : <Link to={`/orders`}   className="{(this.props.activeTab === 'orders')   ? 'active' : ''}" >Orders</Link>,
            products : <Link to={`/products`} className="{(this.props.activeTab === 'products') ? 'active' : ''}" >Products</Link>,
            users    : <Link to={`/users`}    className="{(this.props.activeTab === 'users')    ? 'active' : ''}" >Users</Link>,
        };

        let activeTabs;

        switch (this.props.type) {
        case 'superAdmin':
            activeTabs = (<div className="links">
                { tabs['orders'] }
                { tabs['users'] }
                { tabs['products'] }
            </div>);
            break;

        case 'admin':
            activeTabs = (<div className="links">
                { tabs['orders'] }
                { tabs['users'] }
            </div>);
            break;

        default:
            activeTabs = <div></div>
        }

        return (
            <div id="header-tab-section">
                { activeTabs }
            </div>
        );
    }
}
