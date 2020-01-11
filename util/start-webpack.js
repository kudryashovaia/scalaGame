'use strict';

// Do this as the first thing so that any code reading it knows the right env.
process.env.BABEL_ENV = 'development';
process.env.NODE_ENV = 'development';

process.on('unhandledRejection', err => { throw err; });

const fs = require("fs");
let options = JSON.parse(fs.readFileSync("package.json")).webpackOptions;

const chalk = require("chalk");
const webpack = require("webpack");
const WebpackDevServer = require("webpack-dev-server");
const formatWebpackMessages = require("react-dev-utils/formatWebpackMessages");

const webpackConfig = require('./webpack.config.dev');

let compiler;
try {
  compiler = webpack(webpackConfig);
} catch (err) {
  console.log(chalk.red('Failed to compile.'));
  console.log();
  console.log(err.message || err);
  console.log();
  process.exit(1);
}

compiler.plugin('invalid', () => {
  console.log('Compiling...');
});

compiler.plugin('done', stats => {
  const messages = formatWebpackMessages(stats.toJson({}, true));
  const isSuccessful = !messages.errors.length && !messages.warnings.length;
  if (isSuccessful) {
    console.log(chalk.green('Compiled successfully!'));
  }

  // If errors exist, only show errors.
  if (messages.errors.length) {
    console.log(chalk.red('Failed to compile.\n'));
    console.log(messages.errors.join('\n\n'));
    return;
  }

  // Show warnings if no errors were found.
  if (messages.warnings.length) {
    console.log(chalk.yellow('Compiled with warnings.\n'));
    console.log(messages.warnings.join('\n\n'));
  }
});

const devServer = new WebpackDevServer(compiler, {
  compress: true,
  // Silence WebpackDevServer's own logs since they're generally not useful.
  // It will still show compile warnings and errors with this setting.
  clientLogLevel: 'none',
  contentBase: "src/public",
  // By default files from `contentBase` will not trigger a page reload.
  watchContentBase: true,
  // Enable hot reloading server. It will provide /sockjs-node/ endpoint
  // for the WebpackDevServer client so it can learn when the files were
  // updated. The WebpackDevServer client is included as an entry point
  // in the Webpack development configuration. Note that only changes
  // to CSS are currently hot reloaded. JS changes will refresh the browser.
  hot: true,
  publicPath: "/",
  quiet: true,
  watchOptions: {
    ignored: /node_modules|target|logs/
  },
  historyApiFallback: {
    disableDotRule: true,
  },
  proxy: { "/**": options.proxy }
});

let port = options.port || 3000;
let host = options.host || "0.0.0.0";
devServer.listen(port, host, err => {
  console.log(chalk.cyan("Starting the development server on " + host + ":" + port + "...\n"));
});

['SIGINT', 'SIGTERM'].forEach(function(sig) {
  process.on(sig, function() {
    devServer.close();
    process.exit();
  });
});
