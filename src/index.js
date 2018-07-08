import template from 'lodash.template'
import { createSettings } from './settings'
import { repositionPopover } from './repositionPopovers'
import { init } from './init'
import { onTouchClick, onEscapeKey, onScrollResize, onHover, onUnhover } from './events'
import {
  activateButton,
  addClass,
  deactivateButton,
  findAllButtons,
  findAllPopovers,
  findClosestButton,
  findClosestPopover,
  findOneButton,
  findPopoverButton,
  getPopoverSelector,
  insertPopover,
  isActive,
  isChanging,
  remove,
  setActive,
  setChanging,
  setHovered,
  unsetActive,
  unsetChanging
} from './document'
import {
  CLASS_BUTTON,
  CLASS_FOOTNOTE
} from './constants'

function maybeCall (context, fn, ...args) {
  return typeof fn === 'function' && fn.call(context, ...args)
}

function findButtons (selector, multiple) {
  return selector
    ? multiple
      ? findAllButtons(selector)
      : [findOneButton(selector)]
    : []
}

function activatePopover (settings) {
  return (selector, className) => {
    const { activateCallback, activateDelay, allowMultiple, contentTemplate } = settings
    const renderPopover = template(contentTemplate)

    const popovers = findButtons(selector, allowMultiple)
      .map(findClosestButton)
      .filter(button => button)
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

function dismissPopover (delay) {
  return popover => {
    const button = findPopoverButton(popover)

    if (!isChanging(button)) {
      setChanging(button)
      deactivateButton(button)
      unsetActive(popover)

      window.setTimeout(() => {
        remove(popover)
        unsetChanging(button)
      }, delay)
    }
  }
}

function dismissPopovers (settings) {
  return (selector, delay = settings.dismissDelay) => {
    findAllPopovers(selector).forEach(dismissPopover(delay))
  }
}

function repositionPopovers (event) {
  findAllPopovers().forEach(repositionPopover(event && event.type))
}

function toggleHandler (activate, dismiss, settings) {
  const displayPopover = (selector, button) => {
    const { activateDelay, allowMultiple } = settings
    setChanging(button)
    !allowMultiple && dismiss(`:not(${selector})`)
    activate(selector)
    setTimeout(() => unsetChanging(button), activateDelay)
  }

  return target => {
    const button = findClosestButton(event.target)

    if (button) {
      maybeCall(button, button.blur)
      const selector = getPopoverSelector(button)

      isChanging(button)
        ? null
        : isActive(button)
          ? dismiss(selector)
          : displayPopover(selector, button)

      return button
    }

    const popover = findClosestPopover(event.target)

    if (!popover && document.querySelector(`.${CLASS_FOOTNOTE}`)) {
      dismiss()
    }
  }
}

function hoverHandler (activate, dismiss, settings) {
  const { activateOnHover, allowMultiple } = settings
  return target => {
    if (activateOnHover) {
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

function unhoverHandler (dismiss, settings) {
  return _ => {
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

  const handleToggle = toggleHandler(activate, dismiss, settings)
  const handleActivation = hoverHandler(activate, dismiss, settings)
  const handleDeactivation = unhoverHandler(dismiss, settings)

  init(settings)

  onTouchClick(handleToggle)
  onEscapeKey(dismiss)
  onScrollResize(repositionPopovers)
  onHover(handleActivation)
  onUnhover(handleDeactivation)

  const getSetting = key => settings[key]
  const updateSetting = (key, value) => {
    settings[key] = value
  }

  return { activate, dismiss, getSetting, updateSetting }
}

export default littlefoot
