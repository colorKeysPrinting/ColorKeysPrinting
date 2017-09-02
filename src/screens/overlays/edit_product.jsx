import React                    from 'react';
import { connect }              from 'react-redux';
import { withRouter }           from 'react-router';
import { withCookies }          from 'react-cookie';
import _                        from 'lodash';
import assets                   from 'libs/assets';

import { updateProduct, createProduct, archiveProduct }      from 'ducks/products/actions';
import { getPresignedUrls, uploadImagesS3 }      from 'ducks/assets/actions';

import Overlay                  from 'components/overlay';
import Select                   from 'components/select_box';

class EditProduct extends React.Component {
    constructor(props) {
        super(props);

        const categories = this.props.productCategories.toJS();

        const product = (this.props.location.state.product) ? this.props.location.state.product : {
            id: '',
            // ***************** the following are required *****************
            name: '',
            sibiModelNumber: '',
            productCategoryId: this.props.productCategoryId,
            productSubcategoryId: categories[0].id,
            sku: '',

            // ***************** the following are optional *****************
            serialNumber: '',
            shortDescription: '',
            overview: '',
            faq: [],
            videos: [],
            applianceManufacturerName: '',
            sortIndex: this.props.location.state.sortIndex + 2,
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
            applianceColorsAndImages: [],
            applianceSpecSheetUrl: '',
            applianceRemovalDescription: '',
            applianceRemovalCode: '',
            applianceRemovalPrice: '',
            applianceAssociatedParts: [],
        };

        _.each(product, (value, key) => {
            product[key] = (value === null) ? '' : value;
        });

        this.state = {
            activeSection: '',
            isInstall: false,
            isRemoval: false,
            faqQuestion: '',
            faqAnswer: '',
            image: '',
            imageFile: '',
            color: '',
            partDescription: '',
            partCode: '',
            videoURL: '',
            ...product
        };

        this.update = this.update.bind(this);
        this.updateImage = this.updateImage.bind(this);
        this.close = this.close.bind(this);
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

    componentWillUpdate(nextProps) {
        if (!_.isEqual(nextProps.preSignedURLs, this.props.preSignedURLs)) {
            const re = /http(s)?:\/\//;

            if (_.size(this.state.applianceColorsAndImages) > 0) {
                _.each(this.state.applianceColorsAndImages, (image) => {
                    const match = re.exec(image.imageUrl);
                    if (!match) {
                        const picture = image.imageFile.type.split('/');

                    } else {
                        const fooBar = "don't do anything";
                    }
                });
            }

            console.log('check for uploaded images/videos');
            console.log('update urls for images/videos in product object');
            console.log('send product data to api');
        }

        if (nextProps.imageUploadSuccess.size === nextProps.preSignedURLs.size) {
            this.submitProduct();
        }
    }

    update({ type, value }) {
        this.setState({ [type]: value });

        if (type === 'productSubcategoryId') {
            const products = this.props.products.toJS();
            const categoryName = _.find(this.props.productCategories.toJS(), ['id', value]).name;
            let sortIndex = _.size(products[categoryName]);
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
            const faq = _.remove(prevState.faq, (element, i) => { return i !== index } ); // I'm using this in place of splice because the videos will probably change to obj

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
        const { cookies } = this.props;
        const jwt = cookies.get('sibi-admin-jwt');
        const category = _.find(this.props.productCategories.toJS(), ['id', this.state.productSubcategoryId]);

        this.props.archiveProduct({ token: jwt.token, category: category.name, id: this.state.id })
        this.props.history.push(`/products`);
    }

    submitProduct() {
        const { cookies } = this.props;
        const jwt = cookies.get('sibi-admin-jwt');
        const category = _.find(this.props.productCategories.toJS(), ['id', this.state.productSubcategoryId]);

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

        this.props.history.push(`/products`);
    }

    render() {
        const { cookies } = this.props;
        const jwt = cookies.get('sibi-admin-jwt');

        const styles = {
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
        const title = (this.props.location.state) ? 'Edit' : 'Add';
        const buttonTxt = (this.state.id) ? 'Update' : 'Add';
        const archiveBtn = (this.state.id) ? <div className="btn cancel-btn" onClick={this.archiveProduct}>Archive Product</div> : null;
        const imageBtn = (this.state.image !== '') ? <img src={this.state.image} alt="uploaded-image" height="60" /> : 'Choose File';

        const categories = _.map(this.props.productCategories.toJS(), (category) => {
            return { label: category.name, value: category.id };
        });

        const productPictures = _.map(this.state.applianceColorsAndImages, (image, index) => {
            return (
                <div key={`colorImages${index}`} style={{ display: 'inline-flex', width: '100%' }} >
                    <img src={image.imageUrl} alt="picture" width="auto" height="60" />
                    <input type="text" value={image.color} disabled />
                    <div className="btn cancel-btn" onClick={()=> this.removeColorAndImage({ color: image.color }) } >X</div>
                </div>
            );
        });

        const productVideos = _.map(this.state.videos, (video, index) => {
            return (
                <div key={`colorImages${index}`} style={{ display: 'inline-flex', width: '100%' }} >
                    <input type="text" value={video} disabled />
                    <div className="btn cancel-btn" onClick={()=> this.removeVideo({ index }) } >X</div>
                </div>
            );
        });

        const productParts = _.map(this.state.applianceAssociatedParts, (part, index) => {
            return (
                <div key={`parts${index}`} style={{ display: 'inline-flex', width: '100%' }} >
                    <input type="text" value={part.description} disabled />
                    <input type="text" value={part.code} disabled />
                    <div className="btn cancel-btn" onClick={()=> this.removePart({ partId: (part.id) ? part.id : index }) } >X</div>
                </div>
            )
        });

        const productFAQ = _.map(this.state.faq, (faq, index) => {
            return (
                <div key={`faq${index}`} style={{ display: 'inline-flex', width: '100%' }} >
                    <textarea value={faq.Question} disabled />
                    <textarea value={faq.Answer} disabled />
                    <div className="btn cancel-btn" onClick={()=> this.removeFaq({ index }) } >X</div>
                </div>
            )
        })

        const categoryOptions = [
            { label: 'Select Category', value: '', className: 'disabled' },
            ...categories
        ]

        const fuelTypeOptions = [
            { label: 'Select Fuel Type', value: '', className: 'disabled' },
            { label: 'Gas', value: 'gas' },
            { label: 'Electric', value: 'electric' }
        ]

        return (
            <Overlay type="editProduct">
                <div id="edit-product-overlay" >
                    <div style={styles.titleBar} >
                        <div style={styles.title}>{ title } Product</div>
                        <div onClick={this.close} style={styles.close}>X</div>
                    </div>
                    <form onSubmit={(e) => {e.preventDefault(); this.saveProduct();}} >
                        <div style={styles.content}>
                            <div style={{ columnCount: 2 }}>
                                <div>
                                    <Select
                                        name="product-category"
                                        value={this.state.productSubcategoryId}
                                        options={categoryOptions}
                                        onChange={(value) => this.update({ type: 'productSubcategoryId', value })}
                                    />
                                    <input name="product-name" type="text" placeholder="Product name" value={this.state.name} onChange={(e) => this.update({ type: 'name', value: e.target.value})} required />
                                </div>

                                <div>
                                    <input name="product-classification" type="text" placeholder="Classification" value={this.state.applianceDescription} onChange={(e) => this.update({ type: 'applianceDescription', value: e.target.value})} />
                                    <input name="product-size" type="text" placeholder="Size" value={this.state.applianceSize} onChange={(e) => this.update({ type: 'applianceSize', value: e.target.value})} />
                                </div>

                                <div>
                                    <input name="product-manuf-name" type="text" placeholder="Manufacturer Name (e.g. GE)" value={this.state.applianceManufacturerName} onChange={(e) => this.update({ type: 'applianceManufacturerName', value: e.target.value})}  />
                                    <input name="product-ordering" type="number" placeholder="Feature Placement (e.g. 2)" value={this.state.sortIndex} onChange={(e) => this.update({ type: 'sortIndex', value: e.target.value})} />
                                </div>

                                <div>
                                    <Select
                                        name="product-fuel-type"
                                        value={(this.state.applianceFuelType).toLowerCase()}
                                        options={fuelTypeOptions}
                                        onChange={(value) => this.update({ type: 'applianceFuelType', value })}
                                    />
                                </div>

                                <div>
                                    <input name="product-sibi-model-num" type="text" placeholder="SIBI Model #" value={this.state.sibiModelNumber} onChange={(e) => this.update({ type: 'sibiModelNumber', value: e.target.value})} required />
                                    <input name="product-serial-num" type="text" placeholder="Serial #" value={this.state.serialNumber} onChange={(e) => this.update({ type: 'serialNumber', value: e.target.value})}  />
                                </div>

                                <div>
                                    <input name="product-sku" type="text" placeholder="sku" value={this.state.sku} onChange={(e) => this.update({ type: 'sku', value: e.target.value})} required />
                                    <input name="product-spec-sheet" type="url" placeholder="Spec Sheet URL" value={this.state.applianceSpecSheetUrl} onChange={(e) => this.update({ type: 'applianceSpecSheetUrl', value: e.target.value})} />
                                </div>
                            </div>

                            <textarea name="product-description" placeholder="Short Description" value={this.state.shortDescription} onChange={(e) => this.update({ type: 'shortDescription', value: e.target.value})} maxLength="1000" />

                            <div style={{ columnCount: 2 }}>
                                <input name="product-width" type="text" placeholder="Width"  value={this.state.applianceWidth} onChange={(e) => this.update({ type: 'applianceWidth', value: e.target.value})}  />in.
                            </div>

                            <div style={{ columnCount: 2 }}>
                                <input name="product-height" type="text" placeholder="Height" value={this.state.applianceHeight} onChange={(e) => this.update({ type: 'applianceHeight', value: e.target.value})} />in.
                                <input name="product-depth" type="text" placeholder="Depth"  value={this.state.applianceDepth} onChange={(e) => this.update({ type: 'applianceDepth', value: e.target.value})}  />in.
                            </div>

                            <textarea name="product-overview" type="text" placeholder="overview" value={this.state.overview} onChange={(e) => this.update({ type: 'overview', value: e.target.value})} maxLength="1000" />

                            <div className="accordion">
                                {/* ************************************** faq section ************************************** */}
                                <div id="accordion-faq" className={(this.state.activeSection === 'faq') ? 'headers-active' : 'headers' } onClick={() => this.changeActiveSection('faq')}>
                                    <div>{ _.size(this.state.faq) } FAQs</div>
                                </div>
                                <div style={{ display: (this.state.activeSection === 'faq') ? 'block' : 'none' }} >
                                    { productFAQ }
                                    <div style={{ display: 'inline-flex' }} >
                                        <textarea value={this.state.faqQuestion} placeholder="Question" onChange={(e) => this.update({ type: 'faqQuestion', value: e.target.value })} />
                                        <textarea value={this.state.faqAnswer}   placeholder="Answer"   onChange={(e) => this.update({ type: 'faqAnswer', value: e.target.value })} />
                                        <div onClick={this.addFAQ} className="btn cancel-btn">Add</div>
                                    </div>
                                </div>

                                {/* ************************************** color/pictures section ************************************** */}
                                <div id="accordion-pictures" className={(this.state.activeSection === 'pictures') ? 'headers-active' : 'headers' } onClick={() => this.changeActiveSection('pictures')}>
                                    <div>{ _.size(this.state.applianceColorsAndImages) } Photos</div>
                                </div>
                                <div style={{ display: (this.state.activeSection === 'pictures') ? 'block' : 'none' }} >
                                    { productPictures }
                                    <div style={{ display: 'inline-flex' }} >
                                        <label className="btn blue" >
                                            { imageBtn }
                                            <input
                                                type="file"
                                                accept=".png,.jpg,.jpeg,.svg"
                                                onChange={(e) => {e.preventDefault(); this.updateImage({ image: e.target.files[0] }); }}
                                                style={{ display: 'none' }}
                                            />
                                        </label>
                                        <input type="text" value={this.state.color} placeholder="Color name" onChange={(e) => this.update({ type: 'color', value: e.target.value })} />
                                        <div onClick={this.addColorAndImage} className="btn cancel-btn">Add</div>
                                    </div>
                                </div>

                                {/* ************************************** video section ************************************** */}
                                <div id="accordion-video" className={(this.state.activeSection === 'videos') ? 'headers-active' : 'headers' } onClick={() => this.changeActiveSection('videos')}>
                                    <div>{ _.size(this.state.videos) } Vidoes</div>
                                </div>
                                <div style={{ display: (this.state.activeSection === 'videos') ? 'block' : 'none' }} >
                                    { productVideos }
                                    <div style={{ display: 'inline-flex' }} >
                                        <input type="url" value={this.state.videoURL} placeholder="video URL" onChange={(e) => this.update({ type: 'videoURL', value: e.target.value })} />
                                        <div onClick={this.addVideo} className="btn cancel-btn">Add</div>
                                    </div>
                                </div>

                                {/* ************************************** parts section ************************************** */}
                                <div id="accordion-parts" className={(this.state.activeSection === 'parts') ? 'headers-active' : 'headers' } onClick={() => this.changeActiveSection('parts')} >
                                    <div>{ _.size(this.state.applianceAssociatedParts) } Parts</div>
                                </div>
                                <div style={{ display: (this.state.activeSection === 'parts') ? 'block' : 'none' }} >
                                    { productParts }
                                    <div style={{ display: 'inline-flex' }} >
                                        <input type="text" value={this.state.partDescription} placeholder="Part name"   onChange={(e) => this.update({ type: 'partDescription', value: e.target.value })} />
                                        <input type="text" value={this.state.partCode}        placeholder="Part number" onChange={(e) => this.update({ type: 'partCode', value: e.target.value })} />
                                        <div onClick={this.addPart} className="btn cancel-btn">Add</div>
                                    </div>
                                </div>
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
                                <input name="product-install-code" type="text" placeholder="install code (e.g. M106)" value={this.state.applianceInstallCode} onChange={(e) => this.update({ type: 'applianceInstallCode', value: e.target.value})} />
                                <input name="product-install-value" type="number" placeholder="install value (e.g. 0.00)" value={this.state.applianceInstallPrice} onChange={(e) => this.update({ type: 'applianceInstallPrice', value: e.target.value})} />
                                <textarea name="product-install-descr" type="text" placeholder="Install Description" value={this.state.applianceInstallDescription} onChange={(e) => this.update({ type: 'applianceInstallDescription', value: e.target.value})} />
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
                                <input name="product-removal-code" type="text" placeholder="removal code (e.g. M106)" value={this.state.applianceRemovalCode} onChange={(e) => this.update({ type: 'applianceRemovalCode', value: e.target.value})} />
                                <input name="product-removal-value" type="number" placeholder="removal value (e.g. 0.00)" value={this.state.applianceRemovalPrice} onChange={(e) => this.update({ type: 'applianceRemovalPrice', value: e.target.value})}/>
                                <textarea name="product-removal-descr" type="text" placeholder="Removal Description" value={this.state.applianceRemovalDescription} onChange={(e) => this.update({ type: 'applianceRemovalDescription', value: e.target.value})} />
                            </div>
                        </div>
                        <input className="btn blue" type="submit" value={buttonTxt} style={{ width: '89%' }} />
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
    productCategoryId   : state.products.get('productCategoryId'),
    preSignedURLs       : state.assets.get('preSignedURLs'),
    imageUploadSuccess  : state.assets.get('imageUploadSuccess'),
    imageUploadFailed   : state.assets.get('imageUploadFailed')
});

const actions = {
    updateProduct,
    createProduct,
    archiveProduct,
    getPresignedUrls,
    uploadImagesS3
};

export default connect(select, actions, null, { withRef: true })(withRouter(withCookies(EditProduct)));