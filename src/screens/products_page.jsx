import React                                from 'react';
import _                                    from 'lodash';
import { connect }                          from 'react-redux';
import { withCookies }                      from 'react-cookie';
import { withRouter }                       from 'react-router';
import { Link }                             from 'react-router-dom';
import { Tab, Tabs, TabList, TabPanel }     from 'react-tabs';
import assets                               from 'libs/assets';

import { logout }                           from 'ducks/active_user/actions';
import { getProducts, getProductCategories, getProductsForSubCategory }          from 'ducks/products/actions';
import { setActiveTab }                     from 'ducks/header/actions';

import MyTable                              from 'components/my_table';

class ProductsPage extends React.Component {
    componentWillMount() {
        const { cookies } = this.props;
        const jwt = cookies.get('sibi-admin-jwt');

        if (jwt) {
            this.props.getProductCategories({ token: jwt.token });
        } else {
            console.log('TODO: trigger logout function *** no JWT ***');
        }

        this.props.setActiveTab('products');
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
                            value = <Link className="edit" to={{ pathname: `/edit_product`, state: { prevPath: this.props.location.pathname, category: type.id, product } }} >Edit</Link>;

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
                        />
                    </TabPanel>
                );
            });
        }

        return (
            <div id="products-page">
              <div className="container">
                <div className="box">
                  <div className="header">
                    <div className="pure-g actions">
                      <div className="pure-u-1-2">
                        <h2>Products</h2>
                      </div>
                      <div className="pure-u-1-2">
                        <Link to={`/edit_product`} className="btn submit-btn" >Add</Link>
                      </div>
                    </div>
                    <div className="pure-g">
                      <div className="pure-u-1">
                        <Tabs defaultIndex={0} >
                            <TabList>
                                { tabs }
                            </TabList>
                            { tabContent }
                        </Tabs>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
        );
    }
}

const select = (state) => ({
    products            : state.products.get('products'),
    productCategories   : state.products.get('productCategories')
});

const actions = {
    getProducts,
    getProductCategories,
    getProductsForSubCategory,
    setActiveTab
};

export default connect(select, actions, null, { withRef: true })(withRouter(withCookies(ProductsPage)));
