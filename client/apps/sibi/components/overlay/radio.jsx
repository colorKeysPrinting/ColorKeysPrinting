import React                    from 'react';
import { connect }              from 'react-redux';
import _                        from 'lodash';

export default class RadioOverlay extends React.Component {

    constructor(props) {
        super(props);

        this.state = {activeRadio: Object.keys(this.props.overlayObj.list)[0]};
    }

    update(activeRadio) {
        this.setState({activeRadio});
    }

    render() {
        let inputs, actionSection, close, content;

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
            radioBtnSection: {
                textAlign: 'left'
            },
            options: {
                backgroundColor: '#FFF',
                border: '1px solid rgba(50, 50, 50, 0.1)',
                cursor: 'pointer',
                margin: '20px 0',
                padding: '5px',
            },
            submitBtn: {
                backgroundColor: 'rgb(47, 205, 237)',
                borderRadius: '5px',
                color: '#FFF',
                cursor: 'pointer',
                height: '40px',
                width: '100%',
                margin: '20px auto',
                paddingTop: '10px'
            }
        };

        let title, btnText;
        switch(this.props.overlayObj.type) {
            case 'customMatchups':
                title = 'Custom Matchup';
                btnText = 'Add to Matchup';
                break;
            case 'myLists':
                title = 'List';
                btnText = 'Add to List';
                break;
            default:
        }

        let items = _.map(this.props.overlayObj.list, (item, key)=>{
            return (
                <div key={key} style={styles.options} onClick={()=>{this.setState({activeRadio: key})}}>
                    <input type="radio" name={this.props.overlayObj.type} value={key} onChange={()=>this.update(key)} checked={this.state.activeRadio === key} />{key}
                </div>
            );
        });

        return (
            <div style={styles.container}>
                <div style={ styles.titleBar }>
                    <div style={styles.title}>Add to {title}</div>
                    <div onClick={this.props.close} style={styles.close}>X</div>
                </div>
                <div style={styles.content}>
                    <form onSubmit={()=>this.props.submitAddToBtn(this.props.overlayObj.type)} style={styles.content}>
                        <div className="radio-section" style={styles.radioBtnSection}>
                            <div style={{textAlign: 'left', padding: '5px'}}>Select list to add item to:</div>
                            {items}
                        </div>
                        <div onClick={()=>{this.props.changeOverlay('addNewList')}} style={styles.options}><div style={{textAlign: 'center', color: 'rgb(47, 205, 237)', fontSize: '17px', padding: '10px'}}>Create a New {title}</div></div>
                        <input type="submit" value={btnText} style={ styles.submitBtn }/>
                    </form>
                </div>
            </div>
        );
    }
}
