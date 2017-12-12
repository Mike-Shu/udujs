// Dependencies.
const Path = require('path');

const root = Path.resolve(__dirname);

module.exports = (config) => {
  config.set({
    basePath: root,
    frameworks: ['mocha'],
    plugins: [
      'karma-mocha',
      'karma-mocha-reporter',
      'karma-webpack',
      'karma-sourcemap-loader',
      'karma-chrome-launcher',
      'karma-firefox-launcher',
      'karma-coverage',
    ],
    files: [
      'test/common/*.js',
      'test/client-side/*.js',
    ],
    preprocessors: {
      'src/**/*.js': ['webpack', 'sourcemap'],
      'test/common/*.js': ['webpack', 'sourcemap'],
      'test/client-side/*.js': ['webpack', 'sourcemap'],
    },
    webpack: {
      devtool: 'inline-source-map',
      resolve: {
        extensions: ['*', '.js', '.json'],
      },
      module: {
        loaders: [
          {
            test: /\.js$/,
            loader: 'babel-loader',
            exclude: [
              Path.resolve(root, 'node_modules'),
            ],
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
      },
      node: {
        fs: 'empty',
        child_process: 'empty',
      },
    },
    webpackMiddleware: {
      noInfo: true,
      stats: 'errors-only',
    },
    reporters: ['progress'],
    mochaReporter: {
      // full (default) || autowatch || minimal || noFailures
      output: 'minimal',
      showDiff: true,
      colors: { success: 'greenBright' },
    },
    coverageReporter: {
      includeAllSources: true,
      dir: Path.resolve(root, 'public/coverage/client-side'),
      subdir: '.',
      reporters: [
        { type: 'text' },
        { type: 'lcov' },
      ],
      instrumenterOptions: {
        istanbul: { noCompact: true },
      },
    },
    customLaunchers: {
      ChromeNoSandboxHeadless: {
        base: 'Chrome',
        flags: [
          '--no-sandbox',
          '--headless',
          '--remote-debugging-port=9222',
        ],
      },
    },
    port: 9876,
    colors: true,
    // LOG_DISABLE || LOG_ERROR || LOG_WARN || LOG_INFO || LOG_DEBUG
    logLevel: config.LOG_ERROR,
    autoWatch: false,
    singleRun: false,
    concurrency: 1,
  });
};

