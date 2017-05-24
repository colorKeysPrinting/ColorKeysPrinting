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
            padding: '15px',
            height: '85px',
            cursor: 'pointer'
        },
        active: {
            color: '#000',
            outline: 'none',
            textDecoration: 'none',
            padding: '15px',
            height: '52px',
            borderBottom: '3px solid #0091CE'
        }
    };

    const tabs = {
        products:       <Link to={`/products`}      onClick={ (e)=>{ props.activateTab('products')}}       style={(props.activeTab === 'products')     ? styles.active : styles.tabs}>Products</Link>,
        features:       <Link to={`/features`}      onClick={ (e)=>{ props.activateTab('features')}}       style={(props.activeTab === 'features')     ? styles.active : styles.tabs}>Features</Link>,
        support:        <Link to={`/support`}       onClick={ (e)=>{ props.activateTab('support')}}        style={(props.activeTab === 'support')      ? styles.active : styles.tabs}>Support</Link>,
        orderHistory:   <Link to={`/orderHistory`}  onClick={ (e)=>{ props.activateTab('orderHistory')}}   style={(props.activeTab === 'orderHistory') ? styles.active : styles.tabs}>Order History</Link>,
        warranties:     <Link to={`/warranties`}    onClick={ (e)=>{ props.activateTab('warranties')}}     style={(props.activeTab === 'warranties')   ? styles.active : styles.tabs}>Warranties</Link>,
        reports:        <Link to={`/reports`}       onClick={ (e)=>{ props.activateTab('reports')}}        style={(props.activeTab === 'reports')      ? styles.active : styles.tabs}>Reports</Link>,
        dashboard:      <Link to={`/dashboard`}     onClick={ (e)=>{ props.activateTab('dashboard')}}      style={(props.activeTab === 'dashboard')    ? styles.active : styles.tabs}>Dashboard</Link>,
        rebates:        <Link to={`/rebates`}       onClick={ (e)=>{ props.activateTab('rebates')}}        style={(props.activeTab === 'rebates')      ? styles.active : styles.tabs}>Rebates</Link>,
        dealers:        <Link to={`/dealers`}       onClick={ (e)=>{ props.activateTab('dealers')}}        style={(props.activeTab === 'dealers')      ? styles.active : styles.tabs}>Dealers</Link>,
        funds:          <Link to={`/funds`}         onClick={ (e)=>{ props.activateTab('funds')}}          style={(props.activeTab === 'funds')        ? styles.active : styles.tabs}>Funds</Link>,
        vendors:        <Link to={`/vendors`}       onClick={ (e)=>{ props.activateTab('vendors')}}        style={(props.activeTab === 'vendors')      ? styles.active : styles.tabs}>Vendors</Link>
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