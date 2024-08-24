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
    publicPath: "http://localhost:3001/",
  },

  resolve: {
    extensions: [".jsx", ".js", ".json"],
  },
  resolve: {
    alias: {
      'shared-context_shared-library': path.resolve(__dirname, '../shared'),
    },
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
      name: "AuthApp",
      filename: "remoteEntry.js",
      remotes: {},
      exposes: {
        "./Auth": "./src/Auth",
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
        'shared-context_shared-library': {
          import: 'shared-context_shared-library',
          requiredVersion: require('../shared/package.json').version,
        },      
      },
    }),
    new HtmlWebpackPlugin({
      template: "./public/index.html",
      chunks: ["main"],
    }),
  ],
};
