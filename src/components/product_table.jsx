import React                                                from 'react';
import _                                                    from 'lodash';

import assets                                               from 'libs/assets';
import MyTable                                              from 'components/my_table';

// productIndex
// product
// image
// qty
// price
// outOfStock
// modelNumber
// update
// updateModelNumber
// showOutOfStock

export default function ProductTable(props) {
    const product = props.product;
    const imageData = (!props.replacement) ? [[<img src={props.image} alt="productImg" height="100" width="auto" />]] : null;

    const productImageTable = <MyTable
        type="productDetailsImage"
        headers={(props.productIndex === 0) ? {productImage: 'Product'} : null}
        data={imageData}
    />;

    const productDetailRows = (props.type === 'processOrder') ? ['product', 'outOfStock', 'install', 'remove', 'disconnect'] : ['product', 'outOfStock', 'install', 'remove'];

    const productDetails = _.map(productDetailRows, (row) => {
        let cols = {};
        _.each(props.productHeaders, (header, key) => {
            let value;
            switch(key) {
            case 'productDescription':
                if (row === 'product') {
                    value = (!props.replacement) ? product.applianceDescription : null;

                } else if (row === 'outOfStock') {
                    if (props.type === 'processOrder') {
                        value = (props.outOfStock !== props.productIndex) ? <div className="btn blue" onClick={() => props.showOutOfStock({ productIndex: props.productIndex })} >Out of Stock?</div> : <div className="btn borderless" onClick={() => props.showOutOfStock({ productIndex: '' })} >Cancel</div>;

                    } else if (props.type === 'orderDetails') {
                        value = <div className="no-limit">
                            <div className="table-cell-details">{ `Model Number ${product.sibiModelNumber}` }</div>
                            <div className="table-cell-details">{ `Color: ${props.color}` }</div>
                            <div className="table-cell-details">{ `Fuel Type: ${product.applianceFuelType}` }</div>
                            <div className="table-cell-details">{ `Width: ${product.applianceWidth}` }</div>
                            <div className="table-cell-details">{ `Height: ${product.applianceHeight}` }</div>
                            <div className="table-cell-details">{ `Depth: ${product.applianceDepth}` }</div>
                        </div>;
                    }
                } else if (row === 'install') {
                    // const wrapper = <div className="install-instructions"></div>
                    // const bold = <div><div className="bold" > Install Description</div> <div>{product.applianceInstallDescription}</div></div>
                    const description = (!props.replacement) ? `Install Description: ${ product.applianceInstallDescription }` : null;
                    value = (props.outOfStock !== props.productIndex) ? description : <form onSubmit={(e) => {e.preventDefault(); props.updateModelNumber();}}>
                        <div className="input-container">
                            <label htmlFor="model-num-replace" >Enter Model # to replace product</label>
                            <input name="model-num-replace" value={props.modelNumber} placeholder="GTE18GT" onChange={(e) => props.update({ type: 'modelNumber', value: e.target.value })} required />
                        </div>
                        <input className="btn blue" type="submit" value="Replace" />
                    </form>;

                } else if (row === 'remove') {
                    value = (props.outOfStock !== props.productIndex && !props.replacement) ? `Remove Appliance Description: ${ product.applianceRemovalDescription }` : null;

                } else if (row === 'disconnect') {
                    value = (props.outOfStock !== props.productIndex && !props.replacement) ? `Disconnect Fee: ${ product.applianceDisconnectDescription }` : null;
                }
                break;

            case 'code':
            case 'address':
                if (row === 'product') {
                    if (props.type === 'processOrder') {
                        value = (!props.replacement) ? `#${ product.sibiModelNumber }` : `#${ props.replacement }`;

                    } else if (props.type === 'orderDetails') {
                        value = props.address;
                    }

                } else if (row === 'outOfStock') {
                    value = null;

                } else if (row === 'install') {
                    value = (!props.replacement && props.type === 'processOrder') ? `#${ product.applianceInstallCode }` : null;

                } else if (row === 'remove') {
                    value = (!props.replacement && props.type === 'processOrder') ? `#${ product.applianceRemovalCode }` : null;

                } else if (row === 'disconnect') {
                    value = (!props.replacement) ? `#${ product.applianceDisconnectCode }` : null;
                }

                value = (props.outOfStock !== props.productIndex) ? value : null;
                break;

            case 'qty':
                if (props.type === 'processOrder') {
                    value = (row === 'product' && props.outOfStock !== props.productIndex && !props.replacement) ? props.qty : null;
                } else if (props.type === 'orderDetails') {
                    value = (row === 'product') ? props.qty : null;
                }
                break;

            case 'price':
                if (row === 'product') {
                    value = props.price;

                } else if (row === 'outOfStock') {
                    value = null;

                } else if (row === 'install') {
                    value = product.applianceInstallPrice;

                } else if (row === 'remove') {
                    value = product.applianceRemovalPrice;

                } else if (row === 'disconnect') {
                    value = product.applianceDisconnectPrice;
                }

                value = (props.outOfStock !== props.productIndex && !props.replacement) ? value : null;
                break;
            }
            cols[key] = value;
        });
        return cols;
    });

    const productDetailsTable = <MyTable
        type="productDetails"
        headers={(props.productIndex === 0) ? props.productHeaders : null}
        data={productDetails}
    />;

    return <table className="product-table">
        <colgroup>
            <col span="1" className="product-image-colspan" />
            <col span="1" className="product-details-colspan" />
        </colgroup>
        <tbody>
            <tr className="product-table-container-row">
                <td className="product-image-table">{ productImageTable }</td>
                <td className="product-details-table">{ productDetailsTable }</td>
            </tr>
        </tbody>
    </table>;
}