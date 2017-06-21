import '../common/custom_formats.js'                        // adds formatMoney to Number types
import React                    from 'react';
import { connect }              from 'react-redux';
import _                        from 'lodash';
import assets                   from '../../libs/assets';

import { addToTruck, showOverlay }           from '../../actions/application';

import DetailTabs               from './detail_tabs';
import YourTruck                from './your_truck';

let select = (state)=>{
    return {
        currLang          : state.application.get('currLanguage'),
        products          : state.application.get('products').toJS(),
        productLocations  : state.application.get('productLocations').toJS(),
        truck             : state.application.get('truck'),
        isInStock         : state.application.get('isInStock'),
    };
};

@connect(select, {addToTruck, showOverlay}, null, {withRef: true})
export default class ProductDetails extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            product: _.find(this.props.products, ['modelNum', this.props.params.modelNum]), qty: 1, location: this.props.productLocations[0], warranty: false,
            truck: (this.props.truck.size > 0) ? this.props.truck.toJS() : [],
            minStock: 10
        };

        this.update = this.update.bind(this);
        this.checkInventory = this.checkInventory.bind(this);
    }

    componentWillReceiveProps(nextProps) {
        if(nextProps.truck) {
            this.setState({truck: nextProps.truck.toJS()});
        }
    }

    componentDidMount() {
        this.checkInventory(this.state.location.id);
    }

    update(type, value) {
        this.setState({[type]: value});

        if(type === 'location') {
            this.checkInventory(value);
        }
    }

    checkInventory(id) {
        let location = _.find(this.props.productLocations, ['id', parseInt(id)]);

        if(location.stock < this.state.minStock) {
            this.props.showOverlay('stockCheck', {product: this.state.product, location});
        }
    }

    render() {
        let styles = {
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
            saveItemBtn: {
                margin: 'auto',
                width: '200px',
                height: '46px',
                textAlign: 'center',
                cursor: 'pointer',
                border: '1px solid rgba(50,50,50,0.1)',
                padding: '10px',
                borderRadius: '5px',
                color: '#06cfe5',
                fontWeight: 'bold',
            },
            submitBtn: {
                margin: 'auto',
                backgroundColor: '#06cfe5',
                borderRadius: '5px',
                color: '#FFF',
                cursor: 'pointer',
                width: '200px',
                height: '46px',
                paddingTop: '13px',
                textAlign: 'center',
            },
            image: {
                margin: '10px'
            },
            price: {
                color: 'green',
                width: '50%'
            },
            modelNum: {
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

        let locationOptions = _.map(this.props.productLocations, (location)=>{
            return <option key={location.id} value={location.id} >{location.name} ({location.stock} in stock)</option>;
        });

        let image = (this.state.product.image) ? assets(this.state.product.image) : '';

        return (
            <div id="product-details" style={styles.container}>
                <div style={{width: '80%', fontSize: '24px'}}>
                    <div style={{width: '100%', display: 'inline-flex'}}>
                        <div style={{margin: '20px'}}><img src={image} alt={this.state.product.modelNum} width="500" height="600" style={styles.image}/></div>
                        <div style={{margin: '20px', padding: '20px', width: '50%'}}>
                            <h1>{this.state.product.name}</h1>
                            <div style={{display: 'inline-flex', width: '100%'}}>
                                <div style={styles.price} >${(this.state.product.price).formatMoney(2, '.', ',')}</div>
                                <div style={styles.modelNum} >Model #{this.state.product.modelNum}</div>
                            </div>
                            <div><img src={''} alt="product perks? " width="80%" height="80" style={styles.image}/></div>
                            <div style={{display: 'inline-flex', width: '100%'}}>
                                <div style={{width: '20%'}}>Qty: <input type="number" value={this.state.qty} onChange={(e)=>this.update('qty', e.target.value)} style={styles.qtyInput} /></div>
                                <div style={styles.dropdownSection}>
                                    <select id="locationSelectDropdown" value={ this.state.location } onChange={ (e)=>this.update('location', e.target.value) } style={styles.dropdown}>
                                        { locationOptions }
                                    </select>
                                    <div style={styles.stockError}>This item is sold out here.  Select a new location.</div>
                                </div>
                            </div>
                            <div style={styles.checkbox}>
                                <input type="checkbox"
                                       onClick={()=>this.update('warranty', (this.state.warranty) ? false : true)}
                                       checked={this.state.warranty} />Add 10 Year Parts & Labor Warranty
                            </div>
                            <div style={{display: 'inline-flex', width: '85%'}}>
                                <div style={{width: '50%'}} ><div onClick={(e)=>this.props.showOverlay('productAddTo', {modelNum: this.state.product.modelNum, mouseCoord: {mouseX: e.pageX, mouseY: e.pageY}})} style={styles.saveItemBtn}>Save Item</div></div>
                                <div style={{width: '50%'}} ><div onClick={()=>this.props.addToTruck({...this.state.product, qty: this.state.qty, warranty: this.state.warranty})} style={styles.submitBtn}>Add to truck</div></div>
                            </div>
                        </div>
                    </div>
                    <DetailTabs
                        tabs={this.state.product.tabs}
                        products={this.props.products}
                        addToTruck={this.props.addToTruck} />
                </div>
                <YourTruck
                    truck={this.state.truck} />
            </div>
        );
    }
}



