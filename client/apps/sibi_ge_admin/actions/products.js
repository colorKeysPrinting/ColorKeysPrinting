'use strict';

import ActionTypes      from '../constants/action_types';
import Network          from '../../../libs/constants/network';


// /////////////////////////////////////
//             ASYNC CALLS
// /////////////////////////////////////

// *************** product section ***************
export function getProducts({ token }) {
    return {
        type    : ActionTypes.GET_PRODUCTS,
        method  : Network.GET,
        url     : `${Network.DOMAIN}/products`,
        headers : {
            'x-auth-token': token
        }
    }
}

export function getProductCategories({ token }) {
    return {
        type    : ActionTypes.GET_PRODUCT_CATEGORIES,
        method  : Network.GET,
        url     : `${Network.DOMAIN}/productCategoriesForUser`,
        headers : {
            'x-auth-token': token
        }
    }
}

export function getProductsForCategory({ token, categoryId, category }) {
    return {
        type    : ActionTypes.GET_PRODUCTS_FOR_CATEGORY,
        method  : Network.GET,
        url     : `${Network.DOMAIN}/productsForCategory?categoryId=${categoryId}`,
        headers : {
            'x-auth-token': token,
            category
        }
    }
}

export function getProductsForSubCategory({ token, categoryId, category }) {
    return {
        type    : ActionTypes.GET_PRODUCTS_FOR_SUB_CATEGORY,
        method  : Network.GET,
        url     : `${Network.DOMAIN}/productsForSubcategory?subcategoryId=${categoryId}`,
        headers : {
            'x-auth-token': token,
            category
        }
    }
}

export function updateProduct({ token, category, product }) {
    return {
        type    : ActionTypes.UPDATE_PRODUCTS,
        method  : Network.PATCH,
        url     : `${Network.DOMAIN}/products/${product.id}`,
        headers : {
            'x-auth-token': token,
            category
        },
        body: {
            ...product
        }
    }
}

export function createProduct({ token, category, product }) {
    return {
        type    : ActionTypes.CREATE_PRODUCTS,
        method  : Network.POST,
        url     : `${Network.DOMAIN}/createProduct`,
        headers : {
            'x-auth-token': token,
            category
        },
        body: {
            ...product
        }
    }
}

export function removeProduct({ token, category, id }) {
    return {
        type    : ActionTypes.REMOVE_PRODUCT,
        method  : Network.DEL,
        url     : `${Network.DOMAIN}/products/${id}`,
        headers : {
            'x-auth-token': token,
            category
        }
    }
}

// *************** order section ***************
export function getOrderById({ token, id }) {
  console.log('Running this', token, id);
    return {
      type    : ActionTypes.GET_ORDER_BY_ID,
      method  : Network.GET,
      url     : `${Network.DOMAIN}/order/${id}`,
      headers : {
          'x-auth-token': token
      }
    }
}


export function getOrders({ token, orders }) {
    return {
        type    : ActionTypes.GET_ORDERS,
        method  : Network.GET,
        url     : `${Network.DOMAIN}/${orders}`,
        headers : {
            'x-auth-token': token
        }
    }
}

export function approveOrder({ token, id }) {
    return {
        type    : ActionTypes.APPROVE_ORDER,
        method  : Network.POST,
        url     : `${Network.DOMAIN}/order/${id}/approve`,
        headers : {
            'x-auth-token': token,
            orderId: id
        }
    }
}

export function updateOrder({ token, id, status }) {
    return {
        type    : ActionTypes.UPDATE_ORDER,
        method  : Network.PATCH,
        url     : `${Network.DOMAIN}/order/${id}`,
        headers : {
            'x-auth-token': token
        },
        body: {
            productsAndDestinations,
            fundPropertyId,
            tenantFirstName,
            tenantLastName,
            tenantPhone,
            tenantEmail,
            lockBoxCode,
            specialInstructions,
            customerPONumber,
            occupied,
            isApplianceHotShotDelivery,
            installDate,
            applianceDeliveryTime,
            installDate,
            applianceDeliveryTime
        }
    }
}

export function createOrder() {
    return {
        type    : ActionTypes.CREATE_ORDER,
        method  : Network.POST,
        url     : `${Network.DOMAIN}/createOrder`,
        headers : {
            'x-auth-token': token
        }
    }
}

export function removeOrder(token, id) {
    return {
        type    : ActionTypes.REMOVE_ORDER,
        method  : Network.DEL,
        url     : `${Network.DOMAIN}/order/${id}`,
        headers : {
            'x-auth-token': token
        }
    }
}

export function setActiveFilters(key, value) {
    return {
        type: ActionTypes.SET_ACTIVE_FILTERS,
        key,
        value
    }
}
