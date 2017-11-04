const WebpackConfig = require('./webpack.config');

module.exports = WebpackConfig({
    env             : 'development',
    APP_NAME        : 'color_keys_printing_dev',
    // HOST            : 'example.com', // set this if you need to use a domain other than localhost
    // PORT            : 3001, // set this if you need to change the dev port
    // API_URL         : ''
});