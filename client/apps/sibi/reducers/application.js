'use strict';

import _                    from 'lodash';
import Immutable            from 'immutable';
import ActionTypes          from '../constants/action_types';

const initialState = Immutable.fromJS({ currLanguage: 'English', activeTab: '', activeOverlay: '', overlayObj: false, activePage: 'products',
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
        },
        products: {
            mostPurchased: ['GSX140421']
        },
        myTruck: {}
    },
    products: [
        {name: 'Goodman 3.5 Ton 14 Seer Air conditioner condenser w/ R410A refrigerant',    brand: 'Goodman', image: '', price: '709.00', modelNum: 'GSX140421',  types: ['airConditioners'], description: '', completeSys: ['GMS80805CN','CAPF4860C6'],  recommendedParts: [], specs: {}, overview: '', codeCompliance: '', FAQ: [{question: '', answer: ''}]},
        {name: 'Goodman 80% AFUE 80,000 BTU Upflow  Stage Gas Furnace up to 5 Ton',         brand: 'Goodman', image: '', price: '344.00', modelNum: 'GMS80805CN', types: ['furnaces'],        description: '', completeSys: ['GSX140421','CAPF4860C6'],   recommendedParts: [], specs: {}, overview: '', codeCompliance: '', FAQ: [{question: '', answer: ''}]},
        {name: 'Goodman 4 to 5 ton 21 Inch Width Air Conditioner Evaporator Cased Coil',    brand: 'Goodman', image: '', price: '258.00', modelNum: 'CAPF4860C6', types: ['coils'],           description: '', completeSys: ['GMS80805CN','GSX140421'],   recommendedParts: [], specs: {}, overview: '', codeCompliance: '', FAQ: [{question: '', answer: ''}]},
        {name: 'Goodman 3 Ton 14 SEER Heat Pump Air Conditioner Condenser',                 brand: 'Goodman', image: '', price: '866.00', modelNum: 'GSZ140361',  types: ['heatPumps', 'airConditioners'], description: '', completeSys: [],   recommendedParts: [], specs: {}, overview: '', codeCompliance: '', FAQ: [{question: '', answer: ''}]},

        {name: 'Goodman 3 Ton Air Conditioner Air Handler with Smart Frame Cabinet',        brand: 'Goodman', image: '', price: '380.00', modelNum: 'ARUF37C14',  types: ['airConditioners'], description: '', completeSys: [],   recommendedParts: [], specs: {}, overview: '', codeCompliance: '', FAQ: [{question: '', answer: ''}]},
        {name: 'Goodman 10 Kilowatt 34,100 BTU Heater Coil for Smart Frame Air Handler',    brand: 'Goodman', image: '', price: '36.00',  modelNum: 'HKSX10XC',   types: ['coils'],           description: '', completeSys: [],   recommendedParts: [], specs: {}, overview: '', codeCompliance: '', FAQ: [{question: '', answer: ''}]},
        {name: 'Goodman 5 Ton 14 SEER Heat Pump Air Conditioner Condenser',                 brand: 'Goodman', image: '', price: '1175.00', modelNum: 'GXZ140601', types: ['airConditioners', 'heatPumps'], description: '', completeSys: [],   recommendedParts: [], specs: {}, overview: '', codeCompliance: '', FAQ: [{question: '', answer: ''}]},
        {name: 'Goodman 5 Ton Air Conditioner Air Handler with Smart Frame Cabinet',        brand: 'Goodman', image: '', price: '561.00', modelNum: 'ASPT61D14',  types: ['airConditioners'], description: '', completeSys: [],   recommendedParts: [], specs: {}, overview: '', codeCompliance: '', FAQ: [{question: '', answer: ''}]},

        {name: 'Goodman 15 Kilowatt 51,150 BTU Heater Coil for Smart Fram Air Handler',     brand: 'Goodman', image: '', price: '76.00',  modelNum: 'HKSC15',     types: ['coils'],           description: '', completeSys: [],   recommendedParts: [], specs: {}, overview: '', codeCompliance: '', FAQ: [{question: '', answer: ''}]},
        {name: 'Goodman 3.5 Ton 14 SEER 80,000 BTU Gas/Electric Package Unit - Multi-Position', brand: 'Goodman', image: '', price: '1606.00',  modelNum: 'GPG1442080M41', types: ['packagedUnits'], description: '', completeSys: [],   recommendedParts: [], specs: {}, overview: '', codeCompliance: '', FAQ: [{question: '', answer: ''}]},
        {name: 'Goodman 2.5 Ton 14 SEER Horizontal Heat Pump Package Unit',                 brand: 'Goodman', image: '', price: '1310.00', modelNum: 'GPH1430H41', types: ['packagedUnits', 'heatPumps'], description: '', completeSys: [],   recommendedParts: [], specs: {}, overview: '', codeCompliance: '', FAQ: [{question: '', answer: ''}]},
        {name: 'Goodman 5 Ton 14 SEER Horizontal Heat Pump Package Unit',                   brand: 'Goodman', image: '', price: '1799.00', modelNum: 'GPH1460h42',  types: ['airConditioners'], description: '', completeSys: [],   recommendedParts: [], specs: {}, overview: '', codeCompliance: '', FAQ: [{question: '', answer: ''}]}
    ],
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
            console.log('signUpPage');
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
            break;

        case ActionTypes.ACTIVATE_PAGE:
            console.log('activePage: ', action.key);
            state = state.set('activePage', action.key);
            break;

        default:
    }

    return state;
};
