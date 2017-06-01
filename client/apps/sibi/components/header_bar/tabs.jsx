import React                    from 'react';
import { Link }                 from 'react-router';

export default (props)=>{

    const styles = {
        header: {
            display: 'inline-flex'
        },
        tabSection: {
            width: '400px',
            margin: '0 auto'
        },
        tabs: {
            color: '#000',
            outline: 'none',
            textDecoration: 'none',
            padding: '30px 15px 15px',
            height: '85px',
            cursor: 'pointer',

        },
        active: {
            color: '#000',
            outline: 'none',
            textDecoration: 'none',
            padding: '30px 15px 15px',
            height: '85px',
            borderBottom: '3px solid #0091CE'
        }
    };

    const tabs = {
        products     : <Link to={{pathname: '/products',     state: {activePage: 'products',     activePageContent: ''}}} style={(props.activeTab === 'products')     ? styles.active : styles.tabs} >Products</Link>,
        features     : <Link to={{pathname: '/features',     state: {activePage: 'features',     activePageContent: ''}}} style={(props.activeTab === 'features')     ? styles.active : styles.tabs} >Features</Link>,
        support      : <Link to={{pathname: '/support',      state: {activePage: 'support',      activePageContent: ''}}} style={(props.activeTab === 'support')      ? styles.active : styles.tabs} >Support</Link>,
        orderHistory : <Link to={{pathname: '/orderHistory', state: {activePage: 'orderHistory', activePageContent: ''}}} style={(props.activeTab === 'orderHistory') ? styles.active : styles.tabs} >Order History</Link>,
        warranties   : <Link to={{pathname: '/warranties',   state: {activePage: 'warranties',   activePageContent: ''}}} style={(props.activeTab === 'warranties')   ? styles.active : styles.tabs} >Warranties</Link>,
        reports      : <Link to={{pathname: '/reports',      state: {activePage: 'reports',      activePageContent: ''}}} style={(props.activeTab === 'reports')      ? styles.active : styles.tabs} >Reports</Link>,
        dashboard    : <Link to={{pathname: '/dashboard',    state: {activePage: 'dashboard',    activePageContent: ''}}} style={(props.activeTab === 'dashboard')    ? styles.active : styles.tabs} >Dashboard</Link>,
        rebates      : <Link to={{pathname: '/rebates',      state: {activePage: 'rebates',      activePageContent: ''}}} style={(props.activeTab === 'rebates')      ? styles.active : styles.tabs} >Rebates</Link>,
        dealers      : <Link to={{pathname: '/dealers',      state: {activePage: 'dealers',      activePageContent: ''}}} style={(props.activeTab === 'dealers')      ? styles.active : styles.tabs} >Dealers</Link>,
        funds        : <Link to={{pathname: '/funds',        state: {activePage: 'funds',        activePageContent: ''}}} style={(props.activeTab === 'funds')        ? styles.active : styles.tabs} >Funds</Link>,
        vendors      : <Link to={{pathname: '/vendors',      state: {activePage: 'vendors',      activePageContent: ''}}} style={(props.activeTab === 'vendors')      ? styles.active : styles.tabs} >Vendors</Link>
    };

    let activeTabs;

    switch(props.type) {
        case 'sibi':
            activeTabs = <div style={styles.header}>
                { tabs['products'] }
                { tabs['orderHistory'] }
                { tabs['warranties'] }
                { tabs['reports'] }
            </div>;
            break;

        case 'vendor':
            activeTabs = <div style={styles.header}>
                { tabs['products'] }
                { tabs['orderHistory'] }
                { tabs['warranties'] }
                { tabs['reports'] }
            </div>;
            break;

        case 'landlord':
            activeTabs = <div style={styles.header}>
                { tabs['dashboard'] }
                { tabs['products'] }
                { tabs['warranties'] }
                { tabs['rebates'] }
                { tabs['vendors'] }
                { tabs['reports'] }
                { tabs['support'] }
            </div>;
            break;

        case 'manufacturer':
            activeTabs = <div style={styles.header}>
                { tabs['dashboard'] }
                { tabs['products'] }
                { tabs['warranties'] }
                { tabs['rebates'] }
                { tabs['dealers'] }
                { tabs['funds'] }
                { tabs['reports'] }
            </div>;
            break;
        case 'signUp':
            activeTabs = <div style={styles.header}>
                { tabs['products'] }
                { tabs['features'] }
                { tabs['support'] }
            </div>;
            break;
        default:
    }

    return (
        <div id="header-tab-section" style={styles.tabSection}>
            { activeTabs }
        </div>
    );
}