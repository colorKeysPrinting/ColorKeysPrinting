// if you use jsx, you have to import React
import React                            from 'react';
import { Router, Route, IndexRoute }    from 'react-router';

import appHistory                       from './history';
import Index                            from './components/layout/index';
import Home                             from './components/home';
import OrderPage                        from './components/order_page';
import UsersPage                        from './components/users_page';
import ProductsPage                     from './components/products_page';
import OrderDetails                     from './order_details';
import NotFound                         from './components/common/not_found';

export default (
    <Router history={appHistory}>
        <Route path="/" component={Index}>
            <IndexRoute component={Home} />
        </Route>
        <Route path="/orders" component={Index}>
            <IndexRoute component={OrderPage} />
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
);
