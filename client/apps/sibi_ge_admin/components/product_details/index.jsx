import React                    from 'react';
import { connect }              from 'react-redux';
import _                        from 'lodash';
import assets                   from '../../libs/assets';
import '../common/custom_formats.js'                        // adds formatMoney to Number types

import { showOverlay }           from '../../actions/application';

import DetailTabs               from './detail_tabs';

class ProductDetails extends React.Component {

    constructor(props) {
        super(props);

        const location = this.props.productLocations.toJS();

        this.state = {
            product: _.find(this.props.products.toJS(), ['id', this.props.params.id]),
            qty: 1,
            location: location[0],
            warranty: false,
            minStock: 10
        };

        this.update = this.update.bind(this);
        this.checkInventory = this.checkInventory.bind(this);
    }

    componentDidMount() {
        this.checkInventory(this.state.location.id);
    }

    update(type, value) {
        this.setState({ [type]: value });

        if (type === 'location') {
            this.checkInventory(value);
        }
    }

    checkInventory(id) {
        const location = _.find(this.props.productLocations.toJS(), ['id', id]);

        if (location.stock < this.state.minStock) {
            this.props.showOverlay('stockCheck', { product: this.state.product, location });
        }
    }

    render() {
        const product = this.state.product;

        const styles = {
            container: {
                width: '98%',
                marginTop: '85px',
                textAlign: 'left',
                display: 'inline-flex'
            },
            dropdownSection: {
                width: '60%',
                marginLeft: '15px'
            },
            dropdown: {
                width: '98%',
                height: '45px',
                border: (this.props.isInStock) ? '1px solid rgba(50, 50, 50, 0.1)' : '1px solid #F00',
                backgroundColor: '#FFF',
            },
            qtyInput: {
                width: '50px',
                height: '28px',
                fontSize: '20px',
                paddingLeft: '5px'
            },
            image: {
                margin: '10px'
            },
            price: {
                color: 'green',
                width: '50%'
            },
            modelNumber: {
                color: 'rgba(50, 50, 50, 0.4)',
                width: '50%'
            },
            checkbox: {
                margin: '25px auto'
            },
            stockError: {
                display: (!this.props.isInStock) ? 'block' : 'none',
                color: '#F00',
                fontSize: '15px'
            }
        };

        const locationOptions = _.map(this.props.productLocations.toJS(), (location) => <option key={location.id} value={location.id} >{location.name} ({location.stock} in stock)</option>);

        const image = (product.image) ? assets(product.image) : '';
        const warranty = (this.state.warranty) ? _.find(this.props.warranties.toJS(), ['id', 0]) : false;
        const price = (product.price) ? <div style={styles.price} >${ (parseFloat(product.price)).formatMoney(2, '.', ',') }</div> : null;

        return (
            <div id="product-details" style={styles.container}>
                <div style={{ width: '80%', fontSize: '24px' }}>
                    <div style={{ width: '100%', display: 'inline-flex' }}>
                        <div style={{ margin: '20px' }}><img src={image} alt={product.modelNumber} width="500" height="600" style={styles.image} /></div>
                        <div style={{ margin: '20px', padding: '20px', width: '50%' }}>
                            <h1>{ product.name }</h1>
                            <div style={{ display: 'inline-flex', width: '100%' }}>
                                { price }
                                <div style={styles.modelNumber} >Model #{ product.modelNumber }</div>
                            </div>
                            <div><img src={''} alt="product perks? " width="80%" height="80" style={styles.image} /></div>
                            <div style={{ display: 'inline-flex', width: '100%' }}>
                                <div style={{ width: '20%' }}>Qty: <input type="number" value={this.state.qty} onChange={(e) => this.update('qty', e.target.value)} style={styles.qtyInput} /></div>
                                <div style={styles.dropdownSection}>
                                    <select id="locationSelectDropdown" value={this.state.location} onChange={(e) => this.update('location', e.target.value)} style={styles.dropdown}>
                                        { locationOptions }
                                    </select>
                                    <div style={styles.stockError}>This item is sold out here.  Select a new location.</div>
                                </div>
                            </div>
                            <div style={styles.checkbox}>
                                <input
                                    type="checkbox"
                                    onClick={() => this.update('warranty', !(this.state.warranty))}
                                    checked={this.state.warranty}
                                />Add 10 Year Parts & Labor Warranty
                            </div>
                            <div style={{ display: 'inline-flex', width: '85%' }}>
                                <div style={{ width: '50%' }} ><div className="cancel-btn" onClick={(e) => this.props.showOverlay('productAddTo', { productId: product.id, mouseCoord: { mouseX: e.pageX, mouseY: e.pageY } })} >Save Item</div></div>
                            </div>
                        </div>
                    </div>
                    <DetailTabs
                        product={product}
                        products={this.props.products.toJS()}
                    />
                </div>
            </div>
        );
    }
}

const select = (state) => ({
    currLang          : state.application.get('currLanguage'),
    products          : state.application.get('products'),
    productLocations  : state.application.get('productLocations'),
    isInStock         : state.application.get('isInStock'),
    warranties        : state.application.get('warranties'),
});

export default connect(select, { showOverlay }, null, { withRef: true })(ProductDetails);