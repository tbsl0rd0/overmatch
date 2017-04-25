var webpack = require('webpack');

module.exports = {
  context: __dirname,
  entry: {
    admin_components: './client/components/admin_components.js',
    index_components: './client/components/index_components.js'
  },
  output: {
    path: 'client/components/bundles',
    filename: '[name]_bundle.js'
  },
  module : {
    loaders : [
      {
        test : /\.less$/,
        loader : 'style!css!less'
      },
      {
        test : /\.html$/,
        loader : 'raw!html-minify'
      }
    ]
  }
}
