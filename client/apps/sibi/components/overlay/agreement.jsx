import React                                     from 'react';
import { connect }                               from 'react-redux';

import assets                                    from '../../libs/assets';

export default class AgreementOverlay extends React.Component {

    constructor(props) {
        super(props);

        this.state = {checkbox: false};

        this.update = this.update.bind(this);
    }

    update() {
        let checkbox = (this.state.checkbox) ? false : true;
        this.setState({checkbox});
    }

    render() {
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
            checkbox: {
                width: '60%',
                padding: '30px'
            }
        };

        let title;
        switch(this.props.type) {
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
                    <div onClick={this.props.close} style={styles.close}>X</div>
                </div>
                <div style={styles.content}>
                    <object data={assets(this.props.document)}
                            type="application/pdf"
                            width="100%"
                            height="85%">
                    </object>
                    <div style={{columnCount: 2, display: 'inline-flex', width: '100%'}}>
                        <div style={styles.checkbox}>
                            <input  id="checkbox"
                                    type="checkbox"
                                    onClick={this.update}
                                    checked={this.state.checkbox} />I agree
                        </div>
                        <div className="submit-btn"
                             onClick={(e)=>{e.preventDefault(); this.props.acceptAgreement(this.props.type ,this.state.checkbox); this.props.close()}}
                             style={{paddingTop: '13px', width: '40%'}} >Done</div>
                    </div>
                </div>
            </div>
        );
    }
}
