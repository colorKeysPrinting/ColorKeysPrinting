const webpack               = require('webpack');
const path                  = require('path');
const HtmlWebpackPlugin     = require('html-webpack-plugin');
const ExtractTextPlugin     = require('extract-text-webpack-plugin');
const CopyWebpackPlugin     = require('copy-webpack-plugin');

module.exports = WebpackConfig = (app) => {

    const plugins = [
        new webpack.DefinePlugin({
            'process.env'   : Object.assign({}, {
                NODE_ENV    : JSON.stringify(app.env),
                API_URL     : JSON.stringify(app.API_URL),
                ORDER_URL   : JSON.stringify(app.ORDER_URL)
            })
        }),
        new ExtractTextPlugin(`${app.APP_NAME}_[hash].css`),
        new HtmlWebpackPlugin({
            title: JSON.stringify(app.APP_NAME),
            filename: 'index.html',
            template: '../src/index.html'
        }),
        new CopyWebpackPlugin([
            { from: '../_redirects', to: `./` }
        ]),
        (app.env === 'production') ? new webpack.LoaderOptionsPlugin({
            minimize: true,
            debug: false
        }) : null
    ].filter(Boolean);

    const loaders = [
        { test: /\.(js|jsx)$/,                      use: ['babel-loader','eslint-loader'], exclude: /node_modules/ },
        { test: /\.(js|jsx)$/,                      use: 'source-map-loader',              exclude: /node_modules/, enforce: 'pre' },
        { test: /\.scss$/,                          use: ExtractTextPlugin.extract('css-loader!postcss-loader!sass-loader') },
        { test: /\.*\.(pdf|gif|png|jpg|jpeg|svg)$/, loader: 'file-loader', options: { name: '[name]_[hash].[ext]', useRelativePath: true, outputPath: path.resolve(__dirname, `../build/${app.env}/images`) }},
        { test: /\.*\.(eot|woff2|woff|ttf)$/,       loader: 'file-loader', options: { name: '[name]_[hash].[ext]', useRelativePath: true, outputPath: path.resolve(__dirname, `../build/${app.env}/fonts`) }}
    ];

    return {
        context: path.resolve(__dirname, '../src'),
        entry: 'app',
        output: {
            path: path.resolve(__dirname, `../build/${app.env}/`),
            filename: `${app.APP_NAME}_[hash].bundle.js`,
            sourceMapFilename: `[file].map`,
            devtoolModuleFilenameTemplate: (info) => {
                return `webpack:///${info.resourcePath}`
            },
            publicPath: '/'
        },
        resolve: {
            extensions: ['.js', '.json', '.jsx', '.scss', '.pdf', '.gif', '.png', '.jpg', '.jpeg', '.svg', '.eot', '.woff2', '.woff', '.ttf'],
            modules: [
                path.resolve(__dirname, '../node_modules'),
                path.resolve(__dirname, '../src')
            ]
        },
        plugins,
        module: { loaders },
        devtool: 'source-map',
        devServer: {
            contentBase: '../src',
            historyApiFallback: true,
            inline: true,
            host: app.HOST || 'localhost',
            port: parseInt(app.PORT, 10) || 3000,
            stats: {
                cached: false,
                exclude: [/node_modules[\\/]react(-router)?[\\/]/]
            }
        }
    }
};
