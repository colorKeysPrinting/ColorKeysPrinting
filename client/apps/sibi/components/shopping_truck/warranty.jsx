import '../common/custom_formats.js'                        // adds formatMoney to Number types
import React                    from 'react';
import assets                   from '../../libs/assets';
import _                        from 'lodash';

export default function Warranty(props) {

    let styles = {};

    let warranty = props.warranty;

    return (
        <tr>
            <td>
                <div style={{display: 'inline-flex'}}>
                    <div><img src={assets(warranty.image)} alt={warranty.modelNum}/></div>
                    <div>
                        <div>{ warranty.name }</div>
                        <div>#{ warranty.modelNum }</div>
                    </div>
                </div>
            </td>
            <td>{ warranty.qty }</td>
            <td>
                <div>${ (props.warranty.price).formatMoney(2, '.', ',') }</div>
                <div className="cancel-btn" onClick={()=>props.update(props.productID, 'warranty', false)}>Remove</div>
            </td>
        </tr>
    );
}