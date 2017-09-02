import React                                from 'react';
import _                                    from 'lodash';
import { connect }                          from 'react-redux';
import { withCookies }                      from 'react-cookie';
import dateformat                           from 'dateformat';
import SearchInput                          from 'react-search-input';
import Select                               from 'components/select_box';
import filter                               from 'libs/filter';

import { logout }                           from 'ducks/active_user/actions';
import { getUsers, approveUser, autoApproveUserOrders }            from 'ducks/users/actions';
import { setActiveTab }                     from 'ducks/header/actions';

import MyTable                              from 'components/my_table';

class UsersPage extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            searchTerm: '',
            sortby: {column: '', isAsc: false }
        };

        this.update = this.update.bind(this);
        this.handleAction = this.handleAction.bind(this);
        this.handleAutoApprove = this.handleAutoApprove.bind(this);
        this.orderBy = this.orderBy.bind(this);
    }

    componentWillMount() {
        const { cookies, activeUser } = this.props;
        const jwt = cookies.get('sibi-admin-jwt');

        if (activeUser) {
            const path = (activeUser.size > 0) ? `/users` : `/login`;
            this.props.history.push(path);
        }

        if (jwt) {
            // const re = /@((?:(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?|\[(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?|[a-z0-9-]*[a-z0-9]:(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21-\x5a\x53-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])+)\]))/
            // const emailDomain = re.exec(jwt.email);
            this.props.getUsers({ token: jwt.token });

        } else {
            console.log('TODO: trigger logout function *** no JWT ***');
        }

        this.props.setActiveTab('users');
    }

    componentWillUpdate(nextProps) {
        if (!_.isEqual(nextProps.activeUser, this.props.activeUser)) {
            const path = (nextProps.activeUser.size > 0) ? `/users` : `/login`;
            this.props.history.push(path);
        }
    }

    update({ type, value }) {
        this.setState({ [type]: value });
    }

    handleAction({ item }) {
        console.log('user action:', item.id);
        const { cookies } = this.props;
        const jwt = cookies.get('sibi-admin-jwt');

        this.props.approveUser({ token: jwt.token, id: item.id });
    }

    handleAutoApprove({ user, autoApprovedOrders }) {
        console.log('auto approve');
        const { cookies } = this.props;
        const jwt = cookies.get('sibi-admin-jwt');

        this.props.autoApproveUserOrders({ token: jwt.token, user, autoApprovedOrders });
    }

    orderBy({ column }) {
        this.setState((prevState) => {
            const isAsc = (column === prevState.sortby.column && prevState.sortby.isAsc !== 'asc') ? 'asc' : 'desc';
            const sortby = { column, isAsc };

            return { sortby };
        });
    }

    render() {
        let data = [];

        const headers = {
            id: '',
            name: 'Name',
            office: 'PM Office',
            email: 'Email',
            phoneNumber: 'Phone',
            createdAt: 'Acount Created',
            autoApprovedOrders: 'Auto-approve',
            status: 'Status',
            action: ''
        };

        const KEYS_TO_FILTERS = ['name','office','email','phoneNumber','createdAt','autoApprovedOrders','status'];

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

                    } else if (key === 'autoApprovedOrders') {
                        const autoApprovedOrders = (user.autoApprovedOrders) ? true : false;

                        const options = [
                            { label: 'No', value: false },
                            { label: 'Yes', value: true }
                        ];

                        value = <div><Select
                            name="auto-approved-orders-select"
                            value={autoApprovedOrders}
                            options={options}
                            onChange={(autoApprovedOrders) => this.handleAutoApprove({ user, autoApprovedOrders })}
                        /></div>;

                    } else if (key === 'status') {
                        value = (user['type'] === 'pending') ? 'Pending' : 'Approved';

                    } else if (key === 'action') {
                        value = (user['type'] === 'pending') ? 'approve' : '';
                    }

                    cols[key] = value;
                });

                return cols;
            });

            _.each(headers, (header, key) => {
                let value;

                if (key === 'id' || key === 'action') {
                    value = header;

                } else {
                    value = <div onClick={() => this.orderBy({ column: key })} style={{cursor: 'pointer'}} >{ header }</div>;
                }

                headers[key] = value;
            });

            // this initially sets the "Pending" users before everything
            if(this.state.searchTerm !== '') {
                data = filter(this.state.searchTerm, KEYS_TO_FILTERS, data);
            }

            if (this.state.sortby.column === '') {
                data = _.partition(data, ['status', 'Pending']);
                data = data[0].concat(data[1]);

            } else {
                data = _.orderBy(data, [this.state.sortby.column], [this.state.sortby.isAsc]);
            }
        }

        return (
            <div id="users-page" className="container">
                <div className="table-card">
                    <div className="card-header">
                        <h2>Users</h2>
                        <div className="search-bar">
                            <SearchInput onChange={(value) => this.update({ type: 'searchTerm', value })} />
                        </div>
                    </div>
                    <MyTable
                        type="users"
                        headers={headers}
                        data={data}
                        handleAction={this.handleAction}
                    />
                </div>
            </div>
        );
    }
}

const select = (state) => ({
    activeUser      : state.activeUser.get('activeUser'),
    users           : state.users.get('users')
});

const action = {
    getUsers,
    approveUser,
    autoApproveUserOrders,
    setActiveTab
}

export default connect(select, action, null, { withRef: true })(withCookies(UsersPage));
