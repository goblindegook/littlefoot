import closest from 'dom-closest'
import classList from 'dom-classlist'
import delegate from 'delegate'
import escape from 'lodash/escape'
import template from 'lodash/template'
import throttle from 'lodash/throttle'
import getStylePropertyInPixels from './dom/getStylePropertyInPixels'
import getClosestFootnote from './getClosestFootnote'
import getFootnoteLinks from './getFootnoteLinks'
import hideOriginalFootnotes from './hideOriginalFootnotes'
import createSettings from './settings'
import prepareContent from './prepareContent'
import dismissFootnote from './dismissFootnote'
import repositionFootnote from './repositionFootnote'
import scrollHandler from './scrollHandler'
import { addEventListener, dispatchEvent } from './dom/events'

/**
 * Littlefoot instance factory.
 *
 * @param  {Object} options Littlefoot options.
 * @return {Object}         Littlefoot instance.
 */
const littlefoot = function(options) {

  const settings = createSettings(options)

  /**
   * Footnote button/content initializer (run on doc.ready).
   *
   * Finds the likely footnote links and then uses their target to find the content.
   */
  function init() {
    const buttonTemplate = template(settings.buttonTemplate)
    const footnoteLinks  = getFootnoteLinks(settings)
    const footnotes      = []

    const closestFootnoteLinks = footnoteLinks.filter((footnoteLink) => {
      const closestFootnote = getClosestFootnote(footnoteLink, settings.footnoteSelector, settings.allowDuplicates)

      if (closestFootnote) {
        classList(closestFootnote).add('footnote-processed')
        footnotes.push(closestFootnote)
      }

      return closestFootnote
    })

    const currentFootnoteLinks    = document.querySelectorAll('[data-footnote-id]')
    const currentLastFootnoteLink = currentFootnoteLinks[currentFootnoteLinks.length - 1]
    const footnoteNumStart        = currentLastFootnoteLink ? parseInt(currentLastFootnoteLink.getAttribute('data-footnote-id'), 10) : 0
    let lastResetElement          = null
    let footnoteNum               = 0

    footnotes.forEach((footnote, i) => {
      const footnoteLink  = closestFootnoteLinks[i]
      const footnoteIDNum = footnoteNumStart + i + 1
      const backlinkRef   = footnoteLink.getAttribute('data-footnote-backlink-ref')
      const content       = prepareContent(footnote.innerHTML, backlinkRef)

      if (settings.numberResetSelector != null) {
        const resetElement = closest(footnoteLink, settings.numberResetSelector)
        footnoteNum        = resetElement === lastResetElement ? footnoteNum + 1 : 1
        lastResetElement   = resetElement
      } else {
        footnoteNum = footnoteIDNum
      }

      footnoteLink.insertAdjacentHTML('beforebegin', buttonTemplate({
        content:   escape(content),
        id:        footnoteIDNum,
        number:    footnoteNum,
        reference: footnoteLink.getAttribute('data-footnote-backlink-ref'),
      }))

      classList(footnoteLink).add('footnote-print-only')
      classList(footnote).add('footnote-print-only')

      hideOriginalFootnotes(footnote.parentNode)
    })
  }

  /**
   * Removes/adds appropriate classes to the footnote content and button after
   * a delay (to allow for transitions) it removes the actual footnote content.
   *
   * @param  {String} footnotes The CSS selector for the footnotes to be removed.
   * @param  {Number} timeout   The delay between adding the removal classes and
   *                            actually removing the popover from the DOM.
   */
  function dismissAllFootnotes(footnoteSelector = '.littlefoot-footnote', timeout = settings.dismissDelay) {
    const footnotes = document.querySelectorAll(footnoteSelector)

    Array.prototype.forEach.call(footnotes, (footnote) => {
      dismissFootnote(footnote, timeout)
    })
  }

  /**
   * Positions each footnote relative to its button.
   *
   * @param {Event} event The type of event that prompted the reposition function.
   */
  function repositionAllFootnotes(event) {
    const footnotes = document.querySelectorAll('.littlefoot-footnote')

    Array.prototype.forEach.call(footnotes, (footnote) => {
      repositionFootnote(footnote, event)
    })
  }

  /**
   * Prevents scrolling of the page when you reach the top/ bottom of scrolling
   * a scrollable footnote popover.
   *
   * @param {DOMElement} element The element on which the function was run.
   */
  function bindScrollHandler(element) {
    addEventListener(element, 'mousewheel', throttle(scrollHandler))
    addEventListener(element, 'wheel', throttle(scrollHandler))
  }

  /**
   * Instantiates the footnote popover of the buttons matching the passed
   * selector. This includes replacing any variables in the content template,
   * decoding any special characters, adding the new element to the page,
   * calling the position function, and adding the scroll handler.
   *
   * @param  {String} selector CSS selector of buttons that are to be activated.
   * @return {Array}           All footnotes activated by the function.
   */
  function displayFootnote(selector) {
    const contentTemplate = template(settings.contentTemplate)
    const popoversCreated = []
    const buttons         = []

    if (!selector || selector.length === 0) {
      return popoversCreated
    }

    if (settings.allowMultiple) {
      const elements = document.querySelectorAll(selector)
      Array.prototype.forEach.call(elements, (element) => {
        buttons.push(closest(element, '.littlefoot-footnote__button'))
      })

    } else {
      const element = document.querySelector(selector)
      if (element) {
        buttons.push(closest(element, '.littlefoot-footnote__button'))
      }
    }

    Array.prototype.forEach.call(buttons, (button) => {
      button.insertAdjacentHTML('afterend', contentTemplate({
        content: button.getAttribute('data-littlefoot-footnote'),
        id:      button.getAttribute('data-footnote-id'),
        number:  button.getAttribute('data-footnote-number'),
      }))

      const popover = button.nextElementSibling
      const content = popover.querySelector('.littlefoot-footnote__content')

      popover.setAttribute('data-littlefoot-state', 'init')
      popover.setAttribute('data-littlefoot-max-width', getStylePropertyInPixels(popover, 'maxWidth'))
      popover.setAttribute('data-littlefoot-max-height', getStylePropertyInPixels(content, 'maxHeight'))

      popover.style.maxWidth = '10000px'

      bindScrollHandler(content)
      classList(button).add('is-active')
      repositionAllFootnotes()

      popoversCreated.push(popover)

      if (typeof settings.activateCallback === 'function') {
        settings.activateCallback(popover, button)
      }
    })

    setTimeout(() => {
      Array.prototype.forEach.call(popoversCreated, (popover) => {
        classList(popover).add('is-active')
      })
    }, settings.activateDelay)

    return popoversCreated
  }

  /**
   * To activate the popover of a hovered footnote button. Also removes other
   * popovers, if allowMultiple is false.
   *
   * @param {Event} event Event that contains the target of the mouseenter event.
   */
  function onHover(event) {
    let target = event.target || event.srcElement

    if (!settings.activateOnHover) {
      return
    }

    const footnoteHovered = closest(target, '.littlefoot-footnote__button')
    const dataIdentifier  = `[data-footnote-id="${footnoteHovered.getAttribute('data-footnote-id')}"]`

    if (!classList(footnoteHovered).contains('is-active')) {
      classList(footnoteHovered).add('is-hover-instantiated')

      if (!settings.allowMultiple) {
        dismissAllFootnotes(`.littlefoot-footnote:not(${dataIdentifier})`)
      }

      const popovers = displayFootnote('.littlefoot-footnote__button' + dataIdentifier)

      popovers.forEach((popover) => {
        classList(popover).add('is-hover-instantiated')
      })
    }
  }

  /**
   * Handles the logic of clicking/tapping the footnote button. That is,
   * activates the popover if it isn't already active (+ deactivate others, if
   * appropriate) or, deactivates the popover if it is already active.
   *
   * @param {DOMElement} button Button being clicked/pressed.
   */
  function activateButton(button) {
    const isActive   = classList(button).contains('is-active')
    const isChanging = classList(button).contains('changing')
    const selector   = `[data-footnote-id="${button.getAttribute('data-footnote-id')}"]`

    dispatchEvent(button, 'blur')

    if (isChanging) {
      return
    }

    if (isActive) {
      const dismissSelector = settings.allowMultiple ? '.littlefoot-footnote' + selector : null
      dismissAllFootnotes(dismissSelector)
      return
    }

    if (!settings.allowMultiple) {
      // Dismiss all other footnotes:
      dismissAllFootnotes('.littlefoot-footnote:not(' + selector + ')')
    }

    // Activate footnote:
    classList(button).add('changing')
    classList(button).add('is-click-instantiated')
    displayFootnote('.littlefoot-footnote__button' + selector)

    setTimeout(() => classList(button).remove('changing'), settings.activateDelay)
  }

  /**
   * Activates the button the was clicked/taps. Also removes other popovers, if
   * allowMultiple is false. Finally, removes all popovers if something non-fn
   * related was clicked/tapped.
   *
   * @param {Event} event Event that contains the target of the tap/click event.
   */
  function onTouchClick(event) {
    const button   = closest(event.target, '.littlefoot-footnote__button')
    const footnote = closest(event.target, '.littlefoot-footnote')

    if (button) {
      event.preventDefault()
      activateButton(button)
    }

    if (!button && !footnote && document.querySelector('.littlefoot-footnote')) {
      dismissAllFootnotes()
    }
  }

  /**
   * Removes the unhovered footnote content if dismissOnUnhover is true.
   *
   * @param {Event} event Event that contains the target of the mouseout event.
   */
  function onUnhover(event) {
    if (!settings.dismissOnUnhover || !settings.activateOnHover) {
      return
    }

    setTimeout(() => {
      if (!document.querySelector('.littlefoot-footnote__button:hover, .littlefoot-footnote:hover')) {
        dismissAllFootnotes()
      }
    }, settings.hoverDelay)
  }

  /**
   * Remove all popovers on keypress.
   *
   * @param {Event} event Event that contains the key that was pressed.
   */
  function onEscapeKeypress(event) {
    if (event.keyCode === 27) {
      dismissAllFootnotes()
    }
  }

  init()

  addEventListener(document, 'touchend', onTouchClick)
  addEventListener(document, 'click', onTouchClick)
  addEventListener(document, 'keyup', onEscapeKeypress)
  addEventListener(document, 'gestureend', repositionAllFootnotes)
  addEventListener(window, 'scroll', throttle(repositionAllFootnotes))
  addEventListener(window, 'resize', throttle(repositionAllFootnotes))
  delegate(document, '.littlefoot-footnote__button', 'mouseover', onHover)
  delegate(document, '.is-hover-instantiated', 'mouseout', onUnhover)

  return {
    activate: displayFootnote,
    dismiss:  dismissAllFootnotes,
    get:      settings.get,
    set:      settings.set,
  }
}

export default littlefoot
