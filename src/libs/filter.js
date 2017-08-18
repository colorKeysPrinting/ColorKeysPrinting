'use strict';

import _            from 'lodash';

const checkObj = (obj) => {
    if (obj.type === 'select') {
        if (typeof obj.props.value === 'boolean') {
            return (obj.props.value) ? 'yes' : 'no';
        }
    }
}

export default function filter(searchTerm, keys, data) {
    searchTerm = searchTerm.toLowerCase();
    data = _.map(data, (element) => {
        let isFound = false;

        _.each(keys, (key) => {
            if (element[key]) {
                const value = (typeof element[key] === 'string')? element[key].toLowerCase() : checkObj(element[key]);

                if (_.includes(value, searchTerm) ) {
                    isFound = true;
                }
            }
        });

        if (isFound) {
            return element;
        }
    });

    return data;
}