import React                                from 'react';
import _                                    from 'lodash';
import { connect }                          from 'react-redux';
import { withCookies }                      from 'react-cookie';
import moment                               from 'moment';
import SearchInput                          from 'react-search-input';
import Loader                               from 'react-loader';

import Select                               from 'components/select_box';
import filter                               from 'libs/filter';
import assets                               from 'libs/assets';

import { triggerSpinner }                   from 'ducks/ui/actions';
import { getUsers, approveUser, autoApproveUserOrders }            from 'ducks/users/actions';
import { setActiveTab }                     from 'ducks/header/actions';

import MyTable                              from 'components/my_table';
import Overlay                              from 'components/overlay';

class UsersPage extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            alert: null,
            searchTerm: '',
            sortby: {column: 'status', isAsc: 'desc' }
        };

        this.update = this.update.bind(this);
        this.handleAction = this.handleAction.bind(this);
        this.orderBy = this.orderBy.bind(this);
        this.focus = this.focus.bind(this);
    }

    componentWillMount() {
        const { cookies, activeUser } = this.props;
        const jwt = cookies.get('sibi-admin-jwt');

        if (jwt) {
            this.props.triggerSpinner({ isOn: true });
            this.props.getUsers({ token: jwt.token, type: jwt.type });

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

    handleAction({ token, type, item }) {
        let dialog;
        if (type === 'approve') {
            dialog = <dialog open className="alert-box">
                <div>
                    <p>Are you sure you want to approve this user?</p>
                    <div className="btn borderless" type="submit" value="Cancel" onClick={()=> this.setState({ alert: null }) } >Cancel</div>
                    <div className="btn blue" type="submit" value="Approve" onClick={()=> this.props.approveUser({ token, id: item.id }) } >Approve</div>
                </div>
            </dialog>
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
        const { cookies, users, spinner } = this.props;
        const jwt = cookies.get('sibi-admin-jwt');
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

        if (users.size > 0 ) {

            data = _.map(users.toJS(), (user) => {
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
                        value = moment(new Date(value)).format('MMM DD, YYYY');

                    } else if (key === 'autoApprovedOrders') {
                        const autoApprovedOrders = (user.autoApprovedOrders) ? true : false;

                        const options = [
                            { label: 'No', value: false },
                            { label: 'Yes', value: true }
                        ];

                        value = <Select
                            name="auto-approved-orders-select"
                            user={user}
                            value={autoApprovedOrders}
                            options={options}
                            onChange={({ user, value }) => this.props.autoApproveUserOrders({ token: jwt.token, user, autoApprovedOrders:  value })}
                        />;

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
                headers[key] =  (key === 'id' || key === 'action') ? header : <div onClick={() => this.orderBy({ column: key })} style={{cursor: 'pointer'}} >{ header }</div>;
            });

            // this initially sets the "Pending" users before everything
            if(this.state.searchTerm !== '') {
                data = filter(this.state.searchTerm, KEYS_TO_FILTERS, data);
            }

            if(this.state.sortby.column !== 'autoApprovedOrders') {
                data = _.orderBy(data, [this.state.sortby.column, 'createdAt'], [this.state.sortby.isAsc, 'desc']);
            } else {
                // convert to sort
                data = _.map(data, (item) => {
                    item.autoApprovedOrders = (item.autoApprovedOrders.props.value) ? 'Yes' : 'No';
                    return item;
                });

                // sort
                data = _.orderBy(data, [this.state.sortby.column], [this.state.sortby.isAsc]);

                // convert back
                data = _.map(data, (item) => {
                    const options = [
                        { label: 'No', value: false },
                        { label: 'Yes', value: true }
                    ];

                    const autoApprovedOrders = (item.autoApprovedOrders === 'Yes') ? true : false;
                    item.autoApprovedOrders = <Select
                        name="auto-approved-orders-select"
                        value={autoApprovedOrders}
                        options={options}
                        onChange={(value) => this.handleAutoApprove({ user: item.id, autoApprovedOrders: value })}
                    />;
                    return item;
                });
            }

            this.props.triggerSpinner({ isOn: false });
        }

        return (
            <Loader loaded={spinner} >
                <div id="users-page" className="container">
                    <div className="table-card">
                        <div className="card-header">
                            <h2>Users</h2>
                            <div className="search-wrapper">
                                <img src={assets('./images/icon-search.svg')} className="search-icon" onClick={this.focus} />
                                <SearchInput className="search-input" onChange={(value) => this.update({ type: 'searchTerm', value })} ref={(input) => { this.textInput = input; }} />
                            </div>
                        </div>
                        <MyTable
                            token={jwt.token}
                            type="users"
                            headers={headers}
                            data={data}
                            sortby={this.state.sortby}
                            handleAction={this.handleAction}
                        />
                    </div>
                </div>
                { this.state.alert }
            </Loader>
        );
    }
}

const select = (state) => ({
    spinner         : state.ui.get('spinner'),
    activeUser      : state.activeUser.get('activeUser'),
    users           : state.users.get('users')
});

const action = {
    triggerSpinner,
    getUsers,
    approveUser,
    autoApproveUserOrders,
    setActiveTab
}

export default connect(select, action, null, { withRef: true })(withCookies(UsersPage));
