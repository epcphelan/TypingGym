const merge = require('webpack-merge');
const common = require('./webpack.common.js');

const dev ={
  mode: 'development',
  devServer: {
    contentBase: './dist',
    historyApiFallback: true,
    hot: true,
    inline: true,
    port: 3000, // Defaults to 8080
  }
};

module.exports = merge(common,dev);