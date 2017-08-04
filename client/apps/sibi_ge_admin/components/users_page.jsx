import React                    from 'react';
import _                        from 'lodash';
import { connect }              from 'react-redux';
import { browserHistory, Link } from 'react-router';
import { withCookies }          from 'react-cookie';
import assets                   from '../libs/assets';

import { showOverlay }          from '../actions/application';
import { logout }               from '../actions/header';
import { getUsers }      from '../actions/users';

import MyTable                  from './common/my_table';

class UsersPage extends React.Component {

    componentWillMount() {
        const { cookies } = this.props;
        const jwt = cookies.get('sibi-admin-jwt');

        if (jwt) {
            this.props.getUsers({ token: jwt.token });
        } else {
            console.log('TODO: trigger logout function *** no JWT ***');
        }
    }

    componentWillUpdate(nextProps) {
        if (nextProps.activeUser) {
            const path = (nextProps.activeUser.size > 0) ? `/users` : `/`;
            browserHistory.push(path);
        }

        if (nextProps.isLogout) {
            this.props.logout();
        }
    }

    render() {
        let data = [];

        const { cookies } = this.props;
        const jwt = cookies.get('sibi-admin-jwt');
        const headers = { name: 'Name', office: 'PM Office', email: 'Email', phone: 'Phone', createdAt: 'Acount Created', status: 'Status' };

        if (this.props.users.size > 0) {

            const users = this.props.users.toJS();

            data = _.map(users, (user) => {
                const cols = {};

                _.each(headers, (value, key) => {
                    value = user[key];

                    if (key === 'name') {
                        value = `${user['firstName']} ${user['lastName']}`;

                    } else if (key === 'email') {
                        value = user['email'];

                    } else if (key === 'status') {
                        value = (user['type'] === 'Pending') ? 'Pending' : 'Approved';
                    }

                    cols[key] = value;
                });

                return cols;
            });

            // this initially sets the "Pending" users before everything
            data = _.partition(data, ['status', 'Pending']);
            data = data[0].concat(data[1]);
        }

        return (
            <div id="orders-page" >
                <MyTable
                    type="users"
                    token={jwt.token}
                    headers={headers}
                    data={data}
                />
            </div>
        );
    }
}

const select = (state) => ({
    users          : state.application.get('users')
});

export default connect(select, { showOverlay, getUsers }, null, { withRef: true })(withCookies(UsersPage));