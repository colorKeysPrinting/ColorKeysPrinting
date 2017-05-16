import React                    from 'react';

export default (props)=>{

    const styles = {
        header: {
            height: '40px',
            background: '#FFF',
            display: 'inline-flex',
            width: '970px'
        },
        tabs: {
            padding: '10px'
        },
        active: {
            padding: '10px',
            borderBottom: '3px solid blue'
        }
    };

    const tabs = {
        products:       <div onClick={ (e)=>{ props.show('products') } }     style={(props.activeTab === 'products') ? styles.active : styles.tabs} >Products</div>,
        features:       <div onClick={ (e)=>{ props.show('features') } }     style={(props.activeTab === 'features') ? styles.active : styles.tabs} >Features</div>,
        support:        <div onClick={ (e)=>{ props.show('support') } }      style={(props.activeTab === 'support') ? styles.active : styles.tabs} >Support</div>,
        orderHistory:   <div onClick={ (e)=>{ props.show('orderHistory') } } style={(props.activeTab === 'orderHistory') ? styles.active : styles.tabs} >Order History</div>,
        warranties:     <div onClick={ (e)=>{ props.show('warranties') } }   style={(props.activeTab === 'warranties') ? styles.active : styles.tabs} >Warranties</div>,
        reports:        <div onClick={ (e)=>{ props.show('reports') } }      style={(props.activeTab === 'reports') ? styles.active : styles.tabs} >Reports</div>,

        dashboard:      <div onClick={ (e)=>{ props.show('dashboard') } }    style={(props.activeTab === 'dashboard') ? styles.active : styles.tabs} >Dashboard</div>,
        rebates:        <div onClick={ (e)=>{ props.show('rebates') } }      style={(props.activeTab === 'rebates') ? styles.active : styles.tabs} >Rebates</div>,
        dealers:        <div onClick={ (e)=>{ props.show('dealers') } }      style={(props.activeTab === 'dealers') ? styles.active : styles.tabs} >Dealers</div>,
        funds:          <div onClick={ (e)=>{ props.show('funds') } }        style={(props.activeTab === 'funds') ? styles.active : styles.tabs} >Funds</div>
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
        <div>
            { activeTabs }
        </div>
    );
}