import React                    from 'react';
import { Link }                 from 'react-router';
import _                        from 'lodash';
import assets                   from '../../../libs/assets';
import '../../common/custom_formats.js'                        // adds formatMoney to Number types

export default function OrderHistoryItem(props) {

    const styles = {
        container: {
            border: '1px solid rgba(50, 50, 50, 0.1)',
            backgroundColor: '#FBFBFB'
        },
        productThumbnail: {
            cursor: 'pointer',
            display: 'grid'
        },
        plusBtn: {
            float: 'left',
            margin: '5px',
            height: '42px',
            width: '42px',
            zIndex: '9'
        },
        image: {
            marginTop: '-52px',
            height: '300px',
            backgroundColor: '#FFF'
        },
        name: {
            margin: '10px auto 0px',
            textAlign: 'left',
            fontSize: '20px',
            width: '85%'
        },
        price: {
            color: '#06cfe5',
            fontSize: '25px',
            margin: '2px'
        },
        modelNumber: {
            color: 'rgba(50, 50, 50, 0.4)',
            fontSize: '16px',
            margin: '2px'
        },
        submitBtn: {
            width: '200px',
            height: '46px',
            margin: '20px auto',
            paddingTop: '13px'
        },
        prodInfo: {
            textAlign: 'left',
            padding: '20px 26px 0 0'
        }
    };

    let priceTotal, itemTotal;

    const date = new Date(props.orderDate);

    _.each(props.products, (qty, product) => {
        itemTotal += qty;
        const index = _.findIndex()

    });

    return (
        <tr style={styles.container}>
            <td>{ props.orderNum }</td>
            <td>{ date.toDateString() }</td>
            <td>{ priceTotal }</td>
            <td>{ itemTotal }</td>
            <td>{ props.propertyAddress }</td>
            <td>{ props.status }</td>
            <td><div className="submit-btn" onClick={() => props.addToTruck('order', props.id)} >Add to truck</div></td>
            <td>
                <div onClick={console.log('TODO: share')}><img src={''} alt="share" /></div>
                <div onClick={console.log('TODO: export')}><img src={''} alt="export" /></div>
                <div onClick={console.log('TODO: view')}><img src={''} alt="view" /></div>
            </td>
        </tr>
    );
}



