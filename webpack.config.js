var HtmlWebpackPlugin = require('html-webpack-plugin');

var path = require('path');
var process = require('process');
var webpack = require('webpack');
var fs = require('fs');

var node_env = process.env.NODE_ENV || 'development';
var configPath = `config.${node_env}.js`;

var config = {};
if (fs.existsSync(`config.${node_env}.js`)) {
  config = require(`./config.${node_env}.js`);
}


var plugins = [
  new webpack.NoErrorsPlugin(),
  new HtmlWebpackPlugin({
    template: 'html!./src/index.html',
    title: 'Webedit',
    minify: {},
    inject: 'body',
    hash: true,
  }),
  new webpack.DefinePlugin({
    'process.env': {
      NODE_ENV: JSON.stringify(node_env)
    },
    __DEV__: JSON.stringify(node_env !== 'production'),
    __PROD__: JSON.stringify(node_env === 'production'),
    CONFIG: JSON.stringify(config),
    BASE_URL: JSON.stringify(`/${process.env.BASE_URL || ''}`),
  }),
];

if (node_env === 'production') {
  plugins.push(
    new webpack.optimize.UglifyJsPlugin()
  );
}

module.exports = {
  devtool: node_env === 'production' ? undefined : 'cheap-module-source-map',
  eslint: {
    configFile: './src/.eslintrc',
    failOnWarning: false,
    failOnError: true
  },
  context: __dirname,
  resolve: {
    root: path.resolve('src'),
    extensions: ['', '.jsx', '.js', '.json'],
    alias: {
      'bluebird': 'bluebird/js/browser/bluebird.min.js',
      'bonsai': 'bonsai/src/bootstrapper/_build/common.js',
    },
  },
  entry: [
    './src/index.js'
  ],
  output: {
    path: path.resolve('public'),
    filename: 'app-[hash].js',
    publicPath: ''
  },
  module: {
    loaders: [
      { test: /\.css$/, loader: 'style!css' },
      { test: /.*\.CSS\.js$/,
        loader: 'inline-css!babel!eslint',
        exclude: /(node_modules)/,
        include: /src/,
      },
      { test: /^((?!CSS\.js$).)*\.jsx?$/,
        exclude: /(node_modules)/,
        include: /src/,
        loader: 'babel!eslint',
      },
      { test: /\.(jpg|png|gif)$/, loader: 'file!image' },
      { test: /\.svg/, loader: 'url', include: /node_modules\/font-awesome/ },
      { test: /\.woff2?(\?v=.*)?$/, loader: 'url?limit=10000&minetype=application/font-woff' },
      { test: /\.(eot|ttf|otf)(\?v=.*)?$/, loader: 'url' },
      { test: /\.json$/, loader: 'json' },
      { test: /\.svg$/, loader: 'svg-inline' }
    ],
  },
  plugins,
};
