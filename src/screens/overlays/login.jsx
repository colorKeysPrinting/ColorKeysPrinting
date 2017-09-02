import React                        from 'react';
import { withRouter }               from 'react-router';
import { connect }                  from 'react-redux';
import assets                       from 'libs/assets';

import { login, logout, passwordReset }     from 'ducks/active_user/actions';

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

        } else if (type === 'reset') {
            this.props.passwordReset({ email: this.state.email });
        }
        this.setState({ password: '' });
    }

    render() {
        let close, inputs, actionSection;

        if (this.state.type === 'login') {
            close = <div onClick={this.close} className="icon-close"><img src={assets('./images/icon-x-big.svg')} /></div>;
            inputs = (<div>
                <input type="email"     placeholder="Email"     value={this.state.email}    onChange={(e) => { this.update('email', e.target.value) }}     style={{ width: '435px' }} required />
                <input type="password"  placeholder="Password"  value={this.state.password} onChange={(e) => { this.update('password', e.target.value) }}  style={{ width: '435px' }} required />
            </div>);

            actionSection = (<div className="pure-g">
                <div className="pure-u-1-2">
                    <div className="btn white-btn fill" onClick={() => this.changeOverlay('reset')}>Forgot password?</div>
                </div>
                <div className="pure-u-1-2">
                    <input className="btn blue fill" type="submit" value="Login"/>
                </div>
            </div>);

        } else if (this.state.type === 'reset') {
            close = <div onClick={() => this.changeOverlay('login')} className="icon-close"><img src={assets('./images/icon-x-big.svg')} /></div>;
            inputs = (<div>
                <p>Enter your email to reset your password.</p>
                <input type="email" placeholder="Email" value={this.state.email} onChange={(e) => { this.update('email', e.target.value) }} style={{ width: '435px' }} required />
            </div>);

            actionSection = <input className="btn blue fill" type="submit" value="Submit"/>;
        }

        return (
            <Overlay type="login">
                <div className="modal">
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

const select = (state) => ({});

const actions = {
    login,
    logout,
    passwordReset
};

export default connect(select, actions, null, { withRef: true })(withRouter(LoginOverlay));
