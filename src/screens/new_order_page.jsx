import React                                from 'react';
import _                                    from 'lodash';
import { connect }                          from 'react-redux';
import { withCookies }                      from 'react-cookie';
import Iframe                               from 'react-iframe';

import { logout }                           from 'ducks/active_user/actions';
import { getUsers, getFundProperties }      from 'ducks/users/actions';
import { setActiveTab }                     from 'ducks/header/actions';

class NewOrderPage extends React.Component {

    componentWillMount() {
        this.props.setActiveTab('newOrder');
    }

    render() {
        const { cookies } = this.props;
        const jwt = cookies.get('sibi-admin-jwt');

        return (
            <Iframe
                url={`https://sibi-ge-dev.netlify.com/new?authToken=${jwt.token}`}
                width="100%"
                height="100%"
                allowFullScreen
            />
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