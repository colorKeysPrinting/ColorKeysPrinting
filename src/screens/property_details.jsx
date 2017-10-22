import React                                from 'react';
import _                                    from 'lodash';
import { connect }                          from 'react-redux';
import { withRouter }                       from 'react-router';
import { withCookies }                      from 'react-cookie';
import Select                               from 'react-select';
import moment                               from 'moment';
import Loader                               from 'react-loader';
import assets                               from 'libs/assets';

import { logout }                           from 'ducks/active_user/actions';
import { triggerSpinner }                   from 'ducks/ui/actions';
import * as propertiesActions               from 'ducks/properties/actions';
import { setActiveTab }                     from 'ducks/header/actions';

class PropertyDetails extends React.Component {

    componentWillMount() {
        const { cookies, location } = this.props;

        if (cookies.get('sibi-ge-admin')) {
            const reProperty = /propertyId=(.*)/;
            const match = reProperty.exec(location.search);

            if (match) {
                this.props.triggerSpinner({ isOn: true });
                this.props.getPropertyById({ id: match[1] });

            } else {
                this.props.createNewProperty();
            }
        }

        this.props.setActiveTab('properties');
    }

    componentWillUnmount() {
        this.props.clearProperty();
    }

    render() {
        const { property, spinner, activeUser, states } = this.props;
        let stateOptions, pmOfficeOptions;

        if (property.size > 0) {

            stateOptions = [
                { label: 'Select State', value: '', disabled: true },
                ..._.map(states.toJS(), (name, abv) => (
                    { label: name, value: abv }
                ))
            ]

            // TODO: need to get funds and pm offices for fund
            pmOfficeOptions = [
                { label: 'Select PM office', value: '', disabled: true },
                ..._.map(states.toJS(), (name, abv) => (
                    { label: name, value: abv }
                ))
            ]
            this.props.triggerSpinner({ isOn: false });
        }

        return (
            <Loader loaded={spinner} >
                <div id="property-details-page">
                    <div className="modal">
                        { (property.size > 0) ? (
                            <form onSubmit={(e) => {e.preventDefault(); this.props.createProperty({ property: property.toJS() })}}>
                                <Select
                                    name="pmOfficeName"
                                    value={property.get('pmOfficeName') || ''}
                                    options={pmOfficeOptions}
                                    onChange={(selected) => this.props.update({ key: 'pmOfficeName', value: (selected) ? selected.value : null })}
                                    required
                                />
                                <input name="propertyUnitId" type="text" placeholder="Unit ID" value={property.get('propertyUnitId')} onChange={(e) => this.props.update({ key: 'propertyUnitId', value: e.target.value})} required />
                                <input name="region" type="text" placeholder="Region" value={property.get('region')} onChange={(e) => this.props.update({ key: 'region', value: e.target.value})} required />
                                <input name="addressLineOne" type="text" placeholder="Address line 1" value={property.get('addressLineOne')} onChange={(e) => this.props.update({ key: 'addressLineOne', value: e.target.value})} required />
                                <input name="addressLineTwo" type="text" placeholder="Address line 2" value={property.get('addressLineTwo')} onChange={(e) => this.props.update({ key: 'addressLineTwo', value: e.target.value})} required />
                                <input name="city" type="text" placeholder="City" value={property.get('city')} onChange={(e) => this.props.update({ key: 'city', value: e.target.value})} required />
                                <Select
                                    name="state"
                                    value={property.get('state') || ''}
                                    options={stateOptions}
                                    onChange={(selected) => this.props.update({ key: 'state', value: (selected) ? selected.value : null })}
                                    required
                                />
                                <input name="zipcode" type="text" placeholder="Zipcode" value={property.get('zipcode')} onChange={(e) => this.props.update({ key: 'zipcode', value: e.target.value})} required />
                                <input className="btn blue fill" type="submit" value={(property.get('id')) ? 'Update' : 'Add'} />
                            </form>
                        ) : null }
                    </div>
                </div>
            </Loader>
        );
    }
}

const select = (state) => ({
    spinner    : state.ui.get('spinner'),
    states     : state.ui.get('states'),
    property   : state.properties.get('property'),
    activeUser : state.activeUser.get('activeUser'),
});

const actions = {
    logout,
    triggerSpinner,
    setActiveTab,
    ...propertiesActions
}

export default connect(select, actions, null, { withRef: true })(withRouter(withCookies(PropertyDetails)));
