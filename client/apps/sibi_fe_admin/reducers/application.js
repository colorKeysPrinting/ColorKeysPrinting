'use strict';

import { browserHistory }       from 'react-router';
import _                        from 'lodash';
import Immutable                from 'immutable';
import ActionTypes              from '../constants/action_types';

import * as productFunctions    from './application/helper/products';

const initialState = Immutable.fromJS({ currLanguage: 'English',
    activeUser: {},
    activeTab: '',
    activeOverlay: '',
    overlayObj: false,
});

export default (state = initialState, action) => {

    switch (action.type) {
    case ActionTypes.GO_HOME:
        console.log('going home');
        break;

    case ActionTypes.SET_ACTIVATE_TAB:
        console.log('activeTab', action.key);
        state = state.set('activeTab', action.key);
        break;

    case ActionTypes.CHANGE_LANGUAGE:
        console.log('change language: ', action.language);
        state = state.set('currLanguage', action.language);
        break;

    case ActionTypes.SET_ACTIVE_FILTERS:
        console.log('active filters', action.key, action.value);
        const activeFilters = state.get('activeFilters').toJS();

        activeFilters[action.key] = action.value;

        state = state.set('activeFilters', Immutable.fromJS(activeFilters));
        break;

        // **** LOGIN/CREATE USER SECTION
    case ActionTypes.LOGIN_DONE:
        console.log('login: ', action.payload);

        state = state.set('activeOverlay', '');

        if (action.payload.id) {
            if (!action.payload.disabled) {

                state = state.set('activeUser', Immutable.fromJS({ ...action.payload }));

                window.DEFAULT_JWT = action.payload.token; window.DEFAULT_JWT = action.payload.token;
                browserHistory.push({ pathname: `#/products/` });
            } else {
                alert('Your account has been disabled!\nIf you find this to be an error please contact your fund');
            }
        } else {
            alert('Could not find a Username and Password combination matching the provided');
        }
        break;

    case ActionTypes.LOGOUT:
        console.log('logging out user:', action.username);
        history.pushState(null, '/');

        const activeUser = Immutable.fromJS({ type: '',username: '',profilePic: '',JWT: '',settings: { language: '',keyIndicatorBars: {} },myProducts: { mostPurchased: [] },myMatchups: {},myLists: {},filterPanel:{},orderTruck: {} });
        state = state.set('activeUser', activeUser);
        state = state.set('activeOverlay', '');
        break;

    case ActionTypes.PASSWORD_RESET:
        console.log('password reset', action.email);
        state = state.set('activeOverlay', '');
        // TODO: call API function
        break;

        // **** OVERLAY SECTION
    case ActionTypes.SHOW_OVERLAY:
        console.log('show overlay', action.overlay);
        state = state.set('activeOverlay', action.overlay);

        // normal case
        if (action.obj) {
            state = state.set('overlayObj', action.obj);
        }

        break;

    case ActionTypes.CLOSE_OVERLAY:
        console.log('close overlay');
        state = state.set('activeOverlay', '');
        break;

        // signup actions
    case ActionTypes.GET_TRADES_DONE:
        console.log('trades payload:', action.payload);
        state = state.set('trades', Immutable.fromJS(action.payload));
        break;

    case ActionTypes.GET_FUNDS_DONE:
        console.log('funds payload:', action.payload);
        state = state.set('funds', Immutable.fromJS(action.payload));
        break;

    case ActionTypes.GET_COMPANIES_DONE:
        console.log('companies payload:', action.payload);
        state = state.set('companies', Immutable.fromJS(action.payload));
        break;

    case ActionTypes.CREATE_COMPANY_DONE:
        console.log('create companies payload:', action.payload);
        state = state.setIn(['temp','locationId'], '');
        state = state.setIn(['temp','companyId'], Immutable.fromJS(action.payload.id));
        break;

    case ActionTypes.GET_ENTITY_TYPES_DONE:
        console.log('entityTypes payload:', action.payload);
        state = state.set('entityTypes', Immutable.fromJS(action.payload));
        break;

    case ActionTypes.GET_LOCATIONS_DONE:
        console.log('locations payload:', action.payload);
        state = state.set('locations', Immutable.fromJS(action.payload));
        break;

    case ActionTypes.CREATE_LOCATION_DONE:
        console.log('create location payload:', action.payload);
        state = state.setIn(['temp','locationId'], Immutable.fromJS(action.payload.id));
        break;

        // product actions
    case ActionTypes.GET_PRODUCTS_DONE:
        console.log('receiving products', action.payload);
        state = state.set('products', Immutable.fromJS(action.payload));
        break;

    case ActionTypes.GET_USER_MATCHUPS_DONE:
        console.log('receiving user matchups', action.payload);
        state = state.set('isMatchupDeleted', false);
        state = state.setIn(['activeUser', 'myMatchups'], Immutable.fromJS(action.payload));
        break;


    case ActionTypes.CREATE_MATCHUP_DONE:
        console.log('receiving new matchup', action.payload);
        const myMatchups = state.getIn(['activeUser','myMatchups']).toJS();
        myMatchups.push(action.payload);

        state = state.updateIn(['activeUser','myMatchups'], value => Immutable.fromJS(myMatchups));
        break;

    case ActionTypes.REMOVE_PRODUCT_DONE:
        console.log('delete call back');

        const collectionType = action.obj.collectionType;
        const productId = (action.obj.productId) ? action.obj.productId : '';

        let myList = state.getIn(['activeUser', collectionType]).toJS();

        if (productId.toString()) {
            const collection = _.find(myList, ['id', action.obj.collectionId]);
            myList = _.remove(myList, (collection) => collection.id !== action.obj.collectionId);

            collection.products = _.remove(collection.products, (thisProductID) => parseInt(thisProductID) !== productId);

            myList.push(collection);

        } else {
            myList = _.remove(myList, (collection) => collection.id !== parseInt(action.obj.collectionId));
        }

        state = state.updateIn(['activeUser', collectionType], value => Immutable.fromJS(myList));
        state = state.set('activeOverlay', '');
        break;

    case ActionTypes.REMOVE_MATCHUP_DONE:
        if (action.payload.deleted) {
            alert('matchup has successfully been deleted');
            state = state.set('isMatchupDeleted', Immutable.fromJS(action.payload.deleted));
        } else {
            alert('Error occured, matchup was not deleted');
        }

        state = state.set('activeOverlay', '');
        break;

    case ActionTypes.UPDATE_MATCHUP_DONE:
        console.log('updated matchup', action.payload);

        const matchups = state.getIn(['activeUser','myMatchups']);
        const indexMatchup = _.findIndex(matchups, ['id', action.payload.id]);

        matchups[indexMatchup] = action.payload;

        state = state.updateIn(['activeUser','myMatchups'], value => Immutable.fromJS(matchups));
        state = state.set('activeOverlay', '');
        break;

    case ActionTypes.REMOVE_COLLECTION:
        console.log('delete call back list');

        if (action.collectionType === 'customMatchup') {
            let myMatchups = state.getIn(['activeUser', 'myMatchups']).toJS();
            const customMatchups = _.find(myMatchups, ['type', 'custom']);

            myMatchups = _.remove(myMatchups, (matchup) => matchup.type !== 'custom');
            customMatchups.matchups = _.remove(customMatchups.matchups, (matchup) => matchup.id !== parseInt(action.collectionId));

            myMatchups.push(customMatchups);

            state = state.updateIn(['activeUser', 'myMatchups'], value => Immutable.fromJS(myMatchups));
        }
        break;

    default:
        return state;
    }
    return state;
};
