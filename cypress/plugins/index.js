const webpack = require('@cypress/webpack-preprocessor')

module.exports = on => {
  on('file:preprocessor', webpack())
}
