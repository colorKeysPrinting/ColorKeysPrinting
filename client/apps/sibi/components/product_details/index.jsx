import React                    from 'react';
import { connect }              from 'react-redux';
import _                        from 'lodash';
import assets                   from '../../libs/assets';

import { addToTruck }           from '../../actions/application';

import Tabs                     from './tabs';

let select = (state)=>{
    return {
        currLang          : state.application.get('currLanguage'),
        activePageContent : state.application.get('activePageContent'),
        productLocations  : state.application.get('productLocations').toJS()
    };
};

@connect(select, {addToTruck}, null, {withRef: true})
export default class ProductDetails extends React.Component {

    constructor(props) {
        super(props);

        this.state = {product: this.props.activePageContent, qty: 1, location: this.props.productLocations[0]};

        this.update = this.update.bind(this);
        this.addToTruck = this.addToTruck.bind(this);
    }

    update(type, value) {
        this.setState({[type]: value});
    }

    addToTruck(product) {
        console.log('addToTruck', product);
    }

    render() {

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

        debugger
        let locationOptions = _.map(this.props.productLocations, (location, key)=>{
            return <option key={key} value={location.name} >{location.name} ({location.stock} in stock)</option>;
        });

        return (
            <div style={styles.container}>
                <div>
                    <div><img src={assets(this.state.product.image)} alt={this.state.product.modelNum} /></div>
                    <div>
                        <div>{this.state.product.name}</div>
                        <div>
                            <div>{this.state.product.price}</div>
                            <div>{this.state.product.modelNum}</div>
                        </div>
                        <div>{'product perks?'}</div>
                        <div>
                            <div>Qty: <input type="number" value={this.state.qty} onChange={(e)=>this.update('qty', e.target.value)} /></div>
                            <select id="locationSelectDropdown" value={ this.state.location } onChange={ (e)=>this.update('location', e.target.value) } style={styles.dropdown}>
                                {locationOptions}
                            </select>
                        </div>
                        <div>{}</div>
                        <div>
                            <div onClick={()=>this.saveItem(this.state)}>Save Item</div>
                            <div onClick={()=>this.addToTruck(this.state)}>Add to truck</div>
                        </div>
                    </div>
                </div>
                <Tabs />
            </div>
        );
    }
}



