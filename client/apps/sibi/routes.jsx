// if you use jsx, you have to import React
import React                          from 'react';
import { Router, Route, IndexRoute }  from 'react-router';

import appHistory                     from './history';
import Index                          from './components/layout/index';
import Home                           from './components/home';
import SignUp                         from './components/sign_up';
import Products                       from './components/products';
import NotFound                       from './components/common/not_found';

export default (
  <Router history={appHistory}>
    <Route path="/" component={Index}>
      <IndexRoute component={Home} />
    </Route>
    <Route path="/signup" component={Index}>
      <IndexRoute component={SignUp} />
    </Route>
    <Route path="/products" component={Index}>
      <IndexRoute component={Products} />
    </Route>
    <Route path="*" component={NotFound} />
  </Router>
);
