import React                                from 'react';
import _                                    from 'lodash';
import { connect }                          from 'react-redux';
import { withRouter }                       from 'react-router';
import { withCookies }                      from 'react-cookie';
import Select                               from 'react-select';
import assets                               from 'libs/assets';

import { triggerSpinner }                   from 'ducks/ui/actions';
import * as propertiesActions               from 'ducks/properties/actions';
import { setActiveTab }                     from 'ducks/header/actions';

import Spinner                              from 'components/spinner';

class PropertyDetails extends React.Component {

    componentWillMount() {
        const { id } = this.props.match.params;
        const { cookies } = this.props;

        if (cookies.get('sibi-ge-admin')) {
            this.props.getFunds();
            (id !== 'new') ? this.props.getPropertyById({ id }) : this.props.createNewProperty();
        }
    }

    componentWillUnmount() {
        this.props.clearProperty();
    }

    render() {
        const { history, match, spinner, funds, property, activeUser, states } = this.props;
        let stateOptions, fundsOptions, pmOfficeOptions;

        if (funds.size > 0 &&
            property.size > 0) {

            stateOptions = [
                { label: 'Select State', value: '', disabled: true },
                ..._.map(states.toJS(), (name, abv) => (
                    { label: name, value: abv }
                ))
            ];

            fundsOptions = [
                { label: 'Select a fund', value: '', disabled: true },
                ..._.map(funds.toJS(), (fund) => (
                    { label: fund.name, value: fund.id }
                ))
            ];

            const fund = _.find(funds.toJS(), (fund) => { return fund.id === property.get('fundId') });
            if (fund) {
                pmOfficeOptions = [
                    { label: 'Select PM office', value: '', disabled: true },
                    ..._.map(fund.pmOffices, (office) => (
                        { label: office.name, value: office.name }
                    ))
                ];
            }
        }

        return (
            <div id="property-details-page">
                <div className="modal">
                    <div className="titleBar">
                        <div className="title">{(match.params.id !== 'new') ? 'Edit': 'Create'} Property</div>
                        <div onClick={() => history.goBack()} className="icon-close"><img src={assets('./images/icon-x-big.svg')} /></div>
                    </div>
                    <form onSubmit={(e) => {
                        e.preventDefault();
                        (match.params.id !== 'new') ? this.props.updateProperty() : this.props.createProperty();
                        history.goBack()}}>

                        {(funds.size > 0 && property.size > 0) ? (
                            <div className="content">
                                <Select
                                    name="fund"
                                    value={property.get('fundId')}
                                    options={fundsOptions}
                                    onChange={(selected) => this.props.update({ key: 'fundId', value: (selected) ? selected.value : null })}
                                    required
                                    disabled={(match.params.id !== 'new') ? true : false}
                                />
                                <Select
                                    name="pmOfficeName"
                                    value={property.get('pmOfficeName')}
                                    options={pmOfficeOptions}
                                    onChange={(selected) => this.props.update({ key: 'pmOfficeName', value: (selected) ? selected.value : null })}
                                    required
                                />
                                <input name="propertyUnitId" className="left-col" type="text" placeholder="Unit ID" value={property.get('propertyUnitId')} onChange={(e) => this.props.update({ key: 'propertyUnitId', value: e.target.value})} required />
                                <input name="region" className="right-col" type="text" placeholder="Region" value={property.get('region')} onChange={(e) => this.props.update({ key: 'region', value: e.target.value})} required />
                                <input name="addressLineOne" className="left-col" type="text" placeholder="Address line 1" value={property.get('addressLineOne')} onChange={(e) => this.props.update({ key: 'addressLineOne', value: e.target.value})} required />
                                <input name="addressLineTwo" className="right-col" type="text" placeholder="Address line 2" value={property.get('addressLineTwo')} onChange={(e) => this.props.update({ key: 'addressLineTwo', value: e.target.value})} required />
                                <input name="city" className="left-col"type="text" placeholder="City" value={property.get('city')} onChange={(e) => this.props.update({ key: 'city', value: e.target.value})} required />
                                <Select
                                    name="state"
                                    className="right-col"
                                    value={property.get('state')}
                                    options={stateOptions}
                                    onChange={(selected) => this.props.update({ key: 'state', value: (selected) ? selected.value : null })}
                                    required
                                />
                                <input name="zipcode" className="left-col" type="text" placeholder="Zipcode" value={property.get('zipcode')} onChange={(e) => this.props.update({ key: 'zipcode', value: e.target.value})} required />
                                <input className="btn blue fill" type="submit" value={(property.get('id')) ? 'Update' : 'Add'} />
                            </div>
                        ) : <Spinner /> }
                    </form>
                </div>
            </div>
        );
    }
}

const select = (state) => ({
    states     : state.ui.get('states'),
    property   : state.properties.get('property'),
    funds      : state.properties.get('funds'),
    activeUser : state.activeUser.get('activeUser'),
});

const actions = {
    setActiveTab,
    ...propertiesActions
}

export default connect(select, actions, null, { withRef: true })(withRouter(withCookies(PropertyDetails)));
