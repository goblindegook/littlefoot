'use strict'

var browsers = []

var customLaunchers = {
  ChromeHeadlessNoSandbox: {
    base: 'ChromeHeadless',
    flags: ['--no-sandbox']
  }
}

var reporters = ['dots', 'coverage']

module.exports = karma => {
  karma.set({
    singleRun: true,
    browsers: browsers.concat(Object.keys(customLaunchers)),
    customLaunchers: customLaunchers,
    reporters: reporters,
    browserNoActivityTimeout: 60000,
    frameworks: ['browserify', 'tap', 'sinon', 'karma-typescript'],
    browserify: {
      extensions: ['.ts'],
      debug: true,
      transform: [
        [
          'babelify',
          {
            extensions: ['.js', '.ts']
          }
        ],
        'brfs'
      ]
    },
    files: ['dist/*.css', 'test/**/*.test.{js,ts}', 'test/**/*.html'],
    preprocessors: {
      '**/*.ts': 'karma-typescript',
      'test/**/*.js': ['browserify']
    },
    coverageReporter: {
      dir: 'coverage/',
      reports: ['html', 'text', 'lcov']
    }
  })
}
