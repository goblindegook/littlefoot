import closest from 'dom-closest'
import classList from 'dom-classlist'
import delegate from 'dom-delegate'
import template from 'lodash.template'
import throttle from 'lodash.throttle'
import { getMaxHeight } from './dom/getMaxHeight'
import { bind } from './dom/events'
import createSettings from './settings'
import dismissFootnote from './dismissFootnote'
import getClosestFootnoteButtons from './getClosestFootnoteButtons'
import init from './init'
import repositionFootnote from './repositionFootnote'
import scrollContent from './scrollContent'

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
   * @param  {String} footnotes The CSS selector for the footnotes to be removed.
   * @param  {Number} timeout   The delay between adding the removal classes and
   *                            actually removing the popover from the DOM.
   * @return {void}
   */
  function dismissFootnotes (selector = '.littlefoot-footnote', timeout = settings.dismissDelay) {
    const footnotes = [...document.querySelectorAll(selector)]

    footnotes.forEach((footnote) => {
      dismissFootnote(footnote, timeout)
    })
  }

  /**
   * Positions each footnote relative to its button.
   *
   * @param  {Event} event The type of event that prompted the reposition function.
   * @return {void}
   */
  function repositionFootnotes (event) {
    const footnotes = [...document.querySelectorAll('.littlefoot-footnote')]

    footnotes.forEach((footnote) => {
      repositionFootnote(footnote, event && event.type)
    })
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
    const contentTemplate = template(settings.contentTemplate)
    const buttons = getClosestFootnoteButtons(selector, settings.allowMultiple)

    const popoversCreated = buttons.map((button) => {
      button.insertAdjacentHTML('afterend', contentTemplate({
        content: button.getAttribute('data-footnote-content'),
        id: button.getAttribute('data-footnote-id'),
        number: button.getAttribute('data-footnote-number')
      }))

      const popover = button.nextElementSibling
      const content = popover.querySelector('.littlefoot-footnote__content')

      button.setAttribute('aria-expanded', 'true')
      popover.setAttribute('data-footnote-max-height', getMaxHeight(content))
      popover.style.maxWidth = document.body.clientWidth + 'px'

      classList(button).add('is-active')

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
      popoversCreated.forEach((popover) => {
        classList(popover).add('is-active')
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
      const footnote = closest(target, '.littlefoot-footnote__button')
      const footnoteId = footnote.getAttribute('data-footnote-id')
      const selector = `[data-footnote-id="${footnoteId}"]`

      if (!classList(footnote).contains('is-active')) {
        if (!settings.allowMultiple) {
          dismissFootnotes(`.littlefoot-footnote:not(${selector})`)
        }

        classList(footnote).add('is-hovered')
        displayFootnote('.littlefoot-footnote__button' + selector, 'is-hovered')
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
    const isActive = classList(button).contains('is-active')
    const isChanging = classList(button).contains('is-changing')
    const footnoteId = button.getAttribute('data-footnote-id')
    const selector = `[data-footnote-id="${footnoteId}"]`

    if (typeof button.blur === 'function') {
      button.blur()
    }

    if (isChanging) {
      return
    }

    if (isActive) {
      dismissFootnotes('.littlefoot-footnote' + selector)
      return
    }

    if (!settings.allowMultiple) {
      dismissFootnotes('.littlefoot-footnote:not(' + selector + ')')
    }

    // Activate footnote:
    classList(button).add('is-changing')
    displayFootnote('.littlefoot-footnote__button' + selector)

    setTimeout(() => {
      classList(button).remove('is-changing')
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
    const button = closest(event.target, '.littlefoot-footnote__button')
    const footnote = closest(event.target, '.littlefoot-footnote')

    if (button) {
      event.preventDefault()
      activateButton(button)
    }

    if (!button && !footnote && document.querySelector('.littlefoot-footnote')) {
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
        if (!document.querySelector('.littlefoot-footnote__button:hover, .littlefoot-footnote:hover')) {
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

  delegate(document).on('mouseover', '.littlefoot-footnote__button', onHover)
  delegate(document).on('mouseout', '.is-hovered', onUnhover)

  return {
    activate: displayFootnote,
    dismiss: dismissFootnotes,
    getSetting: settings.get,
    updateSetting: settings.set
  }
}

export default littlefoot
