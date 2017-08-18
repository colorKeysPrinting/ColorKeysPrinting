import React                                from 'react';
import _                                    from 'lodash';
import { connect }                          from 'react-redux';
import { withCookies }                      from 'react-cookie';

import { logout }                           from 'ducks/active_user/actions';
import { getUsers, getFundProperties }      from 'ducks/users/actions';
import { setActiveTab }                     from 'ducks/header/actions';

import InfoCard                             from 'components/info_card';

class DashboardPage extends React.Component {

    componentWillMount() {
        const { cookies } = this.props;
        const jwt = cookies.get('sibi-admin-jwt');

        if (jwt) {
            console.log('TODO: get dashboard data');
        } else {
            console.log('TODO: trigger logout function *** no JWT ***');
        }

        this.props.setActiveTab('dashboard');
    }

    componentWillUpdate(nextProps) {

        if (nextProps.isLogout) {
            this.props.logout();
        }
    }

    render() {
        return (
            <div id="dashboard-page" >
                <InfoCard />
            </div>
        );
    }
}

const select = (state) => ({
    activeUser      : state.activeUser.get('activeUser'),
    users           : state.users.get('users'),
    fundProperties  : state.users.get('fundProperties'),
});

const actions = {
    logout,
    getUsers,
    getFundProperties,
    setActiveTab
}

export default connect(select, actions, null, { withRef: true })(withCookies(DashboardPage));