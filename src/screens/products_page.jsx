import React                                from 'react';
import _                                    from 'lodash';
import { connect }                          from 'react-redux';
import { withCookies }                      from 'react-cookie';
import { Tab, Tabs, TabList, TabPanel }     from 'react-tabs';
import assets                               from 'libs/assets';

import HeaderBar                            from 'components/header_bar';
import { showOverlay }                      from 'actions/application';
import { logout }                           from 'actions/header';
import { getProducts, getProductCategories, getProductsForSubCategory }          from 'actions/products';

import MyTable                              from 'components/my_table';

class ProductsPage extends React.Component {
    constructor(props) {
        super(props);

        this.handleAction = this.handleAction.bind(this);
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
    
    handleAction({ item }) {
        console.log('product action:', item.id.product);
        this.props.showOverlay('editProduct', { ...item.id });
    }

    componentWillUpdate(nextProps) {
        if (!_.isEqual(this.props.productCategories, nextProps.productCategories)) {
            const productCategories = nextProps.productCategories.toJS();

            const { cookies } = this.props;
            const jwt = cookies.get('sibi-admin-jwt');
            
            _.each(productCategories, (category) => {
                this.props.getProductsForSubCategory({ token: jwt.token, categoryId: category.id, category: category.name });
            });
        }
    }

    render() {
        let tabs, tabContent;

        const { cookies } = this.props;
        const jwt = cookies.get('sibi-admin-jwt');

        if (this.props.productCategories.size > 0 &&
            this.props.products.size > 0) {
            
            const productCategories = this.props.productCategories.toJS();
            const products = this.props.products.toJS();

            tabs = _.map(productCategories, (type) => {
                return (
                    <Tab key={type.id} >{ (type.name).toUpperCase() }</Tab>
                );
            });

            tabContent = _.map(productCategories, (type) => {

                const data = _.map(products[type.name], (product) => {
                    const cols = {};

                    _.each(['id','name','action'], (key) => {
                        let value = product[key];

                        if (key === 'action') {
                            value = 'Edit';

                        } else if (key === 'id') {
                            value = { ...product, category: type.id };
                        }

                        cols[key] = value;
                    });

                    return cols;
                });

                return (
                    <TabPanel key={`tabPanel${type.name}`}>
                        <MyTable
                            type="products"
                            tab={type.name}
                            data={data}
                            handleAction={this.handleAction}
                        />
                    </TabPanel>
                );
            });
        }

        return (
            <div id="products-page" >
                <HeaderBar />
                <div>
                    <div>Products</div>
                    <div className="submit-btn" onClick={() => this.props.showOverlay('editProduct')}>Add</div>
                </div>
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

const actions = {
    showOverlay, 
    getProducts, 
    getProductCategories, 
    getProductsForSubCategory
};

export default connect(select, actions, null, { withRef: true })(withCookies(ProductsPage));