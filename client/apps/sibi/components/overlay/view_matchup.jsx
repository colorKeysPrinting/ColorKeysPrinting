import React                    from 'react';
import { connect }              from 'react-redux';
import _                        from 'lodash';
import assets                   from '../../libs/assets';

let select = (state)=>{
    return {
        currLang            : state.application.get('currLanguage'),
        products            : state.application.get('products').toJS()
    };
};

@connect(select, {}, null, {withRef: true})
export default class ViewMatchupOverlay extends React.Component {

    constructor(props) {
        super(props);

        let items = _.map(this.props.overlayObj, (matchupQty, product)=>{
            product = this.props.products[product]
            let cost = product.price * matchupQty;

            return {[product]: {...product, matchupQty, cost}};
        });

        this.state = {items};

        this.update = this.update.bind(this);
        this.remove = this.remove.bind(this);
        this.addToTruck = this.addToTruck.bind(this);
        this.share = this.share.bind(this);
    }

    update(modelNum, matchupQty) {
        let items = this.state.items;

        let product = items[modelNum];
        product.matchupQty = matchupQty;
        product.cost = product.price * matchupQty;

        items[modelNum] = product;

        this.setState({items});
    }

    remove(item) {
        console.log('removing:', item);
    }

    addToTruck(item) {
        console.log('addToTruck:', item);
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
                width: '490px',
                margin: '10em auto',
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
                width: '10%'
            },
            content: {
                width: '89%',
                margin: '0px',
                textAlign: 'left'
            },
            submitBtn: {
                borderRadius: '5px',
                cursor: 'pointer',
                height: '40px',
                width: '100%',
                margin: '20px auto',
                paddingTop: '10px'
            }
        };

        let items = _.map(this.state.items, (product, modelNum)=>{

            return (
                <div key={modelNum} style={{display: 'inline-flex'}}>
                    <div style={{display: 'inline-flex'}}>
                        <div>
                            <img src={''} alt={modelNum} />
                        </div>
                        <div>
                            <div>{product.name}</div>
                            <div>Model # {modelNum}</div>
                        </div>
                    </div>
                    <div>
                        <div style={{display: 'inline-flex'}}>
                            <div>Qty: <input type="number" value={product.matchupQty} onChange={(e)=>this.update(modelNum, e.target.value)}/></div>
                            <div>{product.price}</div>
                        </div>
                        <div style={{display: 'inline-flex'}}>
                            <div onClick={()=>this.remove(modelNum)}>Remove</div>
                            <div onClick={()=>this.addToTruck({[modelNum]: product})} style={styles.submitBtn}>Add to Truck</div>
                        </div>
                    </div>
                </div>
            );
        });

        return (
            <div style={styles.container}>
                <div style={styles.titleBar }>
                    <div style={styles.title}>{''}</div>
                    <div onClick={()=>this.share('')} style={styles.close}>X</div>
                    <div onClick={this.props.close} style={styles.close}>X</div>
                </div>
                <div style={styles.content}>
                    <table>
                        <thead>
                        <tr>
                            <td>Product</td>
                            <td>Qty</td>
                            <td>Price</td>
                        </tr>
                        </thead>
                    </table>
                    <div>
                        {items}
                    </div>
                </div>
            </div>
        );
    }
}
