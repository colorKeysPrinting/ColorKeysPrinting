import React                    from 'react';
import { connect }              from 'react-redux';
import { Link }                 from 'react-router';
import _                        from 'lodash';
import assets                   from '../../../libs/assets';

import { addToTruck, showOverlay }           from '../../../actions/application';

import Product                  from './product';

let select = (state)=>{
    return {
        currLang   : state.application.get('currLanguage'),
        myLists    : state.application.getIn(['activeUser','myLists']),
        products   : state.application.get('products')
    };
};

@connect(select, {addToTruck, showOverlay}, null, {withRef: true})
export default class MyLists extends React.Component {

    render() {
        let content;

        let styles = {
            container: {
                width: '98%'
            },
            titleSection: {
                width: '100%',
                height: '75px',
                borderBottom: '1px solid rgba(50, 50, 50, 0.1)',
                textAlign: 'left',
                padding: '20px',
                fontSize: '30px',
                display: 'inline-flex'
            },
            deleteList: {
                position: 'absolute',
                left: '85%',
                width: '190px',
                height: '45px',
                padding: '10px'
            },
            submitBtn: {
                width: '200px',
                height: '46px',
                margin: '7px auto',
                fontSize: '18px',
                paddingTop: '14px'
            },
            content: {
                margin: '50px auto',
                width: '230px'
            }
        };

        let collection = _.find(this.props.myLists.toJS(), ['id', parseInt(this.props.collectionID)]);

        if(_.size(collection.products)> 0) {

            let products = _.map(collection.products,(productID)=>{

                let product = _.find(this.props.products.toJS(), ['id', parseInt(productID)]);

                return (
                    <Product
                        key={'myListProduct' + product.id}
                        parent="myLists"
                        collectionID={collection.id}
                        product={product}
                        addToTruck={this.props.addToTruck}
                        showOverlay={this.props.showOverlay} />
                );
            });

            content = <div className="pure-g" /*TODO: need to figure out why the grid isn't being displayed correctly*/>
                          { products }
                      </div>;
        } else {
            content = <div style={styles.content}>
                          <h2>This list is empty</h2>
                          <div>Click the "+" icon while viewing a product to add it to your list.</div>
                          <Link to={`/products`} ><div className="submit-btn" style={styles.submitBtn}>Browse Products</div></Link>
                      </div>
        }

        return (
            <div style={styles.container}>
                <div style={styles.titleSection}>
                    <div>{ collection.name }</div>
                    <div className="cancel-btn" onClick={()=>this.props.showOverlay('removeItem', {collectionType: 'myLists', redirect: `#/products`, collectionID: collection.id})} >Delete List</div>
                </div>
                <div style={{margin: '50px -1px'}}>
                    { content }
                </div>
            </div>
        );
    }
}



