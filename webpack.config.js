const path = require('path');
const ExtractTextPlugin = require("extract-text-webpack-plugin");
const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
  entry: './src/main.js',
  output: {
    path: path.resolve(__dirname, './dist'),
    filename: './js/main.bundle.js'
  },
  module: {
    rules: [
        { test: /iview.src.*?js$/, loader: 'babel-loader' },
        { test: /\.js$/, loader: 'babel-loader', exclude: /node_modules/ },
        { test: /\.vue/, loader: 'vue-loader'},
        {
          test: /\.less$/,
          use: ExtractTextPlugin.extract({
            fallback: 'style-loader',
            use: ['css-loader', 'less-loader'],
          }),
        },
        {
          test: /\.js$/,
          exclude: /node_modules/,
          loader: 'babel-loader',
        },
        { test: /\.css$/, loader: 'style-loader!css-loader'},
        {
            test: /\.(gif|jpg|png|woff|svg|eot|ttf)\??.*$/,
            loader: 'url-loader?limit=8192'
        },
    ],
    loaders: [
      {
        test: /\.vue/,
        loader: 'vue-loader',
      }
    ]
  },
  plugins: [
    new ExtractTextPlugin('css/main.css'),
    new HtmlWebpackPlugin({
      template: path.resolve(__dirname, './index.html'),
    }),
  ]
};