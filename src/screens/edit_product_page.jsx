import React                    from 'react';
import { connect }              from 'react-redux';
import { withRouter }           from 'react-router';
import { withCookies }          from 'react-cookie';
import _                        from 'lodash';
import assets                   from 'libs/assets';
import Select                   from 'react-select';

import { clearProduct, getProductById, getProductCategories, updateProduct, createProduct, archiveProduct }      from 'ducks/products/actions';
import { getPresignedUrls }     from 'ducks/assets/actions';

import Appliance                from 'components/products/appliance';
import Hvac                     from 'components/products/hvac';
import Paint                    from 'components/products/paint';

class EditProductPage extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            activeSection: '',
            faqQuestion: '',
            faqAnswer: '',
            image: '',
            imageFile: '',
            color: '',
            partDescription: '',
            partCode: '',
            videoURL: '',
        };

        this.productCheck = this.productCheck.bind(this);
        this.update = this.update.bind(this);
        this.updateImage = this.updateImage.bind(this);
        this.changeActiveSection = this.changeActiveSection.bind(this);
        this.addColorAndImage = this.addColorAndImage.bind(this);
        this.removeColorAndImage = this.removeColorAndImage.bind(this);
        this.addPart = this.addPart.bind(this);
        this.removePart = this.removePart.bind(this);
        this.addVideo = this.addVideo.bind(this);
        this.removeVideo = this.removeVideo.bind(this);
        this.addFAQ = this.addFAQ.bind(this);
        this.removeFaq = this.removeFaq.bind(this);
        this.saveProduct = this.saveProduct.bind(this);
        this.archiveProduct = this.archiveProduct.bind(this);
        this.submitProduct = this.submitProduct.bind(this);
    }

    componentWillMount() {
        this.productCheck({ product: {} });
        this.props.getProductCategories();
    }

    componentWillUpdate(nextProps) {
        if (!_.isEqual(nextProps.product, this.props.product)) {
            this.productCheck({ product: nextProps.product });
        }

        if (!_.isEqual(nextProps.preSignedURLs, this.props.preSignedURLs)) {
            const re = /http(s)?:\/\//;

            if (_.size(this.state.applianceColorsAndImages) > 0) {
                _.each(this.state.applianceColorsAndImages, (image) => {
                    const match = re.exec(image.imageUrl);
                    if (!match) {
                        const picture = image.imageFile.type.split('/');
                    }
                });
            }
        }

        if (nextProps.imageUploadSuccess.size === nextProps.preSignedURLs.size) {
            this.submitProduct();
        }
    }

    componentWillUnmount() {
        this.setState({});
        this.props.clearProduct();
    }

    productCheck({ product }) {
        let { cookies, location, productCategories } = this.props;

        const reProduct = /productId=(.*)/;
        const productId = reProduct.exec(location.search)[1];

        if (location.state) {
            product = location.state.product;

        } else if (productId) {

            if(product.size > 0) {
                product = product.toJS();

            } else {
                const jwt = cookies.get('sibi-admin-jwt');
                this.props.getProductById({ token: jwt.token, id: productId });
            }
        } else {
            const categories = productCategories.toJS();
            const subCategories = productSubCategories.toJS();

            product = {
                id: '',
                // ***************** the following are required for new products *****************
                name: '',
                sibiModelNumber: '',
                productCategoryId: this.props.productCategoryId,
                productSubcategoryId: (_.size(subCategories) > 0) ? subCategories[0].id : '',
                sku: '',

                // ***************** the following are optional *****************
                serialNumber: '',
                shortDescription: '',
                overview: '',
                faq: [],
                videos: [],
                sortIndex: (location.state.sortIndex) ? location.state.sortIndex: 0,
                applianceManufacturerName: '',
                applianceType: '',
                applianceSize: '',
                applianceDescription: '',
                applianceFuelType: '',
                applianceWidth: '',
                applianceHeight: '',
                applianceDepth: '',
                applianceInstallDescription: '',
                applianceInstallPrice: '',
                applianceInstallCode: '',
                applianceColorsInfo: [],
                applianceSpecSheetUrl: '',
                applianceRemovalDescription: '',
                applianceRemovalCode: '',
                applianceRemovalPrice: '',
                applianceAssociatedParts: [],
            };
        }

        product.sortIndex += 1;

        _.each(product, (value, key) => {
            product[key] = (value) ? value : '';
        });

        this.setState({ ...product });
    }

    update({ type, value }) {

        this.setState({ [type]: (value) ? value.value : '' });

        if (type === 'productSubcategoryId' && value) {
            const products = this.props.products.toJS();
            let sortIndex = _.size(products[value.label]) + 1;
            this.setState({ sortIndex });
        }
    }

    updateImage({ image }) {
        const reader = new FileReader();
        this.setState({ imageFile: image });

        reader.onload = (e) => {
            this.setState({ image: e.target.result });
        }

        reader.readAsDataURL(image);
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
            prevState.applianceColorsAndImages.push({ imageUrl: prevState.image, color: prevState.color, imageFile: prevState.imageFile });

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

    addPart() {
        console.log('adding part');
        this.setState((prevState) => {
            const id = _.size(prevState.applianceAssociatedParts);
            prevState.applianceAssociatedParts.push({ id, description: prevState.partDescription, code: prevState.partCode });

            return { applianceAssociatedParts: prevState.applianceAssociatedParts, partDescription: '', partCode: '' };
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

    saveProduct() {
        const re = /http(s)?:\/\//;
        const types = [];

        if (_.size(this.state.applianceColorsAndImages) > 0) {
            _.each(this.state.applianceColorsAndImages, (image) => {
                const match = re.exec(image.imageUrl);
                if (!match) {
                    const picture = image.imageFile.type.split('/');
                    types.push({ type: picture[0], fileType: picture[1] });
                }
            });
        }

        if (_.size(types) > 0) {
            this.props.getPresignedUrls({ types });

        } else {
            console.log('save product', this.state.id);
            this.submitProduct();
        }
    }

    archiveProduct() {
        const { cookies, productCategories } = this.props;
        const jwt = cookies.get('sibi-admin-jwt');
        const category = _.find(productCategories.toJS(), ['id', this.state.productSubcategoryId]);

        this.props.archiveProduct({ token: jwt.token, category: category.name, id: this.state.id })
        this.props.history.push(`/products`);
    }

    submitProduct() {
        const { cookies, productCategories } = this.props;
        const jwt = cookies.get('sibi-admin-jwt');
        const category = _.find(productCategories.toJS(), ['id', this.state.productSubcategoryId]);

        const product = {
            // ***************** the following are required *****************
            name: this.state.name,
            sibiModelNumber: this.state.sibiModelNumber,
            productCategoryId: this.state.productCategoryId,
            productSubcategoryId: category.id,
            sku: this.state.sku,

            // ***************** the following are optional *****************
            serialNumber: this.state.serialNumber,
            shortDescription: this.state.shortDescription,
            overview: this.state.overview,
            faq: this.state.faq,
            videos: this.state.videos,
            applianceManufacturerName: this.state.applianceManufacturerName,
            sortIndex: this.state.sortIndex,
            applianceType: category.name,
            applianceSize: this.state.applianceSize,
            applianceDescription: this.state.applianceDescription,
            applianceFuelType: this.state.applianceFuelType,
            applianceWidth: this.state.applianceWidth,
            applianceHeight: this.state.applianceHeight,
            applianceDepth: this.state.applianceDepth,
            applianceInstallDescription: this.state.applianceInstallDescription,
            applianceInstallPrice: this.state.applianceInstallPrice,
            applianceInstallCode: this.state.applianceInstallCode,
            applianceColorsAndImages: this.state.applianceColorsAndImages,
            applianceSpecSheetUrl: this.state.applianceSpecSheetUrl,
            applianceRemovalDescription: this.state.applianceRemovalDescription,
            applianceRemovalCode: this.state.applianceRemovalCode,
            applianceRemovalPrice: this.state.applianceRemovalPrice,
            applianceAssociatedParts: this.state.applianceAssociatedParts, // not in api?
        };

        product.sortIndex = ((product.sortIndex - 1) <= 0) ? 0 : product.sortIndex - 1;

        _.each(product, (value, key) => {
            if(value === '' || typeof value === 'object' && _.size(value) === 0) {
                delete product[key];
            }
        });

        if (this.state.id) {
            product['id'] = this.state.id;
            this.props.updateProduct({ token: jwt.token, category: category.name, product });

        } else {
            this.props.createProduct({ token: jwt.token, category: category.name, product })
        }

        this.props.close({ sortIndex: 0 });
    }

    render() {
        let subCategorySelect, productType;
        const { isEditShowing, product, productCategories } = this.props;

        const title = (product) ? 'Edit' : 'Add';
        const category = _.find(productCategories.toJS(), ['id', this.state.productCategoryId]);
        const buttonTxt = (this.state.id) ? 'Update' : 'Add';
        const archiveBtn = (this.state.id) ? <div className="btn borderless red" onClick={this.archiveProduct}>Archive Product</div> : null;

        const categories = _.map(productCategories.toJS(), (category) => {
            return { label: category.name, value: category.id };
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
                onChange={(value) => this.update({ type: 'productSubcategoryId', value })}
                required
            />
        }


        const productFAQ = _.map(this.state.faq, (faq, index) => {
            return (
                <div key={`faq${index}`} className="faq-section accordion-detail-row" style={{ display: 'inline-flex'}} >
                    <input type="text" value={faq.Question} disabled />
                    <input type="text" value={faq.Answer} disabled />
                    <div className="cancel-btn" onClick={()=> this.removeFaq({ index }) } ><img src={assets('./images/icon-x-big.svg')} /></div>
                </div>
            );
        });

        const productVideos = _.map(this.state.videos, (video, index) => {
            return (
                <div key={`colorImages${index}`} className="videos-section accordion-detail-row" style={{ display: 'inline-flex', width: '100%' }} >
                    <input type="text" value={video} disabled />
                    <div className="cancel-btn" onClick={()=> this.removeVideo({ index }) } ><img src={assets('./images/icon-x-big.svg')} /></div>
                </div>
            );
        });

        if (category) {
            if (category.name === 'APPLIANCES') {
                productType = <Appliance
                    applianceManufacturerName={this.state.applianceManufacturerName}
                    applianceType={this.state.applianceType}
                    applianceSize={this.state.applianceSize}
                    applianceDescription={this.state.applianceDescription}
                    applianceFuelType={this.state.applianceFuelType}
                    applianceWidth={this.state.applianceWidth}
                    applianceHeight={this.state.applianceHeight}
                    applianceDepth={this.state.applianceDepth}
                    applianceInstallDescription={this.state.applianceInstallDescription}
                    applianceInstallPrice={this.state.applianceInstallPrice}
                    applianceInstallCode={this.state.applianceInstallCode}
                    applianceInstallDescription2={this.state.applianceInstallDescription2}
                    applianceInstallPrice2={this.state.applianceInstallPrice2}
                    applianceInstallCode2={this.state.applianceInstallCode2}
                    applianceColorsInfo={this.state.applianceColorsInfo}
                    applianceSpecSheetUrl={this.state.applianceSpecSheetUrl}
                    applianceRemovalDescription={this.state.applianceRemovalDescription}
                    applianceRemovalCode={this.state.applianceRemovalCode}
                    applianceRemovalPrice={this.state.applianceRemovalPrice}
                    applianceDisconnectDescription={this.state.applianceDisconnectDescription}
                    applianceDisconnectCode={this.state.applianceDisconnectCode}
                    applianceDisconnectPrice={this.state.applianceDisconnectPrice}
                    applianceAssociatedParts={this.state.applianceAssociatedParts}

                    update={this.update}
                    updateImage={this.updateImage}
                    addColorAndImage={this.addColorAndImage}
                    removeColorAndImage={this.removeColorAndImage}
                />;

            } else if (category.name === 'HVAC') {
                productType = <Hvac />;

            } else if (category.name === 'PAINT') {
                productType = <Paint />;
            }
        }

        return (
            <div id="edit-product-page">
                <form onSubmit={() => {e.preventDefault(); this.saveProduct();}} >
                    <div className="content">
                        <Select
                            name="product-category"
                            value={this.state.productCategoryId}
                            options={categoryOptions}
                            onChange={(value) => this.update({ type: 'productCategoryId', value })}
                            required
                        />
                        { subCategorySelect }
                        <input name="product-name" type="text" placeholder="Product name" value={this.state.name} onChange={(e) => this.update({ type: 'name', value: e.target.value})} required />
                        <input name="product-sibi-model-num" type="text" placeholder="SIBI Model #" value={this.state.sibiModelNumber} onChange={(e) => this.update({ type: 'sibiModelNumber', value: e.target.value})} required />
                        <input name="product-ordering" type="number" placeholder="Feature Placement (e.g. 2)" value={this.state.sortIndex} onChange={(e) => this.update({ type: 'sortIndex', value: e.target.value})} />
                        <input name="product-sku" type="text" placeholder="sku" value={this.state.sku} onChange={(e) => this.update({ type: 'sku', value: e.target.value})} required />
                        <input name="product-serial-num" type="text" placeholder="Serial #" value={this.state.serialNumber} onChange={(e) => this.update({ type: 'serialNumber', value: e.target.value})}  />

                        <div className="accordion">
                            {/* ************************************** faq section ************************************** */}
                            <div id="accordion-faq" className={(this.state.activeSection === 'faq') ? 'headers-active' : 'headers' } onClick={() => this.changeActiveSection('faq')}>
                                <div>{ _.size(this.state.faq) } FAQs</div>
                                <img className="accordion-arrow" src={(this.state.activeSection === 'faq') ? assets('./images/icons-arrow-up.png') : assets('./images/icons-arrow-down.png') } />
                            </div>
                            <div className="accordion-detail" style={{ display: (this.state.activeSection === 'faq') ? 'block' : 'none' }} >
                                { productFAQ }
                                <div className="accordion-detail-row" style={{ display: 'inline-flex' }} >
                                    <input type="text" value={this.state.faqQuestion} placeholder="Question" onChange={(e) => this.update({ type: 'faqQuestion', value: e.target.value })} />
                                    <input type="text" value={this.state.faqAnswer}   placeholder="Answer"   onChange={(e) => this.update({ type: 'faqAnswer', value: e.target.value })} />
                                    <div onClick={this.addFAQ} className="cancel-btn blue">Add</div>
                                </div>
                            </div>

                            {/* ************************************** video section ************************************** */}
                            <div id="accordion-video" className={(this.state.activeSection === 'videos') ? 'headers-active' : 'headers' } onClick={() => this.changeActiveSection('videos')}>
                                <div>{ _.size(this.state.videos) } Vidoes</div>
                                <img className="accordion-arrow" src={(this.state.activeSection === 'videos') ? assets('./images/icons-arrow-up.png') : assets('./images/icons-arrow-down.png') } />
                            </div>
                            <div className="accordion-detail" style={{ display: (this.state.activeSection === 'videos') ? 'block' : 'none' }} >
                                { productVideos }
                                <div className="accordion-detail-row" style={{ display: 'inline-flex' }} >
                                    <input type="url" value={this.state.videoURL} placeholder="video URL" onChange={(e) => this.update({ type: 'videoURL', value: e.target.value })} />
                                    <div onClick={this.addVideo} className="cancel-btn blue">Add</div>
                                </div>
                            </div>
                        </div>

                        { productType}

                        <textarea name="product-overview" type="text" placeholder="overview" value={this.state.overview} onChange={(e) => this.update({ type: 'overview', value: e.target.value})} maxLength="1000" />
                    </div>
                    <input className="btn blue fill" type="submit" value={buttonTxt} />
                    { archiveBtn }
                </form>
            </div>
        );
    }
}

const select = (state) => ({
    product              : state.products.get('product'),
    products             : state.products.get('products'),
    productCategories    : state.products.get('productCategories'),
    preSignedURLs        : state.assets.get('preSignedURLs'),
    imageUploadSuccess   : state.assets.get('imageUploadSuccess'),
    imageUploadFailed    : state.assets.get('imageUploadFailed')
});

const actions = {
    clearProduct,
    getProductById,
    getProductCategories,
    updateProduct,
    createProduct,
    archiveProduct,
    getPresignedUrls
};

export default connect(select, actions, null, { withRef: true })(withRouter(withCookies(EditProductPage)));