/**
 * Setup fixtures.
 *
 * @param  {String} fixture Fixture file to load (defaults to default.html).
 * @return {void}
 */
export function setup(fixture) {
  const content = document.createElement('div')

  content.id = 'root';

  switch (fixture) {
    case 'multiple.html':
      content.innerHTML = require('./fixtures/multiple.html');
      break;

    case 'scroll.html':
      content.innerHTML = require('./fixtures/scroll.html');
      break;

    default:
      content.innerHTML = require('./fixtures/default.html');
  }

  document.body.appendChild(content);
}

/**
 * Load littlefoot stylesheet.
 * @return {void}
 */
export function setupStylesheet() {
  const stylesheet = document.createElement('link');
  stylesheet.rel   = 'stylesheet';
  stylesheet.href  = 'base/dist/littlefoot.css';

  document.body.appendChild(stylesheet);
}

/**
 * Tear down fixtures.
 *
 * @return {void}
 */
export function teardown() {
  while (document.body.firstChild) {
    document.body.removeChild(document.body.firstChild);
  }
}

/**
 * Delay function, returning a Promise after the provided number of seconds.
 *
 * @param  {Number}  timeout Sleep delay.
 * @return {Promise}         Promise.
 */
export function sleep(timeout) {
  return new Promise((resolve) => setTimeout(resolve, timeout));
}

export default {
  setup,
  sleep,
  teardown,
};
