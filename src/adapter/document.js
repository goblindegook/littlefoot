import classList from 'dom-classlist'
import closest from 'dom-closest'
import {
  CLASS_BUTTON,
  CLASS_FOOTNOTE
} from './constants'

export function invertSelection (selector) {
  return `:not(${selector})`
}

export function findOne (className) {
  return (selector = '') => document.querySelector(`${selector}.${className}`)
}

export function addClass (className) {
  return element => className && element && classList(element).add(className)
}

export const findPopover = findOne(CLASS_FOOTNOTE)
export const findClosestPopover = element => closest(element, `.${CLASS_FOOTNOTE}`)

export function hasHoveredFootnotes () {
  return !!document.querySelector(`.${CLASS_BUTTON}:hover, .${CLASS_FOOTNOTE}:hover`)
}
