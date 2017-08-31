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
// updateOrderProducts
// showOutOfStock

export default function PartTable(props) {
    const part = props.part;

    const imageData = [[<img src={part.imageUrl} alt="productImg" height="100" width="auto" />]];

    const partImageTable = <MyTable
        className="part-details-image-table"
        type="partDetailsImage"
        data={imageData}
    />;

    const partDetailHeaders = {
        partDescription: '',
        code: '',
        qty: '',
        price: ''
    };

    const partDetailRows = ['part', 'outOfStock', 'install'];

    const partDetails = _.map(partDetailRows, (row) => {
        let cols = {};
        _.each(partDetailHeaders, (header, key) => {
            let value;
            switch(key) {
            case 'partDescription':
                if (row === 'part') {
                    value = part.description;

                } else if (row === 'outOfStock') {
                    value = (props.outOfStock !== props.productIndex) ? <div className="btn blue" onClick={() => props.showOutOfStock({ productIndex: props.productIndex })} >Out of Stock?</div> : <div className="btn cancel-btn" onClick={() => props.showOutOfStock({ productIndex: '' })} >Cancel</div>;

                } else if (row === 'install') {
                    value = (props.outOfStock === props.productIndex) ? <form onSubmit={(e) => {e.preventDefault(); props.updateOrderProducts();}}>
                        <label htmlFor="model-num-replace" >Enter Model # to replace part</label>
                        <input name="model-num-replace" value={props.modelNumber} placeholder="GTE18GT" onChange={(e) => props.update({ type: 'modelNumber', value: e.target.value })} required />
                        <input className="btn blue" type="submit" value="Replace" />
                    </form> : null;
                }
                break;

            case 'code':
                value = (row === 'part') ? `Model #${ part.code }` : '';

                value = (props.outOfStock !== props.productIndex) ? value : '';
                break;

            case 'qty':
                value = (row === 'part' && props.outOfStock !== props.productIndex) ? props.qty : '';
                break;

            case 'price':
                value = (row === 'part') ? props.price : '';

                value = (props.outOfStock !== props.productIndex) ? value : '';
                break;
            }
            cols[key] = value;
        });
        return cols;
    });

    const partDetailsTable = <MyTable
        className="part-details-table"
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