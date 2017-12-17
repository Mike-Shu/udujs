// Dependencies.
const Path = require('path');
const { optimize } = require('webpack');
const BrowserSyncPlugin = require('browser-sync-webpack-plugin');
const appPackage = require('./package');

const { UglifyJsPlugin } = optimize;
const PATH = {
  context: Path.resolve(__dirname),
  app: Path.resolve(__dirname, 'app'),
  src: Path.resolve(__dirname, 'src'),
  public: Path.resolve(__dirname, 'public'),
  test: Path.resolve(__dirname, 'test'),
};
let environment = process.env.NODE_ENV;
const exportConfig = [];
const rules = [];
const plugins = [];

if (typeof environment === 'undefined') {
  environment = 'development';
}

switch (environment) {
  //--------------------------------------------------
  case 'development':
    rules.push({
      test: /\.js$/,
      use: [
        {
          loader: 'babel-loader',
          options: {
            cacheDirectory: true,
            presets: [
              ['env', {
                modules: false,
                targets: {
                  browsers: ['> 2%'],
                },
              }],
            ],
          },
        },
      ],
    });

    plugins.push(new UglifyJsPlugin({
      sourceMap: true,
      beautify: true,
      mangle: false,
      compress: false,
    }));

    plugins.push(new BrowserSyncPlugin({
      proxy: 'http://udu.local/',
      host: 'localhost',
      port: 3000,
      files: [
        'public/index.html',
        'public/js/udu.js',
        'public/js/app.js',
      ],
    }));

    exportConfig.push({ // Library config
      entry: Path.resolve(PATH.src, 'Client.js'),
      output: {
        filename: 'udu.js',
        path: Path.resolve(PATH.public, 'js'),
        library: 'UduJS',
      },
      devtool: 'source-map',
      module: {
        rules,
      },
      plugins,
    });
    exportConfig.push({ // App config
      entry: Path.resolve(PATH.app, 'client-app.js'),
      output: {
        filename: 'app.js',
        path: Path.resolve(PATH.public, 'js'),
      },
      devtool: 'source-map',
      module: {
        rules,
      },
      plugins,
    });
    break;

  //--------------------------------------------------
  case 'production':
    rules.push({
      test: /\.js$/,
      exclude: /(node_modules)/,
      use: {
        loader: 'babel-loader',
        options: {
          cacheDirectory: true,
          presets: [
            ['env', {
              modules: false,
              targets: {
                browsers: ['> 2%'],
              },
            }],
          ],
        },
      },
    });

    plugins.push(new UglifyJsPlugin({
      beautify: false,
      comments: false,
      mangle: {
        screw_ie8: true,
        keep_fnames: true,
      },
      compress: {
        screw_ie8: true,
        sequences: true,
        booleans: true,
        loops: true,
        unused: true,
        warnings: true,
        drop_console: false,
        unsafe: true,
      },
    }));

    exportConfig.push({ // Library config
      entry: Path.resolve(PATH.src, 'Client.js'),
      output: {
        filename: `udujs-${appPackage.version}.min.js`,
        path: Path.resolve(__dirname, 'compiled'),
        library: 'UduJS',
      },
      module: {
        rules,
      },
      plugins,
    });
    break;
  default:
}

module.exports = exportConfig;
