'use strict';

import Api                      from 'libs/network';

// /////////////////////////////////////
//             ACTION TYPES
// /////////////////////////////////////
export const ActionTypes = {
    GET_FUNDS_SUCCESS : 'sibi_ge_admin/users/GET_FUNDS_SUCCESS',
    GET_FUND_PROPERTIES_SUCCESS : 'sibi_ge_admin/users/GET_FUND_PROPERTIES_SUCCESS',
}

// /////////////////////////////////////
//             LOCAL ACTIONS
// /////////////////////////////////////

// /////////////////////////////////////
//             ASYNC CALLS
// /////////////////////////////////////
export function getFunds() {
    return (dispatch, getState) => {
        const email = (getState().activeUser.getIn(['activeUser','email'])).toLowerCase();
        const match = email.match(/^.*@(.+)$/)

        return Api({ url : `/funds?fundEmailDomain=${match[1]}` })
            .then(payload => {
                dispatch({ type: ActionTypes.GET_FUNDS_SUCCESS , ...payload });
            })
    }
}

export function getFundProperties() {
    return (dispatch) => {
        return Api({ url : `/fundsProperties` })
            .then(payload => {
                dispatch({ type: ActionTypes.GET_FUND_PROPERTIES_SUCCESS , ...payload });
            })
    }
}

export function getProperties() {
    return (dispatch) => {
        return Api({ url : `/products` })
            .then(payload => {
                dispatch({ type: ActionTypes.GET_PRODUCTS_SUCCESS , ...payload });
            })
    }
}

export function createProperty({ property }) {
    return (dispatch) => {
        return Api({
            method  : 'post',
            url     : `/createProperty`,
            data    : {
                ...property
            }
        })
            .then(payload => {
                dispatch(getUserPropertyCategories({ category }));
            })
    }
}

export function getPropertyCategories() {
    return (dispatch) => {
        return Api({ url : `/productCategories` })
            .then(payload => {
                dispatch({ type: ActionTypes.GET_PRODUCT_CATEGORIES_SUCCESS , ...payload });
            })
    }
}

export function getUserPropertyCategories({ category }) {
    return (dispatch) => {
        return Api({
            url     : `/productCategoriesForUser`,
            headers : {
                category
            }
        })
            .then(payload => {
                dispatch({ type: ActionTypes.GET_USER_PRODUCT_CATEGORIES_SUCCESS , ...payload });
            })
    }
}

export function getPropertiesForCategory({ categoryId, category }) {
    return (dispatch) => {
        return Api({
            url     : `/productsForCategory?categoryId=${categoryId}`,
            headers : {
                category
            }
        })
            .then(payload => {
                dispatch({ type: ActionTypes.GET_PRODUCTS_FOR_CATEGORY_SUCCESS , ...payload });
            })
    }
}

export function getPropertiesForSubCategory({ category, subCategory, subSubCategory }) {
    return (dispatch) => {
        const id = (subSubCategory) ? subSubCategory.id : subCategory.id;
        return Api({
            url     : `/productsForSubcategory?subcategoryId=${id}`,
            headers : {
                category,
                subCategory: subCategory.name,
                subSubCategory: (subSubCategory) ? subSubCategory.name : null
            }
        })
            .then(payload => {
                dispatch({ type: ActionTypes.GET_PRODUCTS_FOR_SUB_CATEGORY_SUCCESS , ...payload });
            })
    }
}

export function getParts() {
    return (dispatch) => {
        return Api({ url : `/parts` })
            .then(payload => {
                dispatch({ type: ActionTypes.GET_PARTS_SUCCESS , ...payload });
            })
    }
}

export function archiveProperty({ category, id }) {
    return (dispatch) => {
        return Api({
            method  : 'post',
            url     : `/products/${id}/archive`
        })
            .then(payload => {
                dispatch(getUserPropertyCategories({ category }));
            })
    }
}

export function unarchiveProperty({ category, id }) {
    return (dispatch) => {
        return Api({
            method  : 'post',
            url     : `/products/${id}/unarchive`
        })
            .then(payload => {
                dispatch(getUserPropertyCategories({ category }));
            })
    }
}