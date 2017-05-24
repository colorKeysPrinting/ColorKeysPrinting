import React                    from 'react';
import { connect }              from 'react-redux';
import _                        from 'lodash';
import assets                   from '../../../libs/assets';

import {showOverlay}            from '../../../actions/application';

import Product                  from './product';

let select = (state)=>{
    return {
        currLang    : state.application.get('currLanguage'),
        products    : state.application.get('products').toJS(),
    };
};

@connect(select, {showOverlay}, null, {withRef: true})
export default class Products extends React.Component {

    constructor(props) {
        super(props);

        // activePage: products, matchups, equipment, partsSupplies
        // products is the default to be loaded
        this.state = {searchTerm: '', sortBy: 'brand', products: this.props.products,
            sortByOptions: { lowPrice: 'price - low to high', highPrice: 'price - hight to low', nameA: 'name - A to Z', nameZ: 'name - Z to A', rating: 'highest rating', modelNumber: 'Model Number', brand: 'Brand Name'},

        };

        this.searchTerm = this.searchTerm.bind(this);
        this.sortBy = this.sortBy.bind(this);
        this.productSelected = this.productSelected.bind(this);
        this.addToTruck = this.addToTruck.bind(this);
    }

    searchTerm(searchTerm) {
        console.log(searchTerm);
        this.setState({searchTerm});
    }

    sortBy(sortBy) {
        console.log(searchTerm);
        this.setState({sortBy});
    }

    productSelected(product) {
        console.log('productSelected', product);
    }

    addToTruck(product) {
        console.log('addToTruck', product);
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
                left: '81%',
                width: '140px',
                height: '45px',
                marginTop: '17px',
                marginLeft: '15px',
                border: '1px solid rgba(50, 50, 50, 0.1)',
                backgroundColor: '#FFF',
            }
        };

        let sortBy = _.map(this.state.sortByOptions, (value, key)=>{
            return (<option key={key} value={key}>{value}</option>);
        });

        let sortedProducts = _.sortBy(this.state.products, [ (product)=>{ return product[this.state.sortBy] } ]);

        if(this.state.searchTerm) {

        } else {
            products = _.map(sortedProducts, (product, key)=>{
                return (
                    <Product
                        key={key}
                        product={product}
                        productSelected={this.productSelected}
                        addToTruck={this.addToTruck}
                        showOverlay={this.props.showOverlay} />
                );
            });
        }

        return (
            <div style={styles.container}>
                <div style={styles.searchSection}>
                    <input id="productSearchBox" type="text" value={this.state.searchTerm} placeholder="Search for a product by name, brand, or model number" onChange={(e)=>this.searchTerm(e.target.value)} style={styles.searchBox}/>
                    <select id="productSortByDropdown" value={ this.state.sortBy } onChange={ (e)=>this.sortBy(e.target.value) } style={styles.dropdown}>
                        <option disabled value='select'>Sort By</option>
                        {sortBy}
                    </select>
                </div>
                <div>
                    <div className="pure-g" /*TODO: need to figure out why the grid isn't being displayed correctly*/>
                        {products}
                    </div>
                </div>
            </div>
        );
    }
}



