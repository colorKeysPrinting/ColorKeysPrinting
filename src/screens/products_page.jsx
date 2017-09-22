import React                                from 'react';
import _                                    from 'lodash';
import { connect }                          from 'react-redux';
import { withCookies }                      from 'react-cookie';
import { withRouter }                       from 'react-router';
import { Link }                             from 'react-router-dom';
import Loader                               from 'react-loader';
import Tabs, { TabPane }                    from 'rc-tabs';
import TabContent                           from 'rc-tabs/lib/TabContent';
import ScrollableInkTabBar                  from 'rc-tabs/lib/ScrollableInkTabBar';
import assets                               from 'libs/assets';

import { triggerSpinner }                   from 'ducks/ui/actions';
import { getUserProductCategories, getProductsForSubCategory, unarchiveProduct }          from 'ducks/products/actions';
import { setActiveTab }                     from 'ducks/header/actions';

import MyTable                              from 'components/my_table';

class ProductsPage extends React.Component {
    constructor(props) {
        super(props);

        this.state = { isEditShowing: false, sortIndex: 0, product: '', category: '', activeKey: '0', activeSubKey: '0'};
    }

    componentWillMount() {
        const { cookies, activeUser } = this.props;
        const jwt = cookies.get('sibi-admin-jwt');

        if (jwt) {
            this.props.triggerSpinner({ isOn: true });
            this.props.getUserProductCategories({ token: jwt.token, category: jwt.trade }); // need to update this to account for the activeUser trade
        } else {
            this.props.history.push(`/login`);
        }

        this.props.setActiveTab('products');
    }

    componentWillUpdate(nextProps) {
        const { cookies, activeUser, history, products, productCategories } = this.props;

        if (!_.isEqual(nextProps.activeUser, activeUser)) {
            const path = (nextProps.activeUser.size > 0) ? `/products` : `/login`;
            history.push(path);
        }

        if (!_.isEqual(nextProps.products, products)) {
            const jwt = cookies.get('sibi-admin-jwt');
            this.props.getUserProductCategories({ token: jwt.token, category: jwt.trade });
        }

        if (!_.isEqual(productCategories, nextProps.productCategories)) {
            const jwt = cookies.get('sibi-admin-jwt');

            _.each(nextProps.productCategories.toJS(), (category) => {
                _.each(category.subcategories, (subCategory) => {
                    if (subCategory.containedSubCategories) {
                        _.each(subCategory.containedSubCategories, (subSubCategory) => {
                            this.props.getProductsForSubCategory({ token: jwt.token, category: category.name, subCategory, subSubCategory });
                        });
                    } else {
                        this.props.getProductsForSubCategory({ token: jwt.token, category: category.name, subCategory });
                    }
                });
            });
        }
    }

    render() {
        const { cookies, products, productCategories, productSubCategories, productsInCategory, activeUser } = this.props;
        let tabs, tabContent, pageContent, editProductSection;

        if (productCategories.size > 0 &&
            productSubCategories.size > 0 &&
            productsInCategory.size > 0) {

            const products = productsInCategory.toJS();

            tabContent = _.map(productCategories.toJS(), (category) => {
                return _.map(category.subcategories, (subCategory, index) => {
                    const name = subCategory.name;
                    let content;

                    if (subCategory.containedSubCategories) {
                        const subTabContent = _.map(subCategory.containedSubCategories, (subSubCategory, subIndex) => {
                            const subName = subSubCategory.name;

                            const data = _.map(products[category.name][name][subName], (product) => {
                                const cols = {};

                                _.each(['id','name','featured','action'], (key) => {
                                    let value = product[key];

                                    if (key === 'id') {
                                        value = { ...product, category: category.id, subCategory: subCategory.id, subSubCategory: subSubCategory.id };

                                    } else if (key === 'action') {
                                        const jwt = cookies.get('sibi-admin-jwt');

                                        value = (product.archived) ? <div onClick={() => this.props.unarchiveProduct({ token: jwt.token, id: product.id }) } className="product-action">Unarchive</div>
                                            : <Link to={{ pathname: `/edit_product`, search: `productId=${product.id}` }} className="product-action">Edit</Link>;

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
                                <TabPane
                                    tab={subName}
                                    key={subIndex}
                                >
                                    <MyTable
                                        className="products-table"
                                        type="products"
                                        tab={subName}
                                        data={data}
                                    />
                                </TabPane>
                            );
                        });

                        content = <Tabs
                            tabBarPosition="top"
                            activeKey={this.state.activeSubKey}
                            onChange={(activeSubKey) => this.setState({ activeSubKey })}
                            renderTabBar={()=><ScrollableInkTabBar />}
                            renderTabContent={()=><TabContent style={{ overflow: 'none' }} />}
                        >
                            { subTabContent }
                        </Tabs>;

                    } else {
                        const data = _.map(products[category.name][name], (product) => {
                            const cols = {};

                            _.each(['id','name','featured','action'], (key) => {
                                let value = product[key];

                                if (key === 'id') {
                                    value = { ...product, category: category.id, subCategory: subCategory.id };

                                } else if (key === 'action') {
                                    const jwt = cookies.get('sibi-admin-jwt');

                                    value = (product.archived) ? <div onClick={() => this.props.unarchiveProduct({ token: jwt.token, category: category.name, subCategory: name, id: product.id }) } className="product-action">Unarchive</div>
                                        : <Link to={{ pathname: `/edit_product`, search: `productId=${product.id}` }} className="product-action">Edit</Link>;

                                } else if (key === 'featured') {
                                    if (product.sortIndex <= 4) {
                                        value = <div className="featured-column">featured {product.sortIndex + 1}</div>;
                                    }
                                }

                                cols[key] = value;
                            });

                            return cols;
                        });

                        content = <MyTable
                            className="products-table"
                            type="products"
                            tab={name}
                            data={data}
                        />;
                    }

                    return (
                        <TabPane
                            tab={name}
                            key={index}
                        >
                            { content }
                        </TabPane>
                    );
                });
            });

            pageContent = <div>
                <div className="table-card">
                    <div className="card-header">
                        <h2>Products</h2>
                        { (activeUser.toJS().type === 'superAdmin') ? <Link to={`/edit_product`} className="btn blue" >Add</Link> : null }
                    </div>
                    <Tabs
                        tabBarPosition="top"
                        activeKey={this.state.activeKey}
                        onChange={(activeKey) => this.setState({ activeKey })}
                        renderTabBar={()=><ScrollableInkTabBar />}
                        renderTabContent={()=><TabContent style={{ overflow: 'none' }} />}
                    >
                        { tabContent }
                    </Tabs>
                </div>
                { (this.state.isEditShowing) ? <div style={{ display: (this.state.isEditShowing) ? 'block' : 'none' }}>
                    <EditProduct
                        sortIndex={this.state.sortIndex}
                        product={this.state.product}
                        category={this.state.category}
                        close={this.showEditBox}
                    />
                </div> : null }
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
    productsInCategory      : state.products.get('productsInCategory'),
    productCategories       : state.products.get('productCategories'),
    productSubCategories    : state.products.get('productSubCategories')
});

const actions = {
    triggerSpinner,
    getUserProductCategories,
    getProductsForSubCategory,
    unarchiveProduct,
    setActiveTab
};

export default connect(select, actions, null, { withRef: true })(withRouter(withCookies(ProductsPage)));
