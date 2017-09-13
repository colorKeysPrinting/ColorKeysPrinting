// if you use jsx, you have to import React
import React                               from 'react';
import { BrowserRouter as Router, Route }  from 'react-router-dom';

import HeaderBar                           from 'components/header_bar';
import Home                                from 'screens/home';
import OrdersPage                          from 'screens/orders_page';
import UsersPage                           from 'screens/users_page';
import ProductsPage                        from 'screens/products_page';
import DashboardPage                       from 'screens/dashboard_page';
import OrderDetails                        from 'screens/order_details';
import NewOrderPage                        from 'screens/new_order_page';
import ProcessOrderPage                    from 'screens/process_order_page';
import EditProductPage                     from 'screens/edit_product_page';
import LoginOverlay                        from 'screens/login';

import NotFound                            from 'screens/not_found';

export default (
    <Router>
        <div>
            <HeaderBar />
            {/* <Route path="/" component={Home} /> */}
            <Route path="/orders" component={OrdersPage} />
            <Route path="/users" component={UsersPage} />
            <Route path="/products" component={ProductsPage} />
            <Route path="/dashboard" component={DashboardPage} />
            <Route path="/order_details" component={OrderDetails} />
            <Route path="/new_order" component={NewOrderPage} />
            <Route path="/process_order" component={ProcessOrderPage} />
            <Route path="/edit_product" component={EditProductPage} />

            <Route path="/login" component={LoginOverlay} />
        </div>
    </Router>
)
