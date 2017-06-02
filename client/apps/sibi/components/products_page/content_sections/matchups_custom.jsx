import React                    from 'react';
import { connect }              from 'react-redux';
import _                        from 'lodash';
import assets                   from '../../../libs/assets';

import { showOverlay, addToTruck }          from '../../../actions/application';
import { setActivePage }        from '../../../actions/products';

let select = (state)=>{
    return {
        currLang        : state.application.get('currLanguage'),
        matchups        : state.application.get('matchups').toJS(),
        myMatchups      : state.application.getIn(['activeUser', 'myMatchups', 'custom']).toJS()
    };
};

@connect(select, { showOverlay, setActivePage, addToTruck }, null, {withRef: true})
export default class MatchupsCustom extends React.Component {

    constructor(props) {
        super(props);

        this.state = {matchups: this.props.myMatchups};

        this.delete = this.delete.bind(this);
        this.addToTruck = this.addToTruck.bind(this);
        this.newMatchup = this.newMatchup.bind(this);
        this.share = this.share.bind(this);
        this.download = this.download.bind(this);
    }

    componentWillReceiveProps(nextProps) {
        if(nextProps.myMatchups) {
            this.setState({matchups: nextProps.myMatchups});
        }
    }

    delete(matchup) {
        console.log('delete: ', matchup);
    }

    addToTruck(matchup) {
        console.log('addToTruck: ', matchup);

        this.props.addToTruck(matchup);
    }

    newMatchup(){
        console.log('clicked new matchup');

    }

    share() {
        console.log('clicked share');
    }

    download() {
        console.log('clicked download');
    }

    render() {
        let styles = {
            container: {
                width: '98%'
            },
            titleSection: {
                width: '100%',
                height: '75px',
                borderBottom: '1px solid rgba(50, 50, 50, 0.1)',
                textAlign: 'left',
                padding: '7px',
                fontSize: '30px',
                display: 'inline-flex'
            },
            submitBtn: {
                backgroundColor: '#06cfe5',
                borderRadius: '5px',
                color: '#FFF',
                cursor: 'pointer',
                width: '200px',
                height: '46px',
                margin: '7px auto',
                textAlign: 'center',
                fontSize: '18px',
                paddingTop: '14px'
            },
            blueTxt: {
                color: '#06cfe5',
                cursor: 'pointer'
            },
            delete: {
                cursor: 'pointer'
            },
            actions: {
                cursor: 'pointer',
                borderRadius: '5px',
                padding: '5px',
                border: '1px solid rgba(50, 50, 50, 0.1)',
                height: '60px',
                width: '60px'
            }
        };

        let matchups = _.map(this.state.matchups, (matchup, key)=>{
            let name = matchup, items;

            matchup = _.find(this.props.matchups,['matchup', matchup]);

            if(_.size(matchup.items) > 0) {
                items = Object.keys(matchup.items);
                items = items.join(',');

            } else {
                items = <div onClick={()=>this.props.setActivePage('products', '')} style={styles.blueTxt} >Add Products</div>;
            }


            return (
                <tr key={key}>
                    <td>{name}</td>
                    <td>{items}</td>
                    <td onClick={()=>this.props.showOverlay('customMatchup', {name, products: matchup.items})} style={styles.blueTxt} >View Products</td>
                    <td>{matchup.price}</td>
                    <td onClick={()=>this.addToTruck(matchup)} style={styles.blueTxt}>Add to truck</td>
                    <td><div onClick={()=>this.delete(name)} style={styles.delete}><img src={''} alt="delete"/></div></td>
                </tr>
            );
        });

        return (
            <div style={styles.container}>
                <div style={styles.titleSection}>
                    <div style={{padding: '15px'}}>Custom Matchups</div>
                    <div style={{display: 'inline-flex', marginLeft: '60%'}}>
                        <div onClick={()=>this.share()}><img src={''} alt="share" style={styles.actions} /></div>
                        <div onClick={()=>this.download()}><img src={''} alt="download" style={styles.actions} /></div>
                        <div onClick={()=>this.props.showOverlay('addNewList', {type: 'customMatchups'})} style={styles.submitBtn}>New Custom Matchup</div>
                    </div>
                </div>
                <div>
                    <table>
                        <thead>
                        <tr>
                            <td>MATCHUP NAME</td>
                            <td>PRODUCTS</td>
                            <td>PRODUCT DETAILS</td>
                            <td>TOTAL</td>
                            <td>ORDER AGAIN</td>
                            <td>DELETE</td>
                        </tr>
                        </thead>
                        <tbody>
                            {matchups}
                        </tbody>
                    </table>
                </div>
            </div>
        );
    }
}



