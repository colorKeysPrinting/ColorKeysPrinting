import React                    from 'react';

export default (props)=>{

    const styles = {
        active: {
            borderBottom: ''
        }
    };

    const tabs = {
        products:       <div onClick={ (e)=>{ props.show('products') } }     style={(props.activeTab === 'PRODUCTS')? styles.active: {}}>Products</div>,
        features:       <div onClick={ (e)=>{ props.show('features') } }     style={(props.activeTab === 'FEATURES')? styles.active: {}}>Features</div>,
        support:        <div onClick={ (e)=>{ props.show('support') } }      style={(props.activeTab === 'SUPPORT')? styles.active: {}}>Support</div>,
        orderHistory:   <div onClick={ (e)=>{ props.show('orderHistory') } } style={(props.activeTab === 'ORDERHISTORY')? styles.active: {}}>OrderHistory</div>,
        warranties:     <div onClick={ (e)=>{ props.show('warranties') } }   style={(props.activeTab === 'WARRANTIES')? styles.active: {}}>Warranties</div>,
        reports:        <div onClick={ (e)=>{ props.show('reports') } }      style={(props.activeTab === 'REPORTS')? styles.active: {}}>Reports</div>
    };

    let activeTabs;

    switch(props.type) {
        case 'sibi':
            activeTabs = <div>
                { tabs['products'] }
                { tabs['orderHistory'] }
                { tabs['warranties'] }
                { tabs['reports'] }
            </div>;
            break;

        case 'vendor':
            activeTabs = <div>
                { tabs['products'] }
                { tabs['reports'] }
            </div>;
            break;

        case 'landlord':
            activeTabs = <div>
                { tabs['products'] }
                { tabs['orderHistory'] }
                { tabs['warranties'] }
                { tabs['reports'] }
            </div>;
            break;

        case 'manufacturer':
            activeTabs = <div>
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