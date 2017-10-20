import React                                from 'react';
import _                                    from 'lodash';
import { connect }                          from 'react-redux';
import { withCookies }                      from 'react-cookie';
import { withRouter }                       from 'react-router';
import moment                               from 'moment';
import SearchInput                          from 'react-search-input';
import Loader                               from 'react-loader';

import filter                               from 'libs/filter';
import assets                               from 'libs/assets';

import { triggerSpinner }                   from 'ducks/ui/actions';
import { setActiveTab }                     from 'ducks/header/actions';
import { getFundProperties }                from 'ducks/properties/actions';

import MyTable                              from 'components/my_table';
import Overlay                              from 'components/overlay';

class PropertiesPage extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            alert: null,
            searchTerm: '',
            sortby: { column: '', isAsc: false }
        };

        this.handleAction = this.handleAction.bind(this);
        this.handleItem = this.handleItem.bind(this);
        this.orderBy = this.orderBy.bind(this);
    }

    componentWillMount() {
        const { cookies } = this.props;

        if (cookies.get('sibi-ge-admin')) {
            this.props.triggerSpinner({ isOn: true });
            this.props.getFunds();
            this.props.getFundProperties();
        }

        this.props.setActiveTab('properties');
    }

    componentWillUpdate(nextProps) {
        if (!_.isEqual(nextProps.activeUser, this.props.activeUser)) {
            const path = (nextProps.activeUser.size > 0) ? `/properties` : `/login`;
            this.props.history.push(path);
        }
    }

    orderBy({ column }) {
        this.setState((prevState) => {
            const isAsc = (column === prevState.sortby.column && prevState.sortby.isAsc === 'asc') ? 'desc' : 'asc';

            return { sortby: { column, isAsc } };
        });
    }

    handleAction({ type, property }) {
        const { history, location } = this.props;
        let dialog;

        if (type === 'approve') {

        }

        this.setState({
            alert: <Overlay type="alert" closeOverlay={()=>{this.setState({ alert: null }) }}>
                { dialog }
            </Overlay>
        });
    }

    handleItem({ property }) {
        const { history, activeUser } = this.props;
        const permissions = activeUser.get('permissions').toJS();

        history.push({ pathname: `/property_details`, search: `propertyId=${property.id}` });
    }

    render() {
        const { spinner, activeUser, funds, fundProperties, zeroProperties } = this.props;
        const { searchTerm, sortby, alert } = this.state;
        let data = [];

        const headers = {
            id: '',
            region: 'Region',
            office: 'PM Office',
            address: 'Property address',
            unitId: 'Unit ID',
            action: ''
        };

        const KEYS_TO_FILTERS = ['propertyId','address','occupied','userId','geOrderNumber','createdAt','totalCost','orderStatus'];

        if (fundProperties.size > 0) {

            _.each(headers, (header, key) => {
                headers[key] = (key === 'id' || key === 'action') ? <div>{ header }</div> : <div onClick={() => this.orderBy({ column: key })} style={{ cursor: 'pointer' }} >{ header }</div>;
            });

            data = _.map(fundProperties.toJS(), (property) => {
                const cols = {};

                _.each(headers, (value, key) => {
                    value = property[key];

                    if (key === 'id') {
                        value = property.id;

                    } else if (key === 'region') {
                        value = property.region;

                    } else if (key ==='office') {
                        value = property.pmOfficeName;

                    } else if (key === 'address') {
                        value = `${property['addressLineOne']}, ${property['addressLineTwo']}, ${property['city']}, ${property['state']}, ${property['zipcode']}`;

                    } else if (key === 'unitId') {
                        value = `${property.user.firstName} ${property.user.lastName}`;

                    } else if (key === 'action') {
                        const permissions = activeUser.get('permissions').toJS();
                        if (permissions.approveAllOrders || permissions.approveFundOrders) {
                            value = (property['orderStatus'] === 'Pending') ? 'edit' : '';
                        }
                    }

                    cols[key] = value;
                });

                return cols;
            });

            // this initially sets the "Pending" properties before everything and "Approved" properties at the end
            if(searchTerm !== '') {
                data = _.map(data, (property) => {
                    property.totalCost = `${property.totalCost}`;
                    return property;
                });

                data = filter(searchTerm, KEYS_TO_FILTERS, data);
            }

            if (sortby.column === '') {
                // data = _.partition(data, ['orderStatus', 'Processed']);
                // data[0] = _.orderBy(data[0], ['createdAt'], ['desc']); // sorts orderStatus pending w/ orderDate
                // data = data[0].concat(data[1]);

                // data = _.partition(data, ['orderStatus', 'Pending']);
                // data[0] = _.orderBy(data[0], ['createdAt'], ['desc']); // sorts orderStatus pending w/ orderDate
                // data = data[0].concat(data[1]);

                // data = _.partition(data, ['orderStatus', 'Approved']);
                // data[0] = _.orderBy(data[0], ['createdAt'], ['desc']); // sorts orderStatus pending w/ orderDate
                // data = data[1].concat(data[0]);

            } else {
                data = _.orderBy(data, [sortby.column], [sortby.isAsc]);
            }

            this.props.triggerSpinner({ isOn: false });

        } else if (zeroProperties) {
            this.props.triggerSpinner({ isOn: false });
        }

        return (
            <Loader loaded={spinner} >
                <div id="properties-page" className="container">
                    {(!zeroProperties && data) ? (
                        <div className="table-card">
                            <div className="card-header">
                                <h2>Properties</h2>
                                <div className="search-wrapper">
                                    <img src={assets('./images/icon-search.svg')} className="search-icon"/>
                                    <SearchInput className="search-input" onChange={(value) => this.setState({ searchTerm: value })} />
                                </div>
                            </div>
                            <MyTable
                                type="properties"
                                dataClassName="table-row-clickable"
                                headers={headers}
                                data={data}
                                sortby={(sortby.column !== '') ? sortby : { column: 'orderStatus', isAsc: 'asc' }}
                                handleAction={this.handleAction}
                                handleItem={this.handleItem}
                            />
                        </div>
                    ) : (
                        <div>
                            <h1>Properties Status</h1>
                            <p>There are currently no properties to display</p>
                        </div>
                    )}
                </div>
                { alert }
            </Loader>
        );
    }
}

const select = (state) => ({
    spinner        : state.ui.get('spinner'),
    activeUser     : state.activeUser.get('activeUser'),
    fundProperties : state.properties.get('fundProperties'),
    zeroProperties : state.properties.get('zeroProperties'),
});

const actions = {
    triggerSpinner,
    setActiveTab,
    getFundProperties
}

export default connect(select, actions, null, { withRef: true })(withRouter(withCookies(PropertiesPage)));
