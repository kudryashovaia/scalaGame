'use strict';

// Do this as the first thing so that any code reading it knows the right env.
process.env.BABEL_ENV = 'production';
process.env.NODE_ENV = 'production';

process.on('unhandledRejection', err => { throw err; });

const path = require('path');
const fs = require('fs-extra');
const webpack = require('webpack');
const formatWebpackMessages = require('react-dev-utils/formatWebpackMessages');
const FileSizeReporter = require('react-dev-utils/FileSizeReporter');

const webpackConfig = require('./webpack.config.prod');

FileSizeReporter.measureFileSizesBeforeBuild("target/build")
  .then(previousFileSizes => {

    fs.emptyDirSync("target/build");

    return build(previousFileSizes);
  })
  .then(
    ({ stats, previousFileSizes, warnings }) => {
      if (warnings.length) {
        console.log('Compiled with warnings.\n');
        console.log(warnings.join('\n\n'));
      } else {
        console.log('Compiled successfully.\n');
      }

      // These sizes are pretty large. We'll warn for bundles exceeding them.
      const WARN_AFTER_BUNDLE_GZIP_SIZE = 512 * 1024;
      const WARN_AFTER_CHUNK_GZIP_SIZE = 1024 * 1024;

      console.log('File sizes after gzip:\n');
      FileSizeReporter.printFileSizesAfterBuild(
        stats,
        previousFileSizes,
        "target/build",
        WARN_AFTER_BUNDLE_GZIP_SIZE,
        WARN_AFTER_CHUNK_GZIP_SIZE
      );
    },
    err => {
      console.log('Failed to compile.\n');
      console.log((err.message || err) + '\n');
      process.exit(1);
    }
  );

// Create the production build and print the deployment instructions.
function build(previousFileSizes) {
  console.log('Creating an optimized production build...');

  let compiler = webpack(webpackConfig);
  return new Promise((resolve, reject) => {
    compiler.run((err, stats) => {
      if (err) {
        return reject(err);
      }
      const messages = formatWebpackMessages(stats.toJson({}, true));
      if (messages.errors.length) {
        return reject(new Error(messages.errors.join('\n\n')));
      }

      return resolve({
        stats,
        previousFileSizes,
        warnings: messages.warnings
      });
    });
  });
}
