'use strict';

import _                        from 'lodash';
import Immutable                from 'immutable';
import ActionTypes              from '../constants/action_types';
import { browserHistory }       from 'react-router';

const initialState = Immutable.fromJS({ currLanguage: 'English', activeTab: '', activeOverlay: '', overlayObj: false, activePage: 'products', temp: {modelNum: '', listType: '', actualList: '', docs: {workerComp: '', w9: '', insurance: '', contractGoodman: false,  contractAsure: false}},

// ****** API information starts here ******
    fundsList: ['Associated fund', 'value fund', 'foo fund', 'Jolly fund'], locationList: ['petes place', 'lower towers', 'twin terrace'],
    tradeList: ['engineer', 'carpenter', 'fur trade'], entityList: ['business', 'apartment', '4 plex', 'douplex'], languageList: ['English', 'Spanish', 'German'],
    contracts: {'goodman': './documents/pdf-test.pdf', 'asure': './documents/pdf-test.pdf'},
    states: {'AL':'Alabama','AK':'Alaska','AS':'American Samoa','AZ':'Arizona','AR':'Arkansas','CA':'California','CO':'Colorado','CT':'Connecticut','DE':'Delaware','DC':'District Of Columbia','FM':'Federated States Of Micronesia','FL':'Florida','GA':'Georgia','GU':'Guam','HI':'Hawaii','ID':'Idaho','IL':'Illinois','IN':'Indiana','IA':'Iowa','KS':'Kansas','KY':'Kentucky','LA':'Louisiana','ME':'Maine','MH':'Marshall Islands','MD':'Maryland','MA':'Massachusetts','MI':'Michigan','MN':'Minnesota','MS':'Mississippi','MO':'Missouri','MT':'Montana','NE':'Nebraska','NV':'Nevada','NH':'New Hampshire','NJ':'New Jersey','NM':'New Mexico','NY':'New York','NC':'North Carolina','ND':'North Dakota','MP':'Northern Mariana Islands','OH':'Ohio','OK':'Oklahoma','OR':'Oregon','PW':'Palau','PA':'Pennsylvania','PR':'Puerto Rico','RI':'Rhode Island','SC':'South Carolina','SD':'South Dakota','TN':'Tennessee','TX':'Texas','UT':'Utah','VT':'Vermont','VI':'Virgin Islands','VA':'Virginia','WA':'Washington','WV':'West Virginia','WI':'Wisconsin','WY':'Wyoming'},

    keyIndicatorTypes: {
        products: {title: 'Equipment Spend', timeFrame: ['YTD']},
        equipment: {title: 'Equipment Spend', timeFrame: ['YTD']},
        warranties: {title: 'Warranties Purchased', timeFrame: ['YTD']},
        goalVolumeRebate: {title: 'Goal to Volume Rebate', timeFrame: ['YTD']},
        workOrders: {title: 'Work orders in', timeFrame: ['YTD']}
    },
    activeUser: {
        type: 'sibi',
        username: 'JohnDoe',
        JWT: '',
        settings: {
            language: 'English',
            keyIndicatorBars: {
                // the ordering here is the exact order that it will show on the keyIndicatorBar e.g. {spot1, spot2, spot3, spot4}
                // each products page can have there own info bar to show specific things?
                products: [{equipment: 'YTD'},{warranties: 'YTD'},{goalVolumeRebate: 'YTD'},{workOrders: '3/2017'}],
                matchups: [{metric1: 'currWeek'},{metric2: 'value'},{metric3: 'value'},{metric4: 'value'}],
                equipment: [{metric1: 'currWeek'},{metric2: 'value'},{metric3: 'value'},{metric4: 'value'}],
                partsSupplies: [{metric1: 'currWeek'},{metric2: 'value'},{metric3: 'value'},{metric4: 'value'}],
            }
        },
        matchups: {
            standard: 'standard',
            custom: ['Dwight\'s Heat Pump Split-System', 'Dwight\'s Gas Split-System']
        },
        myLists: {
            'Dwight\'s List': ['DSXC17', 'GMVC7', 'CAPT'],
            'Saved Trucks': ['DSXC19', 'GMVC9'],
            'Supplies':[]
        },
        filterPanel:{
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
        },
        products: {
            mostPurchased: ['GSX140421', 'GMS80805CN', 'CAPF4860C6','GSZ140361']
        },
        myTruck: {}
    },
    calculations: {
        salesTaxRate: 8.25
    },
    products: {
        GSX140421     : {name: 'Goodman 3.5 Ton 14 Seer Air conditioner condenser w/ R410A refrigerant',            brand: 'Goodman', image: '', price: '709.00', types: ['airConditioners'], description: '', completeSys: ['GMS80805CN','CAPF4860C6'],  recommendedParts: [], specs: {}, overview: '', codeCompliance: '', FAQ: [{question: '', answer: ''}]},
        GMS80805CN    : {name: 'Goodman 80% AFUE 80,000 BTU Upflow  Stage Gas Furnace up to 5 Ton',                 brand: 'Goodman', image: '', price: '344.00', types: ['furnaces'],        description: '', completeSys: ['GSX140421','CAPF4860C6'],   recommendedParts: [], specs: {}, overview: '', codeCompliance: '', FAQ: [{question: '', answer: ''}]},
        CAPF4860C6    : {name: 'Goodman 4 to 5 ton 21 Inch Width Air Conditioner Evaporator Cased Coil',            brand: 'Goodman', image: '', price: '258.00', types: ['coils'],           description: '', completeSys: ['GMS80805CN','GSX140421'],   recommendedParts: [], specs: {}, overview: '', codeCompliance: '', FAQ: [{question: '', answer: ''}]},
        GSZ140361     : {name: 'Goodman 3 Ton 14 SEER Heat Pump Air Conditioner Condenser',                         brand: 'Goodman', image: '', price: '866.00', types: ['heatPumps', 'airConditioners'], description: '', completeSys: [],   recommendedParts: [], specs: {}, overview: '', codeCompliance: '', FAQ: [{question: '', answer: ''}]},

        ARUF37C14     : {name: 'Goodman 3 Ton Air Conditioner Air Handler with Smart Frame Cabinet',                brand: 'Goodman', image: '', price: '380.00',  types: ['airConditioners'], description: '', completeSys: [],   recommendedParts: [], specs: {}, overview: '', codeCompliance: '', FAQ: [{question: '', answer: ''}]},
        HKSX10XC      : {name: 'Goodman 10 Kilowatt 34,100 BTU Heater Coil for Smart Frame Air Handler',            brand: 'Goodman', image: '', price: '36.00',   types: ['coils'],           description: '', completeSys: [],   recommendedParts: [], specs: {}, overview: '', codeCompliance: '', FAQ: [{question: '', answer: ''}]},
        GXZ140601     : {name: 'Goodman 5 Ton 14 SEER Heat Pump Air Conditioner Condenser',                         brand: 'Goodman', image: '', price: '1175.00', types: ['airConditioners', 'heatPumps'], description: '', completeSys: [],   recommendedParts: [], specs: {}, overview: '', codeCompliance: '', FAQ: [{question: '', answer: ''}]},
        ASPT61D14     : {name: 'Goodman 5 Ton Air Conditioner Air Handler with Smart Frame Cabinet',                brand: 'Goodman', image: '', price: '561.00',  types: ['airConditioners'], description: '', completeSys: [],   recommendedParts: [], specs: {}, overview: '', codeCompliance: '', FAQ: [{question: '', answer: ''}]},

        HKSC15        : {name: 'Goodman 15 Kilowatt 51,150 BTU Heater Coil for Smart Fram Air Handler',             brand: 'Goodman', image: '', price: '76.00',   types: ['coils'],           description: '', completeSys: [],   recommendedParts: [], specs: {}, overview: '', codeCompliance: '', FAQ: [{question: '', answer: ''}]},
        GPG1442080M41 : {name: 'Goodman 3.5 Ton 14 SEER 80,000 BTU Gas/Electric Package Unit - Multi-Position',     brand: 'Goodman', image: '', price: '1606.00', types: ['packagedUnits'], description: '', completeSys: [],   recommendedParts: [], specs: {}, overview: '', codeCompliance: '', FAQ: [{question: '', answer: ''}]},
        GPH1430H41    : {name: 'Goodman 2.5 Ton 14 SEER Horizontal Heat Pump Package Unit',                         brand: 'Goodman', image: '', price: '1310.00', types: ['packagedUnits', 'heatPumps'], description: '', completeSys: [],   recommendedParts: [], specs: {}, overview: '', codeCompliance: '', FAQ: [{question: '', answer: ''}]},
        GPH1460h42    : {name: 'Goodman 5 Ton 14 SEER Horizontal Heat Pump Package Unit',                           brand: 'Goodman', image: '', price: '1799.00', types: ['airConditioners'], description: '', completeSys: [],   recommendedParts: [], specs: {}, overview: '', codeCompliance: '', FAQ: [{question: '', answer: ''}]}
    },
    matchups: {
        standard    : ['DSXC19', 'GMVC9', 'DSXC17', 'GMVC7'],

        DSXC19  : {name: 'Gas Split-System',          image: '', tonnage: [1.5, 1.8], seer: [14, 15, 12], price: '1458.00', items: {'GSX140421': 1, 'GMS80805CN': 1, 'CAPF4860C6': 1}},
        GMVC9   : {name: 'Heat Pump Split-System',    image: '', tonnage: [1.5, 1.8], seer: [14, 15, 12], price: '1458.00', items: {'GSZ140361': 3, 'ARUF37C14': 1, 'HKSX10XC': 1}},
        DSXC17  : {name: 'Package Gas System',        image: '', tonnage: [1.5, 1.8], seer: [14, 15, 12], price: '1458.00', items: {'GXZ140601': 1, 'ASPT61D14': 2, 'HKSC15': 1}, applicationType: {multiPosition: 'Multi-Position', singlePosition: 'Single Position'}},
        GMVC7   : {name: 'Package Heat Pump System',  image: '', tonnage: [1.5, 1.8], seer: [14, 15, 12], price: '1458.00', items: {'GXZ140601': 1,'ASPT61D14': 1, 'HKSC15': 5}, applicationType: {multiPosition: 'Multi-Position', horizontalPosition: 'Horizontal'}},

        'Dwight\'s Heat Pump Split-System'  : {price: '2879.03', products: {'GSX140421': 1, 'GMS80805CN': 2}},
        'Dwight\'s Gas Split-System'        : {price: '2879.03', products: {'ARUF37C14': 1, 'HKSX10XC': 3, 'GXZ140601': 1}}
    },
    truck: {}
});

export default (state = initialState, action)=>{
    switch (action.type) {
        case ActionTypes.HOME:
            console.log('home');
            break;

        case ActionTypes.ACTIVATE_TAB:
            console.log('activeTab', action.key);
            state = state.set('activeTab', action.key);
            break;

// **** LOGIN/CREATE USER SECTION
        case ActionTypes.LOGIN:
            console.log('login: ', action.username, action.password);
            state = state.set('activeOverlay', '');
            state = state.setIn(['activeUser', 'type'], 'sibi'); // TODO: REMOVE THIS LINE FOR TESTING ONLY!
            // TODO: call API function
            // browserHistory.push('/#/products');  //need to get this to go to the products route

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
            console.log('signUpPage');
            state = state.set('person', action.personDetails);
            break;

// **** OVERLAY SECTION
        case ActionTypes.SHOW_OVERLAY:
            console.log('show overlay', action.key);
            state = state.set('activeOverlay', action.key);

            // normal case
            if(action.obj) {
                state = state.set('overlayObj', action.obj);

                // extra cases
                if(action.obj.modelNum) {
                    state = state.setIn(['temp','modelNum'], action.obj.modelNum);
                }

                if(action.obj.mouseCoord) {
                    state = state.set('overlayObj', action.obj.mouseCoord);
                }
            }

            break;
        case ActionTypes.SHOW_ADD_TO_OVERLAY:
            console.log('show add to overlay', action.key);
            state = state.set('activeOverlay', action.key);

            if(action.mouseCoord) {
                state = state.set('overlayObj', action.mouseCoord);
            }

            if(action.modelNum) {
                state = state.setIn(['temp','modelNum'], action.modelNum);
            }
            break;
        case ActionTypes.SHOW_RADIO_OVERLAY:
            console.log('show radio overlay', action.key);
            state = state.set('activeOverlay', action.key);

            if(action.listType) {
                let list;

                state = state.setIn(['temp','listType'], action.listType);

                switch(action.listType) {
                    case 'customMatchups':
                        list = state.getIn(['activeUser', 'matchups', 'Custom Matchups']).toJS();
                        break;
                    case 'myLists':
                        list = state.getIn(['activeUser', 'myLists']).toJS();
                        break;
                    default:
                }

                state = state.set('overlayObj', { type: action.listType, list});
            }
            break;

        case ActionTypes.CLOSE_OVERLAY:
            console.log('close overlay');
            state = state.set('activeOverlay', '');
            break;

        case ActionTypes.CHANGE_LANGUAGE:
            console.log('change language: ', action.language);
            state = state.set('currLanguage', action.language);
            break;

        case ActionTypes.ACTIVATE_PAGE:
            console.log('activePage: ', action.key);
            state = state.set('activePage', action.key);
            break;

        case ActionTypes.UPLOAD_DOCUMENT:
            console.log('uploading document');
            state = state.setIn(['temp','docs', action.key], action.file);
            break;

        case ActionTypes.ACCEPT_AGREEMENT:
            console.log('accept agreement');
            state = state.setIn(['temp','docs', action.key], action.isChecked);
            break;

        case ActionTypes.GET_STRIPE_TOKEN_DONE:
            console.log('received stripe token');
            state = state.setIn(['temp','stripeToken', action.key], action.isChecked);
            break;

        case ActionTypes.ADD_TO_TRUCK:
            console.log('adding item(s) to truck: ', action.items);

            let items = action.items;
            state = state.set('truck', {...state.truck, items});
            break;
        default:
    }

    return state;
};
