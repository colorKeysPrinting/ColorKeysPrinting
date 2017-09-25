import React                                                from 'react';
import _                                                    from 'lodash';

import assets                                               from 'libs/assets';
import MyTable                                              from 'components/my_table';

// productIndex
// part
// qty
// price
// outOfStock
// modelNumber
// update
// updateModelNumber
// showOutOfStock

export default function PartTable(props) {
    const part = props.part;

    const imageData = (!props.replacement) ? [[<img src={part.imageUrl} alt="productImg" height="100" width="auto" />]] : null;

    const partImageTable = <MyTable
        type="partDetailsImage"
        data={imageData}
    />;

    const partDetailHeaders = {
        partDescription: '',
        code: '',
        qty: '',
        price: ''
    };

    const partDetailRows = (props.type === 'processOrder') ? ['part', 'outOfStock', 'install'] : ['part', 'outOfStock'];

    const partDetails = _.map(partDetailRows, (row) => {
        let cols = {};
        _.each(partDetailHeaders, (header, key) => {
            let value;
            switch(key) {
            case 'partDescription':
                if (row === 'part') {
                    const valueStyled = <span className="product-header">{part.description}</span>;
                    value = (!props.replacement) ? valueStyled : null;

                } else if (row === 'outOfStock') {
                    if (props.type === 'processOrder') {
                        value = (props.outOfStock !== props.productIndex) ? <div className="btn blue" onClick={() => props.showOutOfStock({ productIndex: props.productIndex })} >Out of Stock?</div> : <div className="btn borderless" onClick={() => props.showOutOfStock({ productIndex: '' })} >Cancel</div>;

                    } else if (props.type === 'orderDetails') {
                        value = <div className="no-limit">
                            <div className="table-cell-details">{ `Part Code ${part.code}` }</div>
                        </div>;
                    }

                } else if (row === 'install') {
                    value = (props.outOfStock === props.productIndex) ? <form onSubmit={(e) => {e.preventDefault(); props.updateModelNumber({ productsAndParts: props.productsAndParts });}}>
                        <div className="input-container">
                            <label htmlFor="model-num-replace" >Enter Model # to replace part</label>
                            <input name="model-num-replace" value={props.modelNumber} placeholder="GTE18GT" onChange={(e) => props.update({ type: 'modelNumber', value: e.target.value })} required />
                        </div>
                        <input className="btn blue" type="submit" value="Replace" />
                    </form> : null;
                }
                break;

            case 'code':
                const code = (!props.replacement) ? part.code : props.replacement
                value = (row === 'part' && props.type === 'processOrder') ? `#${ code }` : null;

                value = (props.outOfStock !== props.productIndex) ? value : null;
                break;

            case 'qty':
                if (props.type === 'processOrder') {
                    value = (row === 'part' && props.outOfStock !== props.productIndex && !props.replacement) ? props.qty : null;
                } else if (props.type === 'orderDetails') {
                    value = (row === 'part') ? props.qty : null;
                }
                break;

            case 'price':
                value = (row === 'part') ? ('$' + props.price) : null;

                value = (props.outOfStock !== props.productIndex && !props.replacement) ? value : null;
                break;
            }
            cols[key] = value;
        });
        return cols;
    });

    const partDetailsTable = <MyTable
        type="partDetails"
        data={partDetails}
    />;

    return <table className="part-table">
        <colgroup>
            <col span="1" className="product-image-colspan" />
            <col span="1" className="product-details-colspan" />
        </colgroup>
        <tbody>
            <tr className="product-table-container-row" >
                <td className="product-image-table">{ partImageTable }</td>
                <td className="product-details-table">{ partDetailsTable }</td>
            </tr>
        </tbody>
    </table>;
}