import React                                from 'react';
import _                                    from 'lodash';
import { connect }                          from 'react-redux';
import { withCookies }                      from 'react-cookie';
import { withRouter }                       from 'react-router';
import { Link }                             from 'react-router-dom';
import { Tab, Tabs, TabList, TabPanel }     from 'react-tabs';
import assets                               from 'libs/assets';

import { logout }                           from 'ducks/active_user/actions';
import { getProducts, getProductCategories, getProductsForSubCategory, unarchiveProduct }          from 'ducks/products/actions';
import { setActiveTab }                     from 'ducks/header/actions';

import MyTable                              from 'components/my_table';

class ProductsPage extends React.Component {
    componentWillMount() {
        const { cookies, activeUser } = this.props;
        const jwt = cookies.get('sibi-admin-jwt');

        if (activeUser) {
            const path = (activeUser.size > 0) ? `/products` : `/login`;
            this.props.history.push(path);
        }

        if (jwt) {
            this.props.getProductCategories({ token: jwt.token });
        } else {
            console.log('TODO: trigger logout function *** no JWT ***');
        }

        this.props.setActiveTab('products');
    }

    componentWillUpdate(nextProps) {
        if (!_.isEqual(nextProps.activeUser, this.props.activeUser)) {
            const path = (nextProps.activeUser.size > 0) ? `/products` : `/login`;
            this.props.history.push(path);
        }

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
        let tabs, tabContent, tabsSection, addBtn;

        const { cookies } = this.props;
        const jwt = cookies.get('sibi-admin-jwt');

        if (this.props.productCategories.size > 0 &&
            this.props.products.size > 0) {

            const productCategories = this.props.productCategories.toJS();
            const products = this.props.products.toJS();

            addBtn = <Link to={{ pathname: `/edit_product`, state: { prevPath: this.props.location.pathname, applianceOrderDisplayNumber: _.size(products[productCategories[0]]) } }} className="btn blue" >Add</Link>;

            tabs = _.map(productCategories, (type) => {
                return (
                    <Tab key={type.id} >{ (type.name).toUpperCase() }</Tab>
                );
            });

            tabContent = _.map(productCategories, (type) => {

                const data = _.map(products[type.name], (product) => {
                    const cols = {};

                    _.each(['id','name','featured','action'], (key) => {
                        let value = product[key];

                        if (key === 'id') {
                            value = { ...product, category: type.id };

                        } else if (key === 'action') {
                            if (product.archived) {
                                value = <div onClick={() => this.props.unarchiveProduct({ token: jwt.token, category: type.name, id: product.id }) } >Unarchive</div>;
                            } else {
                                value = <Link to={{ pathname: `/edit_product`, state: { prevPath: this.props.location.pathname, category: type.id, product } }} >Edit</Link>;
                            }
                        } else if (key === 'featured') {
                            if (product.applianceOrderDisplayNumber <= 5) {
                                value = <div className="featured-column">featured {product.applianceOrderDisplayNumber + 1}</div>;
                            }
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

            tabsSection = <Tabs defaultIndex={0} >
                <TabList>
                    { tabs }
                </TabList>
                { tabContent }
            </Tabs>;
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
                                    { addBtn }
                                </div>
                            </div>
                            <div className="pure-g">
                                <div className="pure-u-1">
                                    { tabsSection }
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
    activeUser          : state.activeUser.get('activeUser'),
    products            : state.products.get('products'),
    productCategories   : state.products.get('productCategories')
});

const actions = {
    getProducts,
    getProductCategories,
    getProductsForSubCategory,
    unarchiveProduct,
    setActiveTab
};

export default connect(select, actions, null, { withRef: true })(withRouter(withCookies(ProductsPage)));
