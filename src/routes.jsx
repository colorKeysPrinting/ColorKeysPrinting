import React                                from 'react';
import { BrowserRouter as Router, Switch, Route }  from 'react-router-dom';

import HeaderBar                            from 'components/header_bar';
import Home                                 from 'screens/home';
import NotFound                             from 'screens/not_found';

export default (
    <Router>
        <div>
            <HeaderBar />
            <Switch>
                <Route component={Home} />
                <Route component={NotFound} />
            </Switch>
        </div>
    </Router>
)
