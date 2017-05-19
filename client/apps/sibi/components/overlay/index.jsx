import React                    from 'react';
import { connect }              from 'react-redux';

import { login, closeOverlay, passwordReset }      from '../../actions/application';

import Login                    from './login';

let select = (state)=>{
    return {
        activeOverlay: state.application.get('activeOverlay')
    }
};

@connect(select, {login, closeOverlay, passwordReset}, null, {withRef: true})
export default class Overlay extends React.Component {
    constructor(props) {
        super(props);

        this.state = {activeOverlay: this.props.activeOverlay, email: '', password: '', errorEmail: false, errorPassword: false};

        this.changeOverlay = this.changeOverlay.bind(this);
        this.update = this.update.bind(this);
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
        this.setState({[type]: value});
    }

    close() {
        this.setState({email: '', password: '', errorEmail: false, errorPassword: false});
        this.props.closeOverlay();
    }

    submitBtn(type) {
        console.log('submit clicked', 'TODO: run validation checks');
        switch(type) {
            case 'Login':
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
            case 'Reset password':
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
                                type={(this.state.activeOverlay === 'login') ? 'Login': 'Reset password'}
                                email={{email:this.state.email, error: this.state.errorEmail}}
                                password={{password: this.state.password, error: this.state.errorPassword}}
                                update={this.update}
                                changeOverlay={this.changeOverlay}
                                close={this.close}
                                submitBtn={this.submitBtn} />
                break;
            default:
        }

        return (
            <div id="overlay-container" style={styles.overlayBackground}>
                {overlay}
            </div>
        );
    }
}
