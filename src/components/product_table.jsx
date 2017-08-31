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
// updateOrderProducts
// showOutOfStock

export default function ProductTable(props) {
    const product = props.product;
    const imageData = [[<img src={props.image} alt="productImg" height="100" width="auto" />]];

    const productImageTable = <MyTable
        className="product-details-image-table"
        type="productDetailsImage"
        headers={{productImage: 'Product'}}
        data={imageData}
    />;

    const productDetailHeaders = {
        productDescription: '',
        code: 'Model # or Code #',
        qty: 'Qty',
        price: 'Cost'
    };

    const productDetailRows = ['product', 'outOfStock', 'install', 'remove', 'disconnect'];

    const productDetails = _.map(productDetailRows, (row) => {
        let cols = {};
        _.each(productDetailHeaders, (header, key) => {
            let value;
            switch(key) {
            case 'productDescription':
                if (row === 'product') {
                    value = product.applianceDescription;

                } else if (row === 'outOfStock') {
                    value = (props.outOfStock !== props.productIndex) ? <div className="btn blue" onClick={() => props.showOutOfStock({ productIndex: props.productIndex })} >Out of Stock?</div> : <div className="btn cancel-btn" onClick={() => props.showOutOfStock({ productIndex: '' })} >Cancel</div>;

                } else if (row === 'install') {
                    value = (props.outOfStock !== props.productIndex) ? `Install Description: ${ product.applianceInstallDescription }` : <form onSubmit={(e) => {e.preventDefault(); props.updateOrderProducts();}}>
                        <label htmlFor="model-num-replace" >Enter Model # to replace product</label>
                        <input name="model-num-replace" value={props.modelNumber} placeholder="GTE18GT" onChange={(e) => props.update({ type: 'modelNumber', value: e.target.value })} required />
                        <input className="btn blue" type="submit" value="Replace" />
                    </form>;

                } else if (row === 'remove') {
                    value = (props.outOfStock !== props.productIndex) ? `Remove Appliance Description: ${ product.applianceRemovalDescription }` : '';

                } else if (row === 'disconnect') {
                    value = (props.outOfStock !== props.productIndex) ? `Disconnect Fee: ${ '*** missing ***' }` : '';
                }
                break;

            case 'code':
                if (row === 'product') {
                    value = `Model #${ product.sibiModelNumber }`;

                } else if (row === 'outOfStock') {
                    value = ''

                } else if (row === 'install') {
                    value = `Install Code #${ product.applianceInstallCode }`;

                } else if (row === 'remove') {
                    value = `Remove Code #${ product.applianceRemovalCode }`;

                } else if (row === 'disconnect') {
                    value = `Disconnect Code #${ '*** missing ***' }`;
                }

                value = (props.outOfStock !== props.productIndex) ? value : '';
                break;

            case 'qty':
                value = (row === 'product' && props.outOfStock !== props.productIndex) ? props.qty : '';
                break;

            case 'price':
                if (row === 'product') {
                    value = props.price;

                } else if (row === 'outOfStock') {
                    value = '';

                } else if (row === 'install') {
                    value = product.applianceInstallPrice;

                } else if (row === 'remove') {
                    value = product.applianceRemovalPrice;

                } else if (row === 'disconnect') {
                    value = 'missing';
                }

                value = (props.outOfStock !== props.productIndex) ? value : '';
                break;
            }
            cols[key] = value;
        });
        return cols;
    });

    const productDetailsTable = <MyTable
        className="product-details-table"
        type="productDetails"
        headers={productDetailHeaders}
        data={productDetails}
    />;

    return <table className="product-table">
        <colgroup>
            <col span="1" style={{width: '10%'}} />
            <col span="1" style={{width: '90%'}} />
        </colgroup>
        <tbody>
            <tr>
                <td>{ productImageTable }</td>
                <td>{ productDetailsTable }</td>
            </tr>
        </tbody>
    </table>;
}