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
  findButton,
  findClosestButton,
  findClosestPopover,
  findHoveredFootnote,
  findPopover,
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

function maybeCall (context, fn, ...args) {
  return typeof fn === 'function' && fn.call(context, ...args)
}

function findButtons (selector, multiple) {
  return selector
    ? multiple
      ? findAllButtons(selector)
      : [findButton(selector)]
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
    if (!allowMultiple) {
      dismiss(`:not(${selector})`)
    }
    activate(selector)
    setTimeout(() => unsetChanging(button), activateDelay)
  }

  return target => {
    const button = findClosestButton(target)

    if (button) {
      maybeCall(button, button.blur)
      const selector = getPopoverSelector(button)

      if (!isChanging(button)) {
        if (isActive(button)) {
          dismiss(selector)
        } else {
          displayPopover(selector, button)
        }
      }
    } else {
      const popover = findClosestPopover(target)

      if (!popover && findPopover()) {
        dismiss()
      }
    }

    return button
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
  return () => {
    const { activateOnHover, dismissOnUnhover, hoverDelay } = settings
    if (dismissOnUnhover && activateOnHover) {
      setTimeout(() => {
        if (!findHoveredFootnote()) {
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
