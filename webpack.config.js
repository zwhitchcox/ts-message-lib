// webpack.config.js
module.exports = {
  entry  : './index.js',
  output : {
    path     : 'dist',
    filename : 'ts-message-lib.js'
  },
  target: 'node',
  module : {
    loaders: [ {
        test   : /.js$/,
        loader : 'babel-loader'
      }
    ]
  }
};