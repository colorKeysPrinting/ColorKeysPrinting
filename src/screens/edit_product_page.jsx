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

import EditPartOverlay          from 'components/edit_part_overlay';

import Appliance                from 'components/products/appliance';
import Hvac                     from 'components/products/hvac';
import Paint                    from 'components/products/paint';

class EditProductPage extends React.Component {
    constructor(props) {
        super(props);

        // this.state = {
        //     isPartShowing: false,
        //     isPartModelNumFound: true,
        //     showPartsDialog: false,
        //     isProductImage: false,
        //     tempPart: {},
        // };

        this.state = {
            activeSection: '',
            showDialog: false,
        }

        // update function
        this.changeActiveSection = this.changeActiveSection.bind(this);
        // this.showAddPart = this.showAddPart.bind(this);

        // product attr. functions
        this.addColorAndImage = this.addColorAndImage.bind(this);
        // this.removePart = this.removePart.bind(this);

        // action functions
        // this.createNewPart = this.createNewPart.bind(this);
        this.modifyExistingProduct = this.modifyExistingProduct.bind(this);
        // this.modifyExistingPart = this.modifyExistingPart.bind(this);
        // this.savePart = this.savePart.bind(this);
        // this.addPart = this.addPart.bind(this);
        this.saveProduct = this.saveProduct.bind(this);
        this.archiveProduct = this.archiveProduct.bind(this);
        this.submitProduct = this.submitProduct.bind(this);
    }

    componentWillMount() {
        const { cookies, activeUser, productCategories } = this.props;
        const jwt = cookies.get('sibi-admin-jwt');

        if (jwt) {
            this.props.triggerSpinner({ isOn: true });
            this.props.getProducts({ token: jwt.token });
            this.props.getParts({ token: jwt.token });

            const reProduct = /productId=(.*)/;
            const match = reProduct.exec(location.search);

            if (match) {
                this.props.getProductById({ token: jwt.token, id: match[1] });
                this.props.productVerified();
            } else {
                this.props.newProduct();
                this.props.productVerified();
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
        const { cookies, products, productCategories, location, part } = this.props;

        // if (!_.isEqual(nextProps.product, this.props.product)) {
        //     const product = nextProps.product.toJS();
        //     _.each(this.state.applianceAssociatedParts, (part, index) => {
        //         if (part.isNew && this.state.id) {
        //             const jwt = cookies.get('sibi-admin-jwt');

        //             this.props.createProductPart({ token: jwt.token, productId: this.state.id, partId: part.id });
        //         }
        //     });

        //     this.setState({ ...product });
        // }

        if (!_.isEqual(nextProps.imageUploadSuccess, this.props.imageUploadSuccess)) {
            if (!this.state.isProductImage) {
                this.setState((prevState) => {
                    prevState.applianceColorsInfo.push({ imageUrl: nextProps.imageUploadSuccess, color: prevState.color });

                    return { applianceColorsInfo: prevState.applianceColorsInfo, image: '', color: '' };
                });
            } else {
                this.setState((prevState) => {
                    prevState.part['imageUrl'] = nextProps.imageUploadSuccess;
                    return { isProductImage: false, part: prevState.part };
                });
            }
        }

        if (!_.isEqual(productCategories, nextProps.productCategories)) {
            const jwt = cookies.get('sibi-admin-jwt');

            _.each(nextProps.productCategories.toJS(), (category) => {
                _.each(category.subcategories, (subCategory) => {
                    if (subCategory.containedSubCategories) {
                        _.each(subCategory.containedSubCategories, (subSubCategory) => {
                            this.props.getProductsForSubCategory({ token: jwt.token, category: category.name, subCategory, subSubCategory });
                        });
                    } else {
                        this.props.getProductsForSubCategory({ token: jwt.token, category: category.name, subCategory });
                    }
                });
            });
        }

        if(!_.isEqual(part, nextProps.part)) {
            const newPart = nextProps.part.toJS();
            const index = _.find(this.state.applianceAssociatedParts, ['id', newPart.id]);

            if (index) {
                this.state.applianceAssociatedParts[index] = newPart;

            } else {
                this.state.applianceAssociatedParts.push(newPart);
            }
        }
    }

    componentWillUnmount() {
        this.props.clearProduct();
    }

    // update({ type, value }) {
    //     const { productsInCategory, productCategories, productSubCategories } = this.props;
    //     const re = /^part(.*)/;
    //     const match = re.exec(type)

    //     if (match) {
    //         const type = (match[1]);

    //         if (type === 'modelNumber' && !_.isEqual(value, this.state.part.modelNumber)) {
    //             this.setState({ isPartModelNumFound: true });
    //         }
    //         this.setState((prevState) => {
    //             prevState.part[type] = value;
    //             return { part: prevState.part };
    //         });

    //     } else {
    //         this.setState({ [type]: value });

    //         if (type === 'productSubcategoryId' &&
    //             productsInCategory.size > 0) {
    //             const products = productsInCategory.toJS();
    //             const category = _.find(productCategories.toJS(), ['id', this.state.productCategoryId]);
    //             const subCategory = _.find(productSubCategories.toJS(), ['id', value]);
    //             let sortIndex = _.size(products[category.name][subCategory.name]) + 1;
    //             this.setState({ sortIndex });

    //         } else if (type === 'sibiModelNumber' && !_.isEqual(value, this.state.sibiModelNumber)) {
    //             this.setState({ isSibiModelNumFound: true });
    //         }
    //     }
    // }

    // updateImage({ type, imageFile }) {
    //     const { cookies } = this.props;
    //     const reader = new FileReader();

    //     reader.onload = (e) => {
    //         if (type === 'product') {
    //             // imageUrl - use to show the image on the button
    //             // imageFile - use this to upload to server
    //             this.setState({ image: { imageUrl: e.target.result, imageFile } });

    //         } else if (type === 'part') {
    //             this.setState({ isProductImage: true });
    //             const jwt = cookies.get('sibi-admin-jwt');
    //             this.props.uploadImage({ token: jwt.token, key: imageFile.type, imageFile });
    //         }
    //     }
    //     reader.readAsDataURL(imageFile);
    // }

    changeActiveSection(activeSection) {
        this.setState((prevState) => {
            activeSection = (prevState.activeSection !== activeSection) ? activeSection : '';

            return { activeSection };
        });
    }

    // showAddPart({ part }) {
    //     this.setState((prevState) => {
    //         const isPartShowing = (prevState.isPartShowing) ? false : true;
    //         const isPartModelNumFound = (part) ? false : true;
    //         part = (part) ? part : {
    //             productCategoryId: prevState.productCategoryId,
    //             id          : '',
    //             description : '',
    //             code        : '',
    //             imageUrl    : '',
    //             modelNumber : '',
    //             gePrice     : '',
    //             sibiPrice   : ''
    //         };
    //         return { isPartShowing, isPartModelNumFound, part };
    //     });
    // }

    addColorAndImage() { // TODO switch this to a product action.
        const { cookies, productImage } = this.props;
        const jwt = cookies.get('sibi-admin-jwt');

        const type = productImage.get('imageFile').type;
        const imageFile = productImage.get('imageFile');

        this.props.uploadImage({ token: jwt.token, type, imageFile });
    }

    // removePart({ partId }) {
    //     const { cookies, product } = this.props;

    //     if (product.get('id')) {
    //         const jwt = cookies.get('sibi-admin-jwt');
    //         this.props.removePart({ token: jwt.token, productId: this.state.id, partId });
    //     } else {
    //         this.props.removePartLocal({ partId });
    //     }
    // }

    // createNewPart() {
    //     let { productCategoryId, part } = this.state;
    //     part = {
    //         productCategoryId,
    //         id          : '',
    //         description : '',
    //         code        : '',
    //         imageUrl    : '',
    //         modelNumber : part.modelNumber,
    //         gePrice     : '',
    //         sibiPrice   : ''
    //     };
    //     this.setState({ part, showPartsDialog: false, isPartModelNumFound: false });
    // }

    modifyExistingProduct() {
        const { cookies, products, history } = this.props;
        let { product } = this.props;
        const jwt = cookies.get('sibi-admin-jwt');

        product = _.find(products.toJS(), ['sibiModelNumber', product.get('sibiModelNumber')]);
        this.props.getProductById({ token: jwt.token, id: product.id });
        this.props.resetModelNumberChange();
        this.props.productVerified();
        history.push({ pathname: `/edit_product`, search: `productId=${product.id}` });
    }

    // modifyExistingPart() {
    //     const { parts, history } = this.props;

    //     const part = _.find(parts.toJS(), ['modelNumber', this.state.part.modelNumber]);
    //     this.setState({ part, showPartsDialog: false, isPartModelNumFound: false });
    // }

    // savePart() {
    //     const { cookies } = this.props;
    //     let { part, productCategoryId } = this.state;

    //     const jwt = cookies.get('sibi-admin-jwt');

    //     if (part.id) {
    //         this.props.updatePart({ token: jwt.token, part });
    //     } else {
    //         delete part['id'];
    //         delete part['gePrice']; // TODO: we need to redo how pricing is handled once that is updated REMOVE this line.
    //         delete part['sibiPrice']; // TODO: we need to redo how pricing is handled once that is updated REMOVE this line.
    //         this.props.createPart({ token: jwt.token, part });
    //     }

    //     part = {
    //         productCategoryId,
    //         id          : '',
    //         description : '',
    //         code        : '',
    //         imageUrl    : '',
    //         modelNumber : '',
    //         gePrice     : '',
    //         sibiPrice   : ''
    //     };

    //     this.setState({ isPartShowing: false, showPartsDialog: false, part });
    // }

    // addPart() {
    //     const { cookies } = this.props;
    //     if (this.state.id) {
    //         const jwt = cookies.get('sibi-admin-jwt');
    //         this.props.createProductPart({ token: jwt.token, productId: this.state.id, partId: this.state.tempPart.id });
    //         this.setState({ tempPart: {}, isPartShowing: false });

    //     } else {
    //         this.setState((prevState) => {
    //             prevState.applianceAssociatedParts.push({ isNew: true, ...prevState.tempPart});
    //             return { applianceAssociatedParts: prevState.applianceAssociatedParts, tempPart: {}, isPartShowing: false };
    //         });
    //     }
    // }

    saveProduct() {
        const { cookies } = this.props;

        _.each(this.state.applianceAssociatedParts, (part, index) => {
            if (part.isNew && this.state.id) {
                const jwt = cookies.get('sibi-admin-jwt');

                this.props.createProductPart({ token: jwt.token, productId: this.state.id, partId: part.id });
            }
        });

        this.submitProduct();
    }

    archiveProduct() {
        const { cookies, productCategories, activeUser, history } = this.props;
        let subSubCategory
        const jwt = cookies.get('sibi-admin-jwt');
        const category = _.find(productCategories.toJS(), ['id', this.state.productCategoryId]);
        const subCategory = _.find(category.subcategories, ['id', this.state.productSubcategoryId]);

        this.props.archiveProduct({ token: jwt.token, category: category.name, subCategory: subCategory.name, subSubCategory, id: this.state.id })
        history.push(`/products`);
    }

    submitProduct() {
        const { cookies, productCategories, productSubCategories, activeUser, history } = this.props;
        const jwt = cookies.get('sibi-admin-jwt');
        const category = _.find(productCategories.toJS(), ['id', this.state.productCategoryId]);
        const subCategory = _.find(productSubCategories.toJS(), ['id', this.state.productSubcategoryId]);

        const product = {};
        _.each(this.state, (value, key) => {
            product[key] = value;

            if (key === 'isSibiModelNumFound' ||
                key === 'isPartShowing' ||
                key === 'showDialog' ||
                key === 'isPartModelNumFound' ||
                key === 'showPartsDialog' ||
                key === 'isProductImage' ||
                key === 'activeSection' ||
                key === 'faqQuestion' ||
                key === 'faqAnswer' ||
                key === 'image' ||
                key === 'imageFile' ||
                key === 'color' ||
                key === 'videoURL' ||
                key === 'tempPart' ||
                key === 'part') {

                delete product[key];
            }
        });

        product['sortIndex'] = ((product.sortIndex - 1) <= 0) ? 0 : product.sortIndex - 1;

        // remove un-needed/empty fields
        _.each(product, (value, key) => {
            if(key === 'applianceAssociatedParts' || value === '' || typeof value === 'object' && _.size(value) === 0) {
                delete product[key];
            }
        });

        if (product.id) {
            this.props.updateProduct({ token: jwt.token, category: activeUser.toJS().trade, subCategory: subCategory.name, product });

        } else {
            this.props.createProduct({ token: jwt.token, category: activeUser.toJS().trade, subCategory: subCategory.name, product })
        }

        history.push(`/products`);
    }

    render() {
        const { product, productCategories, activeUser, location, modelNumberChanged, spinner, isProductVerified, isProductFound } = this.props;
        let subCategoryOptions, productDetails, isDisabled;

        if (activeUser.size > 0 &&
            productCategories.size > 0 &&
            product.size > 0) {

            isDisabled = (activeUser.toJS().type === 'superAdmin') ? false : true;

            const category = _.find(productCategories.toJS(), ['id', product.get('productCategoryId')]);

            const categories = _.map(productCategories.toJS(), (category) => {
                if (category.name === activeUser.get('trade')) { // TODO: need to update this to account for all category types, if user has multiple trades.
                    return { label: category.name, value: category.id };
                }
            });

            const categoryOptions = [
                { label: 'Select Category', value: '', disabled: true },
                ...categories
            ];

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

            productDetails = (isProductVerified && !isProductFound) ? <div>
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
                            isDisabled={isDisabled}
                            image={this.props.productImage}
                            color={this.props.color}
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
                            updateImage={this.props.updateImage}
                            addColorAndImage={this.addColorAndImage}
                            removeColorAndImage={this.props.removeColorAndImage}
                            removePart={this.removePart}
                            showAddPart={this.showAddPart}
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
                    { (product.get('id') && !isDisabled) ? <div className="btn borderless red fill" onClick={() => this.props.archiveProduct({ id: product.get('id')})}>Archive Product</div> : null }
                </div>
            </div> : null;

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
                                    this.props.resetVerified();
                                    this.props.update({ isProduct: true, key: 'sibiModelNumber', value: e.target.value })
                                }}
                                disabled={isDisabled}
                                required
                            />
                            { (isProductVerified && !isDisabled) ? <input className="btn blue" type="submit" value="Add"/> : null }
                        </div>
                    </form>
                    { (isProductFound) ? <dialog open>
                        <form method="dialog">
                            Alert:
                            <p>A product with this Sibi Model Number already exists!</p>
                            Do you wish to:
                            <p> - continue creating a new product (this will completely replace the existing product)</p>
                            <p> - modify the existing product?</p>
                            <input className="btn borderless red fill" type="submit" value="Create New" onClick={() => {
                                this.props.newProduct();
                                this.props.productVerified();
                            }} />
                            <input className="btn blue" type="submit" value="Modify Existing" onClick={this.modifyExistingProduct} />
                        </form>
                    </dialog> : null }
                    <hr/>
                    <form onSubmit={(e) => {e.preventDefault(); this.saveProduct();}} >
                        { productDetails }
                    </form>
                </div>
                { (this.state.isPartShowing) ? (
                    <EditPartOverlay
                        id={this.state.part.id}
                        imageUrl={this.state.part.imageUrl}
                        description={this.state.part.description}
                        code={this.state.part.code}
                        modelNumber={this.state.part.modelNumber}
                        gePrice={parseFloat(this.state.part.gePrice)}
                        sibiPrice={parseFloat(this.state.part.sibiPrice)}

                        isPartModelNumFound={this.state.isPartModelNumFound}
                        showPartsDialog={this.state.showPartsDialog}

                        update={this.props.updatePart}
                        updateImage={this.updateImage}
                        savePart={this.savePart}
                        addPart={this.addPart}
                        showAddPart={this.showAddPart}
                        checkModelNum={this.checkModelNum}
                        createNewPart={this.createNewPart}
                        modifyExistingPart={this.modifyExistingPart}
                    />) : null }
            </Loader>
        );
    }
}

const select = (state) => ({
    spinner              : state.ui.get('spinner'),
    activeUser           : state.activeUser.get('activeUser'),
    product              : state.product.get('product'),
    modelNumberChanged   : state.product.get('modelNumberChanged'),
    products             : state.products.get('products'),
    isProductVerified    : state.products.get('isProductVerified'),
    isPartVerified       : state.products.get('isPartVerified'),
    isProductFound       : state.products.get('isProductFound'),
    isPartFound          : state.products.get('isPartFound'),
    part                 : state.part.get('part'),
    parts                : state.products.get('parts'),
    productsInCategory   : state.products.get('productsInCategory'),
    productCategories    : state.products.get('productCategories'),
    productSubCategories : state.products.get('productSubCategories'),
    imageUploadSuccess   : state.assets.get('imageUploadSuccess')
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