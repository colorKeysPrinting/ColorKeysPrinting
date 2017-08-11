import React                        from 'react';
import { connect }                  from 'react-redux';
import assets                       from 'libs/assets';

import { login, closeOverlay, passwordReset }      from 'actions/application';
import { logout }                   from 'actions/header';

import Overlay                      from 'components/overlay';

class LoginOverlay extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            type: 'login',
            email: '',
            password: ''
        }

        this.update = this.update.bind(this);
        this.close = this.close.bind(this);
        this.changeOverlay = this.changeOverlay.bind(this);
        this.submitLoginBtn = this.submitLoginBtn.bind(this);
    }

    update(type, value) {
        this.setState({ [type]: value });
    }

    close() {
        this.resetState();
        this.props.closeOverlay();
    }

    changeOverlay(type) {
        this.setState({ type, password: '' });
    }

    submitLoginBtn() {
        if (this.state.type === 'login') {
            this.props.login(this.state.email, this.state.password);

        } else if (this.state.type === 'reset') {
            this.props.passwordReset(this.state.email);
        }
    }

    render() {
        let close, inputs, actionSection;

        const styles = {
            container: {
                backgroundColor: '#F9FAFC',
                borderRadius: '5px',
                border: '1px solid rgba(50, 50, 50, 0.4)',
                boxShadow: '0px 2px 7px 0px rgba(50, 50, 50, 0.4)',
                width: '490px',
                margin: '10em auto',
            },
            titleBar: {
                display: 'inline-flex',
                backgroundColor: '#FFF',
                borderTopLeftRadius: '5px',
                borderTopRightRadius: '5px',
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
                margin: '20px auto 0px',
                textAlign: 'left',
                display: 'inline-grid',
            },
            text: {
                margin: '10px'
            }
        };

        if (this.state.type === 'login') {
            close = <div onClick={this.close} style={styles.close}>X</div>;
            inputs = (<div style={styles.content}>
                <input type="email"     placeholder="Email"     value={this.state.email}    onChange={(e) => { this.update('email', e.target.value) }}     style={{ width: '435px' }} required />
                <input type="password"  placeholder="Password"  value={this.state.password} onChange={(e) => { this.update('password', e.target.value) }}  style={{ width: '435px' }} required />
            </div>);

            actionSection = (<div style={{ columnCount: 2, display: 'inline-flex', width: '435px', textAlign: 'left' }}>
                <div className="cancel-btn" onClick={() => this.changeOverlay('reset')} style={{ width: '97%' }} >Forgot password?</div>
                <input className="submit-btn" type="submit" value="Login" style={{ width: '86%' }} />
            </div>);

        } else if (this.state.type === 'reset') {
            close = <div onClick={() => this.changeOverlay('login')} style={styles.close}>X</div>;
            inputs = (<div>
                <div style={styles.text}>Enter your email to reset your password.</div>
                <input type="email" placeholder="Email" value={this.email.email} onChange={(e) => { this.update('email', e.target.value) }} style={{ width: '435px' }} required />
            </div>);

            actionSection = <input className="submit-btn" type="submit" value="Submit" style={{ width: '86%' }} />;
        }

        return (
            <Overlay>
                <div style={styles.container}>
                    <div style={styles.titleBar} >
                        <div style={styles.title}>{(this.state.type === 'login') ? 'Login': 'Reset password'}</div>
                        { close }
                    </div>
                    <form onSubmit={() => this.submitLoginBtn()}>
                        <div style={styles.content}>
                            { inputs }
                        </div>
                        { actionSection }
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
    closeOverlay
};

export default connect(select, actions, null, { withRef: true })(LoginOverlay);