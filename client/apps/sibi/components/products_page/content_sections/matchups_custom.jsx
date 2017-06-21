import '../../common/custom_formats.js'                        // adds formatMoney to Number types
import React                    from 'react';
import { connect }              from 'react-redux';
import { Link }                 from 'react-router';
import _                        from 'lodash';
import assets                   from '../../../libs/assets';

import { showOverlay, addToTruck }          from '../../../actions/application';

let select = (state)=>{
    return {
        currLang        : state.application.get('currLanguage'),
        matchups        : state.application.get('matchups').toJS(),
        products        : state.application.get('products').toJS(),
        myMatchups      : state.application.getIn(['activeUser', 'myMatchups'])
    };
};

@connect(select, { showOverlay, addToTruck }, null, {withRef: true})
export default class MatchupsCustom extends React.Component {

    constructor(props) {
        super(props);

        let matchups = _.find(this.props.myMatchups.toJS(), ['type', 'custom']);

        matchups = (matchups) ? matchups : {type:'', matchups: ''};

        this.state = {matchups};

        this.delete = this.delete.bind(this);
        this.share = this.share.bind(this);
        this.download = this.download.bind(this);
    }

    componentWillReceiveProps(nextProps) {
        if(nextProps.myMatchups) {
            let matchups = _.find(nextProps.myMatchups.toJS(), ['type', 'custom']);

            this.setState({matchups});
        }
    }

    delete(matchupID) {
        console.log('delete: ', matchupID);

        let matchups = _.remove(this.state.matchups.products, (matchup)=>{return matchup.id !== matchupID});

        this.setState({matchups});
        // TODO: this will eventually need to go to the store to be removed or make a server call
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

        let matchups = _.map(this.state.matchups.matchups, (matchup)=>{
            let products;

            if(_.size(matchup.products) > 0) {

                products = _.map(matchup.products, (qty, productID)=>{
                    let product = _.find(this.props.products, (product)=>{ return product.id === parseInt(productID) });
                    return product.modelNum;
                });

                products = products.join(', ');

            } else {
                products = <Link to={`/products`}><div style={styles.blueTxt} >Add Products</div></Link>;
            }

            return (
                <tr key={matchup.id}>
                    <td>{ matchup.name }</td>
                    <td>{ products }</td>
                    <td onClick={()=>this.props.showOverlay('customMatchup', matchup)} style={styles.blueTxt} >View Products</td>
                    <td>${ (matchup.price).formatMoney(2, '.', ',') }</td>
                    <td onClick={()=>this.props.addToTruck({products: matchup.products})} style={styles.blueTxt}>Add to truck</td>
                    <td><div onClick={()=>this.delete(matchup.name)} style={styles.delete}><img src={''} alt="delete"/></div></td>
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
                            { matchups }
                        </tbody>
                    </table>
                </div>
            </div>
        );
    }
}



