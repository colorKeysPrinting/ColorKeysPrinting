import React                    from 'react';
import { Link }                 from 'react-router';

export default function Tabs(props) {

    const styles = {
        header: {
            display: 'inline-flex'
        },
        tabSection: {
            width: '400px',
            margin: '0 auto'
        },
        tabs: {
            color: '#FFF',
            outline: 'none',
            textDecoration: 'none',
            padding: '30px 15px 15px',
            height: '85px',
            cursor: 'pointer',

        },
        active: {
            color: '#FFF',
            outline: 'none',
            textDecoration: 'none',
            padding: '30px 15px 15px',
            height: '85px',
            borderBottom: '3px solid #0091CE'
        }
    };

    const tabs = {
        orders   : <Link to={`/orders`}   style={(props.activeTab === 'orders')   ? styles.active : styles.tabs} >Orders</Link>,
        products : <Link to={`/products`} style={(props.activeTab === 'products') ? styles.active : styles.tabs} >Products</Link>,
        users    : <Link to={`/users`}    style={(props.activeTab === 'users')    ? styles.active : styles.tabs} >Users</Link>,
    };

    let activeTabs;

    switch (props.type) {
    case 'superAdmin':
        activeTabs = (<div style={styles.header}>
            { tabs['orders'] }
            { tabs['users'] }
            { tabs['products'] }
        </div>);
        break;
    case 'admin':
        activeTabs = (<div style={styles.header}>
            { tabs['orders'] }
            { tabs['users'] }
        </div>);
        break;
    default:
        console.log('no user type provided');
    }

    return (
        <div id="header-tab-section" style={styles.tabSection}>
            { activeTabs }
        </div>
    );
}