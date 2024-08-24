const HtmlWebpackPlugin = require("html-webpack-plugin");
const ModuleFederationPlugin = require("webpack/lib/container/ModuleFederationPlugin");
const path = require('path');

const deps = require("./package.json").dependencies;
module.exports = {
  entry: "./src/index",
  cache: false,

  mode: "development",
  devtool: "source-map",

  optimization: {
    minimize: false,
  },

  output: {
    publicPath: "http://localhost:3004/",
  },

  resolve: {
    extensions: [".jsx", ".js", ".json"],
  },
  module: {
    rules: [
      {
        test: /\.m?js/,
        type: "javascript/auto",
        resolve: {
          fullySpecified: false,
        },
      },      
    ],
  },

  plugins: [
    new ModuleFederationPlugin({
      name: "Maesto",
      filename: "remoteEntry.js",
      remotes: {      
        AuthApp: "AuthApp@http://localhost:3001/remoteEntry.js", 
        CardsApp: "CardsApp@http://localhost:3002/remoteEntry.js",
        ProfileApp: "ProfileApp@http://localhost:3003/remoteEntry.js" 
      },

      shared: {
        ...deps,
        react: {
          singleton: true,
          requiredVersion: deps.react,
        },
        "react-dom": {
          singleton: true,
          requiredVersion: deps["react-dom"],
        },                
      },
    }),
    new HtmlWebpackPlugin({
      template: "./public/index.html",
      chunks: ["main"],
    }),
  ],
};
