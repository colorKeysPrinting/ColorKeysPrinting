'use strict';

import _            from 'lodash';

export default function filter(searchTerm, keys, data) {
    searchTerm = searchTerm.toLowerCase();
    data = _.map(data, (element) => {
        let isFound = false;

        _.each(keys, (key) => {
            if (element[key]) {
                const value = element[key].toLowerCase();

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