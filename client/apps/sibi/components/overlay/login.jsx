import React                                     from 'react';
import { connect }                               from 'react-redux';

import assets                                    from '../../libs/assets';

export default function LoginOverlay(props) {
    let inputs, actionSection, close;

    let styles = {
        container: {
            backgroundColor: '#F9FAFC',
            borderRadius: '5px',
            border: '1px solid rgba(50, 50, 50, 0.4)',
            boxShadow: '0px 2px 7px 0px rgba(50, 50, 50, 0.4)',
            minHight: '400px',
            width: '350px',
            margin: '10em auto',
            zIndex: '999',
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
            width: '89%',
            margin: '0px auto',
            marginTop: '40px',
            textAlign: 'left'
        },
        text: {
            margin: '10px'
        },
        submitBtn: {
            backgroundColor: 'rgb(47, 205, 237)',
            borderRadius: '5px',
            color: '#FFF',
            cursor: 'pointer',
            height: '40px',
            width: '86%',
            margin: '20px auto',
            paddingTop: '10px'
        },
        resetBtn: {
            cursor: 'pointer',
            height: '40px',
            width: '97%',
            margin: '20px auto',
            paddingTop: '10px'
        },
        width100: {
            width: '80%'
        }
    };

    switch(props.type) {
        case 'login':
            close = <div onClick={props.close} style={styles.close}>X</div>;
            inputs = <div>
                <input type="email" placeholder="Email" value={props.email.email} onChange={(e)=>{props.update('email', e.target.value)}} style={styles.width100}/>
                <input type="password" placeholder="Password" value={props.password.password} onChange={(e)=>{props.update('password', e.target.value)}} style={styles.width100}/>
            </div>;

            actionSection = <div style={{columnCount: 2, display: 'inline-flex', width: '310px'}}>
                <div onClick={()=>props.changeOverlay('reset')} style={styles.resetBtn}>Forgot password?</div>
                <input type="submit" value="Login" style={ styles.submitBtn }/>
            </div>
            break;

        case 'reset':
            close = <div onClick={()=>props.changeOverlay('login')} style={styles.close}>X</div>;

            inputs = <div>
                <div style={styles.text}>Enter your email to reset your password.</div>
                <input type="email" placeholder="Email" value={props.email.email} onChange={(e)=>{props.update('email', e.target.value)}} style={styles.width100}/>
            </div>

            actionSection = <input type="submit" value="Submit" style={ styles.submitBtn }/>;
            break;
        default:
    }

    let title = <div style={ styles.titleBar }>
        <div style={styles.title}>{(props.type === 'login') ? 'Login': 'Reset password'}</div>
        {close}
    </div>;

    return (
        <div style={styles.container}>
            {title}
            <form onSubmit={()=>props.submitBtn(props.type)}>
                <div style={styles.content}>
                    {inputs}
                </div>

                {actionSection}
            </form>
        </div>
    );
}
