import '../custom_formats.js'                        // adds formatMoney to Number types
import React                    from 'react';
import assets                   from '../../../libs/assets';
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
        <div>
            <div><img src={image} alt={props.product.modelNum} /></div>
            <div>
                <div>{ props.product.name }</div>
                <div style={{display: 'inline-flex'}}>
                    <div>Qty: <input type="number" value={props.product.qty} onChange={(e)=>props.update(props.product.id, 'qty', e.target.value)} style={styles.qtyInput} /></div>
                    <div>${ (props.product.price).formatMoney(2, '.', ',') }</div>
                </div>
            </div>
            <div><input type="checkbox" onClick={()=>props.update(props.product.id, 'warranty', (props.product.warranty) ? false : true)} checked={props.product.warranty}/> Add 10 Year Parts & Labor Warranty</div>
            <div>SUBTOTAL: ${ (props.subTotal).formatMoney(2, '.', ',') }</div>
            <div>SALES TAX: ${ (props.salesTax).formatMoney(2) }</div>
        </div>
    );
}