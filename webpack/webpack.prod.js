const WebpackConfig = require('./webpack.config');

module.exports = WebpackConfig({
    env             : 'production',
    APP_NAME        : 'sibi_ge_admin',
    ASSETS_PORT     : 8080,
    HOST            : '<s3 url>'
});