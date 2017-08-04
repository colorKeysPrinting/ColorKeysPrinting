import React                    from 'react';
import { connect }              from 'react-redux';
import _                        from 'lodash';
import { withCookies }          from 'react-cookie';
import '../common/custom_formats';

import { login, closeOverlay, passwordReset, changeLanguage }      from '../../actions/application';
import { logout }      from '../../actions/header';
import { updateProduct, createProduct }      from '../../actions/products';

import Login                    from './login';
import FileUploader             from './file_uploader';
import Profile                  from './profile';
import EditProduct              from './edit_product';

class Overlay extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            activeUser: this.props.activeUser.toJS(),
            activeOverlay: '',
            overlayObj: '',
            errorMsg: '',
            email: '',
            password: '',
            category: '',
            productName: '',
            classification: '',
            size: '',
            pictures: [],
            parts: [],
            installCode: '',
            installPrice: '',
            removalCode: '',
            removalPrice: ''
        };

        this.resetState = this.resetState.bind(this);
        this.changeOverlay = this.changeOverlay.bind(this);
        this.update = this.update.bind(this);
        this.fileDrop = this.fileDrop.bind(this);
        this.close = this.close.bind(this);
        this.submitLoginBtn = this.submitLoginBtn.bind(this);
        this.saveProduct = this.saveProduct.bind(this);
        this.archiveProduct = this.archiveProduct.bind(this);
    }

    componentWillReceiveProps(nextProps) {
        if (nextProps.activeOverlay) {
            this.setState({ activeOverlay: nextProps.activeOverlay });

        } else if (nextProps.activeOverlay === '') {
            this.setState({ activeOverlay: '' });
        }

        if (nextProps.overlayObj) {
            if (nextProps.activeOverlay === 'editProduct') {
                const type = 'appliance';
                const category      = nextProps.overlayObj.category,
                    productName     = nextProps.overlayObj.name,
                    classification  = nextProps.overlayObj[`${type}Description`],
                    size            = nextProps.overlayObj[`${type}Size`],
                    pictures        = nextProps.overlayObj[`${type}ColorsAndImages`],
                    parts           = nextProps.overlayObj[`${type}AssociatedParts`],
                    installCode     = nextProps.overlayObj[`${type}InstallCode`],
                    installPrice    = nextProps.overlayObj[`${type}InstallPrice`],
                    removalCode     = nextProps.overlayObj[`${type}RemovalCode`],
                    removalPrice    = nextProps.overlayObj[`${type}RemovalPrice`];

                this.setState({ category, productName, classification, size, pictures, parts, installCode, installPrice, removalCode, removalPrice, overlayObj: nextProps.overlayObj });
            } else {
                this.setState({ overlayObj: nextProps.overlayObj });
            }
        }

        if (nextProps.activeUser) {
            this.setState({ activeUser: nextProps.activeUser.toJS() });
        }
    }

    resetState() {
        this.setState({
            activeOverlay: '',
            overlayObj: '',
            errorMsg: '',
            email: '',
            password: '',
            category: '',
            productName: '',
            classification: '',
            size: '',
            pictures: [],
            parts: [],
            installCode: '',
            installPrice: '',
            removalCode: '',
            removalPrice: ''
        });
    }

    changeOverlay(activeOverlay) {
        this.setState({ password: '', activeOverlay });
    }

    update(type, value) {
        this.setState({ [type]: value });
    }

    close() {
        this.resetState();
        this.props.closeOverlay();
    }

    fileDrop(type, value) {
        let isCorrect = true, errorMsg = '';

        console.log(type, value);

        const re = new RegExp('.(png|jpg|jpeg)', 'i');
        const maxSize = 25000; // 25KB = bytes

        const result = re.exec(value.name);

        if (!result) {
            isCorrect = false;
            errorMsg += "Incorrect file type!\n\tPlease upload a .PNG or .JPG\n\n"
        }

        if (value.size > maxSize) {
            isCorrect = false;
            errorMsg += "File is too big!\n\tPlease upload a file no larger than 25KB\n\n";
        }

        if (isCorrect) {
            this.setState((prevState) => {
                prevState.pictures.push(value);
                return { pictures: prevState.pictures };
            });
            this.changeOverlay('editProduct');
            return true;

        } else {
            this.setState({ errorMsg });
            return false;
        }
    }

    submitLoginBtn(type) {
        console.log('submit login clicked');

        if (type === 'login') {
            this.props.login(this.state.email, this.state.password);
            this.resetState();

        } else if (type === 'reset') {
            this.props.passwordReset(this.state.email);
            this.resetState();
        }
    }

    saveProduct(id) {
        console.log('save product', id);
        const { cookies } = this.props;
        const jwt = cookies.get('sibi-admin-jwt');
        const category = _.find(this.props.productCategories.toJS(), ['id', this.state.category]);

        const product = {
            name: this.state.productName,
            // manufacturerModelNumber: this.state.,    // not in application
            // serialNumber: this.state.,               // not in application
            // shortDescription: this.state.,           // not in application
            // sku: this.state.,                        // not in application
            // overview: this.state.,                   // not in application
            // specifications: this.state.,             // not in application
            // faq: this.state.,                        // not in application
            // videos: this.state.,                     // not in application
            productCategoryId: this.props.activeUser.toJS().tradeId,
            productSubcategoryId: this.state.category,
            // applianceType: this.state.,              // not in application
            applianceSize: this.state.size,
            applianceDescription: this.state.classification,
            // sibiModelNumber: this.state.,                // not in application
            // applianceFuelType: this.state.,              // not in application
            // applianceWidth: this.state.,                 // not in application
            // applianceHeight: this.state.,                // not in application
            // applianceDepth: this.state.,                 // not in application
            // applianceInstallDescription: this.state.,    // not in application
            applianceInstallPrice: this.state.installPrice,
            applianceInstallCode: this.state.installCode,
            applianceColorsAndImages: this.state.pictures,
            applianceAssociatedParts: this.state.parts,     // *** missing from api ***
            // applianceSpecSheetUrl: this.state.,          // not in application
            // applianceRemovalDescription: this.state.,    // not in application
            applianceRemovalCode: this.state.removalCode,
            applianceRemovalPrice: this.state.removalPrice,
        };

        if (id) {
            product['id'] = id;
            
            this.props.updateProduct({ token: jwt.token, category: category.name, product });
        } else {

            this.props.createProduct({ token: jwt.token, category: category.name, product })
        }
        this.close();
    }

    archiveProduct(id) {
        console.log('deleteProduct', id);
        const { cookies } = this.props;
        const jwt = cookies.get('sibi-admin-jwt');
        const category = _.find(this.props.productCategories.toJS(), ['id', this.state.category]);

        // this.props.removeProduct({ token: jwt.token, category: category.name, id });
        this.close();
    }

    render() {
        let overlay, closeSection;

        const styles = {
            overlayBackground: {
                display: (this.state.activeOverlay !== '') ? 'block' : 'none',
                position: 'absolute',
                backgroundColor: (this.state.activeOverlay !== 'productAddTo' && this.state.activeOverlay !== 'profile') ? 'rgba(50, 50, 50, 0.4)' : '',
                height: '100%',
                width: '100%',
                top: '0',
                left: '0',
                zIndex: '999'
            },
            closeSection: {
                height: '100%',
                width: '100%'
            }
        }

        switch (this.state.activeOverlay) {
        case 'login':
        case 'reset':
            overlay = (
                <Login
                    type={this.state.activeOverlay}
                    email={{ email:this.state.email, error: this.state.errorEmail }}
                    password={{ password: this.state.password, error: this.state.errorPassword }}
                    update={this.update}
                    changeOverlay={this.changeOverlay}
                    close={this.close}
                    submitLoginBtn={this.submitLoginBtn}
                />);
            break;

        case 'profile':
            overlay = (
                <Profile
                    profilePic={this.state.activeUser.profilePic}
                    username={this.state.activeUser.username}
                    changeLanguage={this.props.changeLanguage}
                    logout={this.props.logout}
                />);

            closeSection = <div onClick={this.close} style={styles.closeSection}></div>;
            break;

        case 'filePhotos':
            overlay = (
                <FileUploader
                    type={this.state.activeOverlay}
                    fileDrop={this.fileDrop}
                    close={this.close}
                    errorMsg={this.state.errorMsg}
                />);
            break;
        
        case 'editProduct':

            const title = (this.state.overlayObj) ? 'Edit Product' : 'Add Product';
            const id = (this.state.overlayObj) ? this.state.overlayObj.id : null;

            overlay = (<EditProduct 
                title={title}
                id={id}
                category={this.state.category}
                productName={this.state.productName}
                classification={this.state.classification}
                size={this.state.size}
                pictures={this.state.pictures}
                parts={this.state.parts}
                installCode={this.state.installCode}
                installPrice={this.state.installPrice}
                removalCode={this.state.removalCode}
                removalPrice={this.state.removalPrice}
                productCategories={this.props.productCategories.toJS()}
                update={this.update}
                close={this.close}
                changeOverlay={this.changeOverlay}
                saveProduct={this.saveProduct}
                archiveProduct={this.archiveProduct}
            />);
            break;

        default:
        }

        return (
            <div id="overlay-container" style={styles.overlayBackground}>
                { closeSection }
                { overlay }
            </div>
        );
    }
}

const select = (state) => ({
    activeOverlay       : state.application.get('activeOverlay'),
    overlayObj          : state.application.get('overlayObj'),
    activeUser          : state.application.get('activeUser'),
    productCategories   : state.application.get('productCategories'),
});

const actions = {
    login,
    logout,
    closeOverlay,
    passwordReset,
    updateProduct, 
    createProduct
};

export default connect(select, actions, null, { withRef: true })(withCookies(Overlay));