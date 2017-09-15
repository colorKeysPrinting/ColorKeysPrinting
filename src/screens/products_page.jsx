import React                                from 'react';
import _                                    from 'lodash';
import { connect }                          from 'react-redux';
import { withCookies }                      from 'react-cookie';
import { withRouter }                       from 'react-router';
import Tabs, { TabPane }                    from 'rc-tabs';
import TabContent                           from 'rc-tabs/lib/TabContent';
import ScrollableInkTabBar                  from 'rc-tabs/lib/ScrollableInkTabBar';
// import { Tab, Tabs, TabList, TabPanel }     from 'react-tabs';
import assets                               from 'libs/assets';

import { logout }                           from 'ducks/active_user/actions';
import { getProducts, getProductCategories, getProductsForSubCategory, unarchiveProduct }          from 'ducks/products/actions';
import { setActiveTab }                     from 'ducks/header/actions';

import MyTable                              from 'components/my_table';
import EditProduct                          from 'components/edit_product';

class ProductsPage extends React.Component {
    constructor(props) {
        super(props);

        this.state = { isEditShowing: false, sortIndex: 0, product: '', category: '', activeKey: '0'};

        this.showEditBox = this.showEditBox.bind(this);
    }
    componentWillMount() {
        const { cookies, activeUser } = this.props;
        const jwt = cookies.get('sibi-admin-jwt');

        if (jwt) {
            this.props.getProductCategories({ token: jwt.token });
        } else {
            this.props.history.push(`/login`);
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

    showEditBox({ sortIndex, product, category }) {
        this.setState((prevState) => {
            const isEditShowing = (prevState.isEditShowing) ? false : true;
            return { isEditShowing, sortIndex, product, category };
        });
    }

    render() {
        let tabs, tabContent, addBtn, pageContent, editProductSection;

        const { cookies } = this.props;
        const jwt = cookies.get('sibi-admin-jwt');

        if (this.props.productCategories.size > 0 &&
            this.props.products.size > 0) {

            const productCategories = this.props.productCategories.toJS();
            const products = this.props.products.toJS();

            addBtn = <div className="btn blue" onClick={() => this.showEditBox({ sortIndex: _.size(products[productCategories[0].name]) })}>Add</div>;

            tabContent = _.map(productCategories, (type, index) => {
                const name = type.name;

                const data = _.map(products[name], (product) => {
                    const cols = {};

                    _.each(['id','name','featured','action'], (key) => {
                        let value = product[key];

                        if (key === 'id') {
                            value = { ...product, category: type.id };

                        } else if (key === 'action') {
                            value = (product.archived) ? <div onClick={() => this.props.unarchiveProduct({ token: jwt.token, category: name, id: product.id }) } className="product-action">Unarchive</div>
                                : <div className="product-action" onClick={() => this.showEditBox({ category: type.id, product })}>Edit</div>;

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
                        tab={name}
                        key={index}
                    >
                        <MyTable
                            className="products-table"
                            type="products"
                            tab={name}
                            data={data}
                        />
                    </TabPane>
                );
            });


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
                    <Tabs
                        tabBarPosition="top"
                        activeKey={this.state.activeKey}
                        onChange={(activeKey) => {console.log('onChange - activeKey', activeKey); this.setState({ activeKey })}}
                        renderTabBar={()=><ScrollableInkTabBar />}
                        renderTabContent={()=><TabContent />}
                    >
                        { tabContent }
                    </Tabs>
                </div>
                { editProductSection }
            </div>
        }

        return (
            <div id="products-page" className="container">
                { pageContent }
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
