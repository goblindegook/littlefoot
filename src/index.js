import closest from 'dom-closest'
import matches from 'dom-matches'
import siblings from 'dom-siblings'
import escape from 'lodash/escape'
import template from 'lodash/template'
import throttle from 'lodash/throttle'
import addClass from './dom/addClass'
import hasClass from './dom/hasClass'
import removeClass from './dom/removeClass'
import calculateAvailableRoom from './calculateAvailableRoom'
import calculatePixelSize from './calculatePixelSize'
import getClosestFootnote from './getClosestFootnote'
import getFootnoteLinks from './getFootnoteLinks'
import hideOriginalFootnotes from './hideOriginalFootnotes'
import createSettings from './settings'
import positionTooltip from './positionTooltip'
import prepareContent from './prepareContent'
import scrollHandler from './scrollHandler'
import { addEventListener, dispatchEvent } from './events'

/**
 * Littlefoot instance factory.
 *
 * @param  {Object} options Littlefoot options.
 * @return {Object}         Littlefoot instance.
 */
const littlefoot = function(options) {

  const settings      = createSettings(options)
  const popoverStates = {}

  /**
   * Footnote button/ content initializer (run on doc.ready).
   *
   * Finds the likely footnote links and then uses their target to find the content.
   */
  function footnoteInit() {
    const buttonTemplate = template(settings.buttonTemplate)
    const footnoteLinks  = getFootnoteLinks(settings)
    const footnotes      = []

    const finalFNLinks = footnoteLinks.filter(footnoteLink => {
      const closestFootnote = getClosestFootnote(footnoteLink, settings.footnoteSelector, settings.allowDuplicates)

      if (closestFootnote) {
        addClass(closestFootnote, 'footnote-processed')
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
      const footnoteLink  = finalFNLinks[i]
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

      switch (settings.originalFootnotes.toLowerCase()) {
        case 'hide':
          addClass(footnoteLink, 'footnote-print-only')
          addClass(footnote, 'footnote-print-only')
          hideOriginalFootnotes(footnote.parentNode)
          break

        case 'delete':
          footnoteLink.parentNode.removeChild(footnoteLink)
          footnote.parentNode.removeChild(footnote)
          hideOriginalFootnotes(footnote.parentNode, true)
          break

        default:
          addClass(footnoteLink, 'footnote-print-only')
          break
      }
    })
  }

  /**
   * To activate the popover of a hovered footnote button. Also removes other
   * popovers, if allowMultiple is false.
   *
   * @param {Event} event Event that contains the target of the mouseenter event.
   */
  function onHover(event) {
    let target  = event.target || event.srcElement
    let related = event.relatedTarget || event.toElement
    let match   = false

    if (!settings.activateOnHover) {
      return
    }

    while (target !== document && !(match = matches(target, '.littlefoot-footnote__button'))) {
      target = target.parentNode
    }

    if (!match) {
      return
    }

    while (related && related !== target && related !== document) {
      related = related.parentNode
    }

    if (related === target) {
      return
    }

    const footnoteHovered = closest(target, '.littlefoot-footnote__button')
    const dataIdentifier  = '[data-footnote-id="' + footnoteHovered.getAttribute('data-footnote-id') + '"]'

    if (!hasClass(footnoteHovered, 'is-active')) {
      addClass(footnoteHovered, 'is-hover-instantiated')

      if (!settings.allowMultiple) {
        dismissFootnotes('.littlefoot-footnote:not(' + dataIdentifier + ')')
      }

      const popovers = displayFootnote('.littlefoot-footnote__button' + dataIdentifier)

      for (let popover of popovers) {
        addClass(popover, 'is-hover-instantiated')
      }
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
    const dataIdentifier = 'data-footnote-id="' + button.getAttribute('data-footnote-id') + '"'
    const isActive       = hasClass(button, 'is-active')
    const isChanging     = hasClass(button, 'changing')

    dispatchEvent(button, 'blur')

    if (!isChanging && isActive && settings.allowMultiple) {
      dismissFootnotes('.littlefoot-footnote[' + dataIdentifier + ']')
    }

    if (!isChanging && isActive && !settings.allowMultiple) {
      dismissFootnotes()
    }

    if (!isChanging && !isActive) {
      addClass(button, 'changing')
      addClass(button, 'is-click-instantiated')
      displayFootnote('.littlefoot-footnote__button[' + dataIdentifier + ']')

      setTimeout(() => removeClass(button, 'changing'), settings.popoverCreateDelay)

      if (!settings.allowMultiple) {
        dismissFootnotes('.littlefoot-footnote:not([' + dataIdentifier + '])')
      }
    }
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
      dismissFootnotes()
    }
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

    if (typeof selector !== 'string' && settings.allowMultiple) {
      buttons.concat(selector)

    } else if (typeof selector !== 'string') {
      buttons.push(selector[0])

    } else if (settings.allowMultiple) {
      const elements = document.querySelectorAll(selector)
      Array.prototype.forEach.call(elements, (element, i) => {
        buttons[i] = closest(element, '.littlefoot-footnote__button')
      })

    } else {
      const element = document.querySelector(selector)
      if (element) {
        buttons.push(closest(element, '.littlefoot-footnote__button'))
      }
    }

    Array.prototype.forEach.call(buttons, function(button) {
      const content = contentTemplate({
        content: button.getAttribute('data-littlefoot-footnote'),
        id:      button.getAttribute('data-footnote-id'),
        number:  button.getAttribute('data-footnote-number'),
      })

      button.insertAdjacentHTML('afterend', content)

      const popover          = button.nextElementSibling
      const contentContainer = popover.querySelector('.littlefoot-footnote__content')

      popoverStates[button.getAttribute('data-footnote-id')] = 'init'
      popover.setAttribute('data-littlefoot-max-width', calculatePixelSize(popover, 'max-width'))
      popover.setAttribute('data-littlefoot-max-height', calculatePixelSize(contentContainer, 'max-height'))
      popover.style.maxWidth = '10000px'
      repositionPopover()
      addClass(button, 'is-active')
      bindScrollHandler(popover.querySelector('.littlefoot-footnote__content'))

      popoversCreated.push(popover)

      if (typeof settings.activateCallback === 'function') {
        settings.activateCallback(popover, button)
      }
    })

    setTimeout(() => {
      Array.prototype.forEach.call(popoversCreated, popover => {
        addClass(popover, 'is-active')
      })
    }, settings.popoverCreateDelay)

    return popoversCreated
  }

  /**
   * Prevents scrolling of the page when you reach the top/ bottom of scrolling
   * a scrollable footnote popover.
   *
   * @param {DOMElement} element The element on which the function was run.
   */
  function bindScrollHandler(element) {
    if (settings.preventPageScroll) {
      addEventListener(element, 'mousewheel', throttle(scrollHandler))
      addEventListener(element, 'wheel', throttle(scrollHandler))
    }
  }

  /**
   * Removes the unhovered footnote content if dismissOnUnhover is true.
   *
   * @param {Event} event Event that contains the target of the mouseout event.
   */
  function onUnhover(event) {
    let target  = event.target || event.srcElement
    let related = event.relatedTarget || event.fromElement
    let match   = false

    if (!settings.dismissOnUnhover || !settings.activateOnHover) {
      return
    }

    while (target !== document && !(match = matches(target, '.is-hover-instantiated'))) {
      target = target.parentNode
    }

    if (match) {
      while (related && related !== target && related !== document) {
        related = related.parentNode
      }

      if (related !== target) {
        setTimeout(() => {
          if (!document.querySelector('.littlefoot-footnote__button:hover, .littlefoot-footnote:hover')) {
            dismissFootnotes()
          }
        }, settings.hoverDelay)
      }
    }
  }

  /**
   * Remove all popovers on keypress.
   *
   * @param {Event} event Event that contains the key that was pressed.
   */
  function onEscapeKeypress(event) {
    if (event.keyCode === 27) {
      dismissFootnotes()
    }
  }

  /**
   * Removes/adds appropriate classes to the footnote content and button after
   * a delay (to allow for transitions) it removes the actual footnote content.
   *
   * @param  {String} footnotes The CSS selector of the footnotes to be removed.
   * @param  {Number} timeout   The delay between adding the removal classes and
   *                            actually removing the popover from the DOM.
   * @return {Array}            The buttons whose popovers were removed by the call.
   */
  function dismissFootnotes(footnoteSelector = '.littlefoot-footnote', timeout = settings.popoverDismissDelay) {
    const buttonsClosed = []
    const footnoteElements = document.querySelectorAll(footnoteSelector);

    Array.prototype.forEach.call(footnoteElements, footnoteElement => {
      const footnoteID   = footnoteElement.getAttribute('data-footnote-id')
      const linkedButton = document.querySelector('.littlefoot-footnote__button[data-footnote-id="' + footnoteID + '"]')

      if (!hasClass(linkedButton, 'changing')) {
        buttonsClosed.push(linkedButton)

        removeClass(linkedButton, 'is-active')
        removeClass(linkedButton, 'is-hover-instantiated')
        removeClass(linkedButton, 'is-click-instantiated')
        removeClass(footnoteElement, 'is-active')
        addClass(linkedButton, 'changing')
        addClass(footnoteElement, 'disapearing')

        setTimeout(() => {
          footnoteElement.parentNode.removeChild(footnoteElement)
          delete popoverStates[footnoteID]
          removeClass(linkedButton, 'changing')
        }, timeout)
      }
    })

    return buttonsClosed
  }

  /**
   * Positions each footnote relative to its button.
   *
   * @param {Event} event The type of event that prompted the reposition function.
   */
  function repositionPopover(event) {
    const type      = event ? event.type : 'resize'
    const footnotes = document.querySelectorAll('.littlefoot-footnote')

    Array.prototype.forEach.call(footnotes, footnote => {
      const identifier      = footnote.getAttribute('data-footnote-id')
      const button          = siblings(footnote, '.littlefoot-footnote__button')[0]
      const buttonStyle     = button.currentStyle || window.getComputedStyle(button)
      const footnoteStyle   = footnote.currentStyle || window.getComputedStyle(footnote)
      const roomLeft        = calculateAvailableRoom(button)
      const marginSize      = parseFloat(footnoteStyle.marginTop)
      const maxHeightInCSS  = parseFloat(footnote.getAttribute('data-littlefoot-max-height'))
      const totalHeight     = 2 * marginSize + footnote.offsetHeight
      const positionOnTop   = roomLeft.bottomRoom < totalHeight && roomLeft.topRoom > roomLeft.bottomRoom
      const lastState       = popoverStates[identifier]
      let maxHeightOnScreen = 10000

      if (positionOnTop) {
        if (lastState !== 'top') {
          popoverStates[identifier] = 'top'
          addClass(footnote, 'is-positioned-top')
          removeClass(footnote, 'is-positioned-bottom')
          footnote.style.transformOrigin = (roomLeft.leftRelative * 100) + '% 100%'
        }

        maxHeightOnScreen = roomLeft.topRoom - marginSize - 15

      } else {
        if (lastState !== 'bottom' || lastState === 'init') {
          popoverStates[identifier] = 'bottom'
          removeClass(footnote, 'is-positioned-top')
          addClass(footnote, 'is-positioned-bottom')
          footnote.style.transformOrigin = (roomLeft.leftRelative * 100) + '% 0'
        }

        maxHeightOnScreen = roomLeft.bottomRoom - marginSize - 15
      }

      footnote.querySelector('.littlefoot-footnote__content').style.maxHeight = Math.min(maxHeightOnScreen, maxHeightInCSS) + 'px'

      if (type === 'resize') {
        const maxWidthInCSS   = parseFloat(footnote.getAttribute('data-littlefoot-max-width'))
        const footnoteWrapper = footnote.querySelector('.littlefoot-footnote__wrapper')
        const footnoteContent = footnote.querySelector('.littlefoot-footnote__content')
        let maxWidth          = maxWidthInCSS

        if (maxWidthInCSS <= 1) {
          const relative      = settings.maxWidthRelativeTo ? document.querySelector(settings.maxWidthRelativeTo) : null
          const relativeWidth = Math.min(window.innerWidth, relative ? relative.offsetWidth : 10000)

          maxWidth = relativeWidth * maxWidthInCSS
        }

        maxWidth = Math.min(maxWidth, footnoteContent.offsetWidth + 1)

        const left = -roomLeft.leftRelative * maxWidth + parseFloat(buttonStyle.marginLeft) + button.offsetWidth / 2

        footnoteWrapper.style.maxWidth = maxWidth + 'px'
        footnote.style.left            = left + 'px'

        positionTooltip(footnote, roomLeft.leftRelative)
      }

      if (parseInt(footnote.offsetHeight) < footnote.querySelector('.littlefoot-footnote__content').scrollHeight) {
        addClass(footnote, 'is-scrollable')
      }
    })
  }

  footnoteInit()

  addEventListener(document, 'touchend', onTouchClick)
  addEventListener(document, 'click', onTouchClick)
  addEventListener(document, 'keyup', onEscapeKeypress)
  addEventListener(document, 'mouseover', onHover)
  addEventListener(document, 'mouseout', onUnhover)
  addEventListener(document, 'gestureend', repositionPopover)
  addEventListener(window, 'scroll', throttle(repositionPopover))
  addEventListener(window, 'resize', throttle(repositionPopover))

  return {
    activate: displayFootnote,
    close:    dismissFootnotes,
    get:      settings.get,
    set:      settings.set,
  }
}

export default littlefoot
