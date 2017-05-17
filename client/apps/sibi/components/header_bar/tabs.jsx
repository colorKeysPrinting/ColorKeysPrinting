import React                    from 'react';

export default (props)=>{

    const styles = {
        header: {
            display: 'inline-flex'
        },
        tabSection: {
            width: '400px',
            margin: 'auto'
        },
        tabs: {
            padding: '15px',
            height: '17px',
            cursor: 'pointer'
        },
        active: {
            padding: '15px',
            height: '17px',
            borderBottom: '3px solid #0091CE'
        }
    };

    const tabs = {
        products:       <div className="header-tab" onClick={ (e)=>{ props.showPage('products')}}     style={(props.activeTab === 'products') ? styles.active : styles.tabs} >Products</div>,
        features:       <div className="header-tab" onClick={ (e)=>{ props.showPage('features')}}     style={(props.activeTab === 'features') ? styles.active : styles.tabs} >Features</div>,
        support:        <div className="header-tab" onClick={ (e)=>{ props.showPage('support')}}      style={(props.activeTab === 'support') ? styles.active : styles.tabs} >Support</div>,
        orderHistory:   <div className="header-tab" onClick={ (e)=>{ props.showPage('orderHistory')}} style={(props.activeTab === 'orderHistory') ? styles.active : styles.tabs} >Order History</div>,
        warranties:     <div className="header-tab" onClick={ (e)=>{ props.showPage('warranties')}}   style={(props.activeTab === 'warranties') ? styles.active : styles.tabs} >Warranties</div>,
        reports:        <div className="header-tab" onClick={ (e)=>{ props.showPage('reports')}}      style={(props.activeTab === 'reports') ? styles.active : styles.tabs} >Reports</div>,

        dashboard:      <div className="header-tab" onClick={ (e)=>{ props.showPage('dashboard')}}    style={(props.activeTab === 'dashboard') ? styles.active : styles.tabs} >Dashboard</div>,
        rebates:        <div className="header-tab" onClick={ (e)=>{ props.showPage('rebates')}}      style={(props.activeTab === 'rebates') ? styles.active : styles.tabs} >Rebates</div>,
        dealers:        <div className="header-tab" onClick={ (e)=>{ props.showPage('dealers')}}      style={(props.activeTab === 'dealers') ? styles.active : styles.tabs} >Dealers</div>,
        funds:          <div className="header-tab" onClick={ (e)=>{ props.showPage('funds')}}        style={(props.activeTab === 'funds') ? styles.active : styles.tabs} >Funds</div>
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
                { tabs['reports'] }
            </div>;
            break;

        case 'landlord':
            activeTabs = <div style={styles.header}>
                { tabs['products'] }
                { tabs['orderHistory'] }
                { tabs['warranties'] }
                { tabs['reports'] }
            </div>;
            break;

        case 'manufacturer':
            activeTabs = <div style={styles.header}>
                { tabs['products'] }
                { tabs['reports'] }
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