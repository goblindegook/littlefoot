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
import { repositionPopover } from './repositionFootnote'
import { scrollContent } from './scrollContent'
import { onEscapeKeypress } from './events'
import { addClass, findAllFootnotes, insertPopover } from './document'
import {
  CLASS_ACTIVE,
  CLASS_CHANGING,
  CLASS_HOVERED,
  CLASS_BUTTON,
  CLASS_CONTENT,
  CLASS_FOOTNOTE,
  FOOTNOTE_ID,
  FOOTNOTE_MAX_HEIGHT
} from './constants'

function maybeCall (context, fn, ...args) {
  if (typeof fn === 'function') {
    fn.call(context, args)
  }
}

function noop () {}

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
  function dismissPopovers (selector, timeout = settings.dismissDelay) {
    findAllFootnotes(selector).forEach(dismissFootnote(timeout))
  }

  /**
   * Positions each footnote relative to its button.
   *
   * @param  {Event} event The type of event that prompted the reposition function.
   * @return {void}
   */
  function repositionPopovers (event) {
    findAllFootnotes().forEach(repositionPopover(event && event.type))
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
  function displayPopover (selector, className) {
    const { activateCallback, activateDelay, allowMultiple, contentTemplate } = settings
    const renderPopover = template(contentTemplate)

    const popoversCreated = getClosestFootnoteButtons(selector, allowMultiple)
      .map(button => {
        const popover = insertPopover(button, renderPopover)
        const content = popover.querySelector(`.${CLASS_CONTENT}`)

        button.setAttribute('aria-expanded', 'true')
        popover.setAttribute(FOOTNOTE_MAX_HEIGHT, getMaxHeight(content))
        popover.style.maxWidth = document.body.clientWidth + 'px'

        addClass(CLASS_ACTIVE)(button)
        addClass(className)(popover)

        bind(content, 'mousewheel', throttle(scrollContent))
        bind(content, 'wheel', throttle(scrollContent))

        repositionPopovers()
        maybeCall(null, activateCallback, popover, button)

        return popover
      })

    setTimeout(() => {
      popoversCreated.forEach(addClass(CLASS_ACTIVE))
    }, activateDelay)
  }

  function dismissOtherPopovers (selector) {
    if (!settings.allowMultiple) {
      dismissPopovers(`:not(${selector})`)
    }
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
      const footnoteClass = classList(footnote)
      const selector = `[${FOOTNOTE_ID}="${footnoteId}"]`

      if (!footnoteClass.contains(CLASS_ACTIVE)) {
        dismissOtherPopovers(selector)
        footnoteClass.add(CLASS_HOVERED)
        displayPopover(selector, CLASS_HOVERED)
      }
    }
  }

  function activateButtonPopovers (button, selector, delay) {
    dismissOtherPopovers(selector)
    addClass(CLASS_CHANGING)(button)
    displayPopover(selector)

    setTimeout(() => {
      classList(button).remove(CLASS_CHANGING)
    }, delay)
  }

  /**
   * Handles the logic of clicking/tapping the footnote button. That is,
   * activates the popover if it isn't already active (and deactivates
   * others, if appropriate) or, deactivates the popover if it is already
   * active.
   *
   * @param  {DOMElement} button Button being clicked/pressed.
   * @return {void}
   */
  function toggleButton (button) {
    const footnoteId = button.getAttribute(FOOTNOTE_ID)
    const selector = `[${FOOTNOTE_ID}="${footnoteId}"]`
    const buttonClass = classList(button)

    const [fn, ...args] = buttonClass.contains(CLASS_CHANGING)
      ? [noop]
      : buttonClass.contains(CLASS_ACTIVE)
        ? [dismissPopovers, selector, settings.dismissDelay]
        : [activateButtonPopovers, button, selector, settings.activateDelay]

    maybeCall(button, button.blur)
    fn(...args)
  }

  /**
   * Toggles the button that was clicked/tapped, or removes all popovers if
   * something non-footnote related was clicked/tapped.
   *
   * @param  {Event} event Event that contains the target of the tap/click event.
   * @return {void}
   */
  function onTouchClick (event) {
    const button = closest(event.target, `.${CLASS_BUTTON}`)
    const footnote = closest(event.target, `.${CLASS_FOOTNOTE}`)

    if (button) {
      event.preventDefault()
      toggleButton(button)
    }

    if (!button && !footnote && document.querySelector(`.${CLASS_FOOTNOTE}`)) {
      dismissPopovers()
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
          dismissPopovers()
        }
      }, settings.hoverDelay)
    }
  }

  bind(document, 'touchend', onTouchClick)
  bind(document, 'click', onTouchClick)
  bind(document, 'keyup', onEscapeKeypress(dismissPopovers))
  bind(document, 'gestureend', repositionPopovers)
  bind(window, 'scroll', throttle(repositionPopovers))
  bind(window, 'resize', throttle(repositionPopovers))

  delegate(document).on('mouseover', `.${CLASS_BUTTON}`, onHover)
  delegate(document).on('mouseout', `.${CLASS_HOVERED}`, onUnhover)

  return {
    activate: displayPopover,
    dismiss: dismissPopovers,
    getSetting: (key) => settings[key],
    updateSetting: (key, value) => { settings[key] = value }
  }
}

export default littlefoot
