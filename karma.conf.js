'use strict'

var browsers = ['Chrome', 'Firefox', 'PhantomJS']

if (process.env.TRAVIS) {
  browsers = ['Firefox', 'PhantomJS']
}

module.exports = function(karma) {
  karma.set({
    browsers: browsers,
    phantomjsLauncher: {
      exitOnResourceError: true,
    },
    frameworks: [
      'browserify',
      'tap',
      'sinon',
    ],
    files: [
      'test/**/*.js',
    ],
    preprocessors: {
      'test/**/*.js': ['browserify'],
    },
    reporters: [
      process.env.TRAVIS ? 'dots' : 'progress',
    ],
  })
}
