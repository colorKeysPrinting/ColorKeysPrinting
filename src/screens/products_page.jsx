import React                                from 'react';
import _                                    from 'lodash';
import { connect }                          from 'react-redux';
import { withCookies }                      from 'react-cookie';
import { withRouter }                       from 'react-router';
import { Link }                             from 'react-router-dom';
import { Tab, Tabs, TabList, TabPanel }     from 'react-tabs';
import Loader                               from 'react-loader';

import assets                               from 'libs/assets';

import { triggerSpinner }                   from 'ducks/ui/actions';
import { getProducts, getUserProductCategories, getProductsForSubCategory, unarchiveProduct }          from 'ducks/products/actions';
import { setActiveTab }                     from 'ducks/header/actions';

import MyTable                              from 'components/my_table';

class ProductsPage extends React.Component {
    constructor(props) {
        super(props);

        this.state = { isEditShowing: false, sortIndex: 0, product: '', category: '' };
    }

    componentWillMount() {
        const { cookies, activeUser } = this.props;
        const jwt = cookies.get('sibi-admin-jwt');

        if (jwt) {
            this.props.triggerSpinner({ isOn: true });
            this.props.getUserProductCategories({ token: jwt.token });
        } else {
            this.props.history.push(`/login`);
        }

        this.props.setActiveTab('products');
    }

    componentWillUpdate(nextProps) {
        const { cookies } = this.props;

        if (!_.isEqual(nextProps.activeUser, this.props.activeUser)) {
            const path = (nextProps.activeUser.size > 0) ? `/products` : `/login`;
            this.props.history.push(path);
        }

        if (!_.isEqual(this.props.productSubCategories, nextProps.productSubCategories)) {
            const jwt = cookies.get('sibi-admin-jwt');

            _.each(nextProps.productSubCategories.toJS(), (category) => {
                this.props.getProductsForSubCategory({ token: jwt.token, categoryId: category.id, category: category.name });
            });
        }
    }

    render() {
        const { cookies, productSubCategories } = this.props;
        let tabs, tabContent, tabsSection, addBtn, pageContent, editProductSection;

        if (productSubCategories.size > 0 &&
            this.props.products.size > 0) {

            const products = this.props.products.toJS();

            addBtn = <Link to={`/edit_product`} className="btn blue" >Add</Link>;

            tabs = _.map(productSubCategories.toJS(), (type) => {
                const upperCase = type.name;
                console.log("STRING " + upperCase);
                return (
                    <Tab key={type.id} >{ type.name }</Tab>
                );
            });

            tabContent = _.map(productSubCategories.toJS(), (type) => {

                const data = _.map(products[type.name], (product) => {
                    const cols = {};

                    _.each(['id','name','featured','action'], (key) => {
                        let value = product[key];

                        if (key === 'id') {
                            value = { ...product, category: type.id };

                        } else if (key === 'action') {
                            const jwt = cookies.get('sibi-admin-jwt');

                            value = (product.archived) ? <div onClick={() => this.props.unarchiveProduct({ token: jwt.token, category: type.name, id: product.id }) } className="product-action">Unarchive</div>
                                : <Link to={{ pathname: `/edit_product`, search: `productId=${product.id}`, state: { category: type.id, product } }} className="product-action">Edit</Link>;

                        } else if (key === 'featured') {
                            if (product.sortIndex <= 4) {
                                value = <div className="featured-column">featured {product.sortIndex + 1}</div>;
                            }
                        }

                        cols[key] = value;
                    });

                    return cols;
                });

                return (
                    <TabPanel key={`tabPanel${type.name}`}>
                        <MyTable
                            className="products-table"
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

            editProductSection = (this.state.isEditShowing) ? <div style={{ display: (this.state.isEditShowing) ? 'block' : 'none' }}>
                <EditProduct
                    sortIndex={this.state.sortIndex}
                    product={this.state.product}
                    category={this.state.category}
                    close={this.showEditBox}
                />
            </div> : null;

            pageContent = <div>
                <div className="table-card">
                    <div className="card-header">
                        <h2>Products</h2>
                        { addBtn }
                    </div>
                    { tabsSection }
                </div>
                { editProductSection }
            </div>;

            this.props.triggerSpinner({ isOn: false });
        }

        return (
            <Loader loaded={this.props.spinner} >
                <div id="products-page" className="container">
                    { pageContent }
                </div>
            </Loader>
        );
    }
}

const select = (state) => ({
    spinner                 : state.ui.get('spinner'),
    activeUser              : state.activeUser.get('activeUser'),
    products                : state.products.get('products'),
    productSubCategories    : state.products.get('productSubCategories')
});

const actions = {
    triggerSpinner,
    getProducts,
    getUserProductCategories,
    getProductsForSubCategory,
    unarchiveProduct,
    setActiveTab
};

export default connect(select, actions, null, { withRef: true })(withRouter(withCookies(ProductsPage)));
