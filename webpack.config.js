var webpack = require('webpack')
// webpack.config.js
module.exports = {
  entry  : './index.js',
  output : {
    path     : 'dist',
    filename : 'ts-message-lib.js',
    libraryTarget: 'var',
    library: 'TS',
  },
  target: 'web',
  plugins: [
    new webpack.DefinePlugin({
      'process.env.TARGET': '"browser"',
    }),
    new webpack.optimize.UglifyJsPlugin()
  ],
  module : {
    loaders: [ {
        test   : /.js$/,
        loader : 'babel',
        query  : {
          babelrc: false,
          presets: [
            'es2015',
            'stage-0',
          ]
        }
      }
    ]
  }
}
