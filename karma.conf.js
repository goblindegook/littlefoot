'use strict'

var fs = require('fs')

var browsers        = ['PhantomJS']
var customLaunchers = {}
var reporters       = ['dots', 'coverage']

if (process.env.TRAVIS) {
  browsers = ['PhantomJS']
  reporters.push('coveralls')
}

if (!process.env.SAUCE_USERNAME && fs.existsSync('sauce.json')) {
  process.env.SAUCE_USERNAME   = require('./sauce').username
  process.env.SAUCE_ACCESS_KEY = require('./sauce').accessKey
}

if (process.env.SAUCE_USERNAME) {
  customLaunchers = {
    SL_Chrome_49: {
      base:        'SauceLabs',
      platform:    'Windows 7',
      browserName: 'chrome',
      version:     '49',
    },
    SL_Chrome_48: {
      base:        'SauceLabs',
      platform:    'Windows 7',
      browserName: 'chrome',
      version:     '48',
    },
    SL_Edge_13: {
      base:        'SauceLabs',
      platform:    'Windows 10',
      browserName: 'microsoftedge',
      version:     '13',
    },
    SL_InternetExplorer_11: {
      base:        'SauceLabs',
      platform:    'Windows 10',
      browserName: 'internet explorer',
      version:     '11',
    },
    SL_InternetExplorer_10: {
      base:        'SauceLabs',
      platform:    'Windows 8',
      browserName: 'internet explorer',
      version:     '10',
    },
    SL_InternetExplorer_9: {
      base:        'SauceLabs',
      platform:    'Windows 7',
      browserName: 'internet explorer',
      version:     '9',
    },
    // SL_InternetExplorer_8: {
    //   base:        'SauceLabs',
    //   platform:    'Windows 7',
    //   browserName: 'internet explorer',
    //   version:     '8',
    // },
    SL_Firefox_45: {
      base:        'SauceLabs',
      platform:    'Windows 7',
      browserName: 'firefox',
      version:     '45',
    },
    SL_Firefox_44: {
      base:        'SauceLabs',
      platform:    'Windows 7',
      browserName: 'firefox',
      version:     '44',
    },
    SL_Safari_9: {
      base:        'SauceLabs',
      platform:    'OS X 10.11',
      browserName: 'safari',
      version:     '9',
    },
    'SL_Safari_8': {
      base:        'SauceLabs',
      platform:    'OS X 10.10',
      browserName: 'safari',
      version:     '8',
    },
    // SL_Opera_12: {
    //   base:        'SauceLabs',
    //   platform:    'Windows 7',
    //   browserName: 'opera',
    //   version:     '12',
    // },
  }
}

module.exports = function(karma) {
  karma.set({
    browsers:                 browsers.concat(Object.keys(customLaunchers)),
    customLaunchers:          customLaunchers,
    reporters:                reporters,
    browserNoActivityTimeout: 60000,
    frameworks:               ['browserify', 'tap', 'sinon' ],
    browserify: {
      debug: true,
      transform: [
        'babelify',
        'stringify',
        ['browserify-istanbul', {
          instrumenter: require('babel-istanbul')
        }],
      ],
    },
    files: [
      'test/**/*.js',
    ],
    preprocessors: {
      'src/**/*.js':  ['browserify', 'coverage'],
      'test/**/*.js': ['browserify'],
    },
    coverageReporter: {
      dir: 'coverage/',
      reporters: [
        { type: 'text' },
        { type: 'html' },
        { type: 'lcov' },
      ],
    },
    sauceLabs: {
      testName:          'littlefoot',
      passed:            'true',
      recordScreenshots: false,
    },
  })
}
