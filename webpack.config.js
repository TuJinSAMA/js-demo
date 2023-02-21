const path = require('path')
const HTMLWebPackPlugin = require('html-webpack-plugin')
const { CleanWebpackPlugin } = require('clean-webpack-plugin')
module.exports = {
  mode: 'development',
  entry: './ESNext/01-Iterator.js',
  output: {
    path: path.resolve("dist"),
    filename: 'bundle.js'
  },
  devtool: 'inline-source-map',
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: "babel-loader"
      }
    ]
  },
  plugins: [
    new CleanWebpackPlugin({
      cleanOnceBeforeBuildPatterns: ['./dist']
    }),
    new HTMLWebPackPlugin({
      template: './index.html'
    })
  ],
  devServer: {
    // contentBase: './dist',
    // stats: 'errors-only',
    compress: false,
    host: 'localhost',
    port: 3001,
    static: './'
  }
}