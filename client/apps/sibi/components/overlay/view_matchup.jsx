import '../common/custom_formats.js'                        // adds formatMoney to Number types
import React                    from 'react';
import { connect }              from 'react-redux';
import _                        from 'lodash';
import assets                   from '../../libs/assets';

import { addToTruck }           from '../../actions/application';

let select = (state)=>{
    return {
        currLang            : state.application.get('currLanguage'),
        products            : state.application.get('products').toJS(),
        salesTaxRate        : state.application.getIn(['calculations', 'salesTaxRate'])
    };
};

@connect(select, {addToTruck}, null, {withRef: true})
export default class ViewMatchupOverlay extends React.Component {

    constructor(props) {
        super(props);

        let items = _.map(this.props.overlayObj.products, (matchupQty, modelNum)=>{

            let product = _.find(this.props.products, ['modelNum', modelNum]);
            let cost = (parseFloat(product.price * matchupQty));

            return {modelNum, ...product, matchupQty, cost};
        });

        let calc = this.calculate(items);

        this.state = {items, title: this.props.overlayObj.name, subtotal: calc.subtotal, shipping: calc.shipping, salesTax: calc.salesTax, total: calc.total};

        this.update = this.update.bind(this);
        this.calculate = this.calculate.bind(this);
        this.calcTax = this.calcTax.bind(this);
        this.remove = this.remove.bind(this);
        this.addItemToTruck = this.addItemToTruck.bind(this);
        this.addAllToTruck = this.addAllToTruck.bind(this);
        this.share = this.share.bind(this);
    }

    update(modelNum, matchupQty) {
        let items = this.state.items;

        let product = _.find(items, ['modelNum', modelNum]);
        product.matchupQty = parseInt(matchupQty);
        product.cost = product.price * product.matchupQty;

        let index = _.findIndex(items, (obj)=>{ return obj.modelNum === modelNum});
        items[index] = product;

        let calc = this.calculate(items);

        this.setState({items, subtotal: calc.subtotal, shipping: calc.shipping, salesTax: calc.salesTax, total: calc.total});
    }

    calculate(items) {
        let subtotal = 0,
            salesTax = 0,
            shipping = 0;

        _.each(items, (item)=>{
            let cost = item.cost
            subtotal += cost;
            salesTax += this.calcTax(cost * this.props.salesTaxRate / 100);
        });

        let total = subtotal + salesTax;

        return {subtotal, shipping, salesTax, total};
    }

    calcTax(value) {
        let result = Math.floor(value) + ".";
        let cents = 100 * (value - Math.floor(value)) + .5;

        result += Math.floor(cents / 10);
        result += Math.floor(cents % 10);

        return parseFloat(result);
    }

    remove(modelNum) {
        console.log('removing:', modelNum);
        let items = _.remove(this.state.items, (obj)=>{return obj.modelNum !== modelNum});

        let calc = this.calculate(items);

        this.setState({items, subtotal: calc.subtotal, shipping: calc.shipping, salesTax: calc.salesTax, total: calc.total});
    }

    addItemToTruck(item) {
        console.log('addToTruck:', item);
        let qty = item.matchupQty;

        item['qty'] = qty;
        delete item.matchupQty;

        this.props.addToTruck(item);
    }

    addAllToTruck(matchup) {
        console.log('addToTruck:', matchup);

        let items = {};
        _.each(matchup, (item)=>{
            items[item.modelNum] = item.matchupQty;
        });

        matchup = {matchup: this.state.title, items};

        this.props.addToTruck(matchup);
    }

    share(matchup) {
        console.log('sharing:', matchup);
    }

    render() {

        let styles = {
            container: {
                backgroundColor: '#F9FAFC',
                borderRadius: '5px',
                border: '1px solid rgba(50, 50, 50, 0.4)',
                boxShadow: '0px 2px 7px 0px rgba(50, 50, 50, 0.4)',
                width: '85%',
                margin: '2em auto',
                zIndex: '999'
            },
            titleBar: {
                display: 'inline-flex',
                backgroundColor: '#FFF',
                borderTopLeftRadius: '5px',
                borderTopRightRadius: '5px',
                boxShadow: '0px 2px 7px 0px rgba(50, 50, 50, 0.4)',
                height: '20%',
                width: '100%'
            },
            title: {
                textAlign: 'left',
                padding: '30px',
                width: '90%'
            },
            close: {
                cursor: 'pointer',
                textAlign: 'right',
                padding: '30px',
                width: '6%'
            },
            actions: {
                cursor: 'pointer',
                borderRadius: '5px',
                padding: '5px',
                margin: '8px',
                border: '1px solid rgba(50, 50, 50, 0.1)',
                height: '60px',
                width: '60px'
            },
            content: {
                margin: '0px',
                textAlign: 'left'
            },
            qtyInput: {
                width: '50px',
                height: '28px',
                fontSize: '20px',
                paddingLeft: '5px'
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
            table: {
                col1: {
                    width: '80%'
                },
                col2: {
                    width: '10%'
                },
                col3: {
                    width: '10%'
                },
                images: {
                    width: 'auto',
                    height: '220px',
                    margin: '10px'
                },
                removeBtn: {
                    marginTop: '100%',
                    textAlign: 'center',
                    cursor: 'pointer',
                    border: '1px solid rgba(50,50,50,0.1)',
                    padding: '10px',
                    borderRadius: '5px',
                    color: '#06cfe5',
                    fontWeight: 'bold',
                },
                submitBtn: {
                    borderRadius: '5px',
                    cursor: 'pointer',
                    marginTop: '100%',
                    paddingTop: '10px',
                    color: '#FFF',
                    backgroundColor: '#06cfe5',
                    padding: '15px',
                    textAlign: 'center'
                }
            },
            modelNum: {
                color: 'rgba(50, 50, 50, 0.4)',
                fontSize: '16px',
                margin: '2px'
            },
        };

        let items = _.map(this.state.items, (product, i)=>{

            return (
                <tr key={product.modelNum} style={{width: '100%'}}>
                    <td style={styles.table.col1}>
                        <div style={{display: 'inline-flex'}}>
                            <div>
                                <img src={''} alt={product.modelNum} style={styles.table.images}/>
                            </div>
                            <div>
                                <h2>{product.name}</h2>
                                <div style={styles.modelNum}>Model # {product.modelNum}</div>
                            </div>
                        </div>
                    </td>
                    <td style={styles.table.col2}>
                        <label style={{display: 'inline-flex'}} style={{fontSize: '20px', marginRight: '10px'}}>Qty: <input type="number" value={product.matchupQty} onChange={(e)=>this.update(product.modelNum, e.target.value)} style={styles.qtyInput}/></label>
                        <div onClick={()=>this.remove(product.modelNum)} style={styles.table.removeBtn}>Remove</div>
                    </td>
                    <td style={styles.table.col3}>
                        <div>${(product.cost).formatMoney(2, '.', ',')}</div>
                        <div onClick={()=>this.addItemToTruck(product)} style={styles.table.submitBtn}>Add to Truck</div>
                    </td>
                </tr>
            );
        });

        return (
            <div style={styles.container}>
                <div style={styles.titleBar }>
                    <div style={styles.title}>{this.state.title}</div>
                    <div onClick={()=>this.share(this.state.items)}><img src={''} alt="share" style={styles.actions} /></div>
                    <div onClick={this.props.close} style={styles.close}>X</div>
                </div>
                <div style={styles.content}>
                    <table>
                        <thead>
                        <tr>
                            <td style={styles.table.col1}>Product</td>
                            <td style={styles.table.col2}>Qty</td>
                            <td style={styles.table.col3}>Price</td>
                        </tr>
                        </thead>
                        <tbody>
                            {items}
                        </tbody>
                    </table>
                    <table>
                        <tbody>
                            <tr>
                                <td style={{width: '20%'}}>SUBTOTAL: ${(this.state.subtotal).formatMoney(2, '.', ',')}</td>
                                <td style={{width: '20%'}}>SHIPPING: ${(this.state.shipping).formatMoney(2, '.')}</td>
                                <td style={{width: '20%'}}>SALES TAX: ${(this.state.salesTax).formatMoney(2)}</td>
                                <td style={{width: '20%'}}>TOTAL: ${(this.state.total).formatMoney(2, '.', ',')}</td>
                                <td><div onClick={()=>this.addAllToTruck(this.state.items)} style={styles.submitBtn}>Add All Items to Cart</div></td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>
        );
    }
}
