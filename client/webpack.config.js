const path = require("path");
const webpack = require("webpack");

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
        test: /\.css$/,
        use: ["style-loader", "css-loader"]
      },
      {
        test: /\.less$/,
        use: [{
          loader: 'style-loader',
        }, {
          loader: 'css-loader', // translates CSS into CommonJS
        }, {
          loader: 'less-loader', // compiles Less to CSS
          options: { 
            modifyVars: {
              '@font-family': "'Merriweather', 'Georgia', serif",
              '@layout-body-background': '#fff',
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
    // publicPath: "/dist/",
    filename: "bundle.js"
  },
  devServer: {
    contentBase: path.join(__dirname, "public/"),
    port: 3000,
    publicPath: "http://localhost:3000/dist/",
    hotOnly: true
  },
  // plugins: [new webpack.HotModuleReplacementPlugin()]
};