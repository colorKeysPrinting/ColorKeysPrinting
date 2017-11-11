import React                                from 'react';
import { Switch, Route, Redirect, withRouter }  from 'react-router-dom';

import Home                                 from 'screens/home';

import NotFound                             from 'screens/not_found';

class Routes extends React.Component {
    render() {
        return (
            <div>
                <Switch>
                    <Redirect exact from='/' to={{ pathname: '/home' }} />
                    <Route exact path="/home" component={Home} />
                    <Route component={NotFound} />
                </Switch>
            </div>
        )
    }
}

export default withRouter(Routes);
