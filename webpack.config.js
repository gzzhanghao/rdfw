'use strict'

module.exports = {
  entry: './src',
  output: {
    path: 'dist',
    filename: 'rdfw.js',
    library: 'rdfw',
    libraryTarget: 'umd'
  },
  module: {
    loaders: [
      { test: /\.js$/, loader: 'babel-loader?compact' }
    ]
  }
}
