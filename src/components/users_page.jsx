import React                    from 'react';
import _                        from 'lodash';
import { connect }              from 'react-redux';
import { browserHistory, Link } from 'react-router';
import { withCookies }          from 'react-cookie';
import dateformat               from 'dateformat';
import assets                   from 'libs/assets';

import { showOverlay }          from 'actions/application';
import { logout }               from 'actions/header';
import { getUsers, approveUser }    from 'actions/users';

import MyTable                  from './common/my_table';

class UsersPage extends React.Component {
    constructor(props) {
        super(props);

        this.handleAction = this.handleAction.bind(this);
    }

    componentWillMount() {
        const { cookies } = this.props;
        const jwt = cookies.get('sibi-admin-jwt');

        if (jwt) {
            // const re = /@((?:(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?|\[(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?|[a-z0-9-]*[a-z0-9]:(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21-\x5a\x53-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])+)\]))/
            // const emailDomain = re.exec(jwt.email);
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

    handleAction({ item }) {
        console.log('user action:', item.id);
        const { cookies } = this.props;
        const jwt = cookies.get('sibi-admin-jwt');

        this.props.approveUser({ token: jwt.token, id: item.id });
    }

    render() {
        let data = [];

        const { cookies } = this.props;
        const jwt = cookies.get('sibi-admin-jwt');
        const headers = { id: '', name: 'Name', office: 'PM Office', email: 'Email', phoneNumber: 'Phone', createdAt: 'Acount Created', status: 'Status', action: '' };

        if (this.props.users.size > 0 ) {

            const users = this.props.users.toJS();

            data = _.map(users, (user) => {
                const cols = {};

                _.each(headers, (value, key) => {
                    value = user[key];

                    if (key === 'id') {
                        value = user.id;

                    } else if (key === 'name') {
                        value = `${user['firstName']} ${user['lastName']}`;

                    } else if (key === 'office') {
                        value = user.fundLocation.city

                    } else if (key === 'email') {
                        value = user['email'];

                    } else if (key === 'createdAt') {
                        value = dateformat(new Date(value), 'mmmm dd, yyyy');

                    } else if (key === 'status') {
                        value = (user['type'] === 'pending') ? 'Pending' : 'Approved';

                    } else if (key === 'action') {
                        value = (user['type'] === 'pending') ? 'approve' : '';
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
                    headers={headers}
                    data={data}
                    handleAction={this.handleAction}
                />
            </div>
        );
    }
}

const select = (state) => ({
    users           : state.application.get('users')
});

export default connect(select, { showOverlay, getUsers, approveUser }, null, { withRef: true })(withCookies(UsersPage));