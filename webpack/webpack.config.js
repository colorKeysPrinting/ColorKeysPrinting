const webpack               = require('webpack');
const path                  = require('path');
const HtmlWebpackPlugin     = require('html-webpack-plugin');
const ExtractTextPlugin     = require('extract-text-webpack-plugin');
const CopyWebpackPlugin     = require('copy-webpack-plugin');
const CleanWebpackPlugin    = require('clean-webpack-plugin')

module.exports = WebpackConfig = (app) => {
    return {
        context: path.resolve(__dirname, '../src'),
        entry: 'app',
        output: {
            path: path.resolve(__dirname, `../build/`),
            filename: (app.env === 'development') ? `${app.APP_NAME}.bundle.js` : `${app.APP_NAME}_[hash].bundle.js`,
            publicPath: '/'
        },
        resolve: {
            extensions: ['.js', '.json', '.jsx', '.scss'],
            modules: [
                path.resolve(__dirname, '../node_modules'),
                path.resolve(__dirname, '../src')
            ]
        },
        plugins: [
            new webpack.DefinePlugin({
                'process.env'   : Object.assign({}, {
                    NODE_ENV    : `"${app.env}"`,
                    API_URL     : `"${app.API_URL}"`,
                    ORDER_URL   : `"${app.ORDER_URL}"`
                })
            }),
            new CleanWebpackPlugin(['build'], {root: path.resolve(__dirname, '../')}),
            new ExtractTextPlugin((app.env === 'development') ? `${app.APP_NAME}.css` : `${app.APP_NAME}_[hash].css`),
            new HtmlWebpackPlugin({
                title: `"${app.APP_NAME}"`,
                filename: 'index.html',
                template: '../src/index.html'
            }),
            new CopyWebpackPlugin([
                { from: '../_redirects', to: `./` },
                { from: '../robots.txt', to: `./` },
                { from: '../favicon.ico', to: `./` },
                { from: '../favicon.png', to: `./` },
            ])
        ],
        module: {
            rules: [
                { test: /\.(js|jsx)$/,                      use: ['babel-loader','eslint-loader'], exclude: /node_modules/ },
                { test: /\.scss$/,                          use: ExtractTextPlugin.extract('css-loader!postcss-loader!sass-loader') },
                { test: /\.*\.(pdf|gif|png|jpg|jpeg|svg)$/, loader: 'file-loader', options: { name: '[name]_[hash].[ext]', useRelativePath: true, outputPath: path.resolve(__dirname, `../build/images`) }},
                { test: /\.*\.(eot|woff2|woff|ttf)$/,       loader: 'file-loader', options: { name: '[name]_[hash].[ext]', useRelativePath: true, outputPath: path.resolve(__dirname, `../build/fonts`) }}
            ]
        },
        devtool: 'source-map',
        devServer: {
            contentBase: '../src',
            historyApiFallback: true,
            host: app.HOST || 'localhost',
            port: parseInt(app.PORT, 10) || 3000,
            stats: {
                cached: false,
                exclude: [/node_modules[\\/]react(-router)?[\\/]/]
            }
        }
    }
};
