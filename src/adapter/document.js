import classList from 'dom-classlist'
import closest from 'dom-closest'
import siblings from 'dom-siblings'
import throttle from 'lodash.throttle'
import { bind } from './dom/events'
import { getMaxHeight } from './dom/getMaxHeight'
import { maybeCall } from '../helpers'
import {
  CLASS_ACTIVE,
  CLASS_BUTTON,
  CLASS_CHANGING,
  CLASS_CONTENT,
  CLASS_FOOTNOTE,
  CLASS_FULLY_SCROLLED,
  CLASS_HOVERED,
  FOOTNOTE_CONTENT,
  FOOTNOTE_ID,
  FOOTNOTE_MAX_HEIGHT,
  FOOTNOTE_NUMBER,
  FOOTNOTE_REF,
  FOOTNOTE_BACKLINK_REF
} from './constants'

export function invertSelection (selector) {
  return `:not(${selector})`
}

function findOne (className) {
  return (selector = '') => document.querySelector(`${selector}.${className}`)
}

function findAll (className) {
  return (selector = '') => [...document.querySelectorAll(`${selector}.${className}`)]
}

function findClosest (className) {
  return element => closest(element, `.${className}`)
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

export const findButton = findOne(CLASS_BUTTON)
export const findAllButtons = findAll(CLASS_BUTTON)

export const findPopover = findOne(CLASS_FOOTNOTE)
export const findAllPopovers = findAll(CLASS_FOOTNOTE)
export const findClosestPopover = findClosest(CLASS_FOOTNOTE)

export function findHoveredFootnote () {
  return document.querySelector(`.${CLASS_BUTTON}:hover, .${CLASS_FOOTNOTE}:hover`)
}

export const setActive = addClass(CLASS_ACTIVE)
export const getFootnoteId = getAttribute(FOOTNOTE_ID)
export const getFootnoteRef = getAttribute(FOOTNOTE_REF)
export const setFootnoteRef = setAttribute(FOOTNOTE_REF)
export const getFootnoteBacklinkRef = getAttribute(FOOTNOTE_BACKLINK_REF)
export const setFootnoteBacklinkRef = setAttribute(FOOTNOTE_BACKLINK_REF)

export function createButton (element) {
  return element && {
    element,

    blur: () => maybeCall(element, element.blur),

    activate: () => {
      element.setAttribute('aria-expanded', 'true')
      classList(element).add(CLASS_ACTIVE)
    },

    deactivate: () => {
      element.setAttribute('aria-expanded', 'false')
      classList(element).remove(CLASS_ACTIVE)
      classList(element).remove(CLASS_HOVERED)
    },

    getFootnoteSelector: () => `[${FOOTNOTE_ID}="${element.getAttribute(FOOTNOTE_ID)}"]`,

    hover: () => classList(element).add(CLASS_HOVERED),

    isActive: () => classList(element).contains(CLASS_ACTIVE),

    isChanging: () => classList(element).contains(CLASS_CHANGING),

    startChanging: () => classList(element).add(CLASS_CHANGING),

    stopChanging: () => classList(element).remove(CLASS_CHANGING)
  }
}

export function findClosestButton (selector) {
  return createButton(findClosest(CLASS_BUTTON)(selector))
}

export function findPopoverButton (popover) {
  return createButton(siblings(popover, `.${CLASS_BUTTON}`)[0])
}

export function getLastFootnoteId () {
  const footnotes = document.querySelectorAll(`[${FOOTNOTE_ID}]`)
  return footnotes.length && footnotes[footnotes.length - 1].getAttribute(FOOTNOTE_ID)
}

function onScrollContent (event) {
  const target = event.currentTarget
  const delta = event.type === 'wheel' ? -event.deltaY : event.wheelDelta
  const isScrollUp = delta > 0
  const height = target.clientHeight
  const popover = findClosestPopover(target)

  if (!isScrollUp && delta < height + target.scrollTop - target.scrollHeight) {
    classList(popover).add(CLASS_FULLY_SCROLLED)
    target.scrollTop = target.scrollHeight
    event.stopPropagation()
    event.preventDefault()
    return
  }

  if (isScrollUp) {
    classList(popover).remove(CLASS_FULLY_SCROLLED)

    if (target.scrollTop < delta) {
      target.scrollTop = 0
      event.stopPropagation()
      event.preventDefault()
    }
  }
}

export function findPopoverContent (popover) {
  return popover.querySelector(`.${CLASS_CONTENT}`)
}

export function insertPopover (button, render) {
  button.insertAdjacentHTML('afterend', render({
    content: button.getAttribute(FOOTNOTE_CONTENT),
    id: getFootnoteId(button),
    number: button.getAttribute(FOOTNOTE_NUMBER)
  }))

  const popover = button.nextElementSibling
  const content = findPopoverContent(popover)

  popover.setAttribute(FOOTNOTE_MAX_HEIGHT, getMaxHeight(content))
  popover.style.maxWidth = document.body.clientWidth + 'px'

  bind(content, 'mousewheel', throttle(onScrollContent))
  bind(content, 'wheel', throttle(onScrollContent))

  return popover
}

export function remove (element) {
  element.parentNode.removeChild(element)
}
