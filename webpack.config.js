const webpack               = require('webpack');
const path                  = require('path');
const DotenvPlugin          = require('webpack-dotenv-plugin');
const HtmlWebpackPlugin     = require('html-webpack-plugin');
const ExtractTextPlugin     = require('extract-text-webpack-plugin');
const CopyWebpackPlugin     = require('copy-webpack-plugin');
const CleanWebpackPlugin    = require('clean-webpack-plugin');

module.exports = WebpackConfig = (app) => {
  return {
    plugins: [
      new DotenvPlugin({
        sample: '.env.example',
        path: '.env'
      }),
      new webpack.DefinePlugin({
        'process.env' : Object.assign({}, {
          NODE_ENV: JSON.stringify(process.env.NODE_ENV) || 'development',
          GOOGLE_API_KEY: JSON.stringify(process.env.GOOGLE_API_KEY)
        })
      }),
      new CleanWebpackPlugin(['build'], {root: path.resolve(__dirname, './')}),
      new ExtractTextPlugin((process.env.NODE_ENV === 'development') ? `${process.env.APP_NAME}.css` : `${process.env.APP_NAME}_[hash].css`),
      new HtmlWebpackPlugin({
        title: `"${process.env.APP_NAME}"`,
        filename: 'index.html',
        template: 'index.html'
      }),
      new CopyWebpackPlugin([
        { from: '_redirects', to: './' },
        { from: 'robots.txt', to: './' },
        { from: 'favicon.ico', to: './' },
        { from: 'assets/images/favicon.png', to: './' },
        { from: '.htaccess', to: './' },
        { from: 'sitemap.xml', to: './' },
      ])
    ],
    module: {
      rules: [
        { test: /\.(js|jsx)$/,                      use: ['babel-loader','eslint-loader'], exclude: /node_modules/ },
        { test: /\.scss$/,                          use: ExtractTextPlugin.extract('css-loader!postcss-loader!sass-loader') },
        { test: /\.*\.(pdf|gif|png|jpg|jpeg|svg)$/, loader: 'file-loader', options: { name: '[name]_[hash].[ext]', useRelativePath: true, outputPath: path.resolve(__dirname, './build/images') }},
        { test: /\.*\.(eot|woff2|woff|ttf)$/,       loader: 'file-loader', options: { name: '[name]_[hash].[ext]', useRelativePath: true, outputPath: path.resolve(__dirname, './build/fonts') }}
      ]
    },
    context: path.resolve(__dirname, './src'),
    entry: 'app',
    output: {
      path: path.resolve(__dirname, './build/'),
      filename: (process.env.NODE_ENV === 'development') ? `${process.env.APP_NAME}.bundle.js` : `${process.env.APP_NAME}_[hash].bundle.js`,
      publicPath: '/'
    },
    resolve: {
      extensions: ['.js', '.json', '.jsx', '.scss'],
      modules: [
        path.resolve(__dirname, './node_modules'),
        path.resolve(__dirname, './src')
      ]
    },
    devtool: 'source-map',
    devServer: {
      contentBase: './src',
      historyApiFallback: true,
      host: process.env.HOST || 'localhost',
      port: parseInt(process.env.PORT, 10) || 3000,
      stats: {
        cached: false,
        exclude: [/node_modules[\\/]react(-router)?[\\/]/]
      }
    }
  };
};
