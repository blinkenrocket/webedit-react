/* eslint no-sync: 0, no-undef: 0 */
const path = require('path');
const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const nodeEnv = (process.env.NODE_ENV || 'development').trim();
const DashboardPlugin = require('webpack-dashboard/plugin');
const fs = require('fs');

// eslint-disable-next-line
const __DEV__ = nodeEnv !== 'production';

let config = {};

if (fs.existsSync(`./config.${nodeEnv}.js`)) {
  config = require(`./config.${nodeEnv}.js`);
}

const devtool = __DEV__ ? '#source-map' : '';

const plugins = [
  new webpack.DefinePlugin({
    'process.env': {
      NODE_ENV: JSON.stringify(nodeEnv),
    },
    __DEV__: JSON.stringify(nodeEnv !== 'production'),
    __PROD__: JSON.stringify(nodeEnv === 'production'),
    CONFIG: JSON.stringify(config),
    BASE_URL: JSON.stringify(`${process.env.BASE_URL || ''}`),
    FIREBASE_API_KEY: JSON.stringify(`${process.env.FIREBASE_API_KEY || ''}`),
    FIREBASE_AUTH_DOMAIN: JSON.stringify(`${process.env.FIREBASE_AUTH_DOMAIN || ''}`),
    FIREBASE_PROJECT_ID: JSON.stringify(`${process.env.FIREBASE_PROJECT_ID || ''}`),
  }),
  new HtmlWebpackPlugin({
    filename: 'index.html',
    template: 'html-loader!src/index.html',
    minify: {},
    inject: 'body',
    hash: true,
  }),
];

if (__DEV__) {
  plugins.push(new DashboardPlugin());
} else {
  plugins.push(
    new webpack.optimize.UglifyJsPlugin({
      compress: {
        warnings: false,
      },
      output: {
        comments: false,
      },
      screwIe8: true,
      sourceMap: false,
    })
  );
}

module.exports = {
  context: __dirname,
  resolve: {
    // Extension die wir weglassen können
    extensions: ['.js', '.jsx'],
    modules: [path.resolve('src'), 'node_modules'],
    alias: {},
  },
  entry: ['babel-polyfill', './src/index.js'],
  output: {
    path: path.resolve('public'),
    filename: 'app-[hash].js',
    publicPath: `/${process.env.BASE_URL || ''}`,
  },
  module: {
    rules: [
      {
        test: /\.jsx?$/,
        exclude: /(node_modules|primusClient)/,
        loader: 'babel-loader',
        query: { cacheDirectory: true },
      },
      {
        test: /\.(CSS|css)\.js$/,
        exclude: /(node_modules)/,
        loader: 'inline-css-loader',
      },
      { test: /\.pdf$/, loader: 'file-loader' },
      { test: /\.(eot|ttf|otf|svg|woff2?)(\?.*)?$/, loader: 'file-loader' },
      { test: /\.(jpg|png|gif|jpeg|ico)$/, loader: 'url-loader' },
      { test: /\.json$/, loader: 'json-loader' },
      { test: /\.css$/, loader: 'style-loader!css-loader' },
      { test: /\.svg$/, loader: 'svg-inline-loader' },
    ],
  },
  plugins,
  devtool,
};
