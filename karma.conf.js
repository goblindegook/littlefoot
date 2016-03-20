module.exports = function(karma) {
  karma.set({
    browsers: [
      process.env.TRAVIS ? 'Firefox' : 'Chrome',
    ],
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
