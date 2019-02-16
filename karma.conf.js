'use strict'

var browsers = []

var customLaunchers = {
  ChromeHeadlessNoSandbox: {
    base: 'ChromeHeadless',
    flags: ['--no-sandbox']
  }
}

module.exports = karma => {
  karma.set({
    singleRun: true,
    browsers: browsers.concat(Object.keys(customLaunchers)),
    customLaunchers: customLaunchers,
    reporters: ['dots', 'progress', 'coverage'],
    browserNoActivityTimeout: 60000,
    frameworks: ['browserify', 'tap'],
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
    files: ['dist/*.css', 'test/**/*.test.js', 'test/**/*.html'],
    preprocessors: {
      'test/**/*.js': ['browserify']
    },
    coverageReporter: {
      dir: 'coverage/',
      reports: ['html', 'text', 'lcov']
    }
  })
}
