const webpack               = require('webpack');
const path                  = require('path');
const HtmlWebpackPlugin     = require('html-webpack-plugin');
const ExtractTextPlugin     = require('extract-text-webpack-plugin');
const AssetsPlugin          = require('assets-webpack-plugin');

module.exports = WebpackConfig = (app) => {

    const plugins = [
        new webpack.DefinePlugin({
            'process.env'   : Object.assign({}, {
                NODE_ENV    : JSON.stringify(app.env)
            })
        }),
        new ExtractTextPlugin(`${app.APP_NAME}.css`),
        new HtmlWebpackPlugin({
            title: JSON.stringify(app.name),
            filename: 'index.html',
            template: '../src/html/index.html'
        }),
        // new AssetsPlugin({
        //     path: app.outputPath,
        //     fullPath: false,
        //     filename: `${app.APP_NAME}.assets.json`
        // }),
        (app.env === 'production') ? new webpack.LoaderOptionsPlugin({
            minimize: true,
            debug: false
        }) : null
    ].filter(Boolean);

    const loaders = [
        { test: /\.(js|jsx)$/, use: 'babel-loader', exclude: /node_modules/ },
        { test: /\.scss$/, loaders: ExtractTextPlugin.extract('css-loader!autoprefixer-loader!sass-loader')},
        { test: /.*\.(pdf|gif|png|jpg|jpeg|svg)$/, use: ['file-loader?name=[hash].[ext]'] },
        { test: /.*\.(eot|woff2|woff|ttf)$/,       use: ['file-loader?name=[hash].[ext]'] }
    ];

    return {
        context: path.resolve(__dirname, '../src'),
        entry: 'app',
        output: {
            path: path.resolve(__dirname, `../build/${app.env}`),
            filename: `${app.APP_NAME}.bundle.js`,
            sourceMapFilename: `${app.APP_NAME}.map`,
            publicPath: '/'
        },
        resolve: {
            extensions: ['.js', '.json', '.jsx', '.scss', '.less', '.css'],
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
            port: parseInt(app.ASSETS_PORT, 10) || 8080,
            stats: {
                cached: false,
                exclude: [/node_modules[\\/]react(-router)?[\\/]/]
            }
        }
    }
};
