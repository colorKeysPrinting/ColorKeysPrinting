import '../../common/custom_formats.js'                        // adds formatMoney to Number types
import React                    from 'react';
import { connect }              from 'react-redux';
import { Link }                 from 'react-router';
import _                        from 'lodash';
import assets                   from '../../../libs/assets';

import { showOverlay, addToTruck }          from '../../../actions/application';
import { removeMatchup, getUserMatchups }          from '../../../actions/products';

class MatchupsCustom extends React.Component {

    constructor(props) {
        super(props);

        this.share = this.share.bind(this);
        this.download = this.download.bind(this);
    }

    componentWillMount() {
        this.props.getUserMatchups();
    }

    componentWillUpdate(nextProps) {
        if(nextProps.isMatchupDeleted) {
            this.props.getUserMatchups();
        }
    }

    share() {
        console.log('clicked share');
    }

    download() {
        console.log('clicked download');
    }

    render() {
        let content;

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

        if(this.props.myMatchups.size > 0) {
            let myMatchups = _.map(this.props.myMatchups.toJS(), (matchup)=>{
                let products;

                if(_.size(matchup.products) > 0) {

                    products = _.map(matchup.products, (qty, productID)=>{
                        let product = _.find(this.props.products.toJS(), (product)=>{ return product.id === parseInt(productID) });
                        return product.modelNumber;
                    });

                    products = products.join(', ');

                } else {
                    products = <Link to={`/products`}><div className="text-link" >Add Products</div></Link>;
                }

                return (
                    <tr key={matchup.id}>
                        <td>{ matchup.name }</td>
                        <td>{ products }</td>
                        <td className="text-link" onClick={()=>this.props.showOverlay('customMatchup', {collectionObj: matchup})} >View Products</td>
                        <td>${ (parseFloat(matchup.totalCost)).formatMoney(2, '.', ',') }</td>
                        <td className="text-link" onClick={()=>this.props.addToTruck({products: matchup.products})} >Add to truck</td>
                        <td><div onClick={()=>this.props.removeMatchup(matchup.id)} style={styles.delete}><img src={''} alt="delete"/></div></td>
                    </tr>
                );
            });

            content = <div>
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
                                  { myMatchups }
                              </tbody>
                          </table>
                      </div>;
        } else {
            content = <div>
                You do not have any Custom Matchups<br/>
                Press "New Custom Matchup" to create a new one.
            </div>;
        }

        return (
            <div style={styles.container}>
                <div style={styles.titleSection}>
                    <div style={{padding: '15px'}}>Custom Matchups</div>
                    <div style={{display: 'inline-flex', marginLeft: '60%'}}>
                        <div onClick={()=>this.share()}><img src={''} alt="share" style={styles.actions} /></div>
                        <div onClick={()=>this.download()}><img src={''} alt="download" style={styles.actions} /></div>
                        <div className="submit-btn" onClick={()=>this.props.showOverlay('addNewList', {type: 'customMatchups'})} style={{marginTop: '7px'}} >New Custom Matchup</div>
                    </div>
                </div>
                { content }
            </div>
        );
    }
}

let select = (state)=>{
    return {
        currLang            : state.application.get('currLanguage'),
        products            : state.application.get('products'),
        myMatchups          : state.application.getIn(['activeUser', 'myMatchups']),
        isMatchupDeleted    : state.application.get('isMatchupDeleted')
    };
};

export default connect(select, { showOverlay, addToTruck, removeMatchup, getUserMatchups }, null, {withRef: true})(MatchupsCustom);