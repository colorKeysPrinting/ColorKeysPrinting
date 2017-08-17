import React                    from 'react';
import { connect }              from 'react-redux';
import { withRouter }           from 'react-router';
import { withCookies }          from 'react-cookie';
import _                        from 'lodash';
import assets                   from 'libs/assets';

import { updateProduct, createProduct, archiveProduct }      from 'ducks/products/actions';

import Overlay                  from 'components/overlay';

class EditProduct extends React.Component {
    constructor(props) {
        super(props);

        const categories = this.props.productCategories.toJS();

        const product = (this.props.location.state.product) ? this.props.location.state.product : {
            name: '',
            manufacturerModelNumber: '',
            serialNumber: '',
            shortDescription: '',
            sku: '',
            overview: '',
            faq: '',
            videos: [],
            productCategoryId: this.props.productCategoryId,
            productSubcategoryId: categories[0].id,
            applianceManufacturerName: '',
            applianceOrderDisplayNumber: this.props.location.state.applianceOrderDisplayNumber + 1,
            applianceType: '',
            applianceSize: '',
            applianceDescription: '',
            sibiModelNumber: '',
            applianceFuelType: '',
            applianceWidth: '',
            applianceHeight: '',
            applianceDepth: '',
            applianceInstallDescription: '',
            applianceInstallPrice: '',
            applianceInstallCode: '',
            applianceColorsAndImages: [],
            applianceAssociatedParts: [],
            applianceSpecSheetUrl: '',
            applianceRemovalDescription: '',
            applianceRemovalCode: '',
            applianceRemovalPrice: '',
        };

        this.state = { 
            activeSection: '', 
            isInstall: false, 
            isRemoval: false,
            image: '',
            color: '',
            ...product 
        };

        this.update = this.update.bind(this);
        this.close = this.close.bind(this);
        this.changeActiveSection = this.changeActiveSection.bind(this);
        this.addColorAndImage = this.addColorAndImage.bind(this);
        this.removeColorAndImage = this.removeColorAndImage.bind(this);
        this.saveProduct = this.saveProduct.bind(this);
    }

    update({ type, value }) {
        this.setState({ [type]: value });

        if (type === 'productSubcategoryId') {
            const products = this.props.products.toJS();
            const categoryName = _.find(this.props.productCategories.toJS(), ['id', value]).name;
            let applianceOrderDisplayNumber = _.size(products[categoryName]);
            this.setState({ applianceOrderDisplayNumber });
        }
    }

    close() {
        this.props.history.goBack();
    }

    changeActiveSection(activeSection) {
        this.setState((prevState) => { 
            activeSection = (prevState.activeSection !== activeSection) ? activeSection : '';

            return { activeSection };
        });
    }

    addColorAndImage() {
        console.log('adding color & image');
        this.setState((prevState) => {
            prevState.applianceColorsAndImages.push({ imageUrl: prevState.image, color: prevState.color });
            document.getElementById('product-image-input').value = null;

            return { applianceColorsAndImages: prevState.applianceColorsAndImages, color: '', image: '' };
        });
    }

    removeColorAndImage({ color }) {
        console.log('removeColorAndImage with color: ', color);
        this.setState((prevState) => {
            const applianceColorsAndImages = _.remove(prevState.applianceColorsAndImages, (element) => { return element.color !== color } );

            return { applianceColorsAndImages };
        });
    }

    saveProduct({ id }) {
        console.log('save product', id);
        const { cookies } = this.props;
        const jwt = cookies.get('sibi-admin-jwt');
        const category = _.find(this.props.productCategories.toJS(), ['id', this.state.productSubcategoryId]);

        const product = {
            name: this.state.name,
            manufacturerModelNumber: this.state.manufacturerModelNumber,
            serialNumber: this.state.serialNumber,
            shortDescription: this.state.shortDescription,
            sku: this.state.sku,
            overview: this.state.overview,
            faq: this.state.faq,
            videos: this.state.videos,
            productCategoryId: this.state.productCategoryId,
            productSubcategoryId: category.id,
            applianceManufacturerName: this.state.applianceManufacturerName,
            applianceOrderDisplayNumber: this.state.applianceOrderDisplayNumber,
            applianceType: category.name,
            applianceSize: this.state.applianceSize,
            applianceDescription: this.state.applianceDescription,
            sibiModelNumber: this.state.sibiModelNumber,
            applianceFuelType: this.state.applianceFuelType,
            applianceWidth: this.state.applianceWidth,
            applianceHeight: this.state.applianceHeight,
            applianceDepth: this.state.applianceDepth,
            applianceInstallDescription: this.state.applianceInstallDescription || '',
            applianceInstallPrice: this.state.applianceInstallPrice,
            applianceInstallCode: this.state.applianceInstallCode,
            applianceColorsAndImages: this.state.applianceColorsAndImages,
            applianceAssociatedParts: this.state.applianceAssociatedParts, // not in api?
            applianceSpecSheetUrl: this.state.applianceSpecSheetUrl,
            applianceRemovalDescription: this.state.applianceRemovalDescription || '',
            applianceRemovalCode: this.state.applianceRemovalCode,
            applianceRemovalPrice: this.state.applianceRemovalPrice,
        };

        if (id) {
            product['id'] = id;
            this.props.updateProduct({ token: jwt.token, category: category.name, product });

        } else {
            this.props.createProduct({ token: jwt.token, category: category.name, product })
        }

        this.props.history.push(`/products`);
    }

    render() {
        const { cookies } = this.props;
        const jwt = cookies.get('sibi-admin-jwt');
        
        const styles = {
            container: {
                backgroundColor: '#F9FAFC',
                borderRadius: '5px',
                border: '1px solid rgba(50, 50, 50, 0.4)',
                boxShadow: '0px 2px 7px 0px rgba(50, 50, 50, 0.4)',
                width: '490px',
                maxHeight: '640px',
                margin: '5em auto',
            },
            titleBar: {
                display: 'inline-flex',
                backgroundColor: '#FFF',
                borderTopLeftRadius: '5px',
                borderTopRightRadius: '5px',
                boxShadow: '0px 2px 7px 0px rgba(50, 50, 50, 0.4)',
                height: '20%',
                width: '100%'
            },
            title: {
                textAlign: 'left',
                padding: '30px',
                width: '90%'
            },
            close: {
                cursor: 'pointer',
                textAlign: 'right',
                padding: '30px',
                width: '10%'
            },
            content: {
                margin: '20px auto 0px',
                textAlign: 'left',
                display: 'inline-grid',
                maxHeight: '500px',
                overflowY: 'auto'
            },
            checkbox: {
                // width: '60%',
                padding: '30px'
            },
            text: {
                margin: '10px'
            }
        };

        const category = _.find(this.props.productCategories.toJS(), ['id', this.state.productSubcategoryId]);
        const categories = _.map(this.props.productCategories.toJS(), (category) => {
            return <option key={category.id} value={category.id}>{ category.name }</option>;
        });
        const title = (this.props.location.state) ? 'Edit' : 'Add';
        const buttonTxt = (this.state.id) ? 'Update' : 'Add';
        const archiveBtn = (this.state.id) ? <div className="cancel-btn" onClick={() => this.props.archiveProduct({ token: jwt.token, category: category.name, id: this.state.id })}>Archive Product</div> : null;

        const newColorAndImage = <div style={{ display: 'inline-flex' }} >
            <input type="file" id="product-image-input" name="productImage" className="submit-btn" accept=".png,.jpg,.jpeg,.svg" onChange={(e) => {e.preventDefault(); this.update({ type: 'image', value: e.target.files[0] }); }} />
            <input type="text" value={this.state.color} onChange={(e) => this.update({ type: 'color', value: e.target.value })} />
            <div onClick={this.addColorAndImage} className="cancel-btn">Add</div>
        </div>;

        const productPictures = _.map(this.state.applianceColorsAndImages, (image, index) => {
            return (
                <div key={`colorImages${index}`} style={{ display: 'inline-flex', width: '100%' }} >
                    <img src={image.imageUrl} alt="picture" width="auto" height="60" />
                    <input type="text" value={image.color} disabled />
                    <div className="cancel-btn" onClick={()=> this.removeColorAndImage({ color: image.color }) } >X</div>
                </div>
            );
        });
        
        return (
            <Overlay type="editProduct">
                <div style={styles.container}>
                    <div style={styles.titleBar} >
                        <div style={styles.title}>{ title } Product</div>
                        <div onClick={this.close} style={styles.close}>X</div>
                    </div>
                    <form onSubmit={() => this.saveProduct({ id: this.state.id })} >
                        <div style={styles.content}>
                            <div style={{ columnCount: 2 }}>
                                <div>
                                    <div>
                                        <label htmlFor="product-category">Category</label>
                                        <select name="product-category" value={this.state.productSubcategoryId} onChange={(e) => this.update({ type: 'productSubcategoryId', value: e.target.value})} required >
                                            <option disabled defaultValue="" >Select category</option>
                                            { categories }
                                        </select>
                                    </div>

                                    <div>
                                        <label htmlFor="product-name">Product Name</label>
                                        <input name="product-name" type="text" placeholder="Product name" value={this.state.name} onChange={(e) => this.update({ type: 'name', value: e.target.value})} required />
                                    </div>
                                </div>
                                
                                <div>
                                    <div>
                                        <label htmlFor="product-classification">Classification</label>
                                        <input name="product-classification" type="text" placeholder="Classification" value={this.state.applianceDescription} onChange={(e) => this.update({ type: 'applianceDescription', value: e.target.value})} />
                                    </div>
                                    <div>
                                        <label htmlFor="product-size">Size</label>
                                        <input name="product-size" type="text" placeholder="Size" value={this.state.applianceSize} onChange={(e) => this.update({ type: 'applianceSize', value: e.target.value})} />
                                    </div>
                                </div>

                                <div>
                                    <div>
                                        <label htmlFor="product-manuf-name">Manufacturer Name</label>
                                        <input name="product-manuf-name" type="text" placeholder="Manufacturer Name (e.g. GE)" value={this.state.applianceManufacturerName} onChange={(e) => this.update({ type: 'applianceManufacturerName', value: e.target.value})}  />
                                    </div>
                                    <div>
                                        <label htmlFor="product-ordering">Featured #</label>
                                        <input name="product-ordering" type="number" placeholder="Feature Placement (e.g. 2)" value={this.state.applianceOrderDisplayNumber + 1} onChange={(e) => this.update({ type: 'applianceOrderDisplayNumber', value: e.target.value})} />
                                    </div>
                                </div>

                                <div>
                                    <div>
                                        <label htmlFor="product-fuel-type">Fuel Type</label>
                                        <select name="product-fuel-type" value={this.state.applianceFuelType} onChange={(e) => this.update({ type: 'applianceFuelType', value: e.target.value})} >
                                            <option disabled defaultValue="" >Select Fuel Type</option>
                                            <option value="gas">Gas</option>
                                            <option value="electric">Electric</option>
                                        </select>
                                    </div>

                                    <div>
                                        <label htmlFor="product-manuf-model-num">Manufacture Model #</label>
                                        <input name="product-manuf-model-num" type="text" placeholder="Manuf. Model #" value={this.state.manufacturerModelNumber} onChange={(e) => this.update({ type: 'manufacturerModelNumber', value: e.target.value})} required />
                                    </div>
                                </div>

                                <div>
                                    <div>
                                        <label htmlFor="product-sibi-model-num">SIBI Model #</label>
                                        <input name="product-sibi-model-num" type="text" placeholder="SIBI Model #" value={this.state.sibiModelNumber} onChange={(e) => this.update({ type: 'sibiModelNumber', value: e.target.value})} required />
                                    </div>
                                    <div>
                                        <label htmlFor="product-serial-num">Serial #</label>
                                        <input name="product-serial-num" type="text" placeholder="Serial #" value={this.state.serialNumber} onChange={(e) => this.update({ type: 'serialNumber', value: e.target.value})}  />
                                    </div>
                                </div>

                                <div>
                                    <div>
                                        <label htmlFor="product-sku">SKU</label>
                                        <input name="product-sku" type="text" placeholder="sku" value={this.state.sku} onChange={(e) => this.update({ type: 'sku', value: e.target.value})} required />
                                    </div>
                                    <div>
                                        <label htmlFor="product-spec-sheet">Spec Sheet URL</label>
                                        <input name="product-spec-sheet" type="url" placeholder="Spec Sheet URL" value={this.state.applianceSpecSheetUrl} onChange={(e) => this.update({ type: 'applianceSpecSheetUrl', value: e.target.value})} />
                                    </div>
                                </div>
                            </div>
                            <div>
                                <label htmlFor="product-description">Description</label>
                                <textarea name="product-description" placeholder="Short Description" value={this.state.shortDescription} onChange={(e) => this.update({ type: 'shortDescription', value: e.target.value})} maxLength="1000" />
                            </div>
                            <div style={{ columnCount: 2 }}>
                                <div>
                                    <div>
                                        <label htmlFor="product-faq">FAQ</label>
                                        <input name="product-faq" type="text" placeholder="faq" value={this.state.faq} onChange={(e) => this.update({ type: 'faq', value: e.target.value})} />
                                    </div>
                                    <div>
                                        <label htmlFor="product-width">Width</label>
                                        <input name="product-width" type="text" placeholder="Width"  value={this.state.applianceWidth} onChange={(e) => this.update({ type: 'applianceWidth', value: e.target.value})}  />in.
                                    </div>
                                </div>
                            </div>
                            
                            <div style={{ columnCount: 2 }}>
                                <div>
                                    <div>
                                        <label htmlFor="product-height">Height</label>
                                        <input name="product-height" type="text" placeholder="Height" value={this.state.applianceHeight} onChange={(e) => this.update({ type: 'applianceHeight', value: e.target.value})} />in.
                                    </div>
                                    <div>
                                        <label htmlFor="product-depth">Depth</label>
                                        <input name="product-depth" type="text" placeholder="Depth"  value={this.state.applianceDepth} onChange={(e) => this.update({ type: 'applianceDepth', value: e.target.value})}  />in.
                                    </div>
                                </div>
                            </div>

                            <div>
                                <label htmlFor="product-overview">Overview</label>
                                <textarea name="product-overview" type="text" placeholder="overview" value={this.state.overview} onChange={(e) => this.update({ type: 'overview', value: e.target.value})} maxLength="1000" />
                            </div>

                            <div id="accordion">
                                <div id="accordion-pictures" onClick={() => this.changeActiveSection('pictures')}>
                                    <div>{ _.size(this.state.applianceColorsAndImages) } Photos</div>
                                </div>
                                <div style={{ display: (this.state.activeSection === 'pictures') ? 'block' : 'none' }} > 
                                    { productPictures }
                                    { newColorAndImage }
                                </div>
                                <div id="accordion-video" onClick={() => this.changeActiveSection('videos')}>
                                    <div>{ _.size(this.state.applianceColorsAndImages) } Vidoes</div>
                                </div>
                                <div style={{ display: (this.state.activeSection === 'videos') ? 'block' : 'none' }} > showing videos </div>
                                <div id="accordion-parts" onClick={() => this.changeActiveSection('parts')} >
                                    <div>{ _.size(this.state.applianceAssociatedParts) } Parts</div>
                                </div>
                                <div style={{ display: (this.state.activeSection === 'parts') ? 'block' : 'none' }} > showing parts </div>
                            </div>
                            <div style={styles.checkbox}>
                                <input
                                    id="checkbox-is-ge-install"
                                    type="checkbox"
                                    onClick={() => this.update({ type: 'isInstall', value: !this.state.isInstall }) }
                                    checked={this.state.isInstall}
                                    style={{ height: '15px', width: '30px' }}
                                />Option for GE to install
                            </div>
                            <div style={{ display: (this.state.isInstall) ? 'inline-flex' : 'none' }} >
                                <div>
                                    <label htmlFor="product-install-code">Install Code</label>
                                    <input name="product-install-code" type="text" placeholder="install code (e.g. M106)" value={this.state.applianceInstallCode} onChange={(e) => this.update({ type: 'applianceInstallCode', value: e.target.value})} />
                                </div>
                                <div>
                                    <label htmlFor="product-install-value">Install Value</label>
                                    <input name="product-install-value" type="number" placeholder="install value (e.g. 0.00)" value={this.state.applianceInstallPrice} onChange={(e) => this.update({ type: 'applianceInstallPrice', value: e.target.value})} />
                                </div>
                                <div>
                                    <label htmlFor="product-install-descr">Install Description</label>
                                    <textarea name="product-install-descr" type="text" placeholder="Install Description" value={this.state.applianceInstallDescription} onChange={(e) => this.update({ type: 'applianceInstallDescription', value: e.target.value})} />
                                </div>
                            </div>
                            <div style={styles.checkbox}>
                                <input
                                    id="checkbox-is-ge-remove-old"
                                    type="checkbox"
                                    onClick={() => this.update({ type: 'isRemoval', value: !this.state.isRemoval }) }
                                    checked={this.state.isRemoval}
                                    style={{ height: '15px', width: '30px' }}
                                />Option for GE to remove old appliance
                            </div>
                            <div style={{ display: (this.state.isRemoval) ? 'inline-flex' : 'none' }} >
                                <div>
                                    <label htmlFor="product-removal-code">Removal Code</label>
                                    <input name="product-removal-code" type="text" placeholder="removal code (e.g. M106)" value={this.state.applianceRemovalCode} onChange={(e) => this.update({ type: 'applianceRemovalCode', value: e.target.value})} />
                                </div>
                                <div>
                                    <label htmlFor="product-removal-value">Removal Value</label>
                                    <input name="product-removal-value" type="number" placeholder="removal value (e.g. 0.00)" value={this.state.applianceRemovalPrice} onChange={(e) => this.update({ type: 'applianceRemovalPrice', value: e.target.value})}/>
                                </div>
                                <div>
                                    <label htmlFor="product-removal-descr">Removal Description</label>
                                    <textarea name="product-removal-descr" type="text" placeholder="Removal Description" value={this.state.applianceRemovalDescription} onChange={(e) => this.update({ type: 'applianceRemovalDescription', value: e.target.value})} />
                                </div>
                            </div>
                        </div>
                        <input className="submit-btn" type="submit" value={buttonTxt} style={{ width: '89%' }} />
                        { archiveBtn }
                    </form>
                </div>
            </Overlay>
        );
    }
}

const select = (state) => ({
    activeUser          : state.activeUser.get('activeUser'),
    products            : state.products.get('products'),
    productCategories   : state.products.get('productCategories'),
    productCategoryId   : state.products.get('productCategoryId')
});

const actions = {
    updateProduct, 
    createProduct,
    archiveProduct
};

export default connect(select, actions, null, { withRef: true })(withRouter(withCookies(EditProduct)));