import delegate from 'dom-delegate'
import template from 'lodash.template'
import throttle from 'lodash.throttle'
import { bind } from './dom/events'
import { createSettings } from './settings'
import { dismissPopover } from './dismissPopover'
import { repositionPopover } from './repositionPopovers'
import { getClosestFootnoteButtons } from './getClosestFootnoteButtons'
import { init } from './init'
import { onEscapeKeypress } from './events'
import {
  activateButton,
  addClass,
  findAllFootnotes,
  findClosestButton,
  findClosestPopover,
  insertPopover,
  isActive,
  isChanging,
  setActive,
  setChanging,
  setHovered,
  unsetChanging,
  getPopoverSelector
} from './document'
import {
  CLASS_BUTTON,
  CLASS_FOOTNOTE,
  CLASS_HOVERED
} from './constants'

function maybeCall (context, fn, ...args) {
  return typeof fn === 'function' && fn.call(context, ...args)
}

function activatePopover (settings) {
  return (selector, className) => {
    const { activateCallback, activateDelay, allowMultiple, contentTemplate } = settings
    const renderPopover = template(contentTemplate)

    const popovers = getClosestFootnoteButtons(selector, allowMultiple)
      .map(button => {
        const popover = insertPopover(button, renderPopover)
        activateButton(button)
        repositionPopovers()
        addClass(className)(popover)
        maybeCall(null, activateCallback, popover, button)
        return popover
      })

    setTimeout(() => popovers.forEach(setActive), activateDelay)
  }
}

function dismissPopovers (settings) {
  return (selector, timeout = settings.dismissDelay) => {
    findAllFootnotes(selector).forEach(dismissPopover(timeout))
  }
}

function repositionPopovers (event) {
  findAllFootnotes().forEach(repositionPopover(event && event.type))
}

function onTouchClick (activate, dismiss, settings) {
  const displayPopover = (selector, button) => {
    const { activateDelay, allowMultiple } = settings
    setChanging(button)
    !allowMultiple && dismiss(`:not(${selector})`)
    activate(selector)
    setTimeout(() => unsetChanging(button), activateDelay)
  }

  return event => {
    const button = findClosestButton(event.target)

    if (button) {
      event.preventDefault()
      maybeCall(button, button.blur)
      const selector = getPopoverSelector(button)

      return isChanging(button)
        ? null
        : isActive(button)
          ? dismiss(selector)
          : displayPopover(selector, button)
    }

    const popover = findClosestPopover(event.target)

    if (!popover && document.querySelector(`.${CLASS_FOOTNOTE}`)) {
      dismiss()
    }
  }
}

function onHover (activate, dismiss, settings) {
  return event => {
    const { activateOnHover, allowMultiple } = settings
    if (activateOnHover) {
      const target = event.target || event.srcElement
      const button = findClosestButton(target)

      if (!isActive(button)) {
        const selector = getPopoverSelector(button)
        setHovered(button)
        !allowMultiple && dismiss(`:not(${selector})`)
        activate(selector)
      }
    }
  }
}

function onUnhover (dismiss, settings) {
  return () => {
    const { activateOnHover, dismissOnUnhover, hoverDelay } = settings
    if (dismissOnUnhover && activateOnHover) {
      setTimeout(() => {
        if (!document.querySelector(`.${CLASS_BUTTON}:hover, .${CLASS_FOOTNOTE}:hover`)) {
          dismiss()
        }
      }, hoverDelay)
    }
  }
}

/**
 * Littlefoot instance factory.
 *
 * @param  {Object} options Littlefoot options.
 * @return {Object}         Littlefoot instance.
 */
const littlefoot = function (options) {
  const settings = createSettings(options)
  const activate = activatePopover(settings)
  const dismiss = dismissPopovers(settings)

  const getSetting = key => settings[key]
  const updateSetting = (key, value) => {
    settings[key] = value
  }

  init(settings)

  bind(document, 'touchend', onTouchClick(activate, dismiss, settings))
  bind(document, 'click', onTouchClick(activate, dismiss, settings))
  bind(document, 'keyup', onEscapeKeypress(dismiss))
  bind(document, 'gestureend', repositionPopovers)
  bind(window, 'scroll', throttle(repositionPopovers))
  bind(window, 'resize', throttle(repositionPopovers))

  delegate(document).on('mouseover', `.${CLASS_BUTTON}`, onHover(activate, dismiss, settings))
  delegate(document).on('mouseout', `.${CLASS_HOVERED}`, onUnhover(dismiss, settings))

  return { activate, dismiss, getSetting, updateSetting }
}

export default littlefoot
