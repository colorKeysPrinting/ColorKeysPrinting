import React                    from 'react';
import { connect }              from 'react-redux';

import { login, closeOverlay, passwordReset }      from '../../actions/application';

import Login                    from './login';
import FileUploader             from './file_uploader';
import Agreement                from './agreement';

let select = (state)=>{
    return {
        activeOverlay: state.application.get('activeOverlay'),
        contractGoodman: state.application.getIn(['contracts','goodman']),
        contractAsure: state.application.getIn(['contracts','asure'])
    }
};

@connect(select, {login, closeOverlay, passwordReset}, null, {withRef: true})
export default class Overlay extends React.Component {
    constructor(props) {
        super(props);

        this.state = {activeOverlay: this.props.activeOverlay, email: '', password: '', errorEmail: false, errorPassword: false,
                      docWorkerComp: '', docW9: '', docInsurance: '', contractGoodman: false, contractAsure: false};

        this.changeOverlay = this.changeOverlay.bind(this);
        this.update = this.update.bind(this);
        this.fileDrop = this.fileDrop.bind(this);
        this.close = this.close.bind(this);
        this.submitBtn = this.submitBtn.bind(this);
    }

    componentWillReceiveProps(nextProps) {
        if(nextProps.activeOverlay) {
            this.setState({activeOverlay: nextProps.activeOverlay});
        } else {
            this.setState({activeOverlay: ''});
        }
    }

    changeOverlay(activeOverlay) {
        this.setState({password: '', errorEmail: false, errorPassword: false});
        this.setState({activeOverlay});
    }

    update(type, value) {
        console.log(type, value);
        // TODO: validation checks for correct types (email) prevent sql injections,
        this.setState({[type]: value});
    }

    fileDrop(type, value) {
        console.log(value);
        // TODO: validation checks for file type and size
        this.setState({[type]: value});
    }

    close() {
        this.setState({email: '', password: '', errorEmail: false, errorPassword: false});
        this.props.closeOverlay();
    }

    submitBtn(type) {
        console.log('submit clicked', 'TODO: run validation checks');
        switch(type) {
            case 'login':
                let isValid = true;

                if (this.state.email === '' && this.state.password === '') {
                    isValid = false;
                    this.setState({errorEmail: true, errorPassword: true});

                } else if (this.state.email === ''&& this.state.password !== '') {
                    isValid = false;
                    this.setState({errorEmail: true, errorPassword: false});

                } else if (this.state.email !== '' && this.state.password === '') {
                    isValid = false;
                    this.setState({errorEmail: false, errorPassword: true});
                }

                if(isValid) {
                    this.props.login(this.state.email, this.state.password);
                    this.setState({email: '', password: '', errorEmail: false, errorPassword: false});
                }
                break;
            case 'reset':
                isValid = true;

                if (this.state.email === '') {
                    isValid = false;
                    this.setState({errorEmail: true});
                }

                if(isValid) {
                    this.props.passwordReset(this.state.email);
                    this.setState({email: '', password: '', errorEmail: false, errorPassword: false});
                }
                break;
            default:
        }
    }

    render() {
        let overlay;

        let styles = {
            overlayBackground: {
                display: (this.state.activeOverlay !== '') ? 'block' : 'none',
                position: 'absolute',
                backgroundColor: 'rgba(50, 50, 50, 0.4)',
                height: '100%',
                width: '100%',
                top: '0',
                left: '0'
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
                                submitBtn={this.submitBtn} />
                break;
            case 'docWorkerComp':
            case 'docW9':
            case 'docInsurance':
                overlay = <FileUploader
                                type={this.state.activeOverlay}
                                fileDrop={this.fileDrop}
                                close={this.close}
                                submitBtn={this.submitBtn} />
                break;
            case 'contractGoodman':
            case 'contractAsure':
                overlay = <Agreement
                                type={this.state.activeOverlay}
                                update={this.update}
                                document={(this.state.activeOverlay === 'contractGoodman') ? this.props.contractGoodman : this.props.contractAsure}
                                checked={(this.state.activeOverlay === 'contractGoodman') ? this.state.contractGoodman : this.state.contractAsure}
                                close={this.close}
                                submitBtn={this.submitBtn}/>
            default:
        }

        return (
            <div id="overlay-container" style={styles.overlayBackground}>
                {overlay}
            </div>
        );
    }
}
