const browserify = require('@cypress/browserify-preprocessor')

module.exports = on => {
  on(
    'file:preprocessor',
    browserify({
      browserifyOptions: {
        extensions: ['.js']
      }
    })
  )
}
