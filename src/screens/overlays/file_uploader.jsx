import React                    from 'react';
import assets                   from 'libs/assets';

import Overlay                  from 'components/overlay';

export default function fileUploaderOverlay(props) {
    let title, inputs, actionSection, close;

    const styles = {
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
        uploadContainer: {
            borderRadius: '5px',
            border: (props.errorMsg) ? '2px dashed #F00' : '2px dashed rgba(50, 50, 50, 0.4)',
            backgroundColor: '#FFF',
            display: 'grid',
            height: '185px',
            padding: '45px',
            textAlign: 'center'
        },
        errorMsg: {
            color: '#F00',
            fontSize: '17px',
            whiteSpace: 'pre-wrap'
        }
    };

    switch (props.type) {
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

    const errorMsg = (props.errorMsg) ? <div style={styles.errorMsg}>{ props.errorMsg }</div> : '';

    return (
        <Overlay>
            <div style={styles.container}>
                <div style={styles.titleBar}>
                    <div style={styles.title}>Add { title }</div>
                    <div onClick={props.close} style={styles.close}>X</div>
                </div>
                <div style={styles.content}>
                    { errorMsg }
                    <div
                        style={styles.uploadContainer}
                        onDrop={(e) => { e.preventDefault(); props.fileDrop(props.type, e.dataTransfer.files[0]) }}
                        onDragOver={(e) => { e.preventDefault(); e.dropEffect='copy' }}
                    >

                        <label>Drag and drop a document or</label>
                        <label htmlFor="file" className="btn submit-btn" style={{ width: '50%' }} >Choose file
                            <input
                                id="file"
                                type="file"
                                onChange={(e) => { e.preventDefault(); props.fileDrop(props.type, e.target.files[0]) }}
                                accept=".pdf,.word,.png,.jpg"
                                style={{ display: 'none' }}
                            />
                        </label>
                    </div>
                    <p style={styles.text}>Choose a PDF, .WORD, PNG or JPG,</p>
                    <p style={styles.text}>no larger than 25KB</p>
                </div>
            </div>
        </Overlay>
    );
}
