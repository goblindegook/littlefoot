import classList from 'dom-classlist'
import closest from 'dom-closest'
import {
  CLASS_ACTIVE,
  CLASS_BUTTON,
  CLASS_CONTENT,
  CLASS_FOOTNOTE,
  FOOTNOTE_ID,
  FOOTNOTE_REF,
  FOOTNOTE_BACKLINK_REF
} from './constants'

export function invertSelection (selector) {
  return `:not(${selector})`
}

export function findOne (className) {
  return (selector = '') => document.querySelector(`${selector}.${className}`)
}

export function findAll (className) {
  return (selector = '') => [...document.querySelectorAll(`${selector}.${className}`)]
}

export function addClass (className) {
  return element => className && element && classList(element).add(className)
}

function getAttribute (attribute) {
  return element => element.getAttribute(attribute)
}

function setAttribute (attribute) {
  return (element, value) => element.setAttribute(attribute, value)
}

export const findPopover = findOne(CLASS_FOOTNOTE)
export const findAllPopovers = findAll(CLASS_FOOTNOTE)
export const findClosestPopover = element => closest(element, `.${CLASS_FOOTNOTE}`)

export function hasHoveredFootnote () {
  return !!document.querySelector(`.${CLASS_BUTTON}:hover, .${CLASS_FOOTNOTE}:hover`)
}

export const setActive = addClass(CLASS_ACTIVE)
export const getFootnoteRef = getAttribute(FOOTNOTE_REF)
export const setFootnoteRef = setAttribute(FOOTNOTE_REF)
export const getFootnoteBacklinkRef = getAttribute(FOOTNOTE_BACKLINK_REF)
export const setFootnoteBacklinkRef = setAttribute(FOOTNOTE_BACKLINK_REF)

export function getLastFootnoteId () {
  const footnotes = document.querySelectorAll(`[${FOOTNOTE_ID}]`)
  return footnotes.length && footnotes[footnotes.length - 1].getAttribute(FOOTNOTE_ID)
}

export function findPopoverContent (popover) {
  return popover.querySelector(`.${CLASS_CONTENT}`)
}

export function remove (element) {
  element.parentNode.removeChild(element)
}
