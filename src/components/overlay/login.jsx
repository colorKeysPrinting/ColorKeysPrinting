import React                                     from 'react';
import assets                                    from 'libs/assets';

export default function LoginOverlay(props) {
    let inputs, actionSection, close;

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

    switch (props.type) {
    case 'login':
        close = <div onClick={props.close} style={styles.close}>X</div>;
        inputs = (<div style={styles.content}>
            <input type="email"     placeholder="Email"     value={props.email.email}       onChange={(e) => { props.update('email', e.target.value) }}     style={{ width: '435px' }} required />
            <input type="password"  placeholder="Password"  value={props.password.password} onChange={(e) => { props.update('password', e.target.value) }}  style={{ width: '435px' }} required />
        </div>);

        actionSection = (<div style={{ columnCount: 2, display: 'inline-flex', width: '435px', textAlign: 'left' }}>
            <div className="cancel-btn" onClick={() => props.changeOverlay('reset')} style={{ width: '97%' }} >Forgot password?</div>
            <input className="submit-btn" type="submit" value="Login" style={{ width: '86%' }} />
        </div>);
        break;

    case 'reset':
        close = <div onClick={() => props.changeOverlay('login')} style={styles.close}>X</div>;
        inputs = (<div>
            <div style={styles.text}>Enter your email to reset your password.</div>
            <input type="email" placeholder="Email" value={props.email.email} onChange={(e) => { props.update('email', e.target.value) }} style={{ width: '435px' }} required />
        </div>);

        actionSection = <input className="submit-btn" type="submit" value="Submit" style={{ width: '86%' }} />;
        break;
    default:
    }

    const title = (<div style={styles.titleBar} >
        <div style={styles.title}>{(props.type === 'login') ? 'Login': 'Reset password'}</div>
        { close }
    </div>);

    return (
        <div style={styles.container}>
            {title}
            <form onSubmit={() => props.submitLoginBtn(props.type)}>
                <div style={styles.content}>
                    { inputs }
                </div>
                { actionSection }
            </form>
        </div>
    );
}
