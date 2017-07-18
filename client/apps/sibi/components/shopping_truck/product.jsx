import '../common/custom_formats.js'                        // adds formatMoney to Number types
import React                    from 'react';
import assets                   from '../../libs/assets';
import _                        from 'lodash';

export default function Product(props) {

    let styles = {
        qtyInput: {
            width: '50px',
            height: '28px',
            fontSize: '20px',
            paddingLeft: '5px'
        }
    };

    let image = (props.product.image) ? props.product.image : '';

    return (
        <tr>
            <td>
                <div style={{display: 'inline-flex'}}>
                    <div><img src={image} alt={props.product.modelNumber} /></div>
                    <div>
                        <div>{ props.product.name }</div>
                        <div>#{ props.product.modelNumber }</div>
                    </div>
                </div>
            </td>
            <td><div>Qty: <input type="number" value={props.product.qty} onChange={(e)=>props.update(props.product.id, 'qty', e.target.value)} style={styles.qtyInput} /></div></td>
            <td>
                <div>${ (parseFloat(props.product.price)).formatMoney(2, '.', ',') }</div>
                <div className="cancel-btn" onClick={()=>props.removeFromTruck(props.product)}>Remove</div>
            </td>
        </tr>
    );
}