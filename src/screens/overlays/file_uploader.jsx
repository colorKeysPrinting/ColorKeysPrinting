import React                        from 'react';
import { withRouter }               from 'react-router';
import { connect }                  from 'react-redux';
import assets                       from 'libs/assets';

// import { login, logout, passwordReset }     from 'ducks/active_user/actions';

import Overlay                      from 'components/overlay';

class fileUploaderOverlay extends React.Component {

    constructor(props) {
        super(props);

        this.state = { errorMsg: '' };

        this.fileDrop = this.fileDrop.bind(this);
        this.close = this.close.bind(this);
    }

    close() {
        this.props.history.goBack();
    }

    fileDrop(type, value) {
        let isCorrect = true, errorMsg = '';

        console.log(type, value);

        const re = new RegExp('.(png|jpg|jpeg)', 'i');
        const maxSize = 25000; // 25KB = bytes

        const result = re.exec(value.name);

        if (!result) {
            isCorrect = false;
            errorMsg += "Incorrect file type!\n\tPlease upload a .PNG or .JPG\n\n"
        }

        if (value.size > maxSize) {
            isCorrect = false;
            errorMsg += "File is too big!\n\tPlease upload a file no larger than 25KB\n\n";
        }

        if (isCorrect) {

            this.props.history.goBack();
            return true;

        } else {
            this.setState({ errorMsg });
            return false;
        }
    }

    render() {
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
    
        const errorMsg = (props.errorMsg) ? <div style={styles.errorMsg}>{ props.errorMsg }</div> : '';
    
        return (
            <Overlay type="fileUploader">
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
    
                            <label>Drag and drop an image or</label>
                        <label htmlFor="file" className="btn submit-btn" style={{ width: '50%' }} >Choose file
                                <input
                                    id="file"
                                    type="file"
                                    onChange={(e) => { e.preventDefault(); props.fileDrop(props.type, e.target.files[0]) }}
                                    accept=".png,.jpg,.jpeg"
                                    style={{ display: 'none' }}
                                />
                            </label>
                        </div>
                        <p style={styles.text}>Choose a PNG or JPG,</p>
                        <p style={styles.text}>no larger than 25KB</p>
                    </div>
                </div>
            </Overlay>
        );
    }
}

const select = (state) => ({});

const actions = {

};

export default connect(select, actions, null, { withRef: true })(withRouter(fileUploaderOverlay));