import React                                from 'react';
import _                                    from 'lodash';
import { connect }                          from 'react-redux';
import { withCookies }                      from 'react-cookie';
import { withRouter }                       from 'react-router';
import { Link }                             from 'react-router-dom';
import Tabs, { TabPane }                    from 'rc-tabs';
import TabContent                           from 'rc-tabs/lib/TabContent';
import ScrollableInkTabBar                  from 'rc-tabs/lib/ScrollableInkTabBar';
import assets                               from 'libs/assets';

import { getUserProductCategories, getProductsForSubCategory, unarchiveProduct }          from 'ducks/products/actions';
import { setActiveTab }                     from 'ducks/header/actions';

import MyTable                              from 'components/my_table';
import Spinner                              from 'components/spinner';

class ProductsPage extends React.Component {
    constructor(props) {
        super(props);

        this.state = { activeKey: '0', activeSubKey: '0'};
        this.updateTabs = this.updateTabs.bind(this);
    }

    componentWillMount() {
        const { cookies, activeUser, locaction } = this.props;

        if (cookies.get('sibi-ge-admin')) {
            this.props.getUserProductCategories({ category: jwt.trade }); // need to update this to account for the activeUser trade
        }

        if (this.props.match.params) {
            // TODO: need to update this to use the pararms
            let activeKey = /tab=(\d{1})/.exec(location.search);
            let activeSubKey = /subTab=(\d{1})/.exec(location.search);

            activeKey = (activeKey) ? activeKey[1] : '0';
            activeSubKey = (activeSubKey) ? activeSubKey[1] : '0';
            this.setState({ activeKey, activeSubKey });
        }

        this.props.setActiveTab('products');
    }

    componentWillUpdate(nextProps) {
        const { history, activeUser, productCategories } = this.props;

        if (!_.isEqual(nextProps.activeUser, activeUser)) {
            const path = (nextProps.activeUser.size > 0) ? `/products` : `/login`;
            history.push(path);
        }

        if (!_.isEqual(productCategories, nextProps.productCategories)) {

            _.each(nextProps.productCategories.toJS(), (category) => {
                _.each(category.subcategories, (subCategory) => {
                    if (subCategory.containedSubCategories) {
                        _.each(subCategory.containedSubCategories, (subSubCategory) => {
                            this.props.getProductsForSubCategory({ category: category.name, subCategory, subSubCategory });
                        });
                    } else {
                        this.props.getProductsForSubCategory({ category: category.name, subCategory });
                    }
                });
            });
        }
    }

    updateTabs({ activeKey, activeSubKey }) {
        const { history } = this.props;
        (activeKey) ? this.setState({ activeKey }) : null;
        (activeSubKey) ? this.setState({ activeSubKey }) : null;

        history.push({pathname: `/products/${(activeKey) ? `tab=${activeKey}` : ''}${(activeSubKey) ? `,subTab=${activeSubKey}` : ''}` })
    }

    render() {
        const { cookies, products, productCategories, productSubCategories, productsInCategory, activeUser } = this.props;

        return (
            <div id="products-page" className="container">
                { (activeUser.size > 0 &&
                    productCategories.size > 0 &&
                    productSubCategories.size > 0 &&
                    productsInCategory.size > 0) ? <div>
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
                                { _.map(productCategories.toJS(), (category) => {
                                    return _.map(category.subcategories, (subCategory, index) => {
                                        const subName = subCategory.name;

                                        return (
                                            <TabPane
                                                tab={subName}
                                                key={index}
                                            >
                                                { (subCategory.containedSubCategories) ? (
                                                    <Tabs
                                                        tabBarPosition="top"
                                                        activeKey={this.state.activeSubKey}
                                                        onChange={(activeSubKey) => this.updateTabs({ activeKey: this.state.activeKey, activeSubKey })}
                                                        renderTabBar={()=><ScrollableInkTabBar />}
                                                        renderTabContent={()=><TabContent style={{ overflow: 'none' }} />}
                                                    >
                                                        {  _.map(subCategory.containedSubCategories, (subSubCategory, subIndex) => {
                                                            const subSubName = subSubCategory.name;

                                                            return (
                                                                <TabPane
                                                                    tab={subSubName}
                                                                    key={subIndex}
                                                                >
                                                                    <MyTable
                                                                        className="products-table"
                                                                        type="products"
                                                                        tab={subSubName}
                                                                        data={productsInCategory.getIn([category.name,subName,subSubName]).map((product) => {
                                                                            const cols = {};

                                                                            _.each(['id','name','featured','action'], (key) => {
                                                                                let value = product[key];

                                                                                if (key === 'id') {
                                                                                    value = { ...product, category: category.id, subCategory: subCategory.id, subSubCategory: subSubCategory.id };

                                                                                } else if (key === 'action') {
                                                                                    const jwt = cookies.get('sibi-ge-admin');

                                                                                    value = (product.archived) ? <div onClick={() => this.props.unarchiveProduct({ category: jwt.trade, id: product.id }) } className="product-action">Unarchive</div>
                                                                                        : <Link to={{ pathname: `/edit_product/${product.id}` }} className="product-action">Edit</Link>;

                                                                                } else if (key === 'featured') {
                                                                                    if (product.sortIndex <= 4) {
                                                                                        value = <div className="featured-column">Featured {product.sortIndex + 1}</div>;
                                                                                    }
                                                                                }

                                                                                cols[key] = value;
                                                                            });

                                                                            return cols;
                                                                        })}
                                                                    />
                                                                </TabPane>
                                                            );
                                                        }) }
                                                    </Tabs>
                                                ) : (
                                                    <MyTable
                                                        className="products-table"
                                                        type="products"
                                                        tab={subName}
                                                        data={productsInCategory.getIn([category.name,subName]).map((product) => {
                                                            const cols = {};

                                                            _.each(['id','name','featured','action'], (key) => {
                                                                let value = product[key];

                                                                if (key === 'id') {
                                                                    value = { ...product, category: category.id, subCategory: subCategory.id };

                                                                } else if (key === 'action') {

                                                                    value = (product.archived) ? <div onClick={() => this.props.unarchiveProduct({ category: category.name, subCategory: subName, id: product.id }) } className="product-action">Unarchive</div>
                                                                        : <Link to={{ pathname: `/edit_product/${product.id}` }} className="product-action">Edit</Link>;

                                                                } else if (key === 'featured') {
                                                                    if (product.sortIndex <= 4) {
                                                                        value = <div className="featured-column">featured {product.sortIndex + 1}</div>;
                                                                    }
                                                                }

                                                                cols[key] = value;
                                                            });

                                                            return cols;
                                                        })}
                                                    />
                                                ) }
                                            </TabPane>
                                        );
                                    });
                                }) }
                            </Tabs>
                        </div>
                    </div> : <Spinner/> }
            </div>
        );
    }
}

const select = (state) => ({
    activeUser              : state.activeUser.get('activeUser'),
    productsInCategory      : state.products.get('productsInCategory'),
    productCategories       : state.products.get('productCategories'),
    productSubCategories    : state.products.get('productSubCategories')
});

const actions = {
    getUserProductCategories,
    getProductsForSubCategory,
    unarchiveProduct,
    setActiveTab
};

export default connect(select, actions, null, { withRef: true })(withRouter(withCookies(ProductsPage)));
