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
        const { cookies, activeUser } = this.props;
        const jwt = cookies.get('sibi-ge-admin');

        this.props.setActiveTab('new_order');
    }

    componentWillUpdate(nextProps) {
        if (!_.isEqual(nextProps.activeUser, this.props.activeUser)) {
            const path = (nextProps.activeUser.size > 0) ? `/new_order` : `/login`;
            this.props.history.push(path);
        }
    }

    render() {
        let iFrame;
        const { cookies } = this.props;
        const jwt = cookies.get('sibi-ge-admin');
        const height = (window.innerHeight - 69);
        const width = window.innerWidth;

        if(jwt) {
            iFrame = <Iframe
                url={`${process.env.ORDER_URL}/new?authToken=${jwt.token}`}
                width={`${width}`}
                height={`${height}`}
                position="relative"
                allowFullScreen
            />
        }

        return (
            <div style={{ position: 'absolute', top: '69px', height, width }}>
                { iFrame }
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