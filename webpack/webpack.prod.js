const WebpackConfig = require('./webpack.config');

module.exports = WebpackConfig({
    env             : 'production',
    APP_NAME        : 'sibi_ge_admin',
    ASSETS_PORT     : 8080,
    HOST            : 'http://sibi-ge-admin.s3-website-us-west-2.amazonaws.com',
    API_URL         : 'http://sibi-uat.sibipro.com'
});