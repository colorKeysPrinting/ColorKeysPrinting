import React                                from 'react';
import _                                    from 'lodash';
import { connect }                          from 'react-redux';
import { withCookies }                      from 'react-cookie';
import moment                               from 'moment';
import SearchInput                          from 'react-search-input';

import Select                               from 'components/select_box';
import filter                               from 'libs/filter';
import assets                               from 'libs/assets';

import { getUsers, approveUser, autoApproveUserOrders }            from 'ducks/users/actions';
import { getOrders }                        from 'ducks/orders/actions';
import { setActiveTab }                     from 'ducks/header/actions';

import MyTable                              from 'components/my_table';
import Overlay                              from 'components/overlay';
import Spinner                              from 'components/spinner';

class UsersPage extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            alert: null,
            searchTerm: '',
            sortby: {column: 'status', isAsc: 'desc' },
            headers: {
                id: '',
                name: 'Name',
                office: 'PM Office',
                email: 'Email',
                phoneNumber: 'Phone',
                createdAt: 'Account Created',
                autoApprovedOrders: 'Auto-approve',
                status: 'Status',
                action: ''
            },
            KEYS_TO_FILTERS: ['name','office','email','phoneNumber','createdAt','autoApprovedOrders','status']
        };

        this.handleAction = this.handleAction.bind(this);
        this.orderBy = this.orderBy.bind(this);
        this.focus = this.focus.bind(this);
    }

    componentWillMount() {
        const { cookies } = this.props;

        if (cookies.get('sibi-ge-admin')) {
            this.setState({ spinner: true });
            this.props.getUsers();
            this.props.getOrders();
        }
        this.props.setActiveTab('users');
    }

    componentWillUpdate(nextProps) {
        const { history, activeUser } = this.props;
        const { spinner } = this.state;

        if (!_.isEqual(nextProps.activeUser, activeUser)) {
            const path = (nextProps.activeUser.size > 0) ? `/users` : `/login`;
            history.push(path);
        }

        if (nextProps.zeroUsers) {
            this.setState({ spinner: false });
        }

        if (nextProps.users && nextProps.users.size > 0) {
            if (spinner &&
                activeUser.size > 0) {
                this.setState({ spinner: false });
            }
        }
    }

    handleAction(type, user) {
        let dialog;
        if (type === 'approve') {
            dialog = <div className="alert-box">
                <p>Are you sure you want to approve this user?</p>
                <div className="btn borderless" type="submit" value="Cancel" onClick={()=> this.setState({ alert: null }) } >Cancel</div>
                <div className="btn blue" type="submit" value="Approve" onClick={()=> this.props.approveUser({ id: user.id }) } >Approve</div>
            </div>
        }

        this.setState({
            alert: <Overlay type="alert" closeOverlay={()=>{this.setState({ alert: null }) }}>
                { dialog }
            </Overlay>
        });
    }

    orderBy({ column }) {
        this.setState((prevState) => {
            const isAsc = (column === prevState.sortby.column && prevState.sortby.isAsc === 'asc') ? 'desc' : 'asc';
            const sortby = { column, isAsc };

            return { sortby };
        });
    }

    focus() {
        // Explicitly focus the text input using the raw DOM API
        this.textInput.focus();
    }

    render() {
        const { activeUser, zeroUsers, users } = this.props;
        const { searchTerm, sortby, alert, headers, KEYS_TO_FILTERS, spinner } = this.state;
        let data = [], headersObj = {};

        if (users.size > 0 &&
            activeUser.size > 0) {
            const permissions = activeUser.get('permissions');

            _.each(headers, (header, key) => {
                headersObj[key] =  (key === 'id' || key === 'action') ? <div>{ header }</div> : <div onClick={() => this.orderBy({ column: key })} style={{cursor: 'pointer'}} >{ header }</div>;
            });

            data = users.map((user) => {
                const cols = {};
                _.each(headers, (value, key) => {
                    cols[key] = user.get(key);

                    if (key === 'id') {
                        cols[key] = user.get('id');

                    } else if (key === 'name') {
                        cols[key] = `${user.get('firstName')} ${user.get('lastName')}`;

                    } else if (key === 'office') {
                        cols[key] = (user.get('fundLocation')) ? user.getIn(['fundLocation','city']) : '';

                    } else if (key === 'email') {
                        cols[key] = (!_.isNull(user.get('email'))) ? user.get('email') : '';

                    } else if (key === 'createdAt') {
                        cols[key] = moment(new Date(user.get(key))).format('MMM DD, YYYY, HH:MM');

                    } else if (key === 'autoApprovedOrders') {
                        const autoApprovedOrders = (user.get('autoApprovedOrders')) ? true : false;

                        const options = [
                            { label: 'No', value: false },
                            { label: 'Yes', value: true }
                        ];

                        cols[key] = <Select
                            className="select-box"
                            name="auto-approved-orders-select"
                            user={user.toJS()}
                            value={autoApprovedOrders}
                            options={options}
                            onChange={({ user, value }) => this.props.autoApproveUserOrders({ user, autoApprovedOrders:  value })}
                            disabled={(permissions.get('manageAllUsers') || permissions.get('manageAllFundUsers') || permissions.get('manageAllManufacturerUsers')) ? false : true}
                        />;

                    } else if (key === 'status') {
                        cols[key] = (user['type'] === 'pending') ? 'Pending' : 'Approved';

                    } else if (key === 'action') {
                        if ((permissions.get('manageAllUsers') || permissions.get('manageAllFundUsers') || permissions.get('manageAllManufacturerUsers') || permissions.get('manageSubordinateUsers'))) {
                            cols[key] = (user['type'] === 'pending') ? 'approve' : '';
                        }
                    }
                });

                return cols;
            }).toJS()

            // this initially sets the "Pending" users before everything
            if(searchTerm !== '') {
                data = filter(searchTerm, KEYS_TO_FILTERS, data);
            }

            if (sortby.column !== '') {
                if(sortby.column !== 'autoApprovedOrders') {
                    data = _.orderBy(data, [sortby.column, 'createdAt'], [sortby.isAsc, 'desc']);
                } else {
                    // convert to sort
                    data = _.map(data, (item) => {
                        item.autoApprovedOrders = (item.autoApprovedOrders.props.value) ? 'Yes' : 'No';
                        return item;
                    });

                    // sort
                    data = _.orderBy(data, [sortby.column], [sortby.isAsc]);

                    const permissions = activeUser.get('permissions');
                    // convert back
                    data = _.map(data, (item) => {
                        const options = [
                            { label: 'No', value: false },
                            { label: 'Yes', value: true }
                        ];

                        const autoApprovedOrders = (item.autoApprovedOrders === 'Yes') ? true : false;
                        item.autoApprovedOrders = <Select
                            className="select-box"
                            name="auto-approved-orders-select"
                            value={autoApprovedOrders}
                            options={options}
                            onChange={(value) => this.handleAutoApprove({ user: item.id, autoApprovedOrders: value })}
                            disabled={(permissions.get('manageAllUsers') || permissions.get('manageAllFundUsers') || permissions.get('manageAllManufacturerUsers')) ? false : true}
                        />;
                        return item;
                    });
                }
            }
        }

        return (
            <div>
                <div id="users-page" className="container">
                    {(spinner) ? <Spinner /> : (!zeroUsers && _.size(data) > 0) ? (
                        <div className="table-card">
                            <div className="card-header">
                                <h2>Users</h2>
                                <div className="search-wrapper">
                                    <img src={assets('./images/icon-search.svg')} className="search-icon" onClick={this.focus} />
                                    <SearchInput className="search-input" onChange={(value) => this.setState({ searchTerm: value })} ref={(input) => { this.textInput = input; }} />
                                </div>
                            </div>
                            <MyTable
                                type="users"
                                headers={headersObj}
                                data={data}
                                sortby={sortby}
                                handleAction={this.handleAction}
                            />
                        </div>
                    ) : (
                        <div>
                            <h1>User Status</h1>
                            <p>There are currently no users to display</p>
                        </div>
                    )}
                </div>
                { alert }
            </div>
        );
    }
}

const select = (state) => ({
    activeUser : state.activeUser.get('activeUser'),
    users      : state.users.get('users'),
    zeroUsers  : state.users.get('zeroUsers'),
    activeTab  : state.header.get('activeTab'),
});

const action = {
    getUsers,
    getOrders,
    approveUser,
    autoApproveUserOrders,
    setActiveTab
}

export default connect(select, action, null, { withRef: true })(withCookies(UsersPage));
