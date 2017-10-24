import React                                                from 'react';
import _                                                    from 'lodash';

import assets                                               from 'libs/assets';
import MyTable                                              from 'components/my_table';

export default function ProductTable(props) {
    const product = props.product;

    const productDetails = _.map(['product', 'outOfStock', 'install', 'remove', 'disconnect'], (row) => {
        let cols = {};
        _.each(props.productHeaders, (header, key) => {
            let value;
            switch(key) {
            case 'productDescription':
                if (row === 'product') {
                    value = <div className="no-limit">
                        <span className="product-header">{ (!props.replacement) ? product.applianceDescription : `Replaced with model #: ${props.replacement}` }</span>
                        <div className="table-cell-details">{ `${(props.replacement) ? 'Original' : ''} Model Number: ${(props.manufacturerModelNumber) ? props.manufacturerModelNumber : product.sibiModelNumber}` }</div>
                    </div>;

                } else if (row === 'outOfStock') {
                    if (props.type === 'processOrder') {
                        if (props.permissions.updateAllOrders || props.permissions.updateFundOrders) {
                            value = (props.outOfStock !== props.productIndex) ? <div className="btn blue" onClick={() => props.showOutOfStock({ productIndex: props.productIndex })} >Out of Stock?</div> : <div className="btn borderless cancel-button" onClick={() => props.showOutOfStock({ productIndex: '' })} >Cancel</div>;
                        }

                    } else if (props.type === 'orderDetails') {
                        value = (!props.replacement) ? <div className="no-limit">
                            <div className="table-cell-details">{ `Color: ${props.color}` }</div>
                            <div className="table-cell-details">{ `Fuel Type: ${product.applianceFuelType}` }</div>
                            <div className="table-cell-details">{ (product.applianceCapacity) ? `Volume: ${product.applianceCapacity}` : '' }</div>
                            <div className="table-cell-details">{ `Width: ${product.applianceWidth}` }</div>
                            <div className="table-cell-details">{ `Height: ${product.applianceHeight}` }</div>
                            <div className="table-cell-details">{ `Depth: ${product.applianceDepth}` }</div>
                        </div> : null;
                    }
                } else if (row === 'install') {
                    value = (props.type === 'processOrder' && props.outOfStock === props.productIndex) ?
                        (
                            <form className="replace-form" onSubmit={(e) => {e.preventDefault(); props.updateModelNumber({ productsAndParts: props.productsAndParts });}}>
                                <div className="input-container">
                                    <label htmlFor="model-num-replace" >Enter Model # to replace product</label>
                                    <input name="model-num-replace" value={props.modelNumber} placeholder="JGB635DEKBB" onChange={(e) => props.update({ type: 'modelNumber', value: e.target.value })} required />
                                </div>
                                <input className="btn blue" type="submit" value="Replace" />
                            </form>
                        ) : (
                            (props.installAppliance) ? <div className="description"><span className="bold"> Install Description: </span> <span>{product.applianceInstallDescription}</span></div> : null
                        );

                } else if (row === 'remove') {
                    value = (props.removeOldAppliance) ? (
                        (props.outOfStock !== props.productIndex) ? <div className="description"><span className="bold"> Remove Appliance Description: </span><span>{product.applianceRemovalDescription}</span></div> : null
                    ) : null;

                } else if (row === 'disconnect') {
                    value = (props.removeOldAppliance) ? (
                        (props.outOfStock !== props.productIndex) ? <div className="description"><span className="bold"> Disconnect Fee: </span><span>{product.applianceDisconnectDescription}</span></div> : null
                    ) : null;
                }
                break;

            case 'code':
            case 'address':
                if (row === 'product') {
                    if (props.type === 'orderDetails') {
                        value = props.address;
                    }

                } else if (row === 'outOfStock') {
                    value = null;

                } else if (row === 'install') {
                    value = (props.type === 'processOrder' && props.installAppliance) ? `#${ product.applianceInstallCode }` : null;

                } else if (row === 'remove') {
                    value = (props.type === 'processOrder' && props.removeOldAppliance) ? `#${ product.applianceRemovalCode }` : null;

                } else if (row === 'disconnect') {
                    value = (props.type === 'processOrder' && props.removeOldAppliance) ? `#${ product.applianceDisconnectCode }` : null;
                }

                value = (props.outOfStock !== props.productIndex) ? value : null;
                break;

            case 'qty':
                if (props.type === 'processOrder') {
                    value = (row === 'product' && props.outOfStock !== props.productIndex) ? props.qty : null;
                } else if (props.type === 'orderDetails') {
                    value = (row === 'product') ? props.qty : null;
                }
                break;

            case 'price':
                if (row === 'product') {
                    value = (`$${props.price}`);

                } else if (row === 'outOfStock') {
                    value = null;

                } else if (row === 'install') {
                    value = (props.installAppliance) ? (`$${product.applianceInstallPrice}`) : null;

                } else if (row === 'remove') {
                    value = (props.removeOldAppliance) ? (`$${product.applianceRemovalPrice}`) : null;

                } else if (row === 'disconnect') {
                    value = (props.removeOldAppliance) ? (`$${product.applianceDisconnectPrice}`) : null;
                }

                if (props.type === 'processOrder') {
                    value = (props.outOfStock !== props.productIndex) ? value : null;
                }
                break;
            }
            cols[key] = value;
        });
        return cols;
    });

    return <table className="product-table">
        <colgroup>
            <col span="1" className="product-image-colspan" />
            <col span="1" className="product-details-colspan" />
        </colgroup>
        <tbody>
            <tr className="product-table-container-row">
                <td className="product-image-table">
                    <MyTable
                        type="productDetailsImage"
                        headers={(props.productIndex === 0) ? {productImage: 'Product'} : null}
                        data={(!props.replacement) ? [[<img src={props.image} alt="" height="100" width="auto" />]] : null}
                    />
                </td>
                <td className="product-details-table">
                    <MyTable
                        type="productDetails"
                        dataClassName={(props.productIndex !== 0) ? "table-row product-row" : null }
                        headers={(props.productIndex === 0) ? props.productHeaders : null}
                        data={productDetails}
                    />
                </td>
            </tr>
        </tbody>
    </table>;
}