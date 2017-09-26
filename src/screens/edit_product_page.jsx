import React                    from 'react';
import { connect }              from 'react-redux';
import { withRouter }           from 'react-router';
import { withCookies }          from 'react-cookie';
import _                        from 'lodash';
import assets                   from 'libs/assets';
import Select                   from 'react-select';
import Loader                   from 'react-loader';

import { triggerSpinner }       from 'ducks/ui/actions';
import * as productsActions     from 'ducks/products/actions';
import * as productActions      from 'ducks/product/actions';
import * as partActions         from 'ducks/part/actions';
import { uploadImage }          from 'ducks/assets/actions';
import { setActiveTab }         from 'ducks/header/actions';

import Appliance                from 'components/products/appliance';
import Hvac                     from 'components/products/hvac';
import Paint                    from 'components/products/paint';

import EditPartOverlay          from 'components/edit_part_overlay';

class EditProductPage extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            activeSection: ''
        }

        this.close = this.close.bind(this);
        this.modifyExistingProduct = this.modifyExistingProduct.bind(this);
        this.showAddPart = this.showAddPart.bind(this);
        this.removePart = this.removePart.bind(this);
        this.saveProduct = this.saveProduct.bind(this);
    }

    componentWillMount() {
        const { cookies, productCategories } = this.props;
        const jwt = cookies.get('sibi-admin-jwt');

        if (jwt) {
            this.props.triggerSpinner({ isOn: true });
            this.props.getProducts({ token: jwt.token });
            this.props.getParts({ token: jwt.token });

            const reProduct = /productId=(.*)/;
            const match = reProduct.exec(location.search);

            if (match) {
                this.props.getProductById({ token: jwt.token, id: match[1] });
                this.props.verifyProduct({ verified: true });
            } else {
                this.props.verifyProduct({ verified: false });
                this.props.resetFound();
                this.props.newProduct();
            }

            if (productCategories.size <= 0) {
                this.props.getUserProductCategories({ token: jwt.token, category: jwt.trade });
            }
        } else {
            this.props.history.push(`/login`);
        }

        this.props.setActiveTab('products');
    }

    componentWillUpdate(nextProps) {
        if(!_.isEqual(nextProps.imageUploadURL, this.props.imageUploadURL)) {
            const type = nextProps.imageUploadURL.get('type');
            const image = nextProps.imageUploadURL.get('imageURL');
            (type === 'product') ? this.props.update({ key: 'productImage', value: image }) : this.props.updatePartLocal({ isPart: true, key: 'imageUrl', value: image });
        }

        if(!_.isEqual(nextProps.part, this.props.part)) {
            if (nextProps.part.size > 0) {
                this.setState({ activeSection: 'partOverlay' });
            }
        }
    }

    componentWillUnmount() {
        this.props.clearProduct();
    }

    changeActiveSection(activeSection) {
        this.setState((prevState) => {
            activeSection = (prevState.activeSection !== activeSection) ? activeSection : '';

            return { activeSection };
        });
    }

    close() {
        this.setState({ activeSection: '' });
    }

    modifyExistingProduct({ token }) {
        let { product, products } = this.props;

        product = _.find(products.toJS(), ['sibiModelNumber', product.get('sibiModelNumber')]);
        this.props.getProductById({ token, id: product.id });
        this.props.verifyProduct({ verified: true });
        this.props.resetFound();
    }

    showAddPart({ token, productCategoryId, partId }) {
        (partId) ? this.props.getPartById({ token, partId }) : this.props.newPart({ productCategoryId });
    }

    removePart({ token, partId }) {
        const { product } = this.props;
        (product.get('id')) ? this.props.removePart({ token, productId: product.get('id'), partId }) : this.props.removePartLocal({ partId });
    }

    saveProduct({ token, category }) {
        const { history } = this.props;
        let product = this.props.product.toJS();

        _.each(product, (value, key) => {
            if(key === 'applianceAssociatedParts' || value === '' || typeof value === 'object' && _.size(value) === 0) {
                delete product[key];
            }
        });

        product['sortIndex'] = ((product.sortIndex - 1) <= 0) ? 0 : product.sortIndex - 1;

        (product.id) ? this.props.updateProduct({ token, category, product }) : this.props.createProduct({ token, category, product });
        history.push(`/products`);
    }

    render() {
        const {
            cookies,
            history,
            location,
            spinner,
            activeUser,
            product,
            productCategories,
            isProductVerified,
            isProductFound,
            part,
            parts,
            isPartVerified,
            isPartFound
        } = this.props;

        let isDisabled = false, pageContent, subCategoryOptions;
        const jwt = cookies.get('sibi-admin-jwt');

        if (activeUser.size > 0 &&
            productCategories.size > 0 &&
            product.size > 0) {

            isDisabled = (activeUser.toJS().type === 'superAdmin') ? false : true;

            const categoryOptions = [
                { label: 'Select Category', value: '', disabled: true },
                ...(_.map(productCategories.toJS(), (category) => {
                    if (category.name === activeUser.get('trade')) { // TODO: need to update this to account for all category types, if user has multiple trades.
                        return { label: category.name, value: category.id };
                    }
                }))
            ];

            const category = _.find(productCategories.toJS(), ['id', product.get('productCategoryId')]);
            if (category) {
                let subCategories = [];
                const subSubCategories = [];
                _.each(category.subcategories, (subcategory) => {
                    if (!subcategory.containedSubCategories) {
                        subCategories.push({ label: subcategory.name, value: subcategory.id });
                    } else {
                        subSubCategories.push({ label: subcategory.name, value: subcategory.id, disabled: true });
                        _.each(subcategory.containedSubCategories, (subSubCategory) => {
                            subSubCategories.push({ label: subSubCategory.name, value: subSubCategory.id });
                        });
                    }
                });

                subCategories = subCategories.concat(subSubCategories);

                subCategoryOptions = [
                    { label: 'Select Sub-Category', value: '', disabled: true },
                    ...subCategories
                ];
            }

            if (!isProductFound) {
                if (isProductVerified) {
                    pageContent = <div>
                        <div className="product-details" >
                            <Select
                                name="product-category"
                                className="left-col"
                                value={product.get('productCategoryId')}
                                options={categoryOptions}
                                onChange={(selected) => (!isDisabled) ? this.props.update({ isProduct: true, key: 'productCategoryId', value: (selected) ? selected.value : null }) : console.log(`you don't have permission to change!`)}
                            />
                            <Select
                                name="product-sub-category"
                                className="center-col"
                                value={product.get('productSubcategoryId')}
                                options={subCategoryOptions}
                                onChange={(selected) => (!isDisabled) ? this.props.update({ isProduct: true, key: 'productSubcategoryId', value: (selected) ? selected.value : null }) : console.log(`you don't have permission to change!`)}
                                required
                            />
                            <input name="product-name" className="right-col" type="text" placeholder="Product name" value={product.get('name')} onChange={(e) => this.props.update({ isProduct: true, key: 'name', value: e.target.value})} required disabled={isDisabled} />
                            <input name="product-ordering" className="left-col" type="number" placeholder="Feature Placement (e.g. 2)" value={product.get('sortIndex')} onChange={(e) => this.props.update({ isProduct: true, key: 'sortIndex', value: e.target.value})} />
                            <input name="product-sku" className="center-col" type="text" placeholder="sku" value={product.get('sku')} onChange={(e) => this.props.update({ isProduct: true, key: 'sku', value: e.target.value})} required disabled={isDisabled} />
                            <input name="product-serial-num" className="right-col" type="text" placeholder="Serial #" value={product.get('serialNumber')} onChange={(e) => this.props.update({ isProduct: true, key: 'serialNumber', value: e.target.value})} disabled={isDisabled} />
                            {(category && category.name === 'APPLIANCES') ?
                                <Appliance
                                    token={jwt.token}
                                    isDisabled={isDisabled}
                                    image={this.props.productImage}
                                    color={this.props.color}
                                    productCategoryId={product.get('productCategoryId')}
                                    applianceManufacturerName={product.get('applianceManufacturerName')}
                                    applianceType={product.get('applianceType')}
                                    applianceSize={product.get('applianceSize')}
                                    applianceDescription={product.get('applianceDescription')}
                                    applianceFuelType={product.get('applianceFuelType')}
                                    applianceWidth={product.get('applianceWidth')}
                                    applianceHeight={product.get('applianceHeight')}
                                    applianceDepth={product.get('applianceDepth')}
                                    applianceInstallDescription={product.get('applianceInstallDescription')}
                                    applianceInstallPrice={parseFloat(product.get('applianceInstallPrice'))}
                                    applianceInstallCode={product.get('applianceInstallCode')}
                                    applianceInstallDescription2={product.get('applianceInstallDescription2')}
                                    applianceInstallPrice2={parseFloat(product.get('applianceInstallPrice2'))}
                                    applianceInstallCode2={product.get('applianceInstallCode2')}
                                    applianceColorsInfo={product.get('applianceColorsInfo').toJS()}
                                    applianceSpecSheetUrl={product.get('applianceSpecSheetUrl')}
                                    applianceRemovalDescription={product.get('applianceRemovalDescription')}
                                    applianceRemovalCode={product.get('applianceRemovalCode')}
                                    applianceRemovalPrice={parseFloat(product.get('applianceRemovalPrice'))}
                                    applianceDisconnectDescription={product.get('applianceDisconnectDescription')}
                                    applianceDisconnectCode={product.get('applianceDisconnectCode')}
                                    applianceDisconnectPrice={parseFloat(product.get('applianceDisconnectPrice'))}
                                    applianceAssociatedParts={product.get('applianceAssociatedParts').toJS()}

                                    update={this.props.update}
                                    uploadImage={this.props.uploadImage}
                                    addColorAndImage={this.props.addColorAndImage}
                                    removeColorAndImage={this.props.removeColorAndImage}
                                    showAddPart={this.showAddPart}
                                    removePart={this.removePart}
                                /> : null
                            }
                            {(category && category.name === 'HVAC') ?
                                <Hvac /> : null
                            }
                            {(category && category.name === 'PAINT') ?
                                <Paint /> : null
                            }
                            <textarea name="product-shortDescription" placeholder="Short Description" value={product.get('shortDescription')} onChange={(e) => this.props.update({ isProduct: true, key: 'shortDescription', value: e.target.value})} maxLength="1000" disabled={isDisabled} />
                            <textarea name="product-overview" placeholder="overview" value={product.get('overview')} onChange={(e) => this.props.update({ isProduct: true, key: 'overview', value: e.target.value})} maxLength="1000" disabled={isDisabled} />
                            <div className="accordion">
                                {/* ************************************** faq section ************************************** */}
                                <div id="accordion-faq" className={(this.state.activeSection === 'faq') ? 'headers-active' : 'headers' } onClick={() => this.changeActiveSection('faq')}>
                                    <div>{ product.get('faq').size } FAQs</div>
                                    <img className="accordion-arrow" src={(this.state.activeSection === 'faq') ? assets('./images/icons-arrow-up.png') : assets('./images/icons-arrow-down.png') } />
                                </div>
                                <div className="accordion-detail" style={{ display: (this.state.activeSection === 'faq') ? 'block' : 'none' }} >
                                    { _.map(product.get('faq').toJS(), (faq, index) => {
                                        return (
                                            <div key={`faq${index}`} className="faq-section accordion-detail-row" style={{ display: 'inline-flex'}} >
                                                <input type="text" value={faq.Question} disabled />
                                                <input type="text" value={faq.Answer} disabled />
                                                {(!isDisabled) ? <div className="add-btn" onClick={()=> this.props.removeFaq({ index }) } ><img src={assets('./images/icon-x-big.svg')} /></div> : null}
                                            </div>
                                        );
                                    }) }
                                    { (!isDisabled) ? <div className="accordion-detail-row" style={{ display: 'inline-flex' }} >
                                        <input type="text" value={this.props.Question} placeholder="Question" onChange={(e) => this.props.update({ key: 'Question', value: e.target.value })} />
                                        <input type="text" value={this.props.Answer}   placeholder="Answer"   onChange={(e) => this.props.update({ key: 'Answer', value: e.target.value })} />
                                        <div onClick={this.props.addFAQ} className="add-btn blue">Add</div>
                                    </div> : null }
                                </div>

                                {/* ************************************** video section ************************************** */}
                                <div id="accordion-video" className={(this.state.activeSection === 'videos') ? 'headers-active' : 'headers' } onClick={() => this.changeActiveSection('videos')}>
                                    <div>{ product.get('videos').size } Vidoes</div>
                                    <img className="accordion-arrow" src={(this.state.activeSection === 'videos') ? assets('./images/icons-arrow-up.png') : assets('./images/icons-arrow-down.png') } />
                                </div>
                                <div className="accordion-detail" style={{ display: (this.state.activeSection === 'videos') ? 'block' : 'none' }} >
                                    { _.map(product.get('videos').toJS(), (video, index) => {
                                        return (
                                            <div key={`colorImages${index}`} className="videos-section accordion-detail-row" style={{ display: 'inline-flex', width: '100%' }} >
                                                <input type="text" value={video} disabled />
                                                {(!isDisabled) ? <div className="add-btn" onClick={()=> this.props.removeVideo({ index }) } ><img src={assets('./images/icon-x-big.svg')} /></div> : null}
                                            </div>
                                        );
                                    }) }
                                    { (!isDisabled) ? <div className="accordion-detail-row" style={{ display: 'inline-flex' }} >
                                        <input type="url" value={this.props.videoURL} placeholder="video URL" onChange={(e) => this.props.update({ key: 'videoURL', value: e.target.value })} />
                                        <div onClick={this.props.addVideo} className="add-btn blue">Add</div>
                                    </div> : null }
                                </div>
                            </div>
                            <input className="btn blue fill" type="submit" value={(product.get('id')) ? 'Update' : 'Add'} />
                            { (product.get('id') && !isDisabled) ? <div className="btn borderless red fill" onClick={() => {
                                this.props.archiveProduct({ token: jwt.token, category: jwt.trade, id: product.get('id')});
                                history.push(`/products`);
                            }}>Archive Product</div> : null }
                        </div>
                    </div>
                }
            } else {
                pageContent = <dialog open>
                    <form method="dialog">
                        Alert:
                        <p>A product with this Sibi Model Number already exists!</p>
                        Do you wish to:
                        <p> - continue creating a new product (this will completely replace the existing product)</p>
                        <p> - modify the existing product?</p>
                        <input className="btn borderless red fill" type="submit" value="Create New" onClick={() => {
                            this.props.verifyProduct({ verified: true });
                            this.props.resetFound();
                            this.props.newProduct();
                        }} />
                        <input className="btn blue" type="submit" value="Modify Existing" onClick={() => this.modifyExistingProduct({ token: jwt.token })} />
                    </form>
                </dialog>
            }
            this.props.triggerSpinner({ isOn: false });
        }

        return (
            <Loader loaded={spinner} >
                <div id="edit-product-page">
                    <div className="title-bar">
                        <h2>{ (location.search) ? 'Edit' : 'Add' } Product</h2>
                    </div>
                    <hr />
                    <form onSubmit={(e) => {e.preventDefault(); this.props.checkModelNum({ key: 'product', modelNumber: product.get('sibiModelNumber') });}} >
                        <div className="model-number-section">
                            <input
                                name="product-sibi-model-num"
                                className="search-input"
                                type="text"
                                placeholder="SIBI Model #"
                                value={(product.size > 0) ? product.get('sibiModelNumber') : ''}
                                onChange={(e) => {
                                    this.props.verifyProduct({ verified: false });
                                    this.props.update({ isProduct: true, key: 'sibiModelNumber', value: e.target.value });
                                }}
                                disabled={isDisabled}
                                required
                            />
                            { (!isProductVerified && !isDisabled) ? <input className="btn blue" type="submit" value="Add"/> : null }
                        </div>
                    </form>
                    <hr/>
                    <form onSubmit={(e) => {e.preventDefault(); this.saveProduct({ token: jwt.token, category: jwt.trade });}} >
                        { pageContent }
                    </form>
                    { (this.state.activeSection === 'partOverlay') ?
                        (<EditPartOverlay
                            token={jwt.token}
                            isDisabled={isDisabled}
                            productId={product.get('id')}
                            productCategoryId={(part.get('productCategoryId')) ? part.get('productCategoryId') : product.get('productCategoryId')}
                            id={part.get('id')}
                            description={part.get('description')}
                            code={part.get('code')}
                            imageUrl={part.get('imageUrl')}
                            modelNumber={part.get('modelNumber')}
                            gePrice={parseFloat(part.get('gePrice'))}
                            sibiPrice={parseFloat(part.get('sibiPrice'))}
                            includedInManufacturerInstall={part.get('includedInManufacturerInstall')}
                            isPartVerified={isPartVerified}
                            isPartFound={isPartFound}
                            parts={parts}
                            update={this.props.updatePartLocal}
                            uploadImage={this.props.uploadImage}
                            checkModelNum={this.props.checkModelNum}
                            clearPart={this.props.clearPart}
                            createPart={this.props.createpart}
                            getPartById={this.props.getPartById}
                            verifyPart={this.props.verifyPart}
                            resetFound={this.props.resetFound}
                            close={this.close}
                            createPart={this.props.createPart}
                            updatePart={this.props.updatePart}
                        />): null }
                </div>
            </Loader>
        );
    }
}

const select = (state) => ({
    spinner              : state.ui.get('spinner'),
    activeUser           : state.activeUser.get('activeUser'),
    imageUploadURL       : state.assets.get('imageUploadURL'),

    product              : state.product.get('product'),
    productImage         : state.product.get('productImage'),
    color                : state.product.get('color'),
    Question             : state.product.get('Question'),
    Answer               : state.product.get('Answer'),
    videoURL             : state.product.get('videoURL'),
    part                 : state.part.get('part'),
    products             : state.products.get('products'),
    parts                : state.products.get('parts'),
    productCategories    : state.products.get('productCategories'),
    isProductVerified    : state.products.get('isProductVerified'),
    isProductFound       : state.products.get('isProductFound'),
    isPartVerified       : state.products.get('isPartVerified'),
    isPartFound          : state.products.get('isPartFound'),
});

const actions = {
    triggerSpinner,
    ...productsActions,
    ...productActions,
    ...partActions,
    uploadImage,
    setActiveTab
};

export default connect(select, actions, null, { withRef: true })(withRouter(withCookies(EditProductPage)));