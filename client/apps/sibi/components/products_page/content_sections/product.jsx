import React                    from 'react';
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
                cursor: 'pointer'
            },
            plusBtn: {
                float: 'left',
                margin: '5px',
                height: '42px',
                width: '42px'
            },
            image: {
                maxWidth: '50%',
                margin: 'auto'
            },
            name: {
                maxWidth: '50%',
                margin: 'auto',

            },
            price: {
                color: 'rgb(47, 205, 237)',
                fontSize: '25px',
                margin: '2px'
            },
            modelNum: {
                color: 'rgba(50, 50, 50, 0.4)',
                fontSize: '16px',
                margin: '2px'
            },
            submitBtn: {
                backgroundColor: 'rgb(47, 205, 237)',
                borderRadius: '5px',
                color: '#FFF',
                cursor: 'pointer',
                height: '40px',
                width: '50%',
                margin: '20px auto',
                paddingTop: '13px',
                textAlign: 'center'
            },
            prodInfo: {
                width: '50%',
                textAlign: 'left',
                padding: '22px'
            }
        };

        return (
            <div className="pure-u-1 pure-u-md-1-2 pure-u-lg-1-4" style={styles.container}>
                <div onClick={()=>{this.props.productSelected(product)}} style={styles.productThumbnail}>
                    <div style={styles.plusBtn} onMouseOver={()=>this.onHover(true)} onMouseOut={()=>this.onHover(false)}>
                        <img src={assets('./images/plus_circle.png')}
                             alt="add"
                             onClick={(e)=>this.props.showOverlay('productAddTo', {modelNum: product.modelNum, mouseCoord: {mouseX: e.clientX, mouseY: e.clientY}})}
                             style={{display: (this.state.isPlusActive) ? 'block' : 'none'}} />
                    </div>
                    <div style={styles.image}><img src={product.image} alt="picture" /></div>
                    <div style={styles.name}>{product.name}</div>
                </div>
                <div style={{columnCount: 2, display: 'inline-flex', width: '50%'}}>
                    <div style={styles.prodInfo}>
                        <div style={styles.price}>${product.price}</div>
                        <div style={styles.modelNum}>#{product.modelNum}</div>
                    </div>
                    <div onClick={()=>{this.props.addToTruck(product)}} style={styles.submitBtn}>Add to truck</div>
                </div>
            </div>
        );
    }

}



