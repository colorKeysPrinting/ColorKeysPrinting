'use strict';

import _                        from 'lodash';
import Immutable                from 'immutable';
import { Cookies }              from 'react-cookie';
import { ActionTypes }          from './actions';

// /////////////////////////////////////
//             REDUCER
// /////////////////////////////////////
const initialState = Immutable.fromJS({
    property: {},
    funds: [],
    fundProperties: [],
    properties: [],
    zeroProperties: false,
    defaultProperty: {
        addressLineOne: '',
        addressLineTwo: '',
        city: '',
        fundId: '',
        id : '',
        pmOfficeName: '',
        propertyUnitId: '',
        region: '',
        state: '',
        zipcode: '',
    }
});

export default (state = initialState, action) => {

    switch (action.type) {
    case ActionTypes.CLEAR_PROPERTY:
        state = state.set('property', state.get('defaultProperty'));
        state = state.set('funds', []);
        break;

    case ActionTypes.UPDATE:
        state = state.updateIn(['property', action.key], value=>action.value);
        break;

    case ActionTypes.CREATE_NEW_PROPERTY:
        state = state.set('property', state.get('defaultProperty'));
        break;

    case ActionTypes.GET_FUNDS_SUCCESS:
        console.log('receiving funds');
        state = state.set('funds', Immutable.fromJS(action.data));
        break;

    case ActionTypes.GET_PROPERTY_BY_ID_SUCCESS:
        state = state.set('property', Immutable.fromJS(action.data));
        break;

    case ActionTypes.GET_FUND_PROPERTIES_SUCCESS:
        console.log('receiving fund properties');
        state = state.set('fundProperties', Immutable.fromJS(action.data));
        state = state.set('zeroProperties', (_.size(action.data) <= 0) ? true : false );
        break;

    default:
        return state;
    }
    return state;
};