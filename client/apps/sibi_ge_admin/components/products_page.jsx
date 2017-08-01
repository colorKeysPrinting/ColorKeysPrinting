import React                    from 'react';
import _                        from 'lodash';
import { connect }              from 'react-redux';
import { browserHistory, Link } from 'react-router';
import { withCookies }          from 'react-cookie';
import { Tab, Tabs, TabList, TabPanel }     from 'react-tabs';
import assets                   from '../libs/assets';

import { showOverlay }          from '../actions/application';
import { logout }               from '../actions/header';
import { getProducts, getProductCategories }          from '../actions/products';

import MyTable                  from './common/my_table';

class ProductsPage extends React.Component {
    constructor(props) {
        super(props);

        this.changeCategory = this.changeCategory.bind(this);
    }

    componentWillMount() {
        const { cookies } = this.props;
        const jwt = cookies.get('sibi-admin-jwt');

        if (jwt) {
            this.props.getProductCategories({ token: jwt.token });
        } else {
            console.log('TODO: trigger logout function *** no JWT ***');
        }
    }

    componentWillUpdate(nextProps) {
        if (nextProps.activeUser) {
            const path = (nextProps.activeUser.size > 0) ? `/products` : `/`;
            browserHistory.push(path);
        }

        if (nextProps.isLogout) {
            this.props.logout();
        }
    }

    changeCategory(category) {
        const { cookies } = this.props;
        const jwt = cookies.get('sibi-admin-jwt');

        this.props.getProductsForCategory({ token: jwt.token, category });
    }

    render() {

        const { cookies } = this.props;
        const jwt = cookies.get('sibi-admin-jwt');

        const tabs = _.map(this.props.productCategories.toJS(), (type) => {
            if (props.product[type]) {
                return (<Tab 
                    key={type} 
                    onClick={() => this.props.getProductsForCategory({ token: jwt.token, category: type })} 
                >{ (type).toUpperCase() }</Tab>);
            }
        });

        const tabContent = _.map(tabTypes, (type) => {
            if (props.product[type]) {
                content = <div key={type}>{ props.product[type] }</div>;
                let data = [];
                
                return (
                    <TabPanel key={`tabPanel${type}`}>
                        <MyTable
                            type="products"
                            token={jwt.token}
                            headers={headers}
                            data={data}
                        />
                    </TabPanel>
                );
            }
        });

        return (
            <div id="products-page" >
                <Tabs defaultIndex={0} >
                    <TabList>
                        { tabs }
                    </TabList>
                    { tabContent }
                </Tabs>
            </div>
        );
    }
}

const select = (state) => ({
    products            : state.application.get('products'),
    productCategories   : state.application.get('productCategories')
});

export default connect(select, { showOverlay, getProducts }, null, { withRef: true })(withCookies(ProductsPage));