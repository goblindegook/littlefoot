'use strict'

var fs = require('fs')

var browsers = []
var customLaunchers = {}
var reporters = ['dots', 'coverage-istanbul', 'saucelabs']

if (!process.env.SAUCE_USERNAME && fs.existsSync('sauce.json')) {
  process.env.SAUCE_USERNAME = require('./sauce').username
  process.env.SAUCE_ACCESS_KEY = require('./sauce').accessKey
}

if (process.env.SAUCE_USERNAME) {
  customLaunchers = {
    SL_Chrome_dev: {
      base: 'SauceLabs',
      platform: 'Windows 7',
      browserName: 'chrome',
      version: 'dev'
    },
    SL_Chrome_beta: {
      base: 'SauceLabs',
      platform: 'Windows 7',
      browserName: 'chrome',
      version: 'beta'
    },
    SL_Chrome_55: {
      base: 'SauceLabs',
      platform: 'Windows 7',
      browserName: 'chrome',
      version: '55'
    },
    SL_Edge_13: {
      base: 'SauceLabs',
      platform: 'Windows 10',
      browserName: 'microsoftedge',
      version: '13'
    },
    SL_InternetExplorer_11: {
      base: 'SauceLabs',
      platform: 'Windows 10',
      browserName: 'internet explorer',
      version: '11'
    },
    SL_InternetExplorer_10: {
      base: 'SauceLabs',
      platform: 'Windows 8',
      browserName: 'internet explorer',
      version: '10'
    },
    SL_InternetExplorer_9: {
      base: 'SauceLabs',
      platform: 'Windows 7',
      browserName: 'internet explorer',
      version: '9'
    },
    // SL_InternetExplorer_8: {
    //   base:        'SauceLabs',
    //   platform:    'Windows 7',
    //   browserName: 'internet explorer',
    //   version:     '8',
    // },
    SL_Firefox_50: {
      base: 'SauceLabs',
      platform: 'Windows 7',
      browserName: 'firefox',
      version: '50'
    },
    SL_Safari_10: {
      base: 'SauceLabs',
      platform: 'OS X 10.12',
      browserName: 'safari',
      version: '10'
    },
    SL_Safari_9: {
      base: 'SauceLabs',
      platform: 'OS X 10.11',
      browserName: 'safari',
      version: '9'
    }
    // 'SL_iOS_Safari_9': {
    //   base:        'SauceLabs',
    //   platform:    'OS X 10.11',
    //   browserName: 'iphone',
    //   version:     '9.1',
    // },
    // 'SL_Android': {
    //   base:              'SauceLabs',
    //   platform:          'Linux',
    //   browserName:       'android',
    //   version:           '5.1',
    // },
    // SL_Opera_12: {
    //   base:        'SauceLabs',
    //   platform:    'Windows 7',
    //   browserName: 'opera',
    //   version:     '12',
    // },
  }
}

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
        'stringify',
        'browserify-istanbul'
      ]
    },
    files: [
      'dist/*.css',
      'test/**/*.test.js'
    ],
    preprocessors: {
      'src/**/*.js': ['browserify', 'coverage'],
      'test/**/*.js': ['browserify']
    },
    coverageIstanbulReporter: {
      dir: 'coverage/',
      reports: ['text', 'lcov']
    },
    sauceLabs: {
      testName: 'littlefoot',
      passed: 'true',
      recordScreenshots: false
    }
  })
}
