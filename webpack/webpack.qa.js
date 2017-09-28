const WebpackConfig = require('./webpack.config');

module.exports = WebpackConfig({
    env             : 'development',
    APP_NAME        : 'sibi_ge_admin_qa',
    API_URL         : 'https://sibi-qa.herokuapp.com',
    ORDER_URL       : 'https://ge-qa.sibipro.com'
});