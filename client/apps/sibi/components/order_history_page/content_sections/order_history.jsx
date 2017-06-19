import React                    from 'react';
import { connect }              from 'react-redux';
import _                        from 'lodash';
import assets                   from '../../../libs/assets';

import { addToTruck }           from '../../../actions/application';

import Product                  from './product';

let select = (state)=>{
    return {
        currLang    : state.application.get('currLanguage'),
        myOrders    : state.application.getIn(['activeUser','myOrders']),
    };
};

@connect(select, {addToTruck}, null, {withRef: true})
export default class OrderHistory extends React.Component {

    constructor(props) {
        super(props);

        // activePage: products, matchups, equipment, partsSupplies
        // products is the default to be loaded
        this.state = {searchTerm: '', orders: this.props.myOrders.toJS()};

        this.searchTerm = this.searchTerm.bind(this);
    }

    searchTerm(searchTerm) {
        console.log(searchTerm);
        this.setState({searchTerm});
    }

    render() {
        let products;

        let styles = {
            container: {
                width: '98%'
            },
            productContainer: {
                width: '86%'
            },
            searchSection: {
                width: '100%',
                height: '77px',
                borderBottom: '1px solid rgba(50, 50, 50, 0.1)'
            },
            searchBox: {
                border: '1px solid #FFF',
                padding: '30px',
                width: '100%',
            },
            dropdown: {
                position: 'absolute',
                left: '85%',
                width: '190px',
                height: '45px',
                marginTop: '17px',
                marginLeft: '15px',
                border: '1px solid rgba(50, 50, 50, 0.1)',
                backgroundColor: '#FFF',
            },
            headers: {
                height: '50px',
                width: '100%',
                textAlign: 'left',
                backgroundColor: '#F4F8FB',
                padding: '20px'
            }
        };

        if(this.state.searchTerm) {
            console.log('TODO: may need to have a call to the server for this to be handled on the backend?');

        } else {
            mostPurchased = _.map(sortedProducts, (product, key)=>{
                let isMostPurchased = (_.indexOf(purchases, product.modelNumber)) ? true : false;
                if(isMostPurchased) {
                    return (
                        <Product
                            key={key + 'mostPurchased'}
                            parent="products"
                            product={product}
                            addToTruck={this.props.addToTruck}
                            showOverlay={this.props.showOverlay} />
                    );
                }
            });
        }

        return (
            <div style={styles.container}>
                <div style={styles.searchSection}>
                    <input id="productSearchBox" type="text" value={this.state.searchTerm} placeholder="Search for a product by name, brand, or model number" onChange={(e)=>this.searchTerm(e.target.value)} style={styles.searchBox}/>
                    <select id="productSortByDropdown" value={ this.state.sortBy } onChange={ (e)=>this.sortBy(e.target.value) } style={styles.dropdown}>
                        <option disabled >Sort By</option>
                        {sortBy}
                    </select>
                </div>
                <div>
                    <div style={styles.headers}>YOUR MOST ORDERED PRODUCTS ({productAmount})</div>
                    <div className="pure-g" /*TODO: need to figure out why the grid isn't being displayed correctly*/>
                        {mostPurchased}
                    </div>
                </div>
            </div>
        );
    }
}



