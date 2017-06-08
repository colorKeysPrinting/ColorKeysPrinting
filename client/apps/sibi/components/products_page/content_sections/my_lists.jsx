import React                    from 'react';
import { connect }              from 'react-redux';
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

        this.addToTruck = this.addToTruck.bind(this);
    }

    componentWillReceiveProps(nextProps) {
        if(nextProps.myList) {
            this.setState({myList: nextProps.myList});
        }
    }

    addToTruck(matchup) {
        console.log('matchup: ', matchup);

        this.props.addToTruck({...matchup, tonnage, seer, applicationType});
    }

    render() {
        let styles = {
            container: {
                width: '98%'
            },
            productContainer: {
                width: '86%'
            },
            titleSection: {
                width: '100%',
                height: '75px',
                borderBottom: '1px solid rgba(50, 50, 50, 0.1)',
                textAlign: 'left',
                padding: '20px',
                fontSize: '30px',
            },
            searchBox: {
                border: '1px solid #FFF',
                padding: '30px',
                width: '100%',
            },
            dropdown: {
                position: 'absolute',
                left: '85%',
                width: '190px',
                height: '45px',
                marginTop: '17px',
                marginLeft: '15px',
                border: '1px solid rgba(50, 50, 50, 0.1)',
                backgroundColor: '#FFF',
            },
            headers: {
                height: '50px',
                width: '100%',
                textAlign: 'left',
                backgroundColor: '#F4F8FB',
                padding: '20px'
            }
        };

        let index    = this.props.list;
        let listName = this.state.myLists[index].name;
        let items    = this.state.myLists[index].items;

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

        return (
            <div style={styles.container}>
                <div style={styles.titleSection}>
                    { listName }
                </div>
                <div style={{margin: '50px -1px'}}>
                    <div className="pure-g" /*TODO: need to figure out why the grid isn't being displayed correctly*/>
                        { products }
                    </div>
                </div>
            </div>
        );
    }
}



