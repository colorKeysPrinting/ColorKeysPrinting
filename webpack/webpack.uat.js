const WebpackConfig = require('./webpack.config');

module.exports = WebpackConfig({
    env             : 'development',
    APP_NAME        : 'sibi_ge_admin-uat',
    HOST            : 'localhost',
    API_URL         : 'https://sibi-uat.sibipro.com'
});