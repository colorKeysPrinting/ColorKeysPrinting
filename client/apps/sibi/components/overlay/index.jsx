import React                    from 'react';
import { connect }              from 'react-redux';

import { login, showRadioOverlay, closeOverlay, passwordReset }      from '../../actions/application';
import {  addDocument }         from '../../actions/products';

import Login                    from './login';
import FileUploader             from './file_uploader';
import Agreement                from './agreement';
import ProductAddTo             from './product_add_to'
import Radio                    from './radio';
import AddNewList               from './add_new_list';

let select = (state)=>{
    return {
        activeOverlay       : state.application.get('activeOverlay'),
        overlayObj          : state.application.get('overlayObj'),
        contractGoodman     : state.application.getIn(['contracts','goodman']),
        contractAsure       : state.application.getIn(['contracts','asure'])
    }
};

@connect(select, {login, showRadioOverlay, closeOverlay, passwordReset, addDocument}, null, {withRef: true})
export default class Overlay extends React.Component {
    constructor(props) {
        super(props);

        this.state = {activeOverlay: '', overlayObj: '', errorMsg: '', email: '', password: '', newItem: '', contractGoodman: false, contractAsure: false};

        this.resetState = this.resetState.bind(this);
        this.changeOverlay = this.changeOverlay.bind(this);
        this.update = this.update.bind(this);
        this.fileDrop = this.fileDrop.bind(this);
        this.close = this.close.bind(this);
        this.submitLoginBtn = this.submitLoginBtn.bind(this);
        this.submitAddToBtn = this.submitAddToBtn.bind(this);
    }

    componentWillReceiveProps(nextProps) {
        if(nextProps.activeOverlay) {
            this.setState({activeOverlay: nextProps.activeOverlay});
        } else {
            this.setState({activeOverlay: ''});
        }

        if(nextProps.overlayObj) {
            this.setState({overlayObj: nextProps.overlayObj});
        }
    }

    resetState() {
        this.setState({activeOverlay: '', overlayObj: '', email: '', password: '', newItem: '', contractGoodman: false, contractAsure: false});
    }

    changeOverlay(activeOverlay) {
        this.setState({password: ''});
        this.setState({activeOverlay});
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
            this.props.closeOverlay();
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

    submitAddToBtn(type) {
        console.log('submit add to clicked');
    }

    render() {
        let overlay, closeSection;

        let styles = {
            overlayBackground: {
                display: (this.state.activeOverlay !== '') ? 'block' : 'none',
                position: 'absolute',
                backgroundColor: (this.state.activeOverlay !== 'productAddTo') ? 'rgba(50, 50, 50, 0.4)' : '',
                height: '100%',
                width: '100%',
                top: '0',
                left: '0'
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
                                update={this.update}
                                document={(this.state.activeOverlay === 'contractGoodman') ? this.props.contractGoodman : this.props.contractAsure}
                                checked={(this.state.activeOverlay === 'contractGoodman') ? this.state.contractGoodman : this.state.contractAsure}
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
            case 'addNewList':
                overlay = <AddNewList
                                newItem={this.state.newItem}
                                overlayObj={this.state.overlayObj}
                                update={this.update}
                                close={this.close}
                                submitAddToBtn={this.submitAddToBtn} />;
                break;
            default:
        }

        return (
            <div id="overlay-container" style={styles.overlayBackground}>
                {closeSection}
                {overlay}
            </div>
        );
    }
}
