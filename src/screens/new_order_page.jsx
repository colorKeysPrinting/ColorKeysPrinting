import React                                from 'react';
import _                                    from 'lodash';
import { connect }                          from 'react-redux';
import { withCookies }                      from 'react-cookie';

import { logout }                           from 'ducks/active_user/actions';
import { getUsers, getFundProperties }      from 'ducks/users/actions';
import { setActiveTab }                     from 'ducks/header/actions';

class NewOrderPage extends React.Component {

    componentWillMount() {
        const { cookies } = this.props;
        const jwt = cookies.get('sibi-admin-jwt');

        if (jwt) {
            console.log('TODO: get new orders data');
        } else {
            console.log('TODO: trigger logout function *** no JWT ***');
        }

        this.props.setActiveTab('newOrder');
    }

    componentWillUpdate(nextProps) {
        if (!_.isEqual(nextProps.activeUser, this.props.activeUser)) {
            const path = (nextProps.activeUser.size > 0) ? `/new_order` : `/`;
            this.props.history.push(path);
        }

        if (nextProps.isLogout) {
            this.props.logout();
        }
    }

    render() {
        return (
            <div id="new-orders-page" >
                <div>This page is currently under development</div>
            </div>
        );
    }
}

const select = (state) => ({
    activeUser      : state.activeUser.get('activeUser')
});

const actions = {
    logout,
    getUsers,
    getFundProperties,
    setActiveTab
}

export default connect(select, actions, null, { withRef: true })(withCookies(NewOrderPage));