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

export function insertPopover (button, render) {
  button.insertAdjacentHTML('afterend', render({
    content: button.getAttribute(FOOTNOTE_CONTENT),
    id: button.getAttribute(FOOTNOTE_ID),
    number: button.getAttribute(FOOTNOTE_NUMBER)
  }))
  return button.nextElementSibling
}

export function insertButton (link, render, properties) {
  link.insertAdjacentHTML('beforebegin', render(properties))
}
