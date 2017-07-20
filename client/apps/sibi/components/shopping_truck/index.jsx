import '../common/custom_formats.js'                        // adds formatMoney to Number types
import React                    from 'react';
import { connect }              from 'react-redux';
import assets                   from '../../libs/assets';
import _                        from 'lodash';

import { updateTruck, removeFromTruck, addToTruck }          from '../../actions/application';

import Product                  from './product';
import Warranty                 from './warranty';

class ShoppingTruck extends React.Component {

    constructor(props) {
        super(props);

        this.update = this.update.bind(this);
        this.calculate = this.calculate.bind(this);
        this.calcTax = this.calcTax.bind(this);
    }

    update(productId, type, value) {
        let products = this.props.truck.toJS();

        let product = _.find(products, ['id', productId]);

        if(type === 'qty') {
            product.qty = parseInt(value);
            product.cost = product.price * product.qty;

            if(product.warranty) {
                product.warranty.qty = product.qty;
            }

        } else if(type === 'warranty') {
            product.warranty = value;
            product.cost = (product.price * product.qty) + product.warrantyPrice;
        }

        let index = _.findIndex(products, (product)=>{return product.id === productId});
        products[index] = product;

        this.props.updateTruck(products);
    }

    calculate(product) {

        let subTotal = parseFloat(product.price * product.qty);
        let salesTax = this.calcTax(subTotal * this.props.salesTaxRate);

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
        let truck, subTotal = 0, salesTax = 0, total = 0;

        let styles = {
            container: {
                width: '95%',
                margin: '0 auto',
                textAlign: 'left'
            },
            title: {
                padding: '10px',
                fontSize: '24px'
            },
            table: {
                width: '80%',
                margin: 'auto'
            },
            footer: {
                display: 'inline-flex',
                backgroundColor: '#FFF',
                width: '98%'
            }
        };

        if(this.props.truck.size > 0) {

            truck = _.map(this.props.truck.toJS(), (product)=>{
                let cost = this.calculate(product);

                subTotal += cost.subTotal;
                salesTax += cost.salesTax;
                total += (cost.subTotal + cost.salesTax);

                return (
                    <Product
                        key={product.id}
                        product={product}
                        subTotal={cost.subTotal}
                        salesTax={cost.salesTax}
                        update={this.update}
                        removeFromTruck={this.props.removeFromTruck} />
                );
            });

            _.each(this.props.truck.toJS(), (product, index)=>{
                if(product.warranty) {
                    let cost = this.calculate(product.warranty);

                    subTotal += cost.subTotal;
                    salesTax += cost.salesTax;
                    total += (cost.subTotal + cost.salesTax);

                    truck.splice(
                        index + 1,
                        0,
                        <Warranty
                            key={'warranty' + product.warranty.id}
                            productId={product.id}
                            warranty={product.warranty}
                            update={this.update} />
                    );
                }
            });

        } else {

            truck = <div>
                        <div><img src={assets('./images/empty-truck.png')} width="100%"/></div>
                        <div>Your truck is empty</div>
                    </div>;
        }

        return (
            <div id="my-shopping-truck" style={styles.container}>
                <div style={styles.title}>Shopping Truck</div>
                <div>
                <table style={styles.table}>
                    <thead>
                        <tr>
                            <td>Product</td>
                            <td>Qty</td>
                            <td>Price</td>
                        </tr>
                    </thead>
                    <tbody>
                        { truck }
                    </tbody>
                </table>
                </div>
                <div style={styles.footer}>
                    <div>SUBTOTAL: ${ (subTotal).formatMoney(2, '.', ',') }</div>
                    <div>SALES TAX: ${ (salesTax).formatMoney(2, '.', ',') }</div>
                    <div>TOTAL: ${ (total).formatMoney(2, '.', ',') }</div>
                    <div className="submit-btn" >Go to Checkout</div>
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
    };
};

export default connect(select, {updateTruck, removeFromTruck, addToTruck}, null, {withRef: true})(ShoppingTruck);