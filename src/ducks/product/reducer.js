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

    productImage: {},
    isProductFound: false,
    modelNumberChanged: false,
    showProductDialog: false,
    Question: '',
    Answer: '',
    color: '',
    videoURL: '',
});

export default (state = initialState, action) => {
    let products, product, parts, part, index, videos, faq;

    switch (action.type) {
    case ActionTypes.CLEAR_PRODUCT:
        console.log('clearing product');
        state = state.set('product', {});
        break;

    case ActionTypes.NEW_PRODUCT:
        let modelNumber = state.getIn(['product', 'sibiModelNumber']);
        let category = state.getIn(['product','productCategoryId']);
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
            sortIndex                   : 0,

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
        state = state.set('modelNumberChanged', true);
        break;

    case ActionTypes.UPDATE:
        if (action.isProduct) {
            state = state.updateIn(['product', action.key], value=>action.value);
            if (action.key === 'sibiModelNumber') {
                state = state.set('modelNumberChanged', true);
            }
        } else {
            state = state.set(action.key, action.value);
        }
        break;

    case ActionTypes.UPDATE_IMAGE:
        const reader = new FileReader();
        reader.onload = (e) => {
            // imageUrl - use to show the image on the button
            // imageFile - use this to upload to server
            state = state.set('productImage', { imageUrl: e.target.result, imageFile: action.imageFile });
        }
        reader.readAsDataURL(action.imageFile);
        break;

    case ActionTypes.REMOVE_COLOR_AND_IMAGE:
        let applianceColorsInfo = state.getIn(['product','applianceColorsInfo']).toJS();
        applianceColorsInfo = _.remove(prevState.applianceColorsInfo, (element) => { return element.color !== action.color } );
        state = state.updateIn(['product', 'applianceColorsInfo'], value=>applianceColorsInfo);
        break;

    case ActionTypes.ADD_VIDEO:
        videos = state.getIn(['product', 'videos']).toJS();
        videos.push(action.videoURL);
        state = state.updateIn(['product', 'videos'], value=>videos);
        break;

    case ActionTypes.REMOVE_VIDEO:
        videos = state.getIn(['product', 'videos']).toJS();
        videos = _.remove(videos, (element, i) => { return i !== action.index } );
        state = state.updateIn(['product', 'videos'], value=>videos);
        break;

    case ActionTypes.ADD_FAQ:
        faq = state.getIn(['product', 'faq']).toJS();
        faq.push(action.videoURL);
        state = state.updateIn(['product', 'faq'], value=>faq);
        break;

    case ActionTypes.REMOVE_FAQ:
        faq = state.getIn(['product', 'faq']).toJS();
        faq = _.remove(faq, (element, i) => { return i !== action.index } );
        state = state.updateIn(['product', 'faq'], value=>faq);
        break;

    case ActionTypes.RESET_MODEL_NUMBER_CHANGE:
        state = state.set('modelNumberChanged', false);
        break;


    case ActionTypes.GET_PRODUCT_BY_ID_SUCCESS:
        console.log('receiving product');
        state = state.set('product', Immutable.fromJS(action.data));
        state = state.set('modelNumberChanged', false);
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

    case ActionTypes.ARCHIVE_PRODUCT_SUCCESS:
        console.log('archive call back');
        if (action.config.headers.subSubCategory) {
            products = state.getIn(['productsInCategory', action.config.headers.category, action.config.headers.subCategory, action.config.headers.subSubCategory]).toJS();
            index = _.findIndex(products, ['id', action.config.headers.id]);
            products[index].archived = action.data.archived;

            state = state.updateIn(['productsInCategory', action.config.headers.category, action.config.headers.subCategory, action.config.headers.subSubCategory], value => Immutable.fromJS(products));
        } else {
            products = state.getIn(['productsInCategory', action.config.headers.category, action.config.headers.subCategory]).toJS();
            index = _.findIndex(products, ['id', action.config.headers.id]);
            products[index].archived = action.data.archived;

            state = state.updateIn(['productsInCategory', action.config.headers.category, action.config.headers.subCategory], value => Immutable.fromJS(products));
        }
        break;

    case ActionTypes.UNARCHIVE_PRODUCT_SUCCESS:
        console.log('unarchive call back');
        if (action.config.headers.subSubCategory) {
            products = state.getIn(['productsInCategory', action.config.headers.category, action.config.headers.subCategory, action.config.headers.subSubCategory]).toJS();
            index = _.findIndex(products, ['id', action.config.headers.id]);
            products[index].archived = action.data.archived;

            state = state.updateIn(['productsInCategory', action.config.headers.category, action.config.headers.subCategory, action.config.headers.subSubCategory], value => Immutable.fromJS(products));
        } else {
            products = state.getIn(['productsInCategory', action.config.headers.category, action.config.headers.subCategory]).toJS();
            index = _.findIndex(products, ['id', action.config.headers.id]);
            products[index].archived = action.data.archived;

            state = state.updateIn(['productsInCategory', action.config.headers.category, action.config.headers.subCategory], value => Immutable.fromJS(products));
        }
        break;

    case ActionTypes.REMOVE_PART_SUCCESS:
        console.log('remove part success');
        const partId = (action.partId) ? action.partId : action.config.headers.partId;
        let applianceAssociatedParts = state.getIn(['product','applianceAssociatedParts']).toJS();
        applianceAssociatedParts = _.remove(product.applianceAssociatedParts, (part) => { return part.id !== partId });
        state = state.updateIn(['product', 'applianceAssociatedParts'], value=>applianceAssociatedParts);
        break;

    default:
        return state;
    }
    return state;
};