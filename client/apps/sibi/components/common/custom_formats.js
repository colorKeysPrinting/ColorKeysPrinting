

//
//
// example: (1000).formatMoney(2, '.', ',') => 1,000.00
// example: (1000).formatMoney(2, '.')      => 1,000.00
// example: (1000).formatMoney(2)           => 1,000.00
// example: (1000).formatMoney(2, ',', '.') => 1.000,00
// example: (1000).formatMoney(2, '-', '-') => 1-000-00
// example: (1000).formatMoney(3, '.', ',') => 1.000,000
//
////////////////////////////////////////////////////////////
Number.prototype.formatMoney = function(cents, decimal, thousand){
var num = this,
    cents = isNaN(cents = Math.abs(cents)) ? 2 : cents,
    decimal = decimal == undefined ? "." : decimal,
    thousand = thousand == undefined ? "," : thousand,
    sign = num < 0 ? "-" : "",
    i = String(parseInt(num = Math.abs(Number(num) || 0).toFixed(cents))),
    j = (j = i.length) > 3 ? j % 3 : 0;

   return sign + (j ? i.substr(0, j) + thousand : "") + i.substr(j).replace(/(\d{3})(?=\d)/g, "$1" + thousand) + (cents ? decimal + Math.abs(num - i).toFixed(cents).slice(2) : "");
 };