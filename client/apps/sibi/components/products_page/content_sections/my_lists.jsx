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

    constructor(props) {
        super(props);

        let myLists = (this.props.myLists.size > 0) ? this.props.myLists.toJS() : [];
        this.state = {myLists};
    }

    componentWillReceiveProps(nextProps) {
        if(nextProps.myLists.size > 0) {

            let myLists = nextProps.myLists.toJS();
            this.setState({myLists});
        }
    }

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
                border: '1px solid rgba(50,50,50,0.1)',
                backgroundColor: '#FFF',
                textAlign: 'center',
                cursor: 'pointer',
                padding: '10px',
                borderRadius: '5px',
                color: '#06cfe5'
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
            content: {
                margin: '50px auto',
                width: '230px'
            }
        };

        let index    = Number(this.props.list);
        let listName = this.state.myLists[index].name;
        let items    = this.state.myLists[index].items;

        if(_.size(items) > 0) {

            let products = _.map(items, (product, key)=>{
                let products = this.props.products.toJS();

                let index = _.findIndex(products, ['modelNum', product]);
                product = products[index];

                return (
                    <Product
                        key={key + 'listItem'}
                        parent="myList"
                        listName={listName}
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
                          <Link to={`/products`} ><div style={styles.submitBtn}>Browse Products</div></Link>
                      </div>
        }


        return (
            <div style={styles.container}>
                <div style={styles.titleSection}>
                    <div>{ listName }</div>
                    <div onClick={()=>this.props.showOverlay('removeItem', {listType: 'myList', listName})} style={styles.deleteList} >Delete List</div>
                </div>
                <div style={{margin: '50px -1px'}}>
                    { content }
                </div>
            </div>
        );
    }
}



