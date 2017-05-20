import React                                     from 'react';
import { connect }                               from 'react-redux';

import assets                                    from '../../libs/assets';

export default function fileUploaderOverlay(props) {
    let inputs, actionSection, close;

    let styles = {
        container: {
            backgroundColor: '#F9FAFC',
            borderRadius: '5px',
            border: '1px solid rgba(50, 50, 50, 0.4)',
            boxShadow: '0px 2px 7px 0px rgba(50, 50, 50, 0.4)',
            minHight: '400px',
            width: '465px',
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
        uploadContainer: {
            borderRadius: '5px',
            border: '2px dashed rgba(50, 50, 50, 0.4)',
            backgroundColor: '#FFF',
            height: '185px',
            padding: '45px',
            textAlign: 'center'
        }
    };

    let title;
    switch(props.type) {
        case 'docWorkerComp':
            title = 'worker\'s comp';
            break;
        case 'docW9':
            title = 'w9';
            break;
        case 'docInsurance':
            title = 'proof of insurance';
            break;
        default:
    }

    return (
        <div style={styles.container}>
            <div style={ styles.titleBar }>
                <div style={styles.title}>Add {title}</div>
                <div onClick={props.close} style={styles.close}>X</div>
            </div>
            <div>
                <div style={styles.content}>
                    <div style={styles.uploadContainer}
                         onDrop={(e)=>{e.preventDefault(); props.fileDrop(props.type, e.dataTransfer.files[0])}}
                         onDragOver={(e)=>{e.preventDefault(); e.dropEffect='copy'}}>
                        <label htmlFor="file">Drag and drop a document or</label>
                        <input id="file" type="file" value="Choose file" onChange={(e)=>{e.preventDefault(); props.fileDrop(props.type, e.dataTransfer.files[0])}} style={styles.width100}/>
                    </div>
                    <p style={styles.text}>Choose a PDF, .WORD, PNG or JPG,</p>
                    <p style={styles.text}>no larger than 25KB</p>
                </div>
            </div>
        </div>
    );
}
