import classList from 'dom-classlist'
import closest from 'dom-closest'
import throttle from 'lodash.throttle'
import { bind } from './dom/events'
import { getMaxHeight } from './dom/getMaxHeight'
import { scrollContent } from './scrollContent'
import {
  CLASS_ACTIVE,
  CLASS_BUTTON,
  CLASS_CHANGING,
  CLASS_CONTENT,
  CLASS_FOOTNOTE,
  CLASS_HOVERED,
  FOOTNOTE_CONTENT,
  FOOTNOTE_ID,
  FOOTNOTE_MAX_HEIGHT,
  FOOTNOTE_NUMBER
} from './constants'

export function findAllFootnotes (selector = '') {
  return [...document.querySelectorAll(`${selector}.${CLASS_FOOTNOTE}`)]
}

export const findClosestButton = element => closest(element, `.${CLASS_BUTTON}`)
export const findClosestPopover = element => closest(element, `.${CLASS_FOOTNOTE}`)

export function addClass (className) {
  return element => className && element && classList(element).add(className)
}

function removeClass (className) {
  return element => className && element && classList(element).remove(className)
}

function containsClass (className) {
  return element => className && element && classList(element).contains(className)
}

export const setChanging = addClass(CLASS_CHANGING)
export const unsetChanging = removeClass(CLASS_CHANGING)
export const isChanging = containsClass(CLASS_CHANGING)

export const setActive = addClass(CLASS_ACTIVE)
export const unsetActive = removeClass(CLASS_ACTIVE)
export const isActive = containsClass(CLASS_ACTIVE)

export const setHovered = addClass(CLASS_HOVERED)
export const unsetHovered = removeClass(CLASS_HOVERED)
export const isHovered = containsClass(CLASS_HOVERED)

export function activateButton (button) {
  button.setAttribute('aria-expanded', 'true')
  setActive(button)
}

export function deactivateButton (button) {
  button.setAttribute('aria-expanded', 'false')
  unsetActive(button)
  unsetHovered(button)
}

export function insertPopover (button, render) {
  button.insertAdjacentHTML('afterend', render({
    content: button.getAttribute(FOOTNOTE_CONTENT),
    id: button.getAttribute(FOOTNOTE_ID),
    number: button.getAttribute(FOOTNOTE_NUMBER)
  }))

  const popover = button.nextElementSibling
  const content = popover.querySelector(`.${CLASS_CONTENT}`)

  popover.setAttribute(FOOTNOTE_MAX_HEIGHT, getMaxHeight(content))
  popover.style.maxWidth = document.body.clientWidth + 'px'

  bind(content, 'mousewheel', throttle(scrollContent))
  bind(content, 'wheel', throttle(scrollContent))

  return popover
}

export function insertButton (link, render, properties) {
  link.insertAdjacentHTML('beforebegin', render(properties))
}

export function remove (element) {
  element.parentNode.removeChild(element)
}

export function getPopoverSelector (button) {
  return `[${FOOTNOTE_ID}="${button.getAttribute(FOOTNOTE_ID)}"]`
}
