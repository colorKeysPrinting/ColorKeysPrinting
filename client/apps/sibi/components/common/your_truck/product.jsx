import React                    from 'react';
import _                        from 'lodash';
import assets                   from '../../../libs/assets';
import '../custom_formats.js'                        // adds formatMoney to Number types

export default function Product(props) {
    let checkboxSection;

    const styles = {
        qtyInput: {
            width: '50px',
            height: '28px',
            fontSize: '20px',
            paddingLeft: '5px'
        }
    };

    const image = (props.product.image) ? props.product.image : '';

    if (props.product.warranty) {
        const warranty = props.product.warranty;

        checkboxSection = (<div style={{ display: 'inline-flex' }}>
            <div><img src={assets(warranty.image)} alt={warranty.modelNumber} /></div>
            <div>
                <div>{ warranty.name }</div>
                <div>#{ warranty.modelNumber }</div>
                <div>${ (warranty.price).formatMoney(2, '.', ',') }</div>
            </div>
        </div>);
    } else {
        checkboxSection = <div><input type="checkbox" onClick={() => props.update(props.product.id, 'warranty', 0)} />Add 10 Year Parts & Labor Warranty</div>
    }

    return (
        <div>
            <div style={{ display: 'inline-flex' }} >
                <div><img src={image} alt={props.product.modelNumber} /></div>
                <div>
                    <div>{ props.product.name }</div>
                    <div style={{ display: 'inline-flex' }}>
                        <div>Qty: <input type="number" value={props.product.qty} onChange={(e) => props.update(props.product.id, 'qty', e.target.value)} style={styles.qtyInput} /></div>
                        <div>${ (props.product.price).formatMoney(2, '.', ',') }</div>
                    </div>
                </div>
            </div>
            { checkboxSection }
            <div>SUBTOTAL: ${ (props.subTotal).formatMoney(2, '.', ',') }</div>
            <div>SALES TAX: ${ (props.salesTax).formatMoney(2) }</div>
        </div>
    );
}