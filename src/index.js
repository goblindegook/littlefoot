import closest from 'dom-closest'
import classList from 'dom-classlist'
import delegate from 'dom-delegate'
import template from 'lodash.template'
import throttle from 'lodash.throttle'
import { getMaxHeight } from './dom/getMaxHeight'
import { bind } from './dom/events'
import { createSettings } from './settings'
import { dismissFootnote } from './dismissFootnote'
import { getClosestFootnoteButtons } from './getClosestFootnoteButtons'
import { init } from './init'
import { repositionFootnote } from './repositionFootnote'
import { scrollContent } from './scrollContent'
import {
  CLASS_ACTIVE,
  CLASS_CHANGING,
  CLASS_HOVERED,
  CLASS_BUTTON,
  CLASS_CONTENT,
  CLASS_FOOTNOTE,
  FOOTNOTE_CONTENT,
  FOOTNOTE_ID,
  FOOTNOTE_MAX_HEIGHT,
  FOOTNOTE_NUMBER
} from './constants'

/**
 * Littlefoot instance factory.
 *
 * @param  {Object} options Littlefoot options.
 * @return {Object}         Littlefoot instance.
 */
const littlefoot = function (options) {
  const settings = createSettings(options)

  init(settings)

  /**
   * Removes/adds appropriate classes to the footnote content and button after
   * a delay (to allow for transitions) it removes the actual footnote content.
   *
   * @param  {String} selector The CSS selector for the footnotes to be removed.
   * @param  {Number} timeout  The delay between adding the removal classes and
   *                           actually removing the popover from the DOM.
   * @return {void}
   */
  function dismissFootnotes (selector = `.${CLASS_FOOTNOTE}`, timeout = settings.dismissDelay) {
    const footnotes = [...document.querySelectorAll(selector)]
    footnotes.forEach(dismissFootnote(timeout))
  }

  /**
   * Positions each footnote relative to its button.
   *
   * @param  {Event} event The type of event that prompted the reposition function.
   * @return {void}
   */
  function repositionFootnotes (event) {
    const footnotes = [...document.querySelectorAll(`.${CLASS_FOOTNOTE}`)]
    footnotes.forEach(repositionFootnote(event && event.type))
  }

  /**
   * Instantiates the footnote popover of the buttons matching the passed
   * selector. This includes replacing any variables in the content template,
   * decoding any special characters, adding the new element to the page,
   * calling the position function, and adding the scroll handler.
   *
   * @param  {String} selector  CSS selector of buttons that are to be activated.
   * @param  {String} className Class name to add to the popover element.
   * @return {void}
   */
  function displayFootnote (selector, className) {
    const renderContent = template(settings.contentTemplate)
    const buttons = getClosestFootnoteButtons(selector, settings.allowMultiple)

    const popoversCreated = buttons.map(button => {
      button.insertAdjacentHTML('afterend', renderContent({
        content: button.getAttribute(FOOTNOTE_CONTENT),
        id: button.getAttribute(FOOTNOTE_ID),
        number: button.getAttribute(FOOTNOTE_NUMBER)
      }))

      const popover = button.nextElementSibling
      const content = popover.querySelector(`.${CLASS_CONTENT}`)

      button.setAttribute('aria-expanded', 'true')
      popover.setAttribute(FOOTNOTE_MAX_HEIGHT, getMaxHeight(content))
      popover.style.maxWidth = document.body.clientWidth + 'px'

      classList(button).add(CLASS_ACTIVE)

      if (className) {
        classList(popover).add(className)
      }

      bind(content, 'mousewheel', throttle(scrollContent))
      bind(content, 'wheel', throttle(scrollContent))

      repositionFootnotes()

      if (typeof settings.activateCallback === 'function') {
        settings.activateCallback(popover, button)
      }

      return popover
    })

    setTimeout(() => {
      popoversCreated.forEach(popover => {
        classList(popover).add(CLASS_ACTIVE)
      })
    }, settings.activateDelay)
  }

  /**
   * To activate the popover of a hovered footnote button. Also removes other
   * popovers, if allowMultiple is false.
   *
   * @param  {Event} event Event that contains the target of the mouseenter event.
   * @return {void}
   */
  function onHover (event) {
    if (settings.activateOnHover) {
      const target = event.target || event.srcElement
      const footnote = closest(target, `.${CLASS_BUTTON}`)
      const footnoteId = footnote.getAttribute(FOOTNOTE_ID)
      const selector = `[${FOOTNOTE_ID}="${footnoteId}"]`

      if (!classList(footnote).contains(CLASS_ACTIVE)) {
        if (!settings.allowMultiple) {
          dismissFootnotes(`.${CLASS_FOOTNOTE}:not(${selector})`)
        }

        classList(footnote).add(CLASS_HOVERED)
        displayFootnote(`.${CLASS_BUTTON}${selector}`, CLASS_HOVERED)
      }
    }
  }

  /**
   * Handles the logic of clicking/tapping the footnote button. That is,
   * activates the popover if it isn't already active (+ deactivate others, if
   * appropriate) or, deactivates the popover if it is already active.
   *
   * @param  {DOMElement} button Button being clicked/pressed.
   * @return {void}
   */
  function activateButton (button) {
    const isActive = classList(button).contains(CLASS_ACTIVE)
    const isChanging = classList(button).contains(CLASS_CHANGING)
    const footnoteId = button.getAttribute(FOOTNOTE_ID)
    const selector = `[${FOOTNOTE_ID}="${footnoteId}"]`

    if (typeof button.blur === 'function') {
      button.blur()
    }

    if (isChanging) {
      return
    }

    if (isActive) {
      dismissFootnotes(`.${CLASS_FOOTNOTE}${selector}`)
      return
    }

    if (!settings.allowMultiple) {
      dismissFootnotes(`.${CLASS_FOOTNOTE}:not(${selector})`)
    }

    // Activate footnote:
    classList(button).add(CLASS_CHANGING)
    displayFootnote(`.${CLASS_BUTTON}${selector}`)

    setTimeout(() => {
      classList(button).remove(CLASS_CHANGING)
    }, settings.activateDelay)
  }

  /**
   * Activates the button the was clicked/taps. Also removes other popovers, if
   * allowMultiple is false. Finally, removes all popovers if something non-fn
   * related was clicked/tapped.
   *
   * @param  {Event} event Event that contains the target of the tap/click event.
   * @return {void}
   */
  function onTouchClick (event) {
    const button = closest(event.target, `.${CLASS_BUTTON}`)
    const footnote = closest(event.target, `.${CLASS_FOOTNOTE}`)

    if (button) {
      event.preventDefault()
      activateButton(button)
    }

    if (!button && !footnote && document.querySelector(`.${CLASS_FOOTNOTE}`)) {
      dismissFootnotes()
    }
  }

  /**
   * Removes the unhovered footnote content if dismissOnUnhover is true.
   *
   * @return {void}
   */
  function onUnhover () {
    if (settings.dismissOnUnhover && settings.activateOnHover) {
      setTimeout(() => {
        if (!document.querySelector(`.${CLASS_BUTTON}:hover, .${CLASS_FOOTNOTE}:hover`)) {
          dismissFootnotes()
        }
      }, settings.hoverDelay)
    }
  }

  /**
   * Remove all popovers on keypress.
   *
   * @param  {Event} event Event that contains the key that was pressed.
   * @return {void}
   */
  function onEscapeKeypress (event) {
    if (event.keyCode === 27) {
      dismissFootnotes()
    }
  }

  bind(document, 'touchend', onTouchClick)
  bind(document, 'click', onTouchClick)
  bind(document, 'keyup', onEscapeKeypress)
  bind(document, 'gestureend', repositionFootnotes)
  bind(window, 'scroll', throttle(repositionFootnotes))
  bind(window, 'resize', throttle(repositionFootnotes))

  delegate(document).on('mouseover', `.${CLASS_BUTTON}`, onHover)
  delegate(document).on('mouseout', `.${CLASS_HOVERED}`, onUnhover)

  return {
    activate: displayFootnote,
    dismiss: dismissFootnotes,
    getSetting: (key) => settings[key],
    updateSetting: (key, value) => { settings[key] = value }
  }
}

export default littlefoot
