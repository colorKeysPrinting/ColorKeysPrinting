import React                                     from 'react';
import { connect }                               from 'react-redux';

import { login, showOverlay, closeOverlay }      from '../../actions/application';
import assets                                    from '../../libs/assets';

let select = (state)=>{
    return {
        activeOverlay: state.application.get('activeOverlay')
    }
};

@connect(select, { login, showOverlay, closeOverlay }, null, {withRef: true})
export default class Overlay extends React.Component {
    constructor(props) {
        super(props);

        this.state = {email: '', password: '', errorEmail: false, errorPassword: false};
        this.loginClick = this.loginClick.bind(this);
    }

    loginClick() {
        if(this.state.email !== '' && this.state.password !== '') {
            this.props.login(this.state.email, this.state.password);

        } else if (this.state.email === '' && this.state.password === '') {
            this.setState({errorEmail: true, errorPassword: true});

        } else if (this.state.email === ''&& this.state.password !== '') {
            this.setState({errorEmail: true, errorPassword: false});

        } else if (this.state.email !== '' && this.state.password === '') {
            this.setState({errorEmail: false, errorPassword: true});
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
                height: '80%',
                width: '400px',
                margin: 'auto'
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
                border: (!this.state.errorEmail) ? '' : '4px solid rgba(255, 0, 0, 1)',
                borderRadius: '10px',
                marginTop: '50px',
                height: '59px'
            },
            password: {
                border:  (!this.state.errorPassword) ? '' : '4px solid rgba(255, 0, 0, 1)',
                borderRadius: '10px',
                height: '59px'
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
            forgotPassword: {
                cursor: 'pointer',
                paddingTop: '20px',
                textAlign: 'left',
                width: '60%'
            },
            input: {
                borderRadius: '10px',
                padding: '20px',
                width: '89%'
            }
        };

        switch(this.props.activeOverlay) {
            case 'Login':
                overlay = <div style={styles.content}>
                    <div style={styles.credentialSection}>
                        <div style={styles.email}><input type="email" placeholder="Email" onChange={(e)=>{this.setState({email: e.target.value})}} style={styles.input}/></div>
                        <div style={styles.password}><input type="password" placeholder="Password" onChange={(e)=>{this.setState({password: e.target.value})}} style={styles.input}/></div>
                    </div>
                    <div style={styles.actionSection}>
                        <div onClick={()=>this.props.showOverlay('forgotPassword')} style={styles.forgotPassword}>Forgot password?</div>
                        <div onClick={()=>this.loginClick()} style={styles.loginBtn}>Login</div>
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
