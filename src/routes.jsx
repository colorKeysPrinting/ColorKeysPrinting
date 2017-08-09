// if you use jsx, you have to import React
import React                            from 'react';
import { Router, browserHistory, Route, IndexRoute }    from 'react-router';

import Index                            from './components/layout/index';
import Home                             from './components/home';
import OrdersPage                       from './components/orders_page';
import UsersPage                        from './components/users_page';
import ProductsPage                     from './components/products_page';
import OrderDetails                     from './components/order_details';
import NotFound                         from './components/common/not_found';

export default () => {
    return (
        <Router history={browserHistory}>
            <Route path="/" component={Index}>
                <IndexRoute component={Home} />
            </Route>
            <Route path="/orders" component={Index}>
                <IndexRoute component={OrdersPage} />
            </Route>
            <Route path="/users" component={Index}>
                <IndexRoute component={UsersPage} />
            </Route>
            <Route path="/products" component={Index}>
                <IndexRoute component={ProductsPage} />
            </Route>
            <Route path="/order_details" component={Index}>
                <IndexRoute component={OrderDetails} />
            </Route>
            <Route path="*" component={NotFound} />
        </Router>
    )
}
