import simulant from 'simulant'
const fs = require('fs')

/**
 * Checks whether IE is in use.
 */
export function isIE () {
  const ua = window.navigator.userAgent
  return (
    ua.indexOf('MSIE ') > 0 ||
    ua.indexOf('Trident/') > 0 ||
    ua.indexOf('Edge/') > 0
  )
}

/**
 * Setup fixtures.
 *
 * @param  {String} fixture Fixture file to load (defaults to default.html).
 * @return {void}
 */
export function setup (fixture) {
  const content = document.createElement('div')

  content.id = 'root'

  switch (fixture) {
    case 'multiple':
      content.innerHTML = fs.readFileSync(`${__dirname}/fixtures/multiple.html`)
      break

    case 'scroll':
      content.innerHTML = fs.readFileSync(`${__dirname}/fixtures/scroll.html`)
      break

    default:
      content.innerHTML = fs.readFileSync(`${__dirname}/fixtures/default.html`)
  }

  document.body.appendChild(content)
}

/**
 * Load littlefoot stylesheet.
 * @return {void}
 */
export function setupStylesheet () {
  const stylesheet = document.createElement('link')
  stylesheet.rel = 'stylesheet'
  stylesheet.href = 'base/dist/littlefoot.css'

  document.body.appendChild(stylesheet)
}

/**
 * Tear down fixtures.
 *
 * @return {void}
 */
export function teardown () {
  while (document.body.firstChild) {
    document.body.removeChild(document.body.firstChild)
  }
}

/**
 * Delay function, returning a Promise after the provided number of seconds.
 *
 * @param  {Number}  timeout Sleep delay.
 * @return {Promise}         Promise.
 */
export function sleep (timeout) {
  return new Promise(resolve => setTimeout(resolve, timeout))
}

export function getButton (id) {
  return document.querySelector(`button[data-footnote-id="${id}"]`)
}

export function getPopover (id) {
  return document.querySelector(`aside[data-footnote-id="${id}"]`)
}

export function getAllButtons () {
  return [...document.querySelectorAll('button[data-footnote-id]')]
}

export function getAllActiveButtons () {
  return [...document.querySelectorAll('button[data-footnote-id].is-active')]
}

export function getAllPopovers () {
  return [...document.querySelectorAll('aside[data-footnote-id]')]
}

export function click (element) {
  simulant.fire(element, 'click')
}

export function mouseover (element) {
  simulant.fire(element, 'mouseover')
}

export function mouseout (element) {
  simulant.fire(element, 'mouseout')
}

export function keyup (element, key) {
  simulant.fire(element, 'keyup', { key })
}

export const KEY_ENTER = '13'
export const KEY_ESCAPE = '27'
