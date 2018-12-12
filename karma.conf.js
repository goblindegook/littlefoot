'use strict'

var browsers = []

var customLaunchers = {
  ChromeHeadlessNoSandbox: {
    base: 'ChromeHeadless',
    flags: ['--no-sandbox']
  }
}

var reporters = ['dots', 'coverage']

module.exports = function (karma) {
  karma.set({
    singleRun: true,
    browsers: browsers.concat(Object.keys(customLaunchers)),
    customLaunchers: customLaunchers,
    reporters: reporters,
    browserNoActivityTimeout: 60000,
    frameworks: ['browserify', 'tap', 'sinon'],
    browserify: {
      debug: true,
      transform: [
        'babelify',
        'brfs'
      ]
    },
    files: [
      'dist/*.css',
      'test/**/*.test.{js,ts}',
      'test/**/*.html'
    ],
    preprocessors: {
      '{src,test}/**/*.{js,ts}': ['browserify']
    },
    coverageReporter: {
      dir: 'coverage/',
      reports: ['html', 'text', 'lcov']
    }
  })
}
