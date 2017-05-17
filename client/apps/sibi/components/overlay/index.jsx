import React                                     from 'react';
import { connect }                               from 'react-redux';

import { login, showOverlay, closeOverlay, passwordReset }      from '../../actions/application';
import assets                                    from '../../libs/assets';

let select = (state)=>{
    return {
        activeOverlay: state.application.get('activeOverlay'),
        overlayObj: state.application.get('overlayObj')
    }
};

@connect(select, { login, showOverlay, closeOverlay, passwordReset }, null, {withRef: true})
export default class Overlay extends React.Component {
    constructor(props) {
        super(props);

        let email = (this.props.overlayObj.email) ? this.props.overlayObj.email : '';
        // local state
        this.state = {email, password: '', errorEmail: false, errorPassword: false};

        // local functions
        this.changeOverlay = this.changeOverlay.bind(this);
        this.loginClick = this.loginClick.bind(this);
        this.submitClick = this.submitClick.bind(this);
    }

// **** CUSTOM FUNCTIONS
    changeOverlay() {
        let email = this.state.email;
        this.setState({email: '', password: '', errorEmail: false, errorPassword: false});

        this.props.showOverlay('Reset Password', {email})
    }

    loginClick() {
        if(this.state.email !== '' && this.state.password !== '') {
            let email = this.state.email;
            let password = this.state.password;
            this.setState({email: '', password: '', errorEmail: false, errorPassword: false});

            this.props.login(email, password);

        } else if (this.state.email === '' && this.state.password === '') {
            this.setState({errorEmail: true, errorPassword: true});

        } else if (this.state.email === ''&& this.state.password !== '') {
            this.setState({errorEmail: true, errorPassword: false});

        } else if (this.state.email !== '' && this.state.password === '') {
            this.setState({errorEmail: false, errorPassword: true});
        }
    }

    submitClick() {
        if(this.state.email !== '') {
            let email = this.state.email;
            this.setState({email: '', password: '', errorEmail: false, errorPassword: false});

            this.props.passwordReset(email);
            this.props.showOverlay('Login');

        } else {
            this.setState({errorEmail: true});
        }
    }

    render() {
        let overlay;

        let styles = {
            overlayBackground: {
                display: (this.props.activeOverlay !== '') ? 'block' : 'none',
                position: 'absolute',
                backgroundColor: 'rgba(50, 50, 50, 0.4)',
                height: '100%',
                width: '100%',
                top: '0',
                left: '0'
            },
            overlay: {
                backgroundColor: '#F9FAFC',
                borderRadius: '10px',
                height: '400px',
                width: '500px',
                margin: '10em auto',
                zIndex: '999',
            },
            titleBar: {
                display: 'inline-flex',
                backgroundColor: '#FFF',
                borderTopLeftRadius: '10px',
                borderTopRightRadius: '10px',
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
                width: '400px',
                margin: 'auto'
            },
            contentLogin: {
                height: '80%',
            },
            contentReset: {
                height: '60%',
            },
            credentialSection: {
                display: 'grid',
                height: '70%',
                width: '100%'
            },
            actionSection: {
                display: 'inline-flex',
                width: '100%',
                padding: '10px 0'
            },
            email: {
                borderRadius: '10px',
                marginTop: '50px',
                height: '59px'
            },
            password: {
                borderRadius: '10px',
                margin: '20px 0',
                height: '59px',
            },
            loginBtn: {
                backgroundColor: 'rgb(47, 205, 237)',
                borderRadius: '5px',
                color: '#FFF',
                cursor: 'pointer',
                height: '40px',
                width: '40%',
                paddingTop: '20px'
            },
            submitBtn: {
                backgroundColor: 'rgb(47, 205, 237)',
                borderRadius: '5px',
                color: '#FFF',
                cursor: 'pointer',
                height: '40px',
                width: '100%',
                paddingTop: '20px',
                marginTop: '70px'
            },
            forgotPassword: {
                cursor: 'pointer',
                paddingTop: '20px',
                textAlign: 'left',
                width: '60%'
            },
            inputEmail: {
                border: (!this.state.errorEmail) ? '' : '4px solid rgba(255, 0, 0, 1)',
                borderRadius: '10px',
                padding: '20px',
                width: '89%'
            },
            inputPassword: {
                border:  (!this.state.errorPassword) ? '' : '4px solid rgba(255, 0, 0, 1)',
                borderRadius: '10px',
                padding: '20px',
                width: '89%'
            }
        };

        switch(this.props.activeOverlay) {
            case 'Login':
                overlay = <div style={styles.contentLogin}>
                    <div style={styles.content}>
                        <div style={styles.credentialSection}>
                            <div style={styles.email}><input type="email" placeholder="Email" onChange={(e)=>{this.setState({email: e.target.value})}} style={styles.inputEmail}/></div>
                            <div id="password-div" style={styles.password}><input type="password" placeholder="Password" onChange={(e)=>{this.setState({password: e.target.value})}} style={styles.inputPassword}/></div>
                        </div>
                        <div style={styles.actionSection}>
                            <div onClick={()=>this.changeOverlay()} style={styles.forgotPassword}>Forgot password?</div>
                            <div onClick={()=>this.loginClick()} style={styles.loginBtn}>Login</div>
                        </div>
                    </div>
                </div>;
                break;

            case 'Reset Password':
                overlay = <div style={styles.contentReset}>
                    <div style={styles.content}>
                        <div style={styles.credentialSection}>
                            <div style={styles.email}>
                                <p>Enter your email to reset your password.</p>
                                <input type="email" placeholder="Email" onChange={(e)=>{this.setState({email: e.target.value})}} value={this.state.email} style={styles.inputEmail}/>
                            </div>
                        </div>
                        <div style={styles.actionSection}>
                            <div onClick={()=>this.submitClick()} style={styles.submitBtn}>Submit</div>
                        </div>
                    </div>
                </div>;
                break;
            default:
        }

        return (
            <div id="overlay-container" style={styles.overlayBackground}>
                <div id="overlay" style={styles.overlay}>
                    <div style={styles.titleBar}>
                        <div style={styles.title}>{this.props.activeOverlay}</div>
                        <div onClick={()=>this.props.closeOverlay()} style={styles.close}>X</div>
                    </div>
                    { overlay }
                </div>
            </div>
        );
    }
}
