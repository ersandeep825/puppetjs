var path = require("path");
var webpack = require("webpack");

module.exports = {
  entry: "./src/index.js",
  devtool: "source-map",
  mode: "development",

  module: {
    rules: [
      {
        test: /\.(js|jsx|mjs)$/,
        loaders: "babel-loader",
        exclude: /node_modules/,
        //       use: ["babel-loader"]
        options: {
          cacheDirectory: true
        },
        query: {
          presets: ["es2015"]
        }
      },
      {
        test: /\.css$/,
        use: ["style-loader", "css-loader"]
      }
    ]
  },

  output: {
    path: path.resolve(__dirname, "dist"),
    filename: "main.js"
  },

  node: {
    fs: "empty"
  }
};
