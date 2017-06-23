import '../../common/custom_formats.js'                        // adds formatMoney to Number types
import React                    from 'react';
import { Link }                 from 'react-router';
import _                        from 'lodash';
import assets                   from '../../../libs/assets';

export default class Product extends React.Component {
    constructor(props) {
        super(props);

        this.state = {isPlusActive: false};

        this.onHover = this.onHover.bind(this);
    }

    onHover(isPlusActive) {
        this.setState({isPlusActive});
    }

    render() {
        let product = this.props.product;

        let styles = {
            container: {
                border: '1px solid rgba(50, 50, 50, 0.1)',
                backgroundColor: '#FBFBFB'
            },
            productThumbnail: {
                cursor: 'pointer',
                display: 'grid'
            },
            plusBtn: {
                float: 'left',
                margin: '5px',
                height: '42px',
                width: '42px',
                zIndex: '9'
            },
            image: {
                marginTop: '-52px',
                height: '300px',
                backgroundColor: '#FFF'
            },
            name: {
                margin: '10px auto 0px',
                textAlign: 'left',
                fontSize: '20px',
                width: '85%'
            },
            price: {
                color: '#06cfe5',
                fontSize: '25px',
                margin: '2px'
            },
            modelNum: {
                color: 'rgba(50, 50, 50, 0.4)',
                fontSize: '16px',
                margin: '2px'
            },
            submitBtn: {
                backgroundColor: '#06cfe5',
                borderRadius: '5px',
                color: '#FFF',
                cursor: 'pointer',
                width: '200px',
                height: '46px',
                margin: '20px auto',
                paddingTop: '13px'
            },
            prodInfo: {
                textAlign: 'left',
                padding: '20px 26px 0 0'
            }
        };

        let roundBtn = (this.props.parent === 'products') ? <img src={assets('./images/plus_circle.png')}
                                                                 alt="add"
                                                                 onClick={(e)=>this.props.showOverlay('productAddTo', {productID: product.id, mouseCoord: {mouseX: e.pageX, mouseY: e.pageY}})}
                                                                 style={{display: (this.state.isPlusActive) ? 'block' : 'none'}} />
                                                          : <img src={assets('./images/minus_circle.png')}
                                                                 alt="remove"
                                                                 onClick={(e)=>this.props.showOverlay('removeItem', {collectionType: this.props.parent, collectionID: this.props.collectionID, productID: product.id})}
                                                                 style={{display: (this.state.isPlusActive) ? 'block' : 'none'}} />;
        return (
            <div className="pure-u-1 pure-u-md-1-2 pure-u-lg-1-4" style={styles.container}>
                <div style={styles.productThumbnail}>
                    <div style={styles.plusBtn} onMouseOver={()=>this.onHover(true)} onMouseOut={()=>this.onHover(false)}>
                        { roundBtn }
                    </div>
                    <Link to={`/product-details/${product.id}`}>
                        <div style={styles.image}><img src={product.image} alt="picture" height="100%" width="100%"/></div>
                        <h2 style={styles.name}>{ product.name }</h2>
                    </Link>
                </div>
                <div style={{display: 'inline-flex'}}>
                    <div style={styles.prodInfo}>
                        <div style={styles.price}>${ (product.price).formatMoney(2, '.', ',') }</div>
                        <div style={styles.modelNum}>#{ product.modelNum }</div>
                    </div>
                    <div onClick={()=>{this.props.addToTruck(product)}} style={styles.submitBtn}>Add to truck</div>
                </div>
            </div>
        );
    }

}



