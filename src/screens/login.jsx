import React                        from 'react';
import { withRouter }               from 'react-router';
import { connect }                  from 'react-redux';
import assets                       from 'libs/assets';

import { login, logout, resetLoginError, forgotPassword, resetSentEmail }     from 'ducks/active_user/actions';

import Overlay                      from 'components/overlay';

class LoginOverlay extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            type: 'login',
            email: '',
            password: ''
        };

        this.update = this.update.bind(this);
        this.close = this.close.bind(this);
        this.changeOverlay = this.changeOverlay.bind(this);
        this.submitLoginBtn = this.submitLoginBtn.bind(this);
    }

    componentWillUpdate(nextProps) {
        if (nextProps.loginError) {
            this.setState({ password: '' });
            this.props.resetLoginError();
        }

        if (nextProps.emailSent) {
            this.props.resetSentEmail();
            this.setState({ email: '', password: '' });
            this.changeOverlay('login');
        }
    }

    update(type, value) {
        this.setState({ [type]: value });
    }

    close() {
        this.props.history.goBack();
    }

    changeOverlay(type) {
        this.setState({ type, password: '' });
    }

    submitLoginBtn(type) {
        if (type === 'login') {
            this.props.login({ email: this.state.email, password: this.state.password});

        } else if (type === 'forgot') {
            this.props.forgotPassword({ email: this.state.email });
        }
    }

    render() {
        let close, inputs, actionSection;

        if (this.state.type === 'login') {
            inputs = (<div className="login-inputs">
                <input type="email"     placeholder="Email"     value={this.state.email}    onChange={(e) => { this.update('email', e.target.value) }} required />
                <input type="password"  placeholder="Password"  value={this.state.password} onChange={(e) => { this.update('password', e.target.value) }} required />
            </div>);

            actionSection = (<div className="login-buttons">
                <div className="btn white-btn" onClick={() => this.changeOverlay('forgot')}>Forgot password?</div>
                <input className="btn blue" type="submit" value="Login"/>
            </div>);

        } else if (this.state.type === 'forgot') {
            close = <div onClick={() => this.changeOverlay('login')} className="icon-close"><img src={assets('./images/icon-x-big.svg')} /></div>;
            inputs = (<div>
                <p>Enter your email to reset your password.</p>
                <input type="email" placeholder="Email" value={this.state.email} onChange={(e) => { this.update('email', e.target.value) }} required />
            </div>);

            actionSection = <input className="btn blue fill" type="submit" value="Submit"/>;
        }

        return (
            <Overlay type="login">
                <div className="modal" id="login-modal">
                    <div className="titleBar">
                        <div className="title">{(this.state.type === 'login') ? 'Login': 'Reset password'}</div>
                        { close }
                    </div>
                    <form onSubmit={(e) =>{e.preventDefault(); this.submitLoginBtn(this.state.type)}} >
                        <div className="content">
                            { inputs }
                            { actionSection }
                        </div>
                    </form>
                </div>
            </Overlay>
        );
    }
}

const select = (state) => ({
    loginError  : state.activeUser.get('loginError'),
    emailSent   : state.activeUser.get('emailSent'),
});

const actions = {
    login,
    logout,
    resetLoginError,
    forgotPassword,
    resetSentEmail
};

export default connect(select, actions, null, { withRef: true })(withRouter(LoginOverlay));
