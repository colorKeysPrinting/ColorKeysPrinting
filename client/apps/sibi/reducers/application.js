'use strict';

import _                        from 'lodash';
import Immutable                from 'immutable';
import ActionTypes              from '../constants/action_types';
import { browserHistory }       from 'react-router';

const initialState = Immutable.fromJS({ currLanguage: 'English', activeTab: '', activeOverlay: '', overlayObj: false, activePage: 'products', activePageContent: '', temp: {docs: {workerComp: '', w9: '', insurance: '', contractGoodman: false,  contractAsure: false}},

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
        profilePic: './images/profile_pic.jpg',
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
        myProducts: {
            mostPurchased: ['GSX140421', 'GMS80805CN', 'CAPF4860C6','GSZ140361']
        },
        myMatchups: {
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
        myTruck: {}
    },
    calculations: {
        salesTaxRate: 8.25
    },
    products: [
        {modelNum: 'GSX140421',     name: 'Goodman 3.5 Ton 14 Seer Air conditioner condenser w/ R410A refrigerant',         brand: 'Goodman', image: '', price: 709.00,  types: ['airConditioners'],              tabs:{ 'complete the system': ['GMS80805CN','CAPF4860C6'], 'recommended parts': ['GPH1430H41','GXZ140601'],  'code compliance': '<h4>Information for Contractors</h4><h2>Codes 101 Brochure</h2><p>This brochure covers that basics of codes and standards and is aimed at providing contractors with a general understanding of these issues so that they can become more involved in the code evelopment processes that affect the HVAC inducstry. <a>Download it.</a></p><h2>Residential System Design Review Form</h2><p>ACCA has crafted an easy-to-use evaluation of HVAC system design elements in the pertinent building codes. <a>Download it.</a></p> <h2>Computing Infiltration Loads base on a Target Envelope Leakage Requirment</h2><p>This Technical Note shows how to convert a maximum code allowable leakage limit (say, 3 or 5 ACH 50 per the ICC International Energy Conservation Code) to Manual J infiltration CFM value, and then to the infiltration load contributions (Btuh) fr sensible heating, sensible cooling, and latent cooling.  It also discusses the use of blower door data for one or more test points. <a>Download it.</a></p> <h2>ACCA Codes Committee (committee members only)</h2><p>Get involved in ACCA\'s Codes Committee and make a difference in the development and adoption of good building codes.  For more info about becoming involved in the Codes Committee and ACCA\'s building code efforts, contact codes@acca.org.</a></p><hr> <h4>Information for Code officials</h4><h2>Brochures for Code officials</h2><p>ACCA has developed several brochures which help code officials verify residential load calculations, duct design and equipment selection in accordance with Manuals I.D. and S. While it\'s not practical for code officials to verify every single aspect of these</p>', overview: {downloadLink: './documents/product-spec.pdf', 'Standard Features': ['Energy-efficient compressor','Single-speed condenser fan motor','Factory-installed filter drier','Copper tube/aluminum fin coil','Service valves with sweat connections and easy-access guage ports','Contractor with lug connection','Ground lug connection','Ground lug connection','AHRI Certified, ETL Listed'], 'Cabinet Features': ['Heavy-guage galvanized-steel cabinet with a louvered sound control top','Attractive Architectural Gray power-paint finish with 500-hour salt-spray approval','Steel louver coil guard','Top and side maintenance access','Single-panel access to controls with space provided for field-installed accessories','When properly anchored\, meets the 2010 Florida Building Code Unit Integrity requirements for hurricane-type winds (Anchor bracket kits available.)'], 'Outstanding Warranty Protection': 'This unit is backed by a 10-Year Parts Limited Warranty.  The GSX14 Air Conditioner features operating sound levels that are among the lowest in the heating and cooling industry.  With its 14 SEER rating, the GSX14 will help reduce energy consumption throughout the life of the system.'}, 'specifications': './documents/product-spec.pdf', FAQ: [{question: 'Can frost, ice, dirt or other debris keep the outdoor unit of my cooling system from operating effectively?', answer: 'Anything that prevents airflow from making its way to the outdoor coil can negatively affect the efficiency and performance of the equipment.  Make it a priority to keep the space around the equipment clean and clear.'}, {question: 'Should I cover my outdoor unti in the fall and winter?', answer: 'Covering the outdoor unit in the winter months prevents unwanted debris from accumulating on the outdoor unit and later impeding airflow to the outdoor unti.  At the same time accidentally operating the outdoor unit with a covering in place could cause system damage.  It is recommended that high voltage power always be disconnected from the outdoor unit whenever a cover or anything obstructing airflow is introduced.'}]}},
        {modelNum: 'GMS80805CN',    name: 'Goodman 80% AFUE 80,000 BTU Upflow  Stage Gas Furnace up to 5 Ton',              brand: 'Goodman', image: '', price: 344.00,  types: ['furnaces'],                     tabs:{ 'complete the system': ['GSX140421','CAPF4860C6'],  'recommended parts': ['GPH1430H41','GXZ140601'],  'code compliance': '', overview: '', 'specifications': {}, FAQ: [{question: '', answer: ''}]}},
        {modelNum: 'CAPF4860C6',    name: 'Goodman 4 to 5 ton 21 Inch Width Air Conditioner Evaporator Cased Coil',         brand: 'Goodman', image: '', price: 258.00,  types: ['coils'],                        tabs:{ 'complete the system': ['GMS80805CN','GSX140421'],  'recommended parts': ['GPH1430H41','GXZ140601'],  'code compliance': '', overview: '', 'specifications': {}, FAQ: [{question: '', answer: ''}]}},
        {modelNum: 'GSZ140361',     name: 'Goodman 3 Ton 14 SEER Heat Pump Air Conditioner Condenser',                      brand: 'Goodman', image: '', price: 866.00,  types: ['heatPumps', 'airConditioners'], tabs:{ 'complete the system': [],                          'recommended parts': [],                          'code compliance': '', overview: '', 'specifications': {}, FAQ: [{question: '', answer: ''}]}},
        {modelNum: 'ARUF37C14',     name: 'Goodman 3 Ton Air Conditioner Air Handler with Smart Frame Cabinet',             brand: 'Goodman', image: '', price: 380.00,  types: ['airConditioners'],              tabs:{ 'complete the system': [],                          'recommended parts': [],                          'code compliance': '', overview: '', 'specifications': {}, FAQ: [{question: '', answer: ''}]}},
        {modelNum: 'HKSX10XC',      name: 'Goodman 10 Kilowatt 34,100 BTU Heater Coil for Smart Frame Air Handler',         brand: 'Goodman', image: '', price: 36.00,   types: ['coils'],                        tabs:{ 'complete the system': [],                          'recommended parts': [],                          'code compliance': '', overview: '', 'specifications': {}, FAQ: [{question: '', answer: ''}]}},
        {modelNum: 'GXZ140601',     name: 'Goodman 5 Ton 14 SEER Heat Pump Air Conditioner Condenser',                      brand: 'Goodman', image: '', price: 1175.00, types: ['airConditioners', 'heatPumps'], tabs:{ 'complete the system': [],                          'recommended parts': [],                          'code compliance': '', overview: '', 'specifications': {}, FAQ: [{question: '', answer: ''}]}},
        {modelNum: 'ASPT61D14',     name: 'Goodman 5 Ton Air Conditioner Air Handler with Smart Frame Cabinet',             brand: 'Goodman', image: '', price: 561.00,  types: ['airConditioners'],              tabs:{ 'complete the system': [],                          'recommended parts': [],                          'code compliance': '', overview: '', 'specifications': {}, FAQ: [{question: '', answer: ''}]}},
        {modelNum: 'HKSC15',        name: 'Goodman 15 Kilowatt 51,150 BTU Heater Coil for Smart Fram Air Handler',          brand: 'Goodman', image: '', price: 76.00,   types: ['coils'],                        tabs:{ 'complete the system': [],                          'recommended parts': [],                          'code compliance': '', overview: '', 'specifications': {}, FAQ: [{question: '', answer: ''}]}},
        {modelNum: 'GPG1442080M41', name: 'Goodman 3.5 Ton 14 SEER 80,000 BTU Gas/Electric Package Unit - Multi-Position',  brand: 'Goodman', image: '', price: 1606.00, types: ['packagedUnits'],                tabs:{ 'complete the system': [],                          'recommended parts': [],                          'code compliance': '', overview: '', 'specifications': {}, FAQ: [{question: '', answer: ''}]}},
        {modelNum: 'GPH1430H41',    name: 'Goodman 2.5 Ton 14 SEER Horizontal Heat Pump Package Unit',                      brand: 'Goodman', image: '', price: 1310.00, types: ['packagedUnits', 'heatPumps'],   tabs:{ 'complete the system': [],                          'recommended parts': [],                          'code compliance': '', overview: '', 'specifications': {}, FAQ: [{question: '', answer: ''}]}},
        {modelNum: 'GPH1460h42',    name: 'Goodman 5 Ton 14 SEER Horizontal Heat Pump Package Unit',                        brand: 'Goodman', image: '', price: 1799.00, types: ['airConditioners'],              tabs:{ 'complete the system': [],                          'recommended parts': [],                          'code compliance': '', overview: '', 'specifications': {}, FAQ: [{question: '', answer: ''}]}},
    ],
    matchups: [
        {matchup: 'standard', items:['DSXC19', 'GMVC9', 'DSXC17', 'GMVC7']},

        {matchup: 'DSXC19',  name: 'Gas Split-System',          image: '', tonnageOptions: [1.5, 1.8], seerOptions: [14, 15, 12], price: 1419.16, items: {'GSX140421': 1, 'GMS80805CN': 1, 'CAPF4860C6': 1}},
        {matchup: 'GMVC9',   name: 'Heat Pump Split-System',    image: '', tonnageOptions: [1.5, 1.8], seerOptions: [14, 15, 12], price: 3262.66, items: {'GSZ140361': 3, 'ARUF37C14': 1, 'HKSX10XC': 1}},
        {matchup: 'DSXC17',  name: 'Package Gas System',        image: '', tonnageOptions: [1.5, 1.8], seerOptions: [14, 15, 12], price: 2568.77, items: {'GXZ140601': 1, 'ASPT61D14': 2, 'HKSC15': 1}, applicationTypeOptions: {multiPosition: 'Multi-Position', singlePosition: 'Single Position'}},
        {matchup: 'GMVC7',   name: 'Package Heat Pump System',  image: '', tonnageOptions: [1.5, 1.8], seerOptions: [14, 15, 12], price: 2290.57, items: {'GXZ140601': 1,'ASPT61D14': 1, 'HKSC15': 5}, applicationTypeOptions: {multiPosition: 'Multi-Position', horizontalPosition: 'Horizontal'}},

        {matchup: 'Dwight\'s Heat Pump Split-System', price: 1512.25, items: {'GSX140421': 1, 'GMS80805CN': 2}},
        {matchup: 'Dwight\'s Gas Split-System',       price: 1800.20, items: {'ARUF37C14': 1, 'HKSX10XC': 3, 'GXZ140601': 1}}
    ],
    productLocations: [
        // this dummy data is for GSX140421 only
        {name: 'West Phoenix', stock: 5},
        {name: 'Utah', stock: 2},
        {name: 'New York', stock: 1},
        {name: 'Texas', stock: 20}
    ],
    truck: []
});

export default (state = initialState, action)=>{

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

        case ActionTypes.SET_ACTIVE_PAGE:
            console.log('activePage: ', action.key, action.content);
            let activePageContent = (action.content) ? action.content : '';

            state = state.set('activePage', action.key);
            state = state.set('activePageContent', activePageContent);
            break;

        case ActionTypes.GET_STRIPE_TOKEN_DONE:
            console.log('received stripe token');
            state = state.setIn(['temp','stripeToken', action.key], action.isChecked);
            break;

// **** LOGIN/CREATE USER SECTION
        case ActionTypes.LOGIN:
            console.log('login: ', action.username, action.password);
            state = state.set('activeOverlay', '');
            state = state.setIn(['activeUser', 'type'], 'sibi'); // TODO: REMOVE THIS LINE FOR TESTING ONLY!
            history.pushState(null, '/products');
            // TODO: call API function
            break;

        case ActionTypes.LOGOUT:
            console.log('logging out user:', action.username);
            history.pushState(null, '/');

            let activeUser = Immutable.fromJS({type: '',username: '',profilePic: '',JWT: '',settings: {language: '',keyIndicatorBars: {}},myProducts: {mostPurchased: []},myMatchups: {},myLists: {},filterPanel:{},myTruck: {}});
            state = state.set('activeUser', activeUser);
            state = state.set('activeOverlay', '');
            break;

        case ActionTypes.PASSWORD_RESET:
            console.log('password reset', action.email);
            state = state.set('activeOverlay', '');
            // TODO: call API function
            break;

        case ActionTypes.SIGNUP:
            console.log('signup');
            break;

        case ActionTypes.SUBMIT_SIGNUP:
            console.log('submitting signUp');
            // state = state.set('person', action.personDetails);
            break;

// **** OVERLAY SECTION
        case ActionTypes.SHOW_OVERLAY:
            console.log('show overlay', action.key);
            state = state.set('activeOverlay', action.key);

            // normal case
            if(action.obj) {
                state = state.set('overlayObj', action.obj);
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

                switch(action.listType) {
                    case 'customMatchups':
                        list = state.getIn(['activeUser', 'myMatchups', 'custom']).toJS();
                        break;
                    case 'myLists':
                        list = state.getIn(['activeUser', 'myLists']).toJS();
                        break;
                    default:
                }

                state = state.set('overlayObj', {type: action.listType, modelNum: action.modelNum, list});
            }
            break;

        case ActionTypes.CLOSE_OVERLAY:
            console.log('close overlay');
            state = state.set('activeOverlay', '');
            break;

// signup actions
        case ActionTypes.UPLOAD_DOCUMENT:
            console.log('uploading document');
            state = state.setIn(['temp','docs', action.key], action.file);
            break;

        case ActionTypes.ACCEPT_AGREEMENT:
            console.log('accept agreement');
            state = state.setIn(['temp','docs', action.key], action.isChecked);
            break;

// product actions
        case ActionTypes.ADD_TO_TRUCK:
            console.log('adding item(s) to truck: ', action.item);
            let item = action.item, truck = state.get('truck').toJS(), products = state.get('products').toJS();

            if(item.modelNum) {
                let modelNum = item.modelNum
                let index = _.findIndex(truck, ['modelNum', modelNum]);

                if(index >= 0) {
                    truck[index].qty += 1;
                } else {
                    if(!item.qty) {
                        item['qty'] = 1
                    }
                    truck.push(item);
                }

            } else if (item.matchup) {
                _.each(item.items, (qty, modelNum)=>{
                    let index = _.findIndex(truck, ['modelNum', modelNum]);

                    if(index >= 0) {
                        truck[index].qty += qty;
                    } else {
                        let index = _.findIndex(products, ['modelNum', modelNum]);
                        let product = products[index];
                        product['qty'] = qty;
                        truck.push(product);
                    }
                });
            }

            let newTruck = Immutable.fromJS(truck);

            state = state.set('truck', newTruck);
            console.log('current Truck:', state.get('truck').toJS());
            break;

        case ActionTypes.CREATE_NEW_LIST:
            console.log('TODO: ASYNC CALL - create new: ' + action.key, action.newItem);

            switch(action.key) {
                case 'customMatchups':
                    let matchups = state.get('matchups').toJS();
                    let myMatchups = state.getIn(['activeUser', 'myMatchups','custom']).toJS();

                    matchups.push({matchup: action.newItem, items: {}});
                    myMatchups.push(action.newItem);

                    matchups = Immutable.fromJS(matchups);
                    myMatchups = Immutable.fromJS(myMatchups);

                    state = state.update('matchups', value=>matchups);
                    state = state.updateIn(['activeUser', 'myMatchups','custom'], value=>myMatchups);

                    console.log('current matchups:', state.get('matchups').toJS());
                    console.log('current myMatchups:', state.getIn(['activeUser', 'myMatchups','custom']).toJS());
                    break;
                case 'myLists':
                    let myLists = state.getIn(['activeUser', 'myLists']).toJS();
                    myLists[action.newItem] = [];

                    myLists = Immutable.fromJS(myLists);

                    state = state.updateIn(['activeUser', 'myLists'], value=>myLists);
                    console.log('current myLists:', state.getIn(['activeUser', 'myLists']).toJS());
                    break;
                default:
                    console.log('ERROR: no list specified!');
            }
            break;

        case ActionTypes.ADD_TO_LIST:
            let index;
            console.log('TODO: ASYNC CALL - add to ' + action.listName, action.modelNum);

            switch(action.key) {
                case 'customMatchups':
                    let matchups = state.get('matchups').toJS();
                    index = _.findIndex(matchups, ['matchup', action.listName]);
                    let matchup = matchups[index];

                    if(matchup.items[action.modelNum]) {
                        matchup.items[action.modelNum] += 1;

                    } else {
                        matchup.items[action.modelNum] = 1;
                    }

                    matchups[index] = matchup;

                    state = state.update('matchups', value=>Immutable.fromJS(matchups));
                    console.log('current matchups:', state.get('matchups').toJS());

                    state = state.set('activeOverlay', 'addToConfirmation');
                    state = state.set('overlayObj', {name: action.listName, modelNum: action.modelNum, products: matchup.items});
                    break;
                case 'myLists':
                    let myLists = state.getIn(['activeUser', 'myLists']).toJS();
                    myLists[name].push(action.modelNum);

                    state = state.updateIn(['activeUser', 'myLists'], value=>Immutable.fromJS(myLists));
                    console.log('current myLists:', state.getIn(['activeUser', 'myLists']).toJS());
                    break;
                default:
            }
            break;

        case ActionTypes.DELETE_ITEM:
            console.log('delete call back');
            break;

        default:
    }

    return state;
};
