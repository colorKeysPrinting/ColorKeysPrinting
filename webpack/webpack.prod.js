const WebpackConfig = require('./webpack.config');

module.exports = WebpackConfig({
    env             : 'production',
    APP_NAME        : 'color_keys_printing',
    // API_URL         : ''
});