import { Promise } from 'es6-promise'

/**
 * Sleep for the specified number of milliseconds.
 * @param  {Number}  interval Sleep interval in milliseconds.
 * @return {Promise}          Sleep promise.
 */
function sleep(interval) {
  return new Promise(resolve => setTimeout(resolve, interval))
}

export default sleep
