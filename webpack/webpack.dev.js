const WebpackConfig = require('./webpack.config');

module.exports = WebpackConfig({
    env             : 'development',
    APP_NAME        : 'sibi_ge_admin',
    ASSETS_PORT     : 3000,
    HOST            : 'localhost',
    API_URL         : 'https://sibi-development.herokuapp.com'
});