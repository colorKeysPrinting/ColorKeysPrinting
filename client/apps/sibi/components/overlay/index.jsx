import React                    from 'react';
import { connect }              from 'react-redux';
import _                        from 'lodash';

import * as productActions      from '../../actions/products';
import { login, logout, showRadioOverlay, closeOverlay, passwordReset, changeLanguage }      from '../../actions/application';
import { addDocument, acceptAgreement }         from '../../actions/signup';

import Login                    from './login';
import FileUploader             from './file_uploader';
import Agreement                from './agreement';
import ProductAddTo             from './product_add_to'
import Radio                    from './radio';
import AddToConfirmation        from './add_to_confirmation';
import AddNewList               from './add_new_list';
import ViewMatchup              from './view_matchup';
import Profile                  from './profile';
import RemoveListItem           from './remove_list_item';
import StockCheck               from './stock_check';

class Overlay extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            activeUser: this.props.activeUser.toJS(), activeOverlay: '', overlayObj: '', errorMsg: '', email: '', password: '', name: '', newItem: '',
            contractGoodman: false, contractAsure: false
        };

        this.resetState = this.resetState.bind(this);
        this.changeOverlay = this.changeOverlay.bind(this);
        this.update = this.update.bind(this);
        this.fileDrop = this.fileDrop.bind(this);
        this.close = this.close.bind(this);
        this.submitLoginBtn = this.submitLoginBtn.bind(this);
        this.submitCreateListBtn = this.submitCreateListBtn.bind(this);
        this.submitAddToBtn = this.submitAddToBtn.bind(this);
        this.removeProduct = this.removeProduct.bind(this);
        this.removeCollection = this.removeCollection.bind(this);
        this.addToTruck = this.addToTruck.bind(this);
    }

    componentWillReceiveProps(nextProps) {
        if(nextProps.activeOverlay) {
            this.setState({activeOverlay: nextProps.activeOverlay});
        } else if (nextProps.activeOverlay === '') {
            this.setState({activeOverlay: ''});
        }

        if(nextProps.overlayObj) {
            this.setState({overlayObj: nextProps.overlayObj});
        }

        if(nextProps.activeUser) {
            this.setState({activeUser: nextProps.activeUser.toJS()});
        }
    }

    resetState() {
        this.setState({
            activeOverlay: '', overlayObj: '', errorMsg: '', email: '', password: '', name: '', newItem: '',
            contractGoodman: false, contractAsure: false
        });
    }

    changeOverlay(activeOverlay) {
        this.setState({password: '', activeOverlay});
    }

    update(type, value) {
        this.setState({[type]: value});
    }

    close() {
        this.resetState();
        this.props.closeOverlay();
    }

    fileDrop(type, value) {
        let isCorrect = true, errorMsg = '';

        console.log(type, value);

        const re = new RegExp('\.(pdf|word|png|jpg|jpeg)', 'i');
        const maxSize = 25000; // 25KB = bytes

        let result = re.exec(value.name);

        if(!result) {
            isCorrect = false;
            errorMsg += "Incorrect file type!\n\tPlease upload a .PDF, .WORD, .PNG or .JPG\n\n"
        }

        if(value.size > maxSize) {
            isCorrect = false;
            errorMsg += "File is too big!\n\tPlease upload a file no larger than 25KB\n\n";
        }

        if(isCorrect) {
            this.props.addDocument(type, value);
            this.close();
            return true;

        } else {
            this.setState({errorMsg});
            return false;
        }
    }

    submitLoginBtn(type) {
        console.log('submit login clicked');

        if(type === 'login') {
            this.props.login(this.state.email, this.state.password);
            this.resetState();

        } else if (type === 'reset') {
            this.props.passwordReset(this.state.email);
            this.resetState();
        }
    }

    submitCreateListBtn(type) {
        console.log('submit add to clicked');

        let products = [], totalCost;
        if(this.state.overlayObj.productId === undefined) {
            totalCost = 0;
        } else {
            totalCost = _.find(this.props.products.toJS(), ['id', this.state.overlayObj.productId]).price;
            products = [this.state.overlayObj.productId];
        }

        if(type === 'customMatchups') {
            this.props.createMatchup({name: this.state.name, totalCost, adminCreated: (this.state.activeUser.type === 'admin') ? true : false, products});

        } else if(type === 'myLists') {
            this.props.createList({name: this.state.name, products});
        }
        this.close();
    }

    submitAddToBtn(type, collectionId) {
        console.log('submit add to clicked');

        let user = this.props.activeUser.toJS();
        let product = _.find(this.props.products.toJS(), ['id', this.state.overlayObj.productId]);

        if(type === 'customMatchups') {
            let matchup = _.find(user.myMatchups, ['id', collectionId]);

            if(product.price) {
                matchup.totalCost += product.price;
            }

            let products = _.map(matchup.products, (product)=>{
                return product.id;
            });

            products.push(product.id);
            matchup.products = products;

            this.props.updateMatchup(matchup);

        } else if(type === 'myLists') {
            let list = _.find(user.myLists, ['id', collectionId]);

            let products = _.map(list.products, (product)=>{
                return product.id;
            });

            products.push(product.id);
            list.products = products

            this.props.updateList(list);
        }
    }

    removeProduct(collectionType, collectionId, productId) {

        if(collectionType === 'customMatchups') {
            let collection = _.find(this.props.activeUser.toJS().myMatchups, ['id', collectionId]);
            collection.products = _.remove(collection.products, (product)=>{return product.id !== productId});
            this.props.updateMatchup(collection);

        } else if(collectionType === 'myLists') {
            let collection = _.find(this.props.activeUser.toJS().myLists, ['id', collectionId]);
            collection.products = _.remove(collection.products, (product)=>{return product.id !== productId});
            this.props.updateList(collection);
        }
    }

    removeCollection(type, id) {
        console.log('delete collection', type, id);

        if(type === 'customMatchups') {
            this.props.removeMatchup(id);

        } else if(type === 'myLists') {
            this.props.removeList(id);
        }
    }

    addToTruck(items) {
        console.log('add to truck: ', items);
    }

    render() {
        let overlay, closeSection;

        let styles = {
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

        switch(this.state.activeOverlay) {
            case 'login':
            case 'reset':
                overlay = <Login
                                type={this.state.activeOverlay}
                                email={{email:this.state.email, error: this.state.errorEmail}}
                                password={{password: this.state.password, error: this.state.errorPassword}}
                                update={this.update}
                                changeOverlay={this.changeOverlay}
                                close={this.close}
                                submitLoginBtn={this.submitLoginBtn} />
                break;

            case 'profile':
                overlay = <Profile
                                profilePic={this.state.activeUser.profilePic}
                                username={this.state.activeUser.username}
                                changeLanguage={this.props.changeLanguage}
                                logout={this.props.logout} />;

                closeSection = <div onClick={this.close} style={styles.closeSection}></div>;
                break;

            case 'docWorkerComp':
            case 'docW9':
            case 'docInsurance':
                overlay = <FileUploader
                                type={this.state.activeOverlay}
                                fileDrop={this.fileDrop}
                                close={this.close}
                                errorMsg={this.state.errorMsg} />
                break;

            case 'contractGoodman':
            case 'contractAsure':
                overlay = <Agreement
                                type={this.state.activeOverlay}
                                document={(this.state.activeOverlay === 'contractGoodman') ? this.props.contractGoodman : this.props.contractAsure}
                                acceptAgreement={this.props.acceptAgreement}
                                close={this.close} />
                break;

            case 'productAddTo':
                overlay = <ProductAddTo
                                showRadioOverlay={this.props.showRadioOverlay} // to reducer func
                                overlayObj={this.state.overlayObj}
                                close={this.close} />;

                closeSection = <div onClick={this.close} style={styles.closeSection}></div>;
                break;

            case 'radioList':
                overlay = <Radio
                                overlayObj={this.state.overlayObj} // list of selected list elements
                                changeOverlay={this.changeOverlay} // to local func
                                close={this.close}
                                submitAddToBtn={this.submitAddToBtn} />;
                break;

            case 'addToConfirmation':
                overlay = <AddToConfirmation
                                overlayObj={this.state.overlayObj}
                                product={_.find(this.props.products.toJS(), ['id', this.state.overlayObj.productId])}
                                changeOverlay={this.changeOverlay}  // for changing to customMatchupOverlay
                                close={this.close} />;
                break;

            case 'addNewList':
                overlay = <AddNewList
                                name={this.state.name}
                                overlayObj={this.state.overlayObj}
                                update={this.update}
                                close={this.close}
                                submitCreateListBtn={this.submitCreateListBtn} />;
                break;

            case 'customMatchup':
                overlay = <ViewMatchup
                                overlayObj={this.state.overlayObj}
                                close={this.close} />;
                break;

            case 'removeItem' :
                overlay = <RemoveListItem
                                overlayObj={this.state.overlayObj}
                                collection={_.find(this.state.activeUser.myLists, ['id', this.state.overlayObj.collectionId])}
                                product={_.find(this.props.products.toJS(), ['id', this.state.overlayObj.productId])}
                                removeProduct={this.removeProduct}
                                removeCollection={this.removeCollection}
                                close={this.close} />;
                break;

            case 'stockCheck' :
                overlay = <StockCheck
                                location={this.state.overlayObj.location}
                                product={this.state.overlayObj.product}
                                checkingInventory={this.props.checkingInventory}
                                close={this.close} />;
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

let select = (state)=>{
    return {
        activeOverlay       : state.application.get('activeOverlay'),
        overlayObj          : state.application.get('overlayObj'),
        activeUser          : state.application.get('activeUser'),
        products            : state.application.get('products'),
        contractGoodman     : state.application.getIn(['contracts','goodman']),
        contractAsure       : state.application.getIn(['contracts','asure'])
    }
};

let actions = {
    login, logout, showRadioOverlay, closeOverlay, passwordReset, addDocument, acceptAgreement,
    ...productActions
};

export default connect(select, actions, null, {withRef: true})(Overlay);