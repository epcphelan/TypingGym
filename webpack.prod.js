const merge = require('webpack-merge');
const common = require('./webpack.common.js');
const webpack = require('webpack');

const prod = {
  mode: 'production',
  plugins:[
    new webpack.DefinePlugin({
      'process.env.NODE_ENV': JSON.stringify('production')
   })
  ]
};

module.exports = merge(common,prod);