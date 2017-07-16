'use strict';

import _                        from 'lodash';
import Immutable                from 'immutable';
import ActionTypes              from '../constants/action_types';
import { browserHistory }       from 'react-router';

import * as productFunctions    from './application/helper/products';

const initialState = Immutable.fromJS({currLanguage: 'English', activeTab: '', activeOverlay: '', overlayObj: false, activePage: 'products', activePageContent: '',
    isInStock: true, activeUser: {},
    states: {'AL':'Alabama','AK':'Alaska','AS':'American Samoa','AZ':'Arizona','AR':'Arkansas','CA':'California','CO':'Colorado','CT':'Connecticut','DE':'Delaware','DC':'District Of Columbia','FM':'Federated States Of Micronesia','FL':'Florida','GA':'Georgia','GU':'Guam','HI':'Hawaii','ID':'Idaho','IL':'Illinois','IN':'Indiana','IA':'Iowa','KS':'Kansas','KY':'Kentucky','LA':'Louisiana','ME':'Maine','MH':'Marshall Islands','MD':'Maryland','MA':'Massachusetts','MI':'Michigan','MN':'Minnesota','MS':'Mississippi','MO':'Missouri','MT':'Montana','NE':'Nebraska','NV':'Nevada','NH':'New Hampshire','NJ':'New Jersey','NM':'New Mexico','NY':'New York','NC':'North Carolina','ND':'North Dakota','MP':'Northern Mariana Islands','OH':'Ohio','OK':'Oklahoma','OR':'Oregon','PW':'Palau','PA':'Pennsylvania','PR':'Puerto Rico','RI':'Rhode Island','SC':'South Carolina','SD':'South Dakota','TN':'Tennessee','TX':'Texas','UT':'Utah','VT':'Vermont','VI':'Virgin Islands','VA':'Virginia','WA':'Washington','WV':'West Virginia','WI':'Wisconsin','WY':'Wyoming'},
    temp: {docs: {docWorkerComp: '', docW9: '', docInsurance: '', contractGoodman: false,  contractAsure: false}},
    filterPanel: {
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

// ****** API information starts here ******
    contracts: {'goodman': './documents/pdf-test.pdf', 'asure': './documents/pdf-test.pdf'},
    availableFilters: { types: {matchups: ['btu','price'], 'hvac equipment': ['seer','btu','price']}, filters: {btu:['5,000 - 9,000','9,000 - 13,000','13,000 - 17,000','17,000 - 21,000','21,000 - 25,000', '25,000+'], seer: ['8-10','11-13','12-14'], price: {min: 75, max: 1000}}},
    activeFilters: {},

    keyIndicatorTypes: {
        products: {title: 'Equipment Spend', timeFrame: ['YTD']},
        equipment: {title: 'Equipment Spend', timeFrame: ['YTD']},
        warranties: {title: 'Warranties Purchased', timeFrame: ['YTD']},
        goalVolumeRebate: {title: 'Goal to Volume Rebate', timeFrame: ['YTD']},
        workOrders: {title: 'Work orders in', timeFrame: ['YTD']}
    },

    calculations: {
        salesTaxRate: (8.25 / 100)
    },
    products: [
        // productId: incremental int
        {id: 0,  modelNum: 'GSX140421',     name: 'Goodman 3.5 Ton 14 Seer Air conditioner condenser w/ R410A refrigerant',         brand: 'Goodman', image: '', price: 709.00,  types: ['airConditioners'],              tabs:{ 'complete the system': ['1','2'], 'recommended parts': ['10','6'],  'code compliance': '<h4>Information for Contractors</h4><h2>Codes 101 Brochure</h2><p>This brochure covers that basics of codes and standards and is aimed at providing contractors with a general understanding of these issues so that they can become more involved in the code evelopment processes that affect the HVAC inducstry. <a>Download it.</a></p><h2>Residential System Design Review Form</h2><p>ACCA has crafted an easy-to-use evaluation of HVAC system design elements in the pertinent building codes. <a>Download it.</a></p> <h2>Computing Infiltration Loads base on a Target Envelope Leakage Requirment</h2><p>This Technical Note shows how to convert a maximum code allowable leakage limit (say, 3 or 5 ACH 50 per the ICC International Energy Conservation Code) to Manual J infiltration CFM value, and then to the infiltration load contributions (Btuh) fr sensible heating, sensible cooling, and latent cooling.  It also discusses the use of blower door data for one or more test points. <a>Download it.</a></p> <h2>ACCA Codes Committee (committee members only)</h2><p>Get involved in ACCA\'s Codes Committee and make a difference in the development and adoption of good building codes.  For more info about becoming involved in the Codes Committee and ACCA\'s building code efforts, contact codes@acca.org.</a></p><hr> <h4>Information for Code officials</h4><h2>Brochures for Code officials</h2><p>ACCA has developed several brochures which help code officials verify residential load calculations, duct design and equipment selection in accordance with Manuals I.D. and S. While it\'s not practical for code officials to verify every single aspect of these</p>', overview: {downloadLink: './documents/product-spec.pdf', 'Standard Features': ['Energy-efficient compressor','Single-speed condenser fan motor','Factory-installed filter drier','Copper tube/aluminum fin coil','Service valves with sweat connections and easy-access guage ports','Contractor with lug connection','Ground lug connection','Ground lug connection','AHRI Certified, ETL Listed'], 'Cabinet Features': ['Heavy-guage galvanized-steel cabinet with a louvered sound control top','Attractive Architectural Gray power-paint finish with 500-hour salt-spray approval','Steel louver coil guard','Top and side maintenance access','Single-panel access to controls with space provided for field-installed accessories','When properly anchored\, meets the 2010 Florida Building Code Unit Integrity requirements for hurricane-type winds (Anchor bracket kits available.)'], 'Outstanding Warranty Protection': 'This unit is backed by a 10-Year Parts Limited Warranty.  The GSX14 Air Conditioner features operating sound levels that are among the lowest in the heating and cooling industry.  With its 14 SEER rating, the GSX14 will help reduce energy consumption throughout the life of the system.'}, 'specifications': './documents/product-spec.pdf', FAQ: [{question: 'Can frost, ice, dirt or other debris keep the outdoor unit of my cooling system from operating effectively?', answer: 'Anything that prevents airflow from making its way to the outdoor coil can negatively affect the efficiency and performance of the equipment.  Make it a priority to keep the space around the equipment clean and clear.'}, {question: 'Should I cover my outdoor unti in the fall and winter?', answer: 'Covering the outdoor unit in the winter months prevents unwanted debris from accumulating on the outdoor unit and later impeding airflow to the outdoor unti.  At the same time accidentally operating the outdoor unit with a covering in place could cause system damage.  It is recommended that high voltage power always be disconnected from the outdoor unit whenever a cover or anything obstructing airflow is introduced.'}]}},
        {id: 1,  modelNum: 'GMS80805CN',    name: 'Goodman 80% AFUE 80,000 BTU Upflow  Stage Gas Furnace up to 5 Ton',              brand: 'Goodman', image: '', price: 344.00,  types: ['furnaces'],                     tabs:{ 'complete the system': ['0','2'], 'recommended parts': ['10','6'],  'code compliance': '', overview: '', 'specifications': {}, FAQ: [{question: '', answer: ''}]}},
        {id: 2,  modelNum: 'CAPF4860C6',    name: 'Goodman 4 to 5 ton 21 Inch Width Air Conditioner Evaporator Cased Coil',         brand: 'Goodman', image: '', price: 258.00,  types: ['coils'],                        tabs:{ 'complete the system': ['1','0'], 'recommended parts': ['10','6'],  'code compliance': '', overview: '', 'specifications': {}, FAQ: [{question: '', answer: ''}]}},
        {id: 3,  modelNum: 'GSZ140361',     name: 'Goodman 3 Ton 14 SEER Heat Pump Air Conditioner Condenser',                      brand: 'Goodman', image: '', price: 866.00,  types: ['heatPumps', 'airConditioners'], tabs:{ 'complete the system': [],        'recommended parts': [],          'code compliance': '', overview: '', 'specifications': {}, FAQ: [{question: '', answer: ''}]}},
        {id: 4,  modelNum: 'ARUF37C14',     name: 'Goodman 3 Ton Air Conditioner Air Handler with Smart Frame Cabinet',             brand: 'Goodman', image: '', price: 380.00,  types: ['airConditioners'],              tabs:{ 'complete the system': [],        'recommended parts': [],          'code compliance': '', overview: '', 'specifications': {}, FAQ: [{question: '', answer: ''}]}},
        {id: 5,  modelNum: 'HKSX10XC',      name: 'Goodman 10 Kilowatt 34,100 BTU Heater Coil for Smart Frame Air Handler',         brand: 'Goodman', image: '', price: 36.00,   types: ['coils'],                        tabs:{ 'complete the system': [],        'recommended parts': [],          'code compliance': '', overview: '', 'specifications': {}, FAQ: [{question: '', answer: ''}]}},
        {id: 6,  modelNum: 'GXZ140601',     name: 'Goodman 5 Ton 14 SEER Heat Pump Air Conditioner Condenser',                      brand: 'Goodman', image: '', price: 1175.00, types: ['airConditioners', 'heatPumps'], tabs:{ 'complete the system': [],        'recommended parts': [],          'code compliance': '', overview: '', 'specifications': {}, FAQ: [{question: '', answer: ''}]}},
        {id: 7,  modelNum: 'ASPT61D14',     name: 'Goodman 5 Ton Air Conditioner Air Handler with Smart Frame Cabinet',             brand: 'Goodman', image: '', price: 561.00,  types: ['airConditioners'],              tabs:{ 'complete the system': [],        'recommended parts': [],          'code compliance': '', overview: '', 'specifications': {}, FAQ: [{question: '', answer: ''}]}},
        {id: 8,  modelNum: 'HKSC15',        name: 'Goodman 15 Kilowatt 51,150 BTU Heater Coil for Smart Fram Air Handler',          brand: 'Goodman', image: '', price: 76.00,   types: ['coils'],                        tabs:{ 'complete the system': [],        'recommended parts': [],          'code compliance': '', overview: '', 'specifications': {}, FAQ: [{question: '', answer: ''}]}},
        {id: 9,  modelNum: 'GPG1442080M41', name: 'Goodman 3.5 Ton 14 SEER 80,000 BTU Gas/Electric Package Unit - Multi-Position',  brand: 'Goodman', image: '', price: 1606.00, types: ['packagedUnits'],                tabs:{ 'complete the system': [],        'recommended parts': [],          'code compliance': '', overview: '', 'specifications': {}, FAQ: [{question: '', answer: ''}]}},
        {id: 10, modelNum: 'GPH1430H41',    name: 'Goodman 2.5 Ton 14 SEER Horizontal Heat Pump Package Unit',                      brand: 'Goodman', image: '', price: 1310.00, types: ['packagedUnits', 'heatPumps'],   tabs:{ 'complete the system': [],        'recommended parts': [],          'code compliance': '', overview: '', 'specifications': {}, FAQ: [{question: '', answer: ''}]}},
        {id: 11, modelNum: 'GPH1460h42',    name: 'Goodman 5 Ton 14 SEER Horizontal Heat Pump Package Unit',                        brand: 'Goodman', image: '', price: 1799.00, types: ['airConditioners'],              tabs:{ 'complete the system': [],        'recommended parts': [],          'code compliance': '', overview: '', 'specifications': {}, FAQ: [{question: '', answer: ''}]}},
    ],
    warranties: [
        {id: 0, modelNum: 'MSRCA10PL-T', name: '10 Year Parts & Labor Warranty', image: './images/warranty.png', price: 135.00}
    ],
    matchups: [
        {id: 0, matchup: 'standard', matchups:['1', '2', '3', '4']},

        {id: 1, matchup: 'DSXC19',  name: 'Gas Split-System',          image: '', tonnageOptions: [1.5, 1.8], seerOptions: [14, 15, 12], price: 1419.16, products: {'0': 1, '1': 1, '2': 1}},
        {id: 2, matchup: 'GMVC9',   name: 'Heat Pump Split-System',    image: '', tonnageOptions: [1.5, 1.8], seerOptions: [14, 15, 12], price: 3262.66, products: {'3': 3, '4': 1, '5': 1}},
        {id: 3, matchup: 'DSXC17',  name: 'Package Gas System',        image: '', tonnageOptions: [1.5, 1.8], seerOptions: [14, 15, 12], price: 2568.77, products: {'6': 1, '7': 2, '8': 1}, applicationTypeOptions: {multiPosition: 'Multi-Position', singlePosition: 'Single Position'}},
        {id: 4, matchup: 'GMVC7',   name: 'Package Heat Pump System',  image: '', tonnageOptions: [1.5, 1.8], seerOptions: [14, 15, 12], price: 2290.57, products: {'6': 1,'7': 1, '8': 5}, applicationTypeOptions: {multiPosition: 'Multi-Position', horizontalPosition: 'Horizontal'}}
    ],
    productLocations: [
        // this dummy data is for GSX140421 only
        {id: 0, name: 'West Phoenix', stock: 5},
        {id: 1, name: 'Utah', stock: 2},
        {id: 2, name: 'New York', stock: 1},
        {id: 3, name: 'Texas', stock: 20}
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

        case ActionTypes.SET_ACTIVE_FILTERS:
            console.log('active filters', action.key, action.value);
            let activeFilters = state.get('activeFilters').toJS();

            activeFilters[action.key] = action.value;

            state = state.set('activeFilters', Immutable.fromJS(activeFilters));
            break;

// **** LOGIN/CREATE USER SECTION
        case ActionTypes.LOGIN_DONE:
            console.log('login: ', action.payload);

            state = state.set('activeOverlay', '');

            if(action.payload.id) {
                if(!action.payload.disabled) {
                    let settings = {
                        language: 'English',
                        keyIndicatorBars: {
                            // the ordering here is the exact order that it will show on the keyIndicatorBar e.g. {spot1, spot2, spot3, spot4}
                            // each products page can have there own info bar to show specific things?
                            products: [{equipment: 'YTD'},{warranties: 'YTD'},{goalVolumeRebate: 'YTD'},{workOrders: '3/2017'}],
                            matchups: [{metric1: 'currWeek'},{metric2: 'value'},{metric3: 'value'},{metric4: 'value'}],
                            equipment: [{metric1: 'currWeek'},{metric2: 'value'},{metric3: 'value'},{metric4: 'value'}],
                            partsSupplies: [{metric1: 'currWeek'},{metric2: 'value'},{metric3: 'value'},{metric4: 'value'}],
                        }
                    };
                    let myProducts = {mostPurchased: [11, 7, 3, 2]};
                    let myMatchups = [
                        {type: 'custom',
                            matchups: [
                                {id: 0, name: 'Dwight\'s Heat Pump Split-System', price: 1512.25, products: {'0': 1, '1': 2}},
                                {id: 1, name: 'Dwight\'s Gas Split-System',       price: 1800.20, products: {'4': 1, '5': 3, '6': 1}}
                            ]
                        }
                    ];
                    let myLists = [
                        {id: 0, name: 'Dwight\'s List', products: ['7', '6', '10']},
                        {id: 1, name: 'Saved Trucks', products: ['4', '11']},
                        {id: 2, name: 'Supplies', products: []}
                    ];
                    let myOrders = {
                        '0': {orderNum: 138992342, orderDate: 1488412800000, totalCost: 5631.96,  propertyAddress: '2182 N Grant Ave, Ogden, UT, 84414',    shippedTo: '4228 Spruce Ave, Phoenix, AZ 85001', status: 'ordered',           products: {'0': 16, '9': 16}},
                        '1': {orderNum: 138992343, orderDate: 1488153600000, totalCost: 876.03,   propertyAddress: '113 Washington Blvd, Ogden, UT, 84414', shippedTo: '400 N Blvd, Idaho Falls, ID 83401',  status: 'ordered',           products: {'4': 2, '2': 2}},
                        '2': {orderNum: 138992344, orderDate: 1487548800000, totalCost: 3631.96,  propertyAddress: '2182 N Grant Ave, Ogden, UT, 84414',    shippedTo: '400 N Blvd, Idaho Falls, ID 83401',  status: 'ordered',           products: {'11': 16, '9': 16}},
                        '3': {orderNum: 138992345, orderDate: 1487462400000, totalCost: 22331.76, propertyAddress: '2182 N Grant Ave, Ogden, UT, 84414',    shippedTo: '4228 Spruce Ave, Phoenix, AZ 85001', status: 'Shipped',           products: {'1': 50, '6': 10, '7': 50, '2': 1}},
                        '4': {orderNum: 138992346, orderDate: 1487462400000, totalCost: 1631.96,  propertyAddress: '2182 N Grant Ave, Ogden, UT, 84414',    shippedTo: '4228 Spruce Ave, Phoenix, AZ 85001', status: 'Partially Shipped', products: {'0': 3}},
                        '5': {orderNum: 138992347, orderDate: 1487462400000, totalCost: 3631.96,  propertyAddress: '2182 N Grant Ave, Ogden, UT, 84414',    shippedTo: '400 N Blvd, Idaho Falls, ID 83401',  status: 'Delivered',         products: {'2': 4, '5': 1}},
                        '6': {orderNum: 138992348, orderDate: 1486771200000, totalCost: 831.96,   propertyAddress: '2182 N Grant Ave, Ogden, UT, 84414',    shippedTo: '400 N Blvd, Idaho Falls, ID 83401',  status: 'Delivered',         products: {'0': 3, '9': 3, '10': 1}},
                        '7': {orderNum: 138992349, orderDate: 1486684800000, totalCost: 18631.92, propertyAddress: '2182 N Grant Ave, Ogden, UT, 84414',    shippedTo: '4228 Spruce Ave, Phoenix, AZ 85001', status: 'Delivered',         products: {'0': 16, '9': 11, '7': 10, '3': 1}},
                        '8': {orderNum: 138992350, orderDate: 1485561600000, totalCost: 13631.91, propertyAddress: '2182 N Grant Ave, Ogden, UT, 84414',    shippedTo: '400 N Blvd, Idaho Falls, ID 83401',  status: 'Delivered',         products: {'0': 16, '9': 11, '7': 4, '3': 3}},
                    };
                    let myTruck = [];
                    let myWarranties = [];

                    state = state.set('activeUser', Immutable.fromJS({...action.payload, settings, myProducts, myMatchups, myLists, myOrders, myTruck, myWarranties}));
                    window.DEFAULT_JWT = action.payload.token;
                    history.pushState(null, '/products');
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

            let activeUser = Immutable.fromJS({type: '',username: '',profilePic: '',JWT: '',settings: {language: '',keyIndicatorBars: {}},myProducts: {mostPurchased: []},myMatchups: {},myLists: {},filterPanel:{},myTruck: {}});
            state = state.set('activeUser', activeUser);
            state = state.set('activeOverlay', '');
            break;

        case ActionTypes.PASSWORD_RESET:
            console.log('password reset', action.email);
            state = state.set('activeOverlay', '');
            // TODO: call API function
            break;

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

        case ActionTypes.SIGNUP_DONE:
            console.log('signup success', action);
            state = state.setIn(['temp','companyId'], '');
            break;

        case ActionTypes.SUBMIT_SIGNUP_DONE:
            console.log('submitting signUp', action.result);

            // state = state.set('person', action.personDetails);
            break;

// **** OVERLAY SECTION
        case ActionTypes.SHOW_OVERLAY:
            console.log('show overlay', action.overlay);
            state = state.set('activeOverlay', action.overlay);

            // normal case
            if(action.obj) {
                state = state.set('overlayObj', action.obj);
            }

            break;

        case ActionTypes.SHOW_RADIO_OVERLAY:
            console.log('show radio overlay', action.overlay);
            state = state.set('activeOverlay', action.overlay);

            if(action.collectionType) {
                let collections;

                switch(action.collectionType) {
                    case 'customMatchups':
                        let myMatchups = _.find(state.getIn(['activeUser', 'myMatchups']).toJS(), ['type','custom']);
                        collections = myMatchups.matchups;
                        break;

                    case 'myLists':
                        collections = state.getIn(['activeUser', 'myLists']).toJS();
                        break;
                    default:
                }

                state = state.set('overlayObj', {type: action.collectionType, productID: action.productID, collections});
            }
            break;

        case ActionTypes.CLOSE_OVERLAY:
            console.log('close overlay');
            state = state.set('activeOverlay', '');
            break;

// signup actions
        case ActionTypes.ADD_DOCUMENT:
            console.log('adding document');
            state = state.setIn(['temp', 'docs', action.fileType], action.file);
            break;

        case ActionTypes.ACCEPT_AGREEMENT:
            console.log('accept agreement');
            state = state.setIn(['temp', 'docs', action.fileType], action.isChecked);
            break;

// product actions
        case ActionTypes.ADD_TO_TRUCK:
            console.log('adding item(s) to truck: ', action.item);
            var item = action.item,
                truck = state.get('truck').toJS(),
                products = state.get('products').toJS();

            if(typeof(item.id) === 'number') {

                let index = _.findIndex(truck, ['id', item.id]);

                if(index >= 0) {
                    truck[index].qty += 1;

                    if(item.warranty) {
                        truck[index].warranty = item.warranty;
                        truck[index].warranty['qty'] = truck[index].qty;
                    } else {
                        truck[index].warranty = false;
                    }
                } else {
                    if(!item.qty) {
                        item['qty'] = 1
                    }

                    if(item.warranty) {
                        item['warranty'] = item.warranty;
                        item['warranty'].qty = item.qty;
                    } else {
                        item['warranty'] = false;
                    }
                    truck.push(item);
                }
            } else {
                _.each(item.products, (qty, id)=>{
                    let index = _.findIndex(truck, ['id', parseInt(id)]);

                    if(index >= 0) {
                        truck[index].qty += qty;
                        truck[index].warranty = item.warranty;
                    } else {
                        let product = _.find(products, ['id', parseInt(id)]);
                        product['qty'] = qty;
                        truck.push(product);
                    }
                });
            }

            state = state.update('truck', value=>Immutable.fromJS(truck));
            console.log('current Truck:', state.get('truck').toJS());
            break;
        case ActionTypes.REMOVE_FROM_TRUCK:
            console.log('removiing item: ' + action.item);
            var item = action.item,
                truck = state.get('truck').toJS();

            truck = _.remove(truck, (product)=>{ return product.id !== item.id });

            state = state.update('truck', value=>Immutable.fromJS(truck));
            console.log('current Truck:', state.get('truck').toJS());
            break;

        case ActionTypes.UPDATE_TRUCK:
            console.log('updating truck');
            state = state.update('truck', value=>Immutable.fromJS(action.truck));
            break;

        case ActionTypes.ADD_TO_COLLECTION:
            console.log('TODO: ASYNC CALL - add to ' + action.collectionID, action.productID);
            let collectionObj;

            if(action.collectionType === 'customMatchups') {
                let customMatchups = _.find(state.getIn(['activeUser','myMatchups']).toJS(), ['type', 'custom']);
                collectionObj = _.find(customMatchups.matchups, ['id', action.collectionID]);

            } else if (action.collectionType === 'myLists') {
                collectionObj = _.find(state.getIn(['activeUser','myLists']).toJS(), ['id', action.collectionID]);
            }

            state = productFunctions.addToListHelper(state, action.collectionType, collectionObj.id, action.productID);
            break;

        case ActionTypes.CREATE_NEW_LIST:
            let collectionID;
            console.log('TODO: ASYNC CALL - create new: ' + action.collectionType, action.collectionName);

            if(action.collectionType === 'customMatchups') {
                let myMatchups = state.getIn(['activeUser', 'myMatchups']).toJS();
                let customMatchups = _.find(myMatchups, ['type', 'custom']);
                collectionID = _.size(customMatchups.matchups);

                myMatchups = _.remove(myMatchups, (matchup)=>{return matchup.type !== 'custom'});

                customMatchups.matchups.push({id: collectionID, name: action.collectionName, price: 0, products: {}});

                myMatchups.push(customMatchups);

                state = state.updateIn(['activeUser', 'myMatchups'], value=>Immutable.fromJS(myMatchups));

                console.log('current myMatchups:', state.getIn(['activeUser', 'myMatchups']).toJS());

            } else if (action.collectionType === 'myLists') {
                let myLists = state.getIn(['activeUser', 'myLists']).toJS();
                collectionID = _.size(myLists);

                myLists.push({id: collectionID, name: action.collectionName, products: []});

                state = state.updateIn(['activeUser', 'myLists'], value=>Immutable.fromJS(myLists));
                state = state.set('activeOverlay', '');
                console.log('current myLists:', state.getIn(['activeUser', 'myLists']).toJS());

                browserHistory.push({ pathname: `#/products/myList-${ collectionID }` });
            }

            if(action.productID) {
                state = productFunctions.addToListHelper(state, action.collectionType, collectionID, parseInt(action.productID));
            }
            break;

        case ActionTypes.REMOVE_PRODUCT:
            console.log('delete call back');

            let collectionType = action.obj.collectionType;
            let productID = (action.obj.productID) ? action.obj.productID : '';

            let myList = state.getIn(['activeUser', collectionType]).toJS();

            if(productID.toString()) {
                let collection = _.find(myList, ['id', action.obj.collectionID]);
                myList = _.remove(myList, (collection)=>{return collection.id !== action.obj.collectionID});

                collection.products = _.remove(collection.products, (thisProductID)=>{ return parseInt(thisProductID) !== productID});

                myList.push(collection);

            } else {
                myList = _.remove(myList, (collection)=>{ return collection.id !== parseInt(action.obj.collectionID) });
                browserHistory.push({ pathname: action.obj.redirect });
            }

            state = state.updateIn(['activeUser', collectionType], value=>Immutable.fromJS(myList));
            state = state.set('activeOverlay', '');
            break;

        case ActionTypes.REMOVE_COLLECTION:
            console.log('delete call back list');

            if(action.collectionType === 'customMatchup') {
                let myMatchups = state.getIn(['activeUser', 'myMatchups']).toJS();
                let customMatchups = _.find(myMatchups, ['type', 'custom']);

                myMatchups = _.remove(myMatchups, (matchup)=>{ return matchup.type !== 'custom' });
                customMatchups.matchups = _.remove(customMatchups.matchups, (matchup)=>{ return matchup.id !== parseInt(action.collectionID) });

                myMatchups.push(customMatchups);

                state = state.updateIn(['activeUser', 'myMatchups'], value=>Immutable.fromJS(myMatchups));
            }
            break;

        case ActionTypes.CHECKING_INVENTORY:
            console.log('checking inventory:' , action.location, action.product);
            state = state.set('activeOverlay', '');

            //TODO: remove this is dummy data check
            if(action.location.name === 'West Phoenix') {
                let locations = state.get('productLocations').toJS();

                var index = _.findIndex(locations, (location)=>{ return location.id === action.location.id });
                locations[index].stock = 0;

                state = state.update('productLocations', value=>Immutable.fromJS(locations));
                state = state.update('isInStock', value=>false);
            } else {
                state = state.update('isInStock', value=>true);
            }

            break;
        default:
            return state;
    }
    return state;
};
