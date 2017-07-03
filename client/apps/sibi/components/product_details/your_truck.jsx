import React                    from 'react';
import { connect }              from 'react-redux';
import assets                   from '../../libs/assets';
import _                        from 'lodash';

let select = (state)=>{
    return {
        currLang            : state.application.get('currLanguage'),
        salesTaxRate        : state.application.getIn(['calculations', 'salesTaxRate'])
    };
};

@connect(select, {}, null, {withRef: true})
export default class YourTruck extends React.Component {

    constructor(props) {
        super(props);

        let products = _.map(this.props.truck.toJS(), (product)=>{
            let cost = parseFloat(product.price * product.qty);
            let salesTax = this.calcTax(cost * this.props.salesTaxRate);

            return {...product, cost, salesTax};
        });

        let calc = this.calculate(products);

        this.state = {products: calc.products, total: calc.total};

        this.updateQty = this.updateQty.bind(this);
        this.calculate = this.calculate.bind(this);
        this.calcTax = this.calcTax.bind(this);
    }

    updateQty(productID, qty) {
        let products = this.state.products;

        let product = _.find(products, ['id', productID]);
        product.matchupQty = parseInt(matchupQty);
        product.cost = product.price * product.matchupQty;

        let index = _.findIndex(products, (product)=>{ return product.id === productID});
        products[index] = product;

        let calc = this.calculate(products);

        this.setState({products: calc.products, total: calc.total});
    }

    calculate(products) {
        let total = 0;

        products = _.map(products, (product)=>{
            let cost = parseFloat(product.price * product.qty);
            let salesTax = this.calcTax(cost * this.props.salesTaxRate);

            total += (cost + salesTax);

            return {...product, cost, salesTax}
        });

        return {products, total};
    }

    calcTax(value) {
        let result = Math.floor(value) + ".";
        let cents = 100 * (value - Math.floor(value)) + .5;

        result += Math.floor(cents / 10);
        result += Math.floor(cents % 10);

        return parseFloat(result);
    }

    render() {
        let truck;

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
            },
            qtyInput: {
                width: '50px',
                height: '28px',
                fontSize: '20px',
                paddingLeft: '5px'
            }
        };

        if(this.props.truck.size > 0) {

            truck = _.map(this.props.truck.toJS(), (product)=>{
                let image = (product.image) ? product.image : '';

                return (
                    <div key={product.id}>
                        <div><img src={image} alt={product.modelNum} /></div>
                        <div>
                            <div>{ product.name }</div>
                            <div style={{display: 'inline-flex'}}>
                                <div>Qty: <input type="number" value={product.truckQty} onChange={(e)=>this.update(product.id, e.target.value)} style={styles.qtyInput} /></div>
                                <div>{ product.price }</div>
                            </div>
                        </div>
                        <div><input type="checkbox" onClick={()=>this.update('warranty', (this.state.warranty) ? false : true)} checked={this.state.warranty}/> Add 10 Year Parts & Labor Warranty</div>
                        <div>SUBTOTAL: ${ (this.state.subtotal).formatMoney(2, '.', ',') }</div>
                        <div>SALES TAX: ${ (this.state.salesTax).formatMoney(2) }</div>
                    </div>
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
                <hr />
                <div>TOTAL: ${ (this.state.total).formatMoney(2, '.', ',') }</div>

                <div className="submit-btn" >Go to Checkout</div>
                <div className="cancel-btn" >View Truck</div>
            </div>
        );
    }

}