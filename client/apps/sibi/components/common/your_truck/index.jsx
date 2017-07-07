import '../custom_formats.js'                        // adds formatMoney to Number types
import React                    from 'react';
import { connect }              from 'react-redux';
import { Link }                 from 'react-router';
import assets                   from '../../../libs/assets';
import _                        from 'lodash';

import { updateTruck }          from '../../../actions/application';

import Product                  from './product';

class YourTruck extends React.Component {

    constructor(props) {
        super(props);

        this.update = this.update.bind(this);
        this.calculate = this.calculate.bind(this);
        this.calcTax = this.calcTax.bind(this);
    }

    update(productID, type, value) {
        let truck = this.props.truck.toJS();

        let product = _.find(truck, ['id', parseInt(productID)]);

        if(type === 'qty') {
            product.qty = parseInt(value);
            product.cost = product.price * product.qty;

            if(product.warranty) {
                product.warranty.qty = product.qty;
                product.cost += product.warranty.price * product.qty;
            }

        } else if(type === 'warranty') {
            product.warranty = _.find(this.props.warranties.toJS(), ['id', parseInt(value)]);
            product.warranty.qty = product.qty;
            product.cost = (product.price * product.qty) + (product.warranty.price * product.qty);
        }

        let index = _.findIndex(truck, (product)=>{return product.id === productID});
        truck[index] = product;

        this.props.updateTruck(truck);
    }

    calculate(product) {

        let subTotal = parseFloat(product.price * product.qty);
        let salesTax = this.calcTax(subTotal * this.props.salesTaxRate);

        if(product.warranty) {
            subTotal += parseFloat(product.warranty.price * product.warranty.qty);
            salesTax += this.calcTax(product.warranty.price * this.props.salesTaxRate);
        }

        return {subTotal, salesTax};
    }

    calcTax(value) {
        let result = Math.floor(value) + ".";
        let cents = 100 * (value - Math.floor(value)) + .5;

        result += Math.floor(cents / 10);
        result += Math.floor(cents % 10);

        return parseFloat(result);
    }

    render() {
        let truck, total = 0;

        let height = ("innerHeight" in window) ? window.innerHeight : document.documentElement.offsetHeight;

        let styles = {
            container: {
                height,
                width: '20%',
                backgroundColor: '#F4F8FB'
            },
            title: {
                padding: '10px',
                fontSize: '18px'
            },
            truckElements: {
                overflowY: 'scroll',
                height
            }
        };

        if(this.props.truck.size > 0) {

            truck = _.map(this.props.truck.toJS(), (product)=>{
                let cost = this.calculate(product);

                total += (cost.subTotal + cost.salesTax);
                return (
                    <Product
                        key={product.id}
                        product={product}
                        subTotal={cost.subTotal}
                        salesTax={cost.salesTax}
                        update={this.update}
                        calculate={this.calculate} />
                );
            });

        } else {

            truck = <div>
                        <div><img src={assets('./images/empty-truck.png')} width="100%"/></div>
                        <div>Your truck is empty</div>
                    </div>;
        }

        return (
            <div id="your-truck-section" style={styles.container}>
                <div style={styles.title}>YOUR TRUCK</div>
                <hr />
                <div >
                    { truck }
                </div>
                <div style={{display: (this.props.truck.size > 0) ? 'block' : 'none'}}>
                    <hr />
                    <div>TOTAL: ${ (total).formatMoney(2, '.', ',') }</div>

                    <div className="submit-btn" ><Link to={'/'} >Go to Checkout</Link></div>
                    <div className="cancel-btn" ><Link to={'/shopping-truck'} >View Truck</Link></div>
                </div>
            </div>
        );
    }
}

let select = (state)=>{
    return {
        currLang            : state.application.get('currLanguage'),
        salesTaxRate        : state.application.getIn(['calculations', 'salesTaxRate']),
        truck               : state.application.get('truck'),
        warranties          : state.application.get('warranties'),
    };
};

export default connect(select, {updateTruck}, null, {withRef: true})(YourTruck);