import '../custom_formats.js'                        // adds formatMoney to Number types
import React                    from 'react';
import assets                   from '../../../libs/assets';
import _                        from 'lodash';

export default function Product(props) {
    let checkboxSection;

    let styles = {
        qtyInput: {
            width: '50px',
            height: '28px',
            fontSize: '20px',
            paddingLeft: '5px'
        }
    };

    let image = (props.product.image) ? props.product.image : '';

    if(props.product.warranty) {
        let warranty = props.product.warranty;

        checkboxSection = <div style={{display: 'inline-flex'}}>
                              <div><img src={assets(warranty.image)} alt={warranty.modelNumber}/></div>
                              <div>
                                  <div>{ warranty.name }</div>
                                  <div>#{ warranty.modelNumber }</div>
                                  <div>${ (warranty.price).formatMoney(2, '.', ',') }</div>
                              </div>
                          </div>;
    } else {
        checkboxSection = <div><input type="checkbox" onClick={()=>props.update(props.product.id, 'warranty', 0)} />Add 10 Year Parts & Labor Warranty</div>
    }

    return (
        <div>
            <div style={{display: 'inline-flex'}} >
                <div><img src={image} alt={props.product.modelNumber} /></div>
                <div>
                    <div>{ props.product.name }</div>
                    <div style={{display: 'inline-flex'}}>
                        <div>Qty: <input type="number" value={props.product.qty} onChange={(e)=>props.update(props.product.id, 'qty', e.target.value)} style={styles.qtyInput} /></div>
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