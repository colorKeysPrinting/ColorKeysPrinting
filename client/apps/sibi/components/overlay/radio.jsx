import React                    from 'react';
import _                        from 'lodash';

// TODO: need to fix the submit button becuase it's not sending the connected list
export default class RadioOverlay extends React.Component {

    constructor(props) {
        super(props);

        this.state = {activeRadio: this.props.overlayObj.collections[0].id};

        this.update = this.update.bind(this);
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
                width: '490px',
                margin: '10em auto',
                zIndex: '999'
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
            options: {
                backgroundColor: '#FFF',
                border: '1px solid rgba(50, 50, 50, 0.1)',
                cursor: 'pointer',
                margin: '5px 0',
                padding: '5px',
                display: 'inline-flex',
                width: '385px'
            },
            radio: {
                height: '30px',
                width: '60px'
            },
            submitBtn: {
                width: '100%',
                height: '46px',
                margin: '7px auto',
                paddingTop: '14px'
            },
            createNew: {
                textAlign: 'center',
                color: '#06cfe5',
                fontSize: '17px',
                padding: '10px',
                width: '435px'
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

        let collections = _.map(this.props.overlayObj.collections, (collection)=>{
            return (
                <div key={collection.id} onClick={()=>{this.setState({activeRadio: collection.id})}} style={styles.options}>
                    <input type="radio" name={this.props.overlayObj.type} onChange={()=>this.update(collection.id)} style={styles.radio} checked={this.state.activeRadio === collection.id} />
                    <div style={{margin: '15px'}}>{ collection.name }</div>
                </div>
            );
        });

        return (
            <div style={styles.container}>
                <div style={ styles.titleBar }>
                    <div style={styles.title}>Add to { title }</div>
                    <div onClick={this.props.close} style={styles.close}>X</div>
                </div>
                <div style={styles.content}>
                    <div style={styles.content}>
                        <div>
                            <div style={{textAlign: 'left', padding: '5px'}}>Select list to add item to:</div>
                            { collections }
                        </div>
                        <div onClick={()=>{this.props.changeOverlay('addNewList')}} style={styles.options}>
                            <div style={styles.createNew}>Create a New { title }</div>
                        </div>
                        <div className="submit-btn" onClick={()=>this.props.submitAddToBtn(this.props.overlayObj.type, this.state.activeRadio)} style={styles.submitBtn} >{ btnText }</div>
                    </div>
                </div>
            </div>
        );
    }
}
