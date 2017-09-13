import React                    from 'react';
import { connect }              from 'react-redux';
import { withRouter }           from 'react-router';
import { withCookies }          from 'react-cookie';
import _                        from 'lodash';
import assets                   from 'libs/assets';
import Select                   from 'react-select';
import Loader                   from 'react-loader';

import { triggerSpinner }       from 'ducks/ui/actions';
import * as productActions      from 'ducks/products/actions';
import { uploadImage }          from 'ducks/assets/actions';
import { setActiveTab }         from 'ducks/header/actions';

import EditPartOverlay          from 'components/edit_part_overlay';

import Appliance                from 'components/products/appliance';
import Hvac                     from 'components/products/hvac';
import Paint                    from 'components/products/paint';

class EditProductPage extends React.Component {
    constructor(props) {
        super(props);

        const product = this.createProductObj({ product: {} });
        const part = {
            id          : '',
            description : '',
            code        : '',
            imageUrl    : '',
            modelNumber : '',
            gePrice     : '',
            sibiPrice   : ''
        };

        this.state = {
            isSibiModelNumFound: true,
            isPartShowing: false,
            showDialog: false,
            isPartModelNumFound: true,
            showPartsDialog: false,
            isProductImage: false,
            activeSection: '',
            faqQuestion: '',
            faqAnswer: '',
            image: '',
            imageFile: '',
            color: '',
            videoURL: '',
            ...product,
            part
        };

        // check function
        this.checkModelNum = this.checkModelNum.bind(this);
        this.productCheck = this.productCheck.bind(this);

        // update function
        this.update = this.update.bind(this);
        this.updateImage = this.updateImage.bind(this);
        this.changeActiveSection = this.changeActiveSection.bind(this);
        this.showAddPart = this.showAddPart.bind(this);

        // product attr. functions
        this.addColorAndImage = this.addColorAndImage.bind(this);
        this.removeColorAndImage = this.removeColorAndImage.bind(this);
        this.removePart = this.removePart.bind(this);
        this.addVideo = this.addVideo.bind(this);
        this.removeVideo = this.removeVideo.bind(this);
        this.addFAQ = this.addFAQ.bind(this);
        this.removeFaq = this.removeFaq.bind(this);

        // action functions
        this.createProductObj = this.createProductObj.bind(this);
        this.createNewProduct = this.createNewProduct.bind(this);
        this.modifyExistingProduct = this.modifyExistingProduct.bind(this);
        this.savePart = this.savePart.bind(this);
        this.saveProduct = this.saveProduct.bind(this);
        this.archiveProduct = this.archiveProduct.bind(this);
        this.submitProduct = this.submitProduct.bind(this);
    }

    componentWillMount() {
        const { cookies, activeUser, productCategories } = this.props;
        const jwt = cookies.get('sibi-admin-jwt');

        if (jwt) {
            this.props.triggerSpinner({ isOn: true });
            this.productCheck({ product: {} });
            this.props.getProducts({ token: jwt.token });
            this.props.getParts({ token: jwt.token });

            if (productCategories.size <= 0) {
                this.props.getUserProductCategories({ token: jwt.token, category: 'APPLIANCES' });
            }
        } else {
            this.props.history.push(`/login`);
        }

        this.props.setActiveTab('products');
    }

    componentWillUpdate(nextProps) {
        const { cookies, productCategories, location } = this.props;

        if (!_.isEqual(nextProps.product, this.props.product)) {
            this.productCheck({ product: nextProps.product });
        }

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
                    this.props.getProductsForSubCategory({ token: jwt.token, category: category.name, subCategory });
                });
            });
        }
    }

    componentWillUnmount() {
        this.setState({});
        this.props.clearProduct();
    }

    update({ type, value }) {
        const { productsInCategory, productCategories, productSubCategories } = this.props;
        const re = /^part(.*)/;
        const match = re.exec(type)

        if (match) {
            const type = (match[1]);

            if (type === 'modelNumber' && !_.isEqual(value, this.state.part.modelNumber)) {
                this.setState({ isPartModelNumFound: true });
            }
            this.setState((prevState) => {
                prevState.part[type] = value;
                return { part: prevState.part };
            });

        } else {
            this.setState({ [type]: value });

            if (type === 'productSubcategoryId' &&
                productsInCategory.size > 0) {
                const products = productsInCategory.toJS();
                const category = _.find(productCategories.toJS(), ['id', this.state.productCategoryId]);
                const subCategory = _.find(productSubCategories.toJS(), ['id', value]);
                let sortIndex = _.size(products[category.name][subCategory.name]) + 1;
                this.setState({ sortIndex });

            } else if (type === 'sibiModelNumber' && !_.isEqual(value, this.state.sibiModelNumber)) {
                this.setState({ isSibiModelNumFound: true });
            }
        }

    }

    updateImage({ type, imageFile }) {
        const { cookies } = this.props;
        const reader = new FileReader();

        reader.onload = (e) => {
            if (type === 'product') {
                // imageUrl - use to show the image on the button
                // imageFile - use this to upload to server
                this.setState({ image: { imageUrl: e.target.result, imageFile } });

            } else if (type === 'part') {
                this.setState({ isProductImage: true });
                const jwt = cookies.get('sibi-admin-jwt');
                this.props.uploadImage({ token: jwt.token, type: imageFile.type, imageFile });
            }
        }
        reader.readAsDataURL(imageFile);
    }

    checkModelNum({ type }) {
        const { products, parts } = this.props;

        if (type === 'product') {
            const product = _.find(products.toJS(), ['sibiModelNumber', this.state.sibiModelNumber]);
            let isSibiModelNumFound = true, showDialog = false;

            if (!product) {
                console.log('success no modelnumber found for:', this.state.sibiModelNumber);
                isSibiModelNumFound = false;

            } else {
                showDialog = true;
            }

            this.setState({ isSibiModelNumFound, showDialog });

        } else if (type === 'part') {
            const part = _.find(parts.toJS(), ['modelNumber', this.state.part.modelNumber]);
            let isPartModelNumFound = true, showPartsDialog = false;

            if(!part) {
                console.log('success no modelNumber found for:', this.state.part.modelNumber);
                isPartModelNumFound = false;

            } else {
                showPartsDialog = true;
            }

            this.setState({ isPartModelNumFound, showPartsDialog });
        }
    }

    productCheck({ product }) {
        let isSibiModelNumFound, { cookies, location, productCategories } = this.props;

        const reProduct = /productId=(.*)/;
        const match = reProduct.exec(location.search);

        if (location.state) {
            product = location.state.product;
            product.sortIndex += 1;
            isSibiModelNumFound = false;

        } else if (match) {
            const productId = match[1];

            if(product.size > 0) {
                product = product.toJS();
                product.sortIndex += 1;
                isSibiModelNumFound = false;

            } else {
                const jwt = cookies.get('sibi-admin-jwt');
                this.props.getProductById({ token: jwt.token, id: productId });
            }
        } else {
            product = this.createProductObj({ product: {} });
            isSibiModelNumFound = true;
        }

        this.setState({ ...product, isSibiModelNumFound });
    }

    changeActiveSection(activeSection) {
        this.setState((prevState) => {
            activeSection = (prevState.activeSection !== activeSection) ? activeSection : '';

            return { activeSection };
        });
    }

    showAddPart({ part }) {
        this.setState((prevState) => {
            const isPartShowing = (prevState.isPartShowing) ? false : true;
            part = (part) ? part : {
                id          : '',
                description : '',
                code        : '',
                imageUrl    : '',
                modelNumber : '',
                gePrice     : '',
                sibiPrice   : ''
            };
            return { isPartShowing, part };
        });
    }

    addColorAndImage() {
        const { cookies } = this.props;
        const jwt = cookies.get('sibi-admin-jwt');
        const image = this.state.image;

        const type = image.imageFile.type;
        const imageFile = image.imageFile;

        this.props.uploadImage({ token: jwt.token, type, imageFile });
    }

    removeColorAndImage({ color }) {
        console.log('removeColorAndImage with color: ', color);
        this.setState((prevState) => {
            const applianceColorsInfo = _.remove(prevState.applianceColorsInfo, (element) => { return element.color !== color } );

            return { applianceColorsInfo };
        });
    }

    removePart({ partId }) {
        console.log('removePart with partNumber: ', partId);
        this.setState((prevState) => {
            const applianceAssociatedParts = _.remove(prevState.applianceAssociatedParts, (element) => { return element.id !== partId } );

            return { applianceAssociatedParts };
        });
    }

    addVideo() {
        console.log('adding video');
        this.setState((prevState) => {
            prevState.videos.push(prevState.videoURL);

            return { videos: prevState.videos, videoURL: '' };
        });
    }

    removeVideo({ index }) {
        console.log('removing video at: ', index);
        this.setState((prevState) => {
            const videos = _.remove(prevState.videos, (element, i) => { return i !== index } ); // I'm using this in place of splice because the videos will probably change to obj

            return { videos };
        });
    }

    addFAQ() {
        console.log('adding faq');
        this.setState((prevState) => {
            const id = _.size(prevState.faq);
            prevState.faq.push({ Question: prevState.faqQuestion, Answer: prevState.faqAnswer });

            return { faq: prevState.faq, faqQuestion: '', faqAnswer: '' };
        });
    }

    removeFaq({ index }) {
        console.log('removeFaq at: ', index);
        this.setState((prevState) => {
            const faq = _.remove(prevState.faq, (element, i) => { return i !== index } );

            return { faq };
        });
    }

    createProductObj({ product }) {
        return product = {
            id                          : product.id || '',
            // ***************** the following are required for new products *****************
            name                        : product.name || '',
            sibiModelNumber             : product.sibiModelNumber || '',
            productCategoryId           : product.productCategoryId || '',
            productSubcategoryId        : product.productSubcategoryId || '',
            sku                         : product.sku || '',

            // ***************** the following are optional *****************
            serialNumber                : product.serialNumber || '',
            shortDescription            : product.shortDescription || '',
            overview                    : product.overview || '',
            faq                         : product.faq || [],
            videos                      : product.videos || [],
            sortIndex                   : product.sortIndex || 0,

            // ***************** product category section (no required) *****************
            // *****************
            applianceManufacturerName   : product.applianceManufacturerName || '',
            applianceType               : product.applianceType || '',
            applianceSize               : product.applianceSize || '',
            applianceDescription        : product.applianceDescription || '',
            applianceFuelType           : product.applianceFuelType || '',
            applianceWidth              : product.applianceWidth || '',
            applianceHeight             : product.applianceHeight || '',
            applianceDepth              : product.applianceDepth || '',
            applianceInstallDescription : product.applianceInstallDescription || '',
            applianceInstallPrice       : product.applianceInstallPrice || '',
            applianceInstallCode        : product.applianceInstallCode || '',
            applianceColorsInfo         : product.applianceColorsInfo || [],
            applianceSpecSheetUrl       : product.applianceSpecSheetUrl || '',
            applianceRemovalDescription : product.applianceRemovalDescription || '',
            applianceRemovalCode        : product.applianceRemovalCode || '',
            applianceRemovalPrice       : product.applianceRemovalPrice || '',
            applianceAssociatedParts    : product.applianceAssociatedParts || [],
            // *****************
            hvacSeerRating              : product.hvacSeerRating || '',
            hvacEfficiencyRating        : product.hvacEfficiencyRating || '',
            hvacVoltageRating           : product.hvacVoltageRating || '',
            hvacTonnage                 : product.hvacTonnage || '',
            hvacBtuAmount               : product.hvacBtuAmount || '',
            // *****************
            paintCategory               : product.paintCategory || '',
            paintType                   : product.paintType || '',
            paintQuantitySize           : product.paintQuantitySize || '',
            paintFinish                 : product.paintFinish || '',
            paintQuality                : product.paintQuality || '',
            paintColorNumber            : product.paintColorNumber || '',
            paintColorName              : product.paintColorName || ''
        };
    }

    createNewProduct() {
        const sibiModelNumber = this.state.sibiModelNumber;

        const product = this.createProductObj({ product: { sibiModelNumber } });

        this.setState({ ...product, showDialog: false, isSibiModelNumFound: false });
    }

    modifyExistingProduct() {
        const { products, history } = this.props;

        const product = _.find(products.toJS(), ['sibiModelNumber', this.state.sibiModelNumber]);

        history.push({ pathname: `/edit_product`, search: `productId=${product.id}`, state: { product } });
        this.setState({ ...product, showDialog: false, isSibiModelNumFound: false });
    }

    savePart() {
        const { part } = this.state;

        console.log('saving part');

        // const part = {
        //     id          : '',
        //     description : '',
        //     code        : '',
        //     imageUrl    : '',
        //     modelNumber : '',
        //     gePrice     : '',
        //     sibiPrice   : ''
        // };

        // call to create part
    }

    saveProduct() {
        const re = /http(s)?:\/\//;
        const types = [];

        if (_.size(this.state.applianceColorsInfo) > 0) {
            _.each(this.state.applianceColorsInfo, (image) => {
                const match = re.exec(image.imageUrl);
                if (!match) {
                    const picture = image.imageFile.type.split('/');
                    types.push({ type: picture[0], fileType: picture[1] });
                }
            });
        }

        if (_.size(types) > 0) {
            this.props.uploadImage({ types });

        } else {
            console.log('save product', this.state.id);
            this.submitProduct();
        }
    }

    archiveProduct() {
        const { cookies, productCategories, activeUser, history } = this.props;
        const jwt = cookies.get('sibi-admin-jwt');
        const category = _.find(productCategories.toJS(), ['id', this.state.productCategoryId]);
        const subCategory = _.find(category.subcategories, ['id', this.state.productSubcategoryId]);

        this.props.archiveProduct({ token: jwt.token, category: category.name, subCategory: subCategory.name, id: this.state.id })
        history.push(`/products`);
    }

    submitProduct() {
        const { cookies, productCategories, productSubCategories, activeUser } = this.props;
        const jwt = cookies.get('sibi-admin-jwt');
        const category = _.find(productCategories.toJS(), ['id', this.state.productCategoryId]);
        const subCategory = _.find(productSubCategories.toJS(), ['id', this.state.productSubcategoryId]);

        const product = {};
        _.each(this.state, (value, key) => {
            product[key] = value;

            if (key === 'activeSection' ||
                key === 'faqQuestion' ||
                key === 'faqAnswer' ||
                key === 'image' ||
                key === 'imageFile' ||
                key === 'color' ||
                key === 'partDescription' ||
                key === 'partCode' ||
                key === 'videoURL') {

                delete product[key];
            }
        });

        product['sortIndex'] = ((product.sortIndex - 1) <= 0) ? 0 : product.sortIndex - 1;

        // remove un-needed/empty fields
        _.each(product, (value, key) => {
            if(value === '' || typeof value === 'object' && _.size(value) === 0) {
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
        const { product, productCategories, activeUser } = this.props;
        let subCategorySelect, productType, productDetails, isDisabled, archiveBtn;

        const title = (product) ? 'Edit' : 'Add';
        const buttonTxt = (this.state.id) ? 'Update' : 'Add';

        if (activeUser.size > 0 &&
            productCategories.size > 0) {

            isDisabled = (activeUser.toJS().type === 'superAdmin') ? false : true;
            archiveBtn = (this.state.id && !isDisabled) ? <div className="btn borderless red" onClick={this.archiveProduct}>Archive Product</div> : null;

            const category = _.find(productCategories.toJS(), ['id', this.state.productCategoryId]);

            const categories = _.map(productCategories.toJS(), (category) => {
                if (category.name === activeUser.toJS().trade) { // TODO: need to update this to account for all category types, if user has multiple trades.
                    return { label: category.name, value: category.id };
                }
            });

            const categoryOptions = [
                { label: 'Select Category', value: '', disabled: true },
                ...categories
            ];

            if ((_.size(category) > 0)) {
                const subCategories = _.map(category.subcategories, (subcategory) => {
                    return { label: subcategory.name, value: subcategory.id };
                });

                const subCategoryOptions = [
                    { label: 'Select Sub-Category', value: '', disabled: true },
                    ...subCategories
                ];

                subCategorySelect = <Select
                    name="product-sub-category"
                    value={this.state.productSubcategoryId}
                    options={subCategoryOptions}
                    onChange={(selected) => (!isDisabled) ? this.update({ type: 'productSubcategoryId', value: (selected) ? selected.value : null }) : console.log(`you don't have permission to change!`)}
                    required
                />
            }

            const productFAQ = _.map(this.state.faq, (faq, index) => {
                return (
                    <div key={`faq${index}`} className="faq-section accordion-detail-row" style={{ display: 'inline-flex'}} >
                        <input type="text" value={faq.Question} disabled />
                        <input type="text" value={faq.Answer} disabled />
                        {(!isDisabled) ? <div className="cancel-btn" onClick={()=> this.removeFaq({ index }) } ><img src={assets('./images/icon-x-big.svg')} /></div> : null}
                    </div>
                );
            });

            const addFAQSection = (!isDisabled) ? <div className="accordion-detail-row" style={{ display: 'inline-flex' }} >
                <input type="text" value={this.state.faqQuestion} placeholder="Question" onChange={(e) => this.update({ type: 'faqQuestion', value: e.target.value })} />
                <input type="text" value={this.state.faqAnswer}   placeholder="Answer"   onChange={(e) => this.update({ type: 'faqAnswer', value: e.target.value })} />
                <div onClick={this.addFAQ} className="cancel-btn blue">Add</div>
            </div> : null;

            const productVideos = _.map(this.state.videos, (video, index) => {
                return (
                    <div key={`colorImages${index}`} className="videos-section accordion-detail-row" style={{ display: 'inline-flex', width: '100%' }} >
                        <input type="text" value={video} disabled />
                        {(!isDisabled) ? <div className="cancel-btn" onClick={()=> this.removeVideo({ index }) } ><img src={assets('./images/icon-x-big.svg')} /></div> : null}
                    </div>
                );
            });

            const addVideoSection = (!isDisabled) ? <div className="accordion-detail-row" style={{ display: 'inline-flex' }} >
                <input type="url" value={this.state.videoURL} placeholder="video URL" onChange={(e) => this.update({ type: 'videoURL', value: e.target.value })} />
                <div onClick={this.addVideo} className="cancel-btn blue">Add</div>
            </div> : null;

            if (category) {
                if (category.name === 'APPLIANCES') {
                    productType = <Appliance
                        isDisabled={isDisabled}
                        image={this.state.image}
                        color={this.state.color}
                        applianceManufacturerName={this.state.applianceManufacturerName}
                        applianceType={this.state.applianceType}
                        applianceSize={this.state.applianceSize}
                        applianceDescription={this.state.applianceDescription}
                        applianceFuelType={this.state.applianceFuelType}
                        applianceWidth={this.state.applianceWidth}
                        applianceHeight={this.state.applianceHeight}
                        applianceDepth={this.state.applianceDepth}
                        applianceInstallDescription={this.state.applianceInstallDescription}
                        applianceInstallPrice={parseFloat(this.state.applianceInstallPrice)}
                        applianceInstallCode={this.state.applianceInstallCode}
                        applianceInstallDescription2={this.state.applianceInstallDescription2}
                        applianceInstallPrice2={parseFloat(this.state.applianceInstallPrice2)}
                        applianceInstallCode2={this.state.applianceInstallCode2}
                        applianceColorsInfo={this.state.applianceColorsInfo}
                        applianceSpecSheetUrl={this.state.applianceSpecSheetUrl}
                        applianceRemovalDescription={this.state.applianceRemovalDescription}
                        applianceRemovalCode={this.state.applianceRemovalCode}
                        applianceRemovalPrice={parseFloat(this.state.applianceRemovalPrice)}
                        applianceDisconnectDescription={this.state.applianceDisconnectDescription}
                        applianceDisconnectCode={this.state.applianceDisconnectCode}
                        applianceDisconnectPrice={parseFloat(this.state.applianceDisconnectPrice)}
                        applianceAssociatedParts={this.state.applianceAssociatedParts}

                        update={this.update}
                        updateImage={this.updateImage}
                        addColorAndImage={this.addColorAndImage}
                        removeColorAndImage={this.removeColorAndImage}
                        removePart={this.removePart}
                        showAddPart={this.showAddPart}
                    />;

                } else if (category.name === 'HVAC') {
                    productType = <Hvac />;

                } else if (category.name === 'PAINT') {
                    productType = <Paint />;
                }
            }

            productDetails = (!this.state.isSibiModelNumFound) ? <div>
                <div className="content">
                    <Select
                        name="product-category"
                        value={this.state.productCategoryId}
                        options={categoryOptions}
                        onChange={(selected) => (!isDisabled) ? this.update({ type: 'productCategoryId', value: (selected) ? selected.value : null }) : console.log(`you don't have permission to change!`)}
                        required
                    />
                    { subCategorySelect }
                    <input name="product-name" type="text" placeholder="Product name" value={this.state.name} onChange={(e) => this.update({ type: 'name', value: e.target.value})} required disabled={isDisabled} />
                    <input name="product-ordering" type="number" placeholder="Feature Placement (e.g. 2)" value={this.state.sortIndex} onChange={(e) => this.update({ type: 'sortIndex', value: e.target.value})} />
                    <input name="product-sku" type="text" placeholder="sku" value={this.state.sku} onChange={(e) => this.update({ type: 'sku', value: e.target.value})} required disabled={isDisabled} />
                    <input name="product-serial-num" type="text" placeholder="Serial #" value={this.state.serialNumber} onChange={(e) => this.update({ type: 'serialNumber', value: e.target.value})} disabled={isDisabled} />
                    { productType}
                    <textarea name="product-shortDescription" placeholder="Short Description" value={this.state.shortDescription} onChange={(e) => this.update({ type: 'shortDescription', value: e.target.value})} maxLength="1000" disabled={isDisabled} />
                    <textarea name="product-overview" placeholder="overview" value={this.state.overview} onChange={(e) => this.update({ type: 'overview', value: e.target.value})} maxLength="1000" disabled={isDisabled} />
                    <div className="accordion">
                        {/* ************************************** faq section ************************************** */}
                        <div id="accordion-faq" className={(this.state.activeSection === 'faq') ? 'headers-active' : 'headers' } onClick={() => this.changeActiveSection('faq')}>
                            <div>{ _.size(this.state.faq) } FAQs</div>
                            <img className="accordion-arrow" src={(this.state.activeSection === 'faq') ? assets('./images/icons-arrow-up.png') : assets('./images/icons-arrow-down.png') } />
                        </div>
                        <div className="accordion-detail" style={{ display: (this.state.activeSection === 'faq') ? 'block' : 'none' }} >
                            { productFAQ }
                            { addFAQSection }
                        </div>

                        {/* ************************************** video section ************************************** */}
                        <div id="accordion-video" className={(this.state.activeSection === 'videos') ? 'headers-active' : 'headers' } onClick={() => this.changeActiveSection('videos')}>
                            <div>{ _.size(this.state.videos) } Vidoes</div>
                            <img className="accordion-arrow" src={(this.state.activeSection === 'videos') ? assets('./images/icons-arrow-up.png') : assets('./images/icons-arrow-down.png') } />
                        </div>
                        <div className="accordion-detail" style={{ display: (this.state.activeSection === 'videos') ? 'block' : 'none' }} >
                            { productVideos }
                            { addVideoSection }
                        </div>
                    </div>
                </div>
                <input className="btn blue fill" type="submit" value={buttonTxt} />
                { archiveBtn }
            </div> : null;

            this.props.triggerSpinner({ isOn: false });
        }

        const addPartOverlay = (this.state.isPartShowing) ? (
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

                update={this.update}
                updateImage={this.updateImage}
                savePart={this.savePart}
                showAddPart={this.showAddPart}
                checkModelNum={this.checkModelNum}
            />) : null;

        const modelNumAdd = (this.state.isSibiModelNumFound && !isDisabled) ? <input className="btn blue" type="submit" value="Add"/> : null;
        const dialogBox = (this.state.showDialog) ? <dialog open>
            <form method="dialog">
                Alert:
                <p>A product with this Sibi Model Number already exists!</p>
                Do you wish to:
                <p> - continue creating a new product (this will completely replace the existing product)</p>
                <p> - modify the existing product?</p>
                <input className="btn red" type="submit" value="Create New" onClick={this.createNewProduct} />
                <input className="btn blue" type="submit" value="Modify Existing" onClick={this.modifyExistingProduct} />
            </form>
        </dialog> : null;

        return (
            <Loader loaded={this.props.spinner} >
                <div id="edit-product-page">
                    <form onSubmit={(e) => {e.preventDefault(); this.checkModelNum({ type: 'product' });}} >
                        <div className="content">
                            <input
                                name="product-sibi-model-num"
                                className="search-input"
                                type="text"
                                placeholder="SIBI Model #"
                                value={this.state.sibiModelNumber}
                                onChange={(e) => this.update({ type: 'sibiModelNumber', value: e.target.value })}
                                disabled={isDisabled}
                                required
                            />
                            { modelNumAdd }
                        </div>
                    </form>
                    <form onSubmit={(e) => {e.preventDefault(); this.saveProduct();}} >
                        { productDetails }
                    </form>
                </div>
                { dialogBox }
                { addPartOverlay }
            </Loader>
        );
    }
}

const select = (state) => ({
    spinner              : state.ui.get('spinner'),
    activeUser           : state.activeUser.get('activeUser'),
    product              : state.products.get('product'),
    products             : state.products.get('products'),
    parts                : state.products.get('parts'),
    productsInCategory   : state.products.get('productsInCategory'),
    productCategories    : state.products.get('productCategories'),
    productSubCategories : state.products.get('productSubCategories'),
    imageUploadSuccess   : state.assets.get('imageUploadSuccess')
});

const actions = {
    triggerSpinner,
    ...productActions,
    uploadImage,
    setActiveTab
};

export default connect(select, actions, null, { withRef: true })(withRouter(withCookies(EditProductPage)));