// if you use jsx, you have to import React
import React                               from 'react';
import { BrowserRouter as Router, Switch, Route }  from 'react-router-dom';

import HeaderBar                           from 'components/header_bar';
import Home                                from 'screens/home';
import OrdersPage                          from 'screens/orders_page';
import UsersPage                           from 'screens/users_page';
import ProductsPage                        from 'screens/products_page';
import PropertiesPage                      from 'screens/properties_page';
import DashboardPage                       from 'screens/dashboard_page';
import OrderDetails                        from 'screens/order_details';
import PropertyDetails                     from 'screens/property_details';
import NewOrderPage                        from 'screens/new_order_page';
import ProcessOrderPage                    from 'screens/process_order_page';
import EditProductPage                     from 'screens/edit_product_page';
import LoginOverlay                        from 'screens/login';

import NotFound                            from 'screens/not_found';

export default (
    <Router>
        <div>
            <HeaderBar />
            <Switch>
                <Route exact path="/orders" component={OrdersPage} />
                <Route exact path="/users" component={UsersPage} />
                <Route exact path="/products/:tab,:subTab" component={ProductsPage} />
                <Route exact path="/properties" component={PropertiesPage} />
                <Route exact path="/property_details/:id" component={PropertyDetails} />
                <Route exact path="/dashboard" component={DashboardPage} />
                <Route exact path="/order_details/:id" component={OrderDetails} />
                <Route exact path="/new_order" component={NewOrderPage} />
                <Route exact path="/login" component={LoginOverlay} />
                <Route exact path="/process_order/:id" component={ProcessOrderPage} />
                <Route exact path="/edit_product/:id" component={EditProductPage} />
                <Route component={NotFound} />
            </Switch>
        </div>
    </Router>
)
