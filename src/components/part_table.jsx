import React                                                from 'react';
import _                                                    from 'lodash';

import assets                                               from 'libs/assets';
import MyTable                                              from 'components/my_table';

export default function PartTable(props) {
    const part = props.part;
    const isOutOfStockActive = (props.outOfStock !== props.productIndex);
    const partHeaders = ['partImage','partDescription','address','code','qty','price'];
    const partRows = ['part']

    if (props.type === '/process_order') {
        partRows.push('install');
    }

    return (
        <MyTable
            type="partDetails"
            className="part-table"
            dataClassName={(props.productIndex !== 0) ? "table-row part-row" : null }
            colspan={partHeaders}
            data={_.map(['part', 'outOfStock', 'install'], (row) => {
                let cols = {};
                _.each(partHeaders, (header) => {
                    switch(header) {
                    case 'partImage':
                        cols[header] = (row === 'part') ? <img src={part.imageUrl} alt="" height="100" width="auto" /> : '';
                        break;
                    case 'partDescription':
                        if (row === 'part') {
                            cols[header] = <div className="no-limit">
                                <span className="product-header">{(!props.replacement) ? part.description : `Replaced with part #: ${props.replacement}`}</span>
                                <div className="table-cell-details" style={{ minWidth: '100px' }}>{ `${(props.replacement) ? 'Original' : ''} Model Number: ${part.modelNumber}` }</div>
                                {(props.type === '/process_order' && !props.processedAt && props.orderStatus !== 'Pending') ?
                                    (props.permissions.get('updateAllOrders') || props.permissions.get('updateFundOrders')) ?
                                        (isOutOfStockActive) ? <div className="btn blue" onClick={() => props.showOutOfStock({ productIndex: props.productIndex })} >Out of Stock?</div> : <div className="btn borderless cancel-button" onClick={() => props.showOutOfStock({ productIndex: '' })} >Cancel</div>
                                        : null
                                    : null}
                            </div>;

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
            })}
        />
    );
}