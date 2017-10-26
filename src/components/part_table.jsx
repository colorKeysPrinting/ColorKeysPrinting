import React                                                from 'react';
import _                                                    from 'lodash';

import assets                                               from 'libs/assets';
import MyTable                                              from 'components/my_table';

export default function PartTable(props) {
    const part = props.part;
    const isOutOfStockActive = (props.outOfStock !== props.productIndex);

    const partDetails = _.map(['part', 'outOfStock', 'install'], (row) => {
        let cols = {};
        _.each(['partDescription','address','code','qty','price'], (header) => {
            switch(header) {
            case 'partDescription':
                if (row === 'part') {
                    cols[header] =<div className="no-limit">
                        <span className="product-header">{(!props.replacement) ? part.description : `Replaced with part #: ${props.replacement}`}</span>
                        <div className="table-cell-details" style={{ minWidth: '100px' }}>{ `${(props.replacement) ? 'Original' : ''} Model Number: ${part.modelNumber}` }</div>
                    </div>;

                } else if (row === 'outOfStock') {
                    if (props.type === '/process_order' && !props.processedAt && props.orderStatus !== 'Pending') {
                        if (props.permissions.get('updateAllOrders') || props.permissions.get('updateFundOrders')) {
                            cols[header] = (isOutOfStockActive) ? <div className="btn blue" onClick={() => props.showOutOfStock({ productIndex: props.productIndex })} >Out of Stock?</div> : <div className="btn borderless" onClick={() => props.showOutOfStock({ productIndex: '' })} >Cancel</div>;
                        }
                    }

                } else if (row === 'install') {
                    cols[header] = (props.outOfStock === props.productIndex) ? <form className="replace-form" onSubmit={(e) => {e.preventDefault(); props.updateModelNumber({ productsAndParts: props.productsAndParts });}}>
                        <div className="input-container">
                            <label htmlFor="model-num-replace" >Enter Model # to replace part</label>
                            <input name="model-num-replace" value={props.modelNumber} placeholder="GTE18GT" onChange={(e) => props.update({ type: 'modelNumber', value: e.target.value })} required />
                        </div>
                        <input className="btn blue" type="submit" value="Replace" />
                    </form> : null;
                }
                break;

            case 'qty':
                cols[header] = (row === 'part' && isOutOfStockActive) ? props.qty : null;
                break;

            case 'price':
                cols[header] = (row === 'part' && isOutOfStockActive) ? `$${props.price}` : null;
                break;
            default:
                cols[header] = '';
            }
        });
        return cols;
    });

    return <table className="part-table">
        <colgroup>
            <col span="1" className="product-image-colspan" />
            <col span="1" className="product-details-colspan" />
        </colgroup>
        <tbody>
            <tr className="product-table-container-row" >
                <td className="product-image-table">
                    <MyTable
                        type="partDetailsImage"
                        data={(!props.replacement) ? [[<img src={part.imageUrl} alt="" height="100" width="auto" />]] : []}
                    />
                </td>
                <td className="product-details-table">
                    <MyTable
                        type="partDetails"
                        dataClassName={(props.productIndex !== 0) ? "table-row part-row" : null }
                        data={partDetails}
                    />
                </td>
            </tr>
        </tbody>
    </table>;
}