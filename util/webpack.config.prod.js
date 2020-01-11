'use strict';

const path = require('path');
const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const InterpolateHtmlPlugin = require('react-dev-utils/InterpolateHtmlPlugin');

module.exports = {
  bail: true,
  devtool: 'source-map',
  entry: [
    "babel-polyfill",
    "./app/client/index.tsx"
  ],
  output: {
    path: path.resolve("./target/build"),
    filename: 'static/js/[name].[chunkhash:8].js',
    publicPath: "/",
    devtoolModuleFilenameTemplate: info => path.relative("app/client/", info.absoluteResourcePath)
  },
  resolve: {
    modules: ['node_modules'],
    extensions: ['.js', '.json', '.jsx', ".ts", ".tsx"]
  },
  module: {
    strictExportPresence: true,
    rules: [

      // ** ADDING/UPDATING LOADERS **
      // The "file" loader handles all assets unless explicitly excluded.
      // The `exclude` list *must* be updated with every change to loader extensions.
      // When adding a new loader, you must add its `test`
      // as a new entry in the `exclude` list in the "file" loader.

      // "file" loader makes sure those assets end up in the `build` folder.
      // When you `import` an asset, you get its filename.
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
        }
      },

      // "url" loader works just like "file" loader but it also embeds
      // assets smaller than specified size as data URLs to avoid requests.
      {
        test: [/\.bmp$/, /\.gif$/, /\.jpe?g$/, /\.png$/],
        loader: require.resolve('url-loader'),
        options: {
          limit: 10000,
          name: 'static/media/[name].[hash:8].[ext]'
        }
      },

      // Process JS with Babel.
      {
        test: /\.(js|jsx)$/,
        include: path.resolve("app/client"),
        loader: require.resolve('babel-loader'),
        options: {
          compact: true
        }
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
      // "style" loader normally turns CSS into JS modules injecting <style>,
      // but unlike in development configuration, we do something different.
      // `ExtractTextPlugin` first applies the "postcss" and "css" loaders
      // (second argument), then grabs the result CSS and puts it into a
      // separate file in our build process. This way we actually ship
      // a single CSS file in production instead of JS code injecting <style>
      // tags. If you use code splitting, however, any async bundles will still
      // use the "style" loader inside the async code so CSS from them won't be
      // in the main CSS file.
      {
        test: /\.css$/,
        loader: ExtractTextPlugin.extract(
          Object.assign(
            {
              fallback: require.resolve('style-loader'),
              use: [
                {
                  loader: require.resolve('css-loader'),
                  options: {
                    importLoaders: 1,
                    minimize: true,
                    sourceMap: true,
                  },
                },
              ],
            }
          )
        )
        // Note: this won't work without `new ExtractTextPlugin()` in `plugins`.
      },

      {
        test: /\.scss$/,
        loader: ExtractTextPlugin.extract(
          Object.assign(
            {
              fallback: require.resolve('style-loader'),
              use: [
                {
                  loader: require.resolve('css-loader'),
                  options: {
                    importLoaders: 1,
                    minimize: true,
                    sourceMap: true,
                  },
                },
                {
                  loader: require.resolve("sass-loader"),
                  options: {
                    outputStyle: "compressed",
                    sourceMap: true
                  }
                }
              ],
            }
          )
        )
      }

      // ** STOP ** Are you adding a new loader?
      // Remember to add the new extension(s) to the "file" loader exclusion list.
    ]
  },
  plugins: [
    // Generates an `index.html` file with the <script> injected.
    new HtmlWebpackPlugin({
      filename: "lk.html",
      inject: true,
      template: "app/client/index.html",
      minify: {
        removeComments: true,
        collapseWhitespace: true,
        removeRedundantAttributes: true,
        useShortDoctype: true,
        removeEmptyAttributes: true,
        removeStyleLinkTypeAttributes: true,
        keepClosingSlash: true,
        minifyJS: true,
        minifyCSS: true,
        minifyURLs: true
      },
    }),
    new webpack.DefinePlugin({
      'process.env': { NODE_ENV: '"production"' }
    }),
    // Minify the code.
    new webpack.optimize.UglifyJsPlugin({
      compress: {
        warnings: false,
        // Disabled because of an issue with Uglify breaking seemingly valid code:
        // https://github.com/facebookincubator/create-react-app/issues/2376
        // Pending further investigation:
        // https://github.com/mishoo/UglifyJS2/issues/2011
        comparisons: false
      },
      output: {
        comments: false,
        // Turned on because emoji and regex is not minified properly using default
        // https://github.com/facebookincubator/create-react-app/issues/2488
        ascii_only: true
      },
      sourceMap: true
    }),
    new ExtractTextPlugin({
      filename: 'static/css/[name].[contenthash:8].css',
    }),
    // see https://github.com/jmblog/how-to-optimize-momentjs-with-webpack
    new webpack.ContextReplacementPlugin(/moment[\/\\]locale$/, /en|ru/)
  ],
  // Some libraries import Node modules but don't use them in the browser.
  // Tell Webpack to provide empty mocks for them so importing them works.
  node: {
    dgram: 'empty',
    fs: 'empty',
    net: 'empty',
    tls: 'empty',
  },
};
