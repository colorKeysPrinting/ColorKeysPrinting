import React                    from 'react';
import _                        from 'lodash';
import assets                   from '../../libs/assets';
import '../common/custom_formats.js'                        // adds formatMoney to Number types

export default function Warranty(props) {

    const styles = {};

    const warranty = props.warranty;

    return (
        <tr>
            <td>
                <div style={{ display: 'inline-flex' }}>
                    <div><img src={assets(warranty.image)} alt={warranty.modelNumber} /></div>
                    <div>
                        <div>{ warranty.name }</div>
                        <div>#{ warranty.modelNumber }</div>
                    </div>
                </div>
            </td>
            <td>{ warranty.qty }</td>
            <td>
                <div>${ (props.warranty.price).formatMoney(2, '.', ',') }</div>
                <div className="cancel-btn" onClick={() => props.update(props.productId, 'warranty', false)}>Remove</div>
            </td>
        </tr>
    );
}