const browserify = require('@cypress/browserify-preprocessor')

module.exports = (on) => {
  on(
    'file:preprocessor',
    browserify({
      browserifyOptions: {
        extensions: ['.js']
      },
    })
  )
  on('task', {
    log(message) {
      console.log(message)

      return null
    },
    table(message) {
      console.table(message)

      return null
    },
  })
}
