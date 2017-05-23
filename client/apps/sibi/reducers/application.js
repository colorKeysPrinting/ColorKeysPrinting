'use strict';

import _                    from 'lodash';
import Immutable            from 'immutable';
import ActionTypes          from '../constants/action_types';

const initialState = Immutable.fromJS({ currLanguage: 'English', activeTab: '', activeOverlay: '', overlayObj: false,
    fundsList: ['Associated fund', 'value fund', 'foo fund', 'Jolly fund'], locationList: ['petes place', 'lower towers', 'twin terrace'],
    tradeList: ['engineer', 'carpenter', 'fur trade'], entityList: ['business', 'apartment', '4 plex', 'douplex'], languageList: ['English', 'Spanish', 'German'],
    contracts: {'goodman': './documents/pdf-test.pdf', 'asure': './documents/pdf-test.pdf'},
    states: {'AL':'Alabama','AK':'Alaska','AS':'American Samoa','AZ':'Arizona','AR':'Arkansas','CA':'California','CO':'Colorado','CT':'Connecticut','DE':'Delaware','DC':'District Of Columbia','FM':'Federated States Of Micronesia','FL':'Florida','GA':'Georgia','GU':'Guam','HI':'Hawaii','ID':'Idaho','IL':'Illinois','IN':'Indiana','IA':'Iowa','KS':'Kansas','KY':'Kentucky','LA':'Louisiana','ME':'Maine','MH':'Marshall Islands','MD':'Maryland','MA':'Massachusetts','MI':'Michigan','MN':'Minnesota','MS':'Mississippi','MO':'Missouri','MT':'Montana','NE':'Nebraska','NV':'Nevada','NH':'New Hampshire','NJ':'New Jersey','NM':'New Mexico','NY':'New York','NC':'North Carolina','ND':'North Dakota','MP':'Northern Mariana Islands','OH':'Ohio','OK':'Oklahoma','OR':'Oregon','PW':'Palau','PA':'Pennsylvania','PR':'Puerto Rico','RI':'Rhode Island','SC':'South Carolina','SD':'South Dakota','TN':'Tennessee','TX':'Texas','UT':'Utah','VT':'Vermont','VI':'Virgin Islands','VA':'Virginia','WA':'Washington','WV':'West Virginia','WI':'Wisconsin','WY':'Wyoming'},

    activeUser: {
        type: 'sibi',
        username: 'JohnDoe',
        JWT: '',
        settings: {
            language: 'English',
            infoBar: {
                // the ordering here is the exact order that it will show on the infoBar e.g. {spot1, spot2, spot3, spot4}
                // each products page can have there own info bar to show specific things?
                products: {equipmentSpend: 'YTD', warrantiesPurchased: 'YTD', goalVolumeRebate: 'YTD', workOrders: '3/2017'},
                matchups: {metric1: 'currWeek', metric2: 'value', metric3: 'value', metric4: 'value'},
                equipment: {metric1: 'currWeek', metric2: 'value', metric3: 'value', metric4: 'value'},
                partsSupplies: {metric1: 'currWeek', metric2: 'value', metric3: 'value', metric4: 'value'},
            }
        },
        filterPanel:{
            matchups:{
                'Standard Matchups': ['DSXC19', 'GMVC9', 'DSXC17, GMVC7, CAPT'],
                'Custom Matchups': {'Dwight\'s Heat Pump Split-System': ['DSXC19', 'GMVC9'], 'Dwight\'s Gas Split-System': ['DSXC17', 'GMVC7', 'CAPT']}
            },
            'my lists': {
                'Dwight\'s List': ['DSXC17', 'GMVC7', 'CAPT'],
                'Saved Trucks': ['DSXC19', 'GMVC9'],
                'Supplies':[]
            },
            'hvac equipment': {
                types: {
                    airConditioners: 'Air Conditioners',
                    heatPumps: 'Heat Pumps',
                    furnaces: 'Furnaces',
                    miniSplits: 'Mini-Splits',
                    humidifiers: 'Humidifiers',
                    coils: 'Coils',
                    packagedUnits: 'Packaged Units'
                },
                filters: {
                    seer: {},
                    btu: {},
                    price: {}
                }
            },
            'parts & supplies': {}
        }
    },
    products: {

    }
});

export default (state = initialState, action)=>{
    switch (action.type) {
        case ActionTypes.HOME:
            console.log('home');
            break;

        case ActionTypes.ACTIVATE_TAB:
            console.log(action.key);
            state = state.set('activeTab', action.key);
            break;

// **** LOGIN/CREATE USER SECTION
        case ActionTypes.LOGIN:
            console.log('login', action.username, action.password);
            state = state.set('activeOverlay', '');
            // TODO: call API function
            break;
        case ActionTypes.PASSWORD_RESET:
            console.log('password reset', action.email);
            state = state.set('activeOverlay', '');
            // TODO: call API function
            break;

        case ActionTypes.SIGNUP:
            console.log('signup');
            break;

        case ActionTypes.SIGNUP_PAGE:
            console.log('signuppage');
            state = state.set('person', action.personDetails);
            break;

// **** OVERLAY SECTION
        case ActionTypes.SHOW_OVERLAY:
            console.log('show overlay', action.key);
            state = state.set('activeOverlay', action.key);

            if(action.obj) {
                state = state.set('overlayObj', action.obj);
            }
            break;

        case ActionTypes.CLOSE_OVERLAY:
            console.log('close overlay');
            state = state.set('activeOverlay', '');
            break;

        case ActionTypes.CHANGE_LANGUAGE:
            console.log('change language: ', action.language);
            state = state.set('currLanguage', action.language);

        default:
    }

    return state;
};
