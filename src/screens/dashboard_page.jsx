import React                                from 'react';
import _                                    from 'lodash';
import { connect }                          from 'react-redux';
import { withCookies }                      from 'react-cookie';

import { getUsers }                         from 'ducks/users/actions';
import { getFundProperties }                from 'ducks/properties/actions';
import { setActiveTab }                     from 'ducks/header/actions';

import InfoCard                             from 'components/info_card';

class DashboardPage extends React.Component {

    componentWillMount() {
        const { cookies } = this.props;
        const jwt = cookies.get('sibi-ge-admin');

        if (jwt) {
            console.log('TODO: get dashboard data');
        }

        this.props.setActiveTab('dashboard');
    }

    render() {
        return (
            <div id="dashboard-page" className="container">
                <InfoCard />
            </div>
        );
    }
}

const select = (state) => ({
    activeUser      : state.activeUser.get('activeUser'),
    users           : state.users.get('users'),
    fundProperties  : state.properties.get('fundProperties'),
});

const actions = {
    getUsers,
    getFundProperties,
    setActiveTab
}

export default connect(select, actions, null, { withRef: true })(withCookies(DashboardPage));