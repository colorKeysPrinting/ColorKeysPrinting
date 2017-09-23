'use strict';

import _                        from 'lodash';
import Immutable                from 'immutable';
import { Cookies }              from 'react-cookie';
import { ActionTypes }          from './actions';

// /////////////////////////////////////
//             REDUCER
// /////////////////////////////////////
const initialState = Immutable.fromJS({
    product: {},
    productImage: '',
    color: '',
    Question: '',
    Answer: '',
    videoURL: '',
});

export default (state = initialState, action) => {
    let products, product, sortIndex, parts, part, index, videos, faq, applianceColorsInfo;

    switch (action.type) {
    case ActionTypes.CLEAR_PRODUCT:
        console.log('clearing product');
        state = state.set('product', {});
        break;

    case ActionTypes.NEW_PRODUCT:
        let modelNumber = state.getIn(['product', 'sibiModelNumber']);
        let category = state.getIn(['product','productCategoryId']);
        sortIndex = state.getIn(['product','sortIndex']);
        product = {
            id                          : '',
            // ***************** the following are required for new products *****************
            name                        : '',
            sibiModelNumber             : (modelNumber) ? modelNumber : '',
            productCategoryId           : (category) ? category : '',
            productSubcategoryId        : '',
            sku                         : '',

            // ***************** the following are optional *****************
            serialNumber                : '',
            shortDescription            : '',
            overview                    : '',
            faq                         : [],
            videos                      : [],
            sortIndex                   : sortIndex || 0,

            // ***************** product category section (no required) *****************
            // *****************
            applianceManufacturerName   : '',
            applianceType               : '',
            applianceSize               : '',
            applianceDescription        : '',
            applianceFuelType           : '',
            applianceWidth              : '',
            applianceHeight             : '',
            applianceDepth              : '',
            applianceInstallDescription : '',
            applianceInstallPrice       : '',
            applianceInstallCode        : '',
            applianceColorsInfo         : [],
            applianceSpecSheetUrl       : '',
            applianceRemovalDescription : '',
            applianceRemovalCode        : '',
            applianceRemovalPrice       : '',
            applianceAssociatedParts    : [],
            // *****************
            hvacSeerRating              : '',
            hvacEfficiencyRating        : '',
            hvacVoltageRating           : '',
            hvacTonnage                 : '',
            hvacBtuAmount               : '',
            // *****************
            paintCategory               : '',
            paintType                   : '',
            paintQuantitySize           : '',
            paintFinish                 : '',
            paintQuality                : '',
            paintColorNumber            : '',
            paintColorName              : ''
        };

        state = state.set('product', Immutable.fromJS(product));
        break;

    case ActionTypes.UPDATE:
        if (action.isProduct) {
            state = state.updateIn(['product', action.key], value=>action.value);
            if (action.key === 'productSubcategoryId') {
                // TODO: need to update the sortIndex
            }
        } else {
            state = state.set(action.key, action.value);
        }
        break;

    case ActionTypes.ADD_COLOR_AND_IMAGE:
        const imageUrl = state.get('productImage');
        const color = state.get('color');
        applianceColorsInfo = state.getIn(['product','applianceColorsInfo']).toJS();
        applianceColorsInfo.push({ color, imageUrl });

        state = state.updateIn(['product', 'applianceColorsInfo'], value=>Immutable.fromJS(applianceColorsInfo));
        state = state.set('productImage', '');
        state = state.set('color', '');
        break;

    case ActionTypes.REMOVE_COLOR_AND_IMAGE:
        applianceColorsInfo = state.getIn(['product','applianceColorsInfo']).toJS();
        applianceColorsInfo = _.remove(applianceColorsInfo, (element) => { return element.color !== action.color } );
        state = state.updateIn(['product', 'applianceColorsInfo'], value=>Immutable.fromJS(applianceColorsInfo));
        break;

    case ActionTypes.ADD_VIDEO:
        videos = state.getIn(['product', 'videos']).toJS();
        const videoURL = state.get('videoURL');
        videos.push(videoURL);
        state = state.updateIn(['product', 'videos'], value=>Immutable.fromJS(videos));
        state = state.set('videoURL', '');
        break;

    case ActionTypes.REMOVE_VIDEO:
        videos = state.getIn(['product', 'videos']).toJS();
        videos = _.remove(videos, (element, i) => { return i !== action.index } );
        state = state.updateIn(['product', 'videos'], value=>Immutable.fromJS(videos));
        break;

    case ActionTypes.ADD_FAQ:
        faq = state.getIn(['product', 'faq']).toJS();
        const Question = state.get('Question');
        const Answer = state.get('Answer');
        faq.push({ Question, Answer });
        state = state.updateIn(['product', 'faq'], value=>Immutable.fromJS(faq));
        state = state.set('Question', '');
        state = state.set('Answer', '');
        break;

    case ActionTypes.REMOVE_FAQ:
        faq = state.getIn(['product', 'faq']).toJS();
        faq = _.remove(faq, (element, i) => { return i !== action.index } );
        state = state.updateIn(['product', 'faq'], value=>Immutable.fromJS(faq));
        break;


    case ActionTypes.GET_PRODUCT_BY_ID_SUCCESS:
        console.log('receiving product');
        state = state.set('product', Immutable.fromJS(action.data));
        sortIndex = (action.data.sortIndex) ? action.data.sortIndex + 1 : 1;
        state = state.updateIn(['product','sortIndex'], value=>sortIndex);
        break;

    case ActionTypes.CREATE_PRODUCT_PART_SUCCESS:
        console.log('create product part success');
        products = state.get('products').toJS();
        parts = state.get('parts').toJS();
        index = _.findIndex(products, ['id', action.config.headers.productId]);
        part = _.find(parts, ['id', action.config.headers.partId]);
        product = products[index];
        product.applianceAssociatedParts.push(part);
        products[index] = product;
        state = state.set('product', Immutable.fromJS(product));
        state = state.set('products', Immutable.fromJS(products));
        break;

    case ActionTypes.REMOVE_PART_SUCCESS:
        console.log('remove part success');
        const partId = (action.partId) ? action.partId : action.config.headers.partId;
        let applianceAssociatedParts = state.getIn(['product','applianceAssociatedParts']).toJS();
        applianceAssociatedParts = _.remove(product.applianceAssociatedParts, (part) => { return part.id !== partId });
        state = state.updateIn(['product', 'applianceAssociatedParts'], value=>Immutable.fromJS(applianceAssociatedParts));
        break;

    default:
        return state;
    }
    return state;
};