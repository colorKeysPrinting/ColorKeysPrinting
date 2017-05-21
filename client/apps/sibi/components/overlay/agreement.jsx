import React                                     from 'react';
import { connect }                               from 'react-redux';

import assets                                    from '../../libs/assets';

export default function agreementOverlay(props) {
    let inputs, actionSection, close;

    let styles = {
        container: {
            backgroundColor: '#F9FAFC',
            borderRadius: '5px',
            border: '1px solid rgba(50, 50, 50, 0.4)',
            boxShadow: '0px 2px 7px 0px rgba(50, 50, 50, 0.4)',
            minHight: '400px',
            width: '850px',
            margin: '10em auto',
            zIndex: '999',
        },
        titleBar: {
            display: 'inline-flex',
            backgroundColor: '#FFF',
            borderTopLeftRadius: '5px',
            borderTopRightRadius: '5px',
            boxShadow: '0px 2px 7px 0px rgba(50, 50, 50, 0.4)',
            height: '10%',
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
            height: '530px',
            width: '90%',
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
            width: '40%',
            margin: '20px auto',
            paddingTop: '13px',
            textAlign: 'center'
        },
        checkbox: {
            width: '60%',
            padding: '30px'
        },
        width100: {
            width: '97%'
        }
    };

    let title;
    switch(props.type) {
        case 'contractGoodman':
            title = 'Goodman';
            break;
        case 'contractAsure':
            title = 'Asure';
            break;
        default:
    }

    return (
        <div style={styles.container}>
            <div style={ styles.titleBar }>
                <div style={styles.title}>Agree to {title} contract</div>
                <div onClick={props.close} style={styles.close}>X</div>
            </div>
            <div style={styles.content}>
                <object data={assets(props.document)}
                        type="application/pdf"
                        width="100%"
                        height="85%">
                </object>
                <div style={{columnCount: 2, display: 'inline-flex', width: '100%'}}>
                    <div style={styles.checkbox}>
                        <input  id="checkbox"
                                type="checkbox"
                                checked={props.checked} // TODO: need to fix checkbox validation
                                onClick={(e)=>{ e.preventDefault(); props.update(props.type, (props.checked) ? false : true)}}/>I agree
                    </div>
                    <div style={styles.submitBtn} onClick={props.close}>Done</div>
                </div>
            </div>
        </div>
    );
}
