const WebpackConfig = require('./webpack.config');

module.exports = WebpackConfig({
    env             : 'development',
    APP_NAME        : 'sibi_ge_admin_uat',
    API_URL         : 'https://sibi-uat.sibipro.com',
    ORDER_URL       : 'https://ge-uat.sibipro.com'
});