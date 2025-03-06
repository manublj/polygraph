// config-overrides.js
const webpack = require('webpack');
const path = require('path');
const NodePolyfillPlugin = require('node-polyfill-webpack-plugin');

module.exports = function override(config, env) {
  const fallback = {
    "crypto": require.resolve("crypto-browserify"),
    "stream": require.resolve("stream-browserify"),
    "assert": require.resolve("assert"),
    "http": require.resolve("stream-http"),
    "https": require.resolve("https-browserify"),
    "os": require.resolve("os-browserify"),
    "url": require.resolve("url"),
    "path": require.resolve("path-browserify"),
    "fs": false,
    "vm": false,
    "querystring": require.resolve("querystring-es3"),
    "net": false,
    "tls": false,
    "child_process": false,
    "http2": false,
    "zlib": false
  };

  config.resolve = {
    ...config.resolve,
    fallback: {
      "events": require.resolve("events/"),
      "process": require.resolve("process/browser"),
      "util": require.resolve("util/"),
      ...fallback
    }
  };

  config.plugins = [
    ...(config.plugins || []),
    new webpack.ProvidePlugin({
      process: 'process/browser',
      Buffer: ['buffer', 'Buffer']
    }),
    new NodePolyfillPlugin(),
    new webpack.ProvidePlugin({
      process: ["process/browser.js", "process"],
      Buffer: ["buffer", "Buffer"]
    })
  ];

  config.module.rules.push({
    test: /\.js$/,
    exclude: /node_modules/, 
    use: {
      loader: 'babel-loader',
      options: {
        presets: ['@babel/preset-env']
      }
    }
  });

  config.module.rules.push({
    test: /\.node$/,
    loader: 'node-loader',
    options: {
      name: '[name].[ext]'
    }
  });

  config.devServer = {
    setupMiddlewares: (middlewares, devServer) => {
      if (!devServer) {
        throw new Error('webpack-dev-server is not defined');
      }
      return middlewares;
    },
    hot: true,
    historyApiFallback: true,
    client: {
      overlay: true
    }
  };

  config.resolve.alias = {
    ...config.resolve.alias,
    'node-loader': require.resolve('node-loader')
  };

  return config;
};