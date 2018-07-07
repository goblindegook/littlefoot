import classList from 'dom-classlist'
import {
  CLASS_FOOTNOTE,
  FOOTNOTE_CONTENT,
  FOOTNOTE_ID,
  FOOTNOTE_NUMBER
} from './constants'

export function findAllFootnotes (selector = '') {
  return [...document.querySelectorAll(`${selector}.${CLASS_FOOTNOTE}`)]
}

export function addClass (className) {
  return className
    ? element => element && classList(element).add(className)
    : () => {}
}

export function insertPopover (element, render) {
  element.insertAdjacentHTML('afterend', render({
    content: element.getAttribute(FOOTNOTE_CONTENT),
    id: element.getAttribute(FOOTNOTE_ID),
    number: element.getAttribute(FOOTNOTE_NUMBER)
  }))
  return element.nextElementSibling
}

export function insertButton (link, render, properties) {
  link.insertAdjacentHTML('beforebegin', render(properties))
}
