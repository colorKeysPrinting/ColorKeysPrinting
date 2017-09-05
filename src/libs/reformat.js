'use strict';

import _            from 'lodash';

export function formatPhoneNumbers(string) {
    let s2 = (""+string).replace(/\D/g, '');
    let m = s2.match(/^(\d{3})(\d{3})(\d{4})$/);
    return (!m) ? null : "(" + m[1] + ") " + m[2] + "-" + m[3];
}