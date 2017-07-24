// if you use jsx, you have to import React
import React                          from 'react';
import { Router, Route, IndexRoute }  from 'react-router';

import appHistory                     from './history';
import Index                          from './components/layout/index';
import Home                           from './components/home';
import ProductsPage                   from './components/products_page';
import ProductDetails                 from './components/product_details';
import NotFound                       from './components/common/not_found';

export default (
    <Router history={appHistory}>
        <Route path="/" component={Index}>
            <IndexRoute component={Home} />
        </Route>
        <Route path="/products(/:activePage/:id)" component={Index}>
            <IndexRoute component={ProductsPage} />
        </Route>
        <Route path="/product-details/:id" component={Index}>
            <IndexRoute component={ProductDetails} />
        </Route>
        <Route path="*" component={NotFound} />
    </Router>
);
