'use strict';

const path = require('path');
const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
  // see https://webpack.js.org/configuration/devtool/
  devtool: "cheap-module-source-map",
  entry: [
    "babel-polyfill",
    "react-dev-utils/webpackHotDevClient",
    "react-error-overlay",
    "./app/client/index.tsx",
  ],
  output: {
    path: path.resolve("./target/build"),
    pathinfo: true,
    filename: 'static/js/bundle.js',
    publicPath: "/",
    // Point sourcemap entries to original disk location
    devtoolModuleFilenameTemplate: info => path.resolve(info.absoluteResourcePath)
  },
  resolve: {
    modules: ['node_modules'],
    // These are the reasonable defaults supported by the Node ecosystem.
    // We also include JSX as a common component filename extension to support
    // some tools, although we do not recommend using it, see:
    // https://github.com/facebookincubator/create-react-app/issues/290
    // `web` extension prefixes have been added for better support
    // for React Native Web.
    extensions: ['.js', '.json', '.jsx', '.ts', '.tsx']
  },
  module: {
    strictExportPresence: true,

    rules: [

      // ** ADDING/UPDATING LOADERS **
      // The "file" loader handles all assets unless explicitly excluded.
      // The `exclude` list *must* be updated with every change to loader extensions.
      // When adding a new loader, you must add its `test`
      // as a new entry in the `exclude` list for "file" loader.

      // "file" loader makes sure those assets get served by WebpackDevServer.
      // When you `import` an asset, you get its (virtual) filename.
      // In production, they would get copied to the `build` folder.
      {
        exclude: [
          /\.html$/,
          /\.(js|jsx)$/,
          /\.(ts|tsx)$/,
          /\.css$/,
          /\.scss$/,
          /\.json$/,
          /\.bmp$/, /\.gif$/, /\.jpe?g$/, /\.png$/ // handled by url-loader
        ],
        loader: require.resolve('file-loader'),
        options: {
          name: 'static/media/[name].[hash:8].[ext]',
        },
      },

      // "url" loader works like "file" loader except that it embeds assets
      // smaller than specified limit in bytes as data URLs to avoid requests.
      {
        test: [/\.bmp$/, /\.gif$/, /\.jpe?g$/, /\.png$/],
        loader: require.resolve('url-loader'),
        options: {
          limit: 10000,
          name: 'static/media/[name].[hash:8].[ext]',
        },
      },

      // Process JS with Babel.
      {
        test: /\.(js|jsx)$/,
        include: path.resolve("app/client"),
        loader: require.resolve('babel-loader'),
        options: {
          // This is a feature of `babel-loader` for webpack (not Babel itself).
          // It enables caching results in ./node_modules/.cache/babel-loader/
          // directory for faster rebuilds.
          cacheDirectory: true
        },
      },

      // process TypeScript
      {
        test: /\.(ts|tsx)$/,
        include: path.resolve("app/client"),
        use: [
          {
            loader: require.resolve("babel-loader"),
            options: {
              presets: [
                "react"
              ]
            }
          },
          {
            loader: "ts-loader"
          }
        ]
      },

      // "css" loader resolves paths in CSS and adds assets as dependencies.
      // "style" loader turns CSS into JS modules that inject <style> tags.
      // In production, we use a plugin to extract that CSS to a file, but
      // in development "style" loader enables hot editing of CSS.
      {
        test: /\.css$/,
        use: [
          require.resolve('style-loader'),
          {
            loader: require.resolve('css-loader'),
            options: {
              importLoaders: 1,
            }
          }
        ]
      },

      {
        test: /\.scss$/,
        use: [
          require.resolve("style-loader"),
          {
            loader: require.resolve("css-loader"),
            options: {
              importLoaders: 1
            }
          },
          {
            loader: require.resolve("sass-loader"),
            options: {
              outputStyle: "expanded"
            }
          }
        ]
      }

      // ** STOP ** Are you adding a new loader?
      // Remember to add the new extension(s) to the "file" loader exclusion list.
    ]
  },
  plugins: [
    // Generates an `index.html` file with the <script> injected.
    new HtmlWebpackPlugin({
      filename: "index.html",
      inject: true,
      template: "app/client/index.html",
    }),
    // Add module names to factory functions so they appear in browser profiler.
    new webpack.NamedModulesPlugin(),
    // This is necessary to emit hot updates (currently CSS only):
    new webpack.HotModuleReplacementPlugin(),
    // see https://github.com/jmblog/how-to-optimize-momentjs-with-webpack
    new webpack.ContextReplacementPlugin(/moment[\/\\]locale$/, /en|ru/)
  ],
  // Some libraries import Node modules but don't use them in the browser.
  // Tell Webpack to provide empty mocks for them so importing them works.
  node: {
    dgram: 'empty',
    fs: 'empty',
    net: 'empty',
    tls: 'empty'
  },
  // Turn off performance hints during development because we don't do any
  // splitting or minification in interest of speed. These warnings become
  // cumbersome.
  performance: {
    hints: false
  },
  watch: true
};
