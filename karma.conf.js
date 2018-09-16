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
    browsers: browsers.concat(Object.keys(customLaunchers)),
    customLaunchers: customLaunchers,
    reporters: reporters,
    browserNoActivityTimeout: 60000,
    frameworks: ['browserify', 'tap', 'sinon'],
    browserify: {
      debug: true,
      transform: [
        'babelify',
        'stringify'
      ]
    },
    files: [
      'dist/*.css',
      'test/**/*.test.js',
      'test/**/*.html'
    ],
    preprocessors: {
      '{src,test}/**/*.js': ['browserify']
    },
    coverageReporter: {
      dir: 'coverage/',
      reports: ['html', 'text', 'lcov']
    }
  })
}
