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

        this.state = { activeKey: '0', activeSubKey: '0'};
        this.updateTabs = this.updateTabs.bind(this);
    }

    componentWillMount() {
        const { cookies, activeUser, locaction } = this.props;
        const jwt = cookies.get('sibi-admin-jwt');

        if (jwt) {
            this.props.triggerSpinner({ isOn: true });
            this.props.getUserProductCategories({ token: jwt.token, category: jwt.trade }); // need to update this to account for the activeUser trade
        }

        if (location.search) {
            let activeKey = /tab=(\d{1})/.exec(location.search);
            let activeSubKey = /subTab=(\d{1})/.exec(location.search);

            activeKey = (activeKey) ? activeKey[1] : '0';
            activeSubKey = (activeSubKey) ? activeSubKey[1] : '0';
            this.setState({ activeKey, activeSubKey });
        }

        this.props.setActiveTab('products');
    }

    componentWillUpdate(nextProps) {
        const { cookies, history, activeUser, productCategories } = this.props;

        if (!_.isEqual(nextProps.activeUser, activeUser)) {
            const path = (nextProps.activeUser.size > 0) ? `/products` : `/login`;
            history.push(path);
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

    updateTabs({ activeKey, activeSubKey }) {
        const { history } = this.props;
        (activeKey) ? this.setState({ activeKey }) : null;
        (activeSubKey) ? this.setState({ activeSubKey }) : null;

        history.push({pathname: `/products`, search: `${(activeKey)? `tab=${activeKey}` : ''}${(activeSubKey) ? `,subTab=${activeSubKey}` : ''}`})
    }

    render() {
        const { cookies, products, productCategories, productSubCategories, productsInCategory, activeUser } = this.props;
        let tabs, tabContent, pageContent, editProductSection;

        if (activeUser.size > 0 &&
            productCategories.size > 0 &&
            productSubCategories.size > 0 &&
            productsInCategory.size > 0) {

            const products = productsInCategory.toJS();

            tabContent = _.map(productCategories.toJS(), (category) => {
                return _.map(category.subcategories, (subCategory, index) => {
                    const subName = subCategory.name;
                    let content;

                    if (subCategory.containedSubCategories) {
                        const subTabContent = _.map(subCategory.containedSubCategories, (subSubCategory, subIndex) => {
                            const subSubName = subSubCategory.name;

                            const data = _.map(products[category.name][subName][subSubName], (product) => {
                                const cols = {};

                                _.each(['id','name','featured','action'], (key) => {
                                    let value = product[key];

                                    if (key === 'id') {
                                        value = { ...product, category: category.id, subCategory: subCategory.id, subSubCategory: subSubCategory.id };

                                    } else if (key === 'action') {
                                        const jwt = cookies.get('sibi-admin-jwt');

                                        value = (product.archived) ? <div onClick={() => this.props.unarchiveProduct({ token: jwt.token, category: jwt.trade, id: product.id }) } className="product-action">Unarchive</div>
                                            : <Link to={{ pathname: `/edit_product`, search: `productId=${product.id}` }} className="product-action">Edit</Link>;

                                    } else if (key === 'featured') {
                                        if (product.sortIndex <= 4) {
                                            value = <div className="featured-column">Featured {product.sortIndex + 1}</div>;
                                        }
                                    }

                                    cols[key] = value;
                                });

                                return cols;
                            });

                            return (
                                <TabPane
                                    tab={subSubName}
                                    key={subIndex}
                                >
                                    <MyTable
                                        className="products-table"
                                        type="products"
                                        tab={subSubName}
                                        data={(_.size(data) > 0) ? data : {}}
                                    />
                                </TabPane>
                            );
                        });

                        content = <Tabs
                            tabBarPosition="top"
                            activeKey={this.state.activeSubKey}
                            onChange={(activeSubKey) => this.updateTabs({ activeKey: this.state.activeKey, activeSubKey })}
                            renderTabBar={()=><ScrollableInkTabBar />}
                            renderTabContent={()=><TabContent style={{ overflow: 'none' }} />}
                        >
                            { subTabContent }
                        </Tabs>;

                    } else {
                        const data = _.map(products[category.name][subName], (product) => {
                            const cols = {};

                            _.each(['id','name','featured','action'], (key) => {
                                let value = product[key];

                                if (key === 'id') {
                                    value = { ...product, category: category.id, subCategory: subCategory.id };

                                } else if (key === 'action') {
                                    const jwt = cookies.get('sibi-admin-jwt');

                                    value = (product.archived) ? <div onClick={() => this.props.unarchiveProduct({ token: jwt.token, category: category.name, subCategory: subName, id: product.id }) } className="product-action">Unarchive</div>
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
                            tab={subName}
                            data={data}
                        />;
                    }

                    return (
                        <TabPane
                            tab={subName}
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
                        onChange={(activeKey) => this.updateTabs({ activeKey })}
                        renderTabBar={()=><ScrollableInkTabBar />}
                        renderTabContent={()=><TabContent style={{ overflow: 'none' }} />}
                    >
                        { tabContent }
                    </Tabs>
                </div>
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
