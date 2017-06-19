import React                    from 'react';
import { connect }              from 'react-redux';
import { withRouter }           from 'react-router';

import OrderHistory             from './content_sections/order_history';
import Order                    from './content_sections/order';

let select = (state)=>{
    return {
        myOrders    : state.application.getIn(['activeUser','myOrders']),
    };
};

@connect(select, {}, null, {withRef: true})
export default withRouter(class ContentPanelOrderHistory extends React.Component {

    render() {
        let activeSection;

        let styles = {
            container: {
                backgroundColor: '#FFF',
                width: '83%'
            },
            element: {
                width: '25%',
                padding: '2%',
                borderBottom: '1px solid rgba(50, 50, 50, 0.1)',
            }
        };

        const re = /(\w{1,})-([\w|\d]{1,})/;
        const type = re.exec(location.hash) || ['',''];

        switch(type[1]) {
            case 'order':
                activeSection = <Order
                                    order={type[2]}/>;
                break;
            default:
                activeSection = <OrderHistory />;
        }

        return (
            <div style={styles.container}>
                {activeSection}
            </div>
        );
    }
})



