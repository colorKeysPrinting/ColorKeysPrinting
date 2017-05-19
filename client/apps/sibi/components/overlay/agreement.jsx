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
            width: '97%'
        }
    };

    let title;
    // switch(props.type) {
    //     case 'docWorkerComp':
    //         title = 'worker\'s comp';
    //         break;
    //     case 'docW9':
    //         title = 'w9';
    //         break;
    //     case 'docInsurance':
    //         title = 'proof of insurance';
    //         break;
    //     default:
    // }

    return (
        <div style={styles.container}>
            <div style={ styles.titleBar }>
                <div style={styles.title}>Add {title}</div>
                <div onClick={props.close} style={styles.close}>X</div>
            </div>
            <form onSubmit={()=>props.submitBtn(props.type)}>
                <div style={styles.content}>
                    <p>put content here</p>
                </div>
            </form>
        </div>
    );
}
