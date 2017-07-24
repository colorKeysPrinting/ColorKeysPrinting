import React                    from 'react';
import { Link }                 from 'react-router';

export default (props) => {

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
        products     : <Link to={`/products`}     style={(props.activeTab === 'products')     ? styles.active : styles.tabs} >Products</Link>,
        features     : <Link to={`/features`}     style={(props.activeTab === 'features')     ? styles.active : styles.tabs} >Features</Link>,
        support      : <Link to={`/support`}      style={(props.activeTab === 'support')      ? styles.active : styles.tabs} >Support</Link>,
        orderHistory : <Link to={`/orderHistory`} style={(props.activeTab === 'orderHistory') ? styles.active : styles.tabs} >Order History</Link>,
        warranties   : <Link to={`/warranties`}   style={(props.activeTab === 'warranties')   ? styles.active : styles.tabs} >Warranties</Link>,
        reports      : <Link to={`/reports`}      style={(props.activeTab === 'reports')      ? styles.active : styles.tabs} >Reports</Link>,
        dashboard    : <Link to={`/dashboard`}    style={(props.activeTab === 'dashboard')    ? styles.active : styles.tabs} >Dashboard</Link>,
        rebates      : <Link to={`/rebates`}      style={(props.activeTab === 'rebates')      ? styles.active : styles.tabs} >Rebates</Link>,
        dealers      : <Link to={`/dealers`}      style={(props.activeTab === 'dealers')      ? styles.active : styles.tabs} >Dealers</Link>,
        funds        : <Link to={`/funds`}        style={(props.activeTab === 'funds')        ? styles.active : styles.tabs} >Funds</Link>,
        vendors      : <Link to={`/vendors`}      style={(props.activeTab === 'vendors')      ? styles.active : styles.tabs} >Vendors</Link>
    };

    let activeTabs;

    switch (props.type) {
    case 'admin':
        activeTabs = (<div style={styles.header}>
            { tabs['products'] }
            { tabs['orderHistory'] }
            { tabs['warranties'] }
            { tabs['reports'] }
        </div>);
        break;

    case 'vendor':
        activeTabs = (<div style={styles.header}>
            { tabs['products'] }
            { tabs['orderHistory'] }
            { tabs['warranties'] }
            { tabs['reports'] }
        </div>);
        break;

    case 'landlord':
        activeTabs = (<div style={styles.header}>
            { tabs['dashboard'] }
            { tabs['products'] }
            { tabs['warranties'] }
            { tabs['rebates'] }
            { tabs['vendors'] }
            { tabs['reports'] }
            { tabs['support'] }
        </div>);
        break;

    case 'manufacturer':
        activeTabs = (<div style={styles.header}>
            { tabs['dashboard'] }
            { tabs['products'] }
            { tabs['warranties'] }
            { tabs['rebates'] }
            { tabs['dealers'] }
            { tabs['funds'] }
            { tabs['reports'] }
        </div>);
        break;

    case 'signUp':
        activeTabs = (<div style={styles.header}>
            { tabs['products'] }
            { tabs['features'] }
            { tabs['support'] }
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