import React                    from 'react';
import { Link }                 from 'react-router';
import _                        from 'lodash';
import assets                   from '../../../libs/assets';
import '../../common/custom_formats.js'                        // adds formatMoney to Number types

export default class Product extends React.Component {
    constructor(props) {
        super(props);

        this.state = { isPlusActive: false };

        this.onHover = this.onHover.bind(this);
    }

    onHover(isPlusActive) {
        this.setState({ isPlusActive });
    }

    render() {
        const product = this.props.product;

        const styles = {
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
                zIndex: '9',
                position: 'absolute'
            },
            image: {
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
            modelNumber: {
                color: 'rgba(50, 50, 50, 0.4)',
                fontSize: '16px',
                margin: '2px'
            },
            prodInfo: {
                textAlign: 'left',
                padding: '20px 26px 0 0'
            }
        };

        const roundBtn = (this.props.parent === 'products') ? (<img
            src={assets('./images/plus_circle.png')}
            alt="add"
            onClick={(e) => this.props.showOverlay('productAddTo', { productId: product.id, mouseCoord: { mouseX: e.pageX, mouseY: e.pageY } })}
            style={{ display: (this.state.isPlusActive) ? 'block' : 'none' }}
        />)
            : (<img
                src={assets('./images/minus_circle.png')}
                alt="remove"
                onClick={(e) => this.props.showOverlay('removeItem', { collectionType: this.props.parent, collectionId: this.props.collectionId, productId: product.id })}
                style={{ display: (this.state.isPlusActive) ? 'block' : 'none' }}
            />);
        const price = (product.price) ? <div style={styles.price}>${ (parseFloat(product.price)).formatMoney(2, '.', ',') }</div> : null;

        return (
            <div className="pure-u-1 pure-u-md-1-2 pure-u-lg-1-4" style={styles.container}>
                <div style={styles.productThumbnail}>
                    <div onMouseOver={() => this.onHover(true)} onMouseOut={() => this.onHover(false)} style={styles.plusBtn} >
                        { roundBtn }
                    </div>
                    <Link to={`/product-details/${product.id}`}>
                        <div style={styles.image}><img src={product.image} alt="picture" height="100%" width="100%" /></div>
                        <h2 style={styles.name}>{ product.name }</h2>
                    </Link>
                </div>
                <div style={{ display: 'inline-flex' }}>
                    <div style={styles.prodInfo}>
                        { price }
                        <div style={styles.modelNumber}>#{ product.modelNumber }</div>
                    </div>
                    <div className="submit-btn" onClick={() => this.props.addToTruck(product)} style={{ width: '140px' }}>Add to truck</div>
                </div>
            </div>
        );
    }

}



