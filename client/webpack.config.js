const path = require("path");
const webpack = require("webpack");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");

module.exports = {
  entry: "./src/index.js",
  mode: "development",
  module: {
    rules: [
      {
        test: /\.(js|jsx)$/,
        exclude: /(node_modules|bower_components)/,
        loader: "babel-loader",
        options: { presets: ["@babel/env"] }
      },
      {
        test: /\.less$/,
        use: [
        {
          loader: MiniCssExtractPlugin.loader
        },
        {
          loader: 'css-loader'
        },
        {
          loader: 'less-loader', // compiles Less to CSS
          options: {
            modifyVars: {
              '@font-family': "'Merriweather', 'Georgia', serif",
              '@layout-body-background': '#fff',
              // '@layout-body-background': '#404040',
              // '@body-background': '#404041',
              // '@layout-sider-background': '#313131',
              // '@component-background': '#313132',
              // '@input-bg': '#313133',
              // '@btn-default-bg': '#262626',
              // '@border-color-base': '#1e1e1e',
              // '@border-color-split': '#262627',
              // '@heading-color': 'fade(#fff, 85%)',
              // '@text-color ': 'fade(#fff, 80%)',
              // '@primary-1': 'fade(#000, 15%)',
              // '@text-color-secondary ': 'fade(#fff, 65%)',
            },
            javascriptEnabled: true 
          }
        }]
      }
    ]
  },
  resolve: { extensions: ["*", ".js", ".jsx", ".less"] },
  output: {
    path: path.resolve(__dirname, "public/js/"),
    publicPath: "/writango/static/js/",
    filename: "bundle.js"
  },
  devServer: {
    contentBase: path.join(__dirname, "public/"),
    port: 3000,
    publicPath: "http://localhost:3000/dist/",
    hotOnly: true
  },
  plugins: [
    new MiniCssExtractPlugin({
      // Options similar to the same options in webpackOptions.output
      // both options are optional
      path: path.resolve(__dirname, "public/css/"),
      filename: "[name].css",
      // chunkFilename: "[id].css",
      publicPath: "/writango/static/css/",
    })
  ]
};