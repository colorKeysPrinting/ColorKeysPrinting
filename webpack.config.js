const webpack = require('webpack');
const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const CleanWebpackPlugin = require('clean-webpack-plugin');
const UglifyJsPlugin = require('uglifyjs-webpack-plugin');
const Dotenv = require('dotenv-webpack');

const config = {
  plugins: [
    new Dotenv(),
    new CleanWebpackPlugin(['build'], { root: path.resolve(__dirname, './') }),
    new MiniCssExtractPlugin({
      filename: `${process.env.APP_NAME}_[hash].css`,
    }),
    new HtmlWebpackPlugin({
      title: `"${process.env.APP_NAME}"`,
      filename: 'index.html',
      template: 'index.html',
    }),
    new CopyWebpackPlugin([
      { from: '_redirects', to: './' },
      { from: 'robots.txt', to: './' },
      { from: 'favicon.ico', to: './' },
      { from: 'assets/images/favicon.png', to: './' },
      { from: '.htaccess', to: './' },
      { from: 'sitemap.xml', to: './' },
    ]),
  ],
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        loader: 'source-map-loader',
        enforce: 'pre',
      },
      {
        test: /\.(js|jsx)$/,
        use: [
          'babel-loader',
          'eslint-loader'
        ],
        exclude: /node_modules/ },
      {
        test: /\.*\.(pdf|gif|png|jpg|jpeg|svg)$/,
        loader: 'file-loader',
        options: {
          name: '[name]_[hash].[ext]',
          useRelativePath: true,
          outputPath: path.resolve(__dirname, './build/images'),
        },
      },
      {
        test: /\.*\.(eot|woff2|woff|ttf)$/,
        loader: 'file-loader',
        options: {
          name: '[name]_[hash].[ext]',
          useRelativePath: true,
          outputPath: path.resolve(__dirname, './build/fonts'),
        },
      },
    ],
  },
  context: path.resolve(__dirname, './src'),
  entry: 'app',
  output: {
    path: path.resolve(__dirname, './build/'),
    filename: `${process.env.APP_NAME}.bundle.js`,
    publicPath: '/',
  },
  resolve: {
    extensions: ['.js', '.json', '.jsx'],
    modules: [path.resolve(__dirname, './node_modules'), path.resolve(__dirname, './src')],
  },
};

module.exports = (env, argv) => {
  if (argv.mode === 'development') {
    config.devtool = 'source-map';
    config.devServer = {
      contentBase: './src',
      historyApiFallback: true,
      host: process.env.HOST || 'localhost',
      port: parseInt(process.env.PORT, 10) || 3000,
      stats: {
        cached: false,
        exclude: [/node_modules[\\/]react(-router)?[\\/]/],
      },
    };
  }

  if (argv.mode === 'production') {
    config.optimization = {
      minimizer: [new UglifyJsPlugin({
        parallel: true,
        test: /\.js(\?.*)?$/i,
        exclude: /node_modules/
      })]
    };
  }

  return config;
};
