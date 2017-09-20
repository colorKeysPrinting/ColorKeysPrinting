const WebpackConfig = require('./webpack.config');

module.exports = WebpackConfig({
    env             : 'production',
    APP_NAME        : 'sibi_ge_admin',
    API_URL         : 'https://sibi-prod.herokuapp.com/',
    ORDER_URL       : 'https://ge.sibipro.com/'
});