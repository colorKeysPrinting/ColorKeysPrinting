import React                    from 'react';
import { connect }              from 'react-redux';
import _                        from 'lodash';

import { login, logout, closeOverlay, passwordReset, changeLanguage }      from '../../actions/application';

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
        };

        this.resetState = this.resetState.bind(this);
        this.changeOverlay = this.changeOverlay.bind(this);
        this.update = this.update.bind(this);
        this.fileDrop = this.fileDrop.bind(this);
        this.close = this.close.bind(this);
        this.submitLoginBtn = this.submitLoginBtn.bind(this);
    }

    componentWillReceiveProps(nextProps) {
        if (nextProps.activeOverlay) {
            this.setState({ activeOverlay: nextProps.activeOverlay });
        } else if (nextProps.activeOverlay === '') {
            this.setState({ activeOverlay: '' });
        }

        if (nextProps.overlayObj) {
            this.setState({ overlayObj: nextProps.overlayObj });
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
            name: '',
            newItem: '',
            contractGoodman: false,
            contractAsure: false
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

        const re = new RegExp('.(pdf|word|png|jpg|jpeg)', 'i');
        const maxSize = 25000; // 25KB = bytes

        const result = re.exec(value.name);

        if (!result) {
            isCorrect = false;
            errorMsg += "Incorrect file type!\n\tPlease upload a .PDF, .WORD, .PNG or .JPG\n\n"
        }

        if (value.size > maxSize) {
            isCorrect = false;
            errorMsg += "File is too big!\n\tPlease upload a file no larger than 25KB\n\n";
        }

        if (isCorrect) {
            // this.props.addDocument(type, value);
            this.close();
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

    saveProduct() {
        console.log('save product');
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
                />)
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

        case 'docWorkerComp':
            overlay = (
                <FileUploader
                    type={this.state.activeOverlay}
                    fileDrop={this.fileDrop}
                    close={this.close}
                    errorMsg={this.state.errorMsg}
                />);
            break;
        
        case 'editProduct':
            overlay = (<div></div>);
            console.log('show editProduct overlay');
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
    passwordReset
};

export default connect(select, actions, null, { withRef: true })(Overlay);