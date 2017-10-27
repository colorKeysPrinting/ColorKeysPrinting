import React                                                from 'react';
import _                                                    from 'lodash';

import assets                                               from 'libs/assets';
import MyTable                                              from 'components/my_table';

export default function ProductTable(props) {
    const product = props.product;

    const isOutOfStockActive = (props.outOfStock !== props.productIndex);
    const productRows = ['product', 'productDetails', 'installerInfo', 'install'];

    if (props.removeOldAppliance) {
        productRows.push('remove');
        productRows.push('disconnect');
    }

    return (
        <MyTable
            type="productDetails"
            className="product-table"
            dataClassName="table-row product-row"
            headers={props.productHeaders}
            colspan={props.productHeaders}
            data={_.map(productRows, (row) => {
                let cols = {};
                // key/header are the columns
                _.each(props.productHeaders, (header, key) => {
                    let value;
                    switch(key) {
                    case 'productImage':
                        cols[key] = (row === 'product') ? <img src={props.image} alt="" height="130" width="auto" /> : '';
                        break;
                    case 'productDescription':
                        if (row === 'product') {
                            cols[key] = <div className="no-limit">
                                <span className="product-header">{ (!props.replacement) ? product.applianceDescription : `Replaced with model #: ${props.replacement}` }</span>
                                <div className="table-cell-details">{ `${(props.replacement) ? 'Original' : ''} Model Number: ${(props.manufacturerModelNumber) ? props.manufacturerModelNumber : product.sibiModelNumber}` }</div>
                                {(props.type === '/process_order' && !props.processedAt && props.orderStatus !== 'Pending') ?
                                    (props.permissions.get('updateAllOrders') || props.permissions.get('updateFundOrders')) ?
                                        (isOutOfStockActive) ? <div className="btn blue" onClick={() => props.showOutOfStock({ productIndex: props.productIndex })} >Out of Stock?</div> : <div className="btn borderless cancel-button" onClick={() => props.showOutOfStock({ productIndex: '' })} >Cancel</div>
                                        : null
                                    : null}
                            </div>;

                        } else if (row === 'productDetails') {
                            cols[key] = <div className="no-limit">
                                {(props.outOfStock === props.productIndex) ? (
                                    <form className="replace-form" onSubmit={(e) => {e.preventDefault(); props.updateModelNumber({ productsAndParts: props.productsAndParts });}}>
                                        <div className="input-container">
                                            <label htmlFor="model-num-replace" >Enter Model # to replace product</label>
                                            <input name="model-num-replace" value={props.modelNumber} placeholder="JGB635DEKBB" onChange={(e) => props.update({ type: 'modelNumber', value: e.target.value })} required />
                                        </div>
                                        <input className="btn blue" type="submit" value="Replace" />
                                    </form>
                                ) : (
                                    (!props.replacement) ? (<div>
                                        <div className="table-cell-details">{ `Color: ${props.color}` }</div>
                                        <div className="table-cell-details">{ `Fuel Type: ${product.applianceFuelType}` }</div>
                                        <div className="table-cell-details">{ (product.applianceCapacity) ? `Volume: ${product.applianceCapacity}` : '' }</div>
                                        <div className="table-cell-details">{ `Width: ${product.applianceWidth}` }</div>
                                        <div className="table-cell-details">{ `Height: ${product.applianceHeight}` }</div>
                                        <div className="table-cell-details">{ `Depth: ${product.applianceDepth}` }</div>
                                    </div>) : null
                                )}
                            </div>;

                        } else if (row === 'install') {
                            cols[key] = (isOutOfStockActive) ? <div className="description"><span className="bold"> Install Description: </span> <span>{product.applianceInstallDescription}</span></div> : null

                        } else if (row === 'remove') {
                            cols[key] = (isOutOfStockActive) ? <div className="description"><span className="bold"> Remove Appliance Description: </span><span>{product.applianceRemovalDescription}</span></div> : null

                        } else if (row === 'disconnect') {
                            cols[key] = (isOutOfStockActive) ? <div className="description"><span className="bold"> Disconnect Fee: </span><span>{product.applianceDisconnectDescription}</span></div> : null

                        } else if (row === 'installerInfo') {
                            const installer = props.installer;
                            cols[key] = (isOutOfStockActive) ? <div>
                                <div className="description"><span className="bold"> Installer Info: </span> <span>{ (installer.installType === 'manufacturer') ? props.installerTypes.get(installer.installType) : null }</span></div>
                                {(installer.installType !== 'manufacturer') ? <div className="table-cell-details">Installer: { props.installerTypes.get(installer.installType) }</div> : null}
                                {(installer.installerName) ? <div className="table-cell-details">Name: { installer.installerName}</div> : null}
                                {(installer.installerPhoneNumber) ? <div className="table-cell-details">Phone Number: { installer.installerPhoneNumber}</div> : null}
                                {(installer.installerEmail) ? <div className="table-cell-details">Email: { installer.installerEmail}</div> : null}
                                {(installer.dropOffLocation) ? <div className="table-cell-details">Drop Off Location: { installer.dropOffLocation}</div> : null}
                            </div> : null;
                        }
                        break;

                    case 'code':
                        if ((isOutOfStockActive)) {
                            if (row === 'product' || row === 'outOfStock') {
                                cols[key] = null;

                            } else if (row === 'install') {
                                cols[key] = (props.installAppliance) ? `${ product.applianceInstallCode }` : null;

                            } else if (row === 'remove') {
                                cols[key] = (props.removeOldAppliance) ? `${ product.applianceRemovalCode }` : null;

                            } else if (row === 'disconnect') {
                                cols[key] = (props.removeOldAppliance) ? `${ product.applianceDisconnectCode }` : null;
                            }
                        }
                        break;
                    case 'address':
                        cols[key] = (row === 'product' && isOutOfStockActive) ? props.address : null;
                        break;

                    case 'qty':
                        cols[key] = (row === 'product' && isOutOfStockActive) ? props.qty : null;
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

                        cols[key] = (isOutOfStockActive) ? value : null;
                        break;
                    }
                });
                return cols;
            })}
        />
    );
}