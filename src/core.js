import template from 'lodash.template'
import { maybeCall } from './helpers'
import { createButton } from './adapter/document'

function activatePopover (adapter, settings) {
  return (selector, className) => {
    if (!selector) {
      return
    }

    const { activateCallback, activateDelay, allowMultiple, contentTemplate } = settings
    const renderPopover = template(contentTemplate)

    const popovers = (allowMultiple ? adapter.findAllButtons(selector) : [adapter.findButton(selector)])
      .filter(button => button)
      .map(element => {
        const popover = adapter.insertPopover(element, renderPopover)
        const button = createButton(element)
        button.activate()
        adapter.addClass(className)(popover)
        maybeCall(null, activateCallback, popover, button.element) // FIXME
        return popover
      })

    adapter.findAllPopovers().forEach(adapter.resizePopover)

    setTimeout(() => popovers.forEach(adapter.setActive), activateDelay)
  }
}

function dismissPopover (adapter, delay) {
  return popover => {
    const button = adapter.findPopoverButton(popover)

    if (!button.isChanging()) {
      button.startChanging()
      button.deactivate()

      setTimeout(() => {
        adapter.remove(popover)
        button.stopChanging()
      }, delay)
    }
  }
}

function dismissPopovers (adapter, settings) {
  return (selector, delay = settings.dismissDelay) => {
    adapter.findAllPopovers(selector).forEach(dismissPopover(adapter, delay))
  }
}

function createToggleHandler (adapter, activate, dismiss, settings) {
  return target => {
    const { activateDelay, allowMultiple } = settings
    const button = adapter.findClosestButton(target)

    if (button) {
      button.blur()
      const selector = button.getFootnoteSelector()

      if (!button.isChanging()) {
        if (button.isActive()) {
          dismiss(selector)
        } else {
          button.startChanging()
          if (!allowMultiple) {
            dismiss(adapter.invertSelection(selector))
          }
          activate(selector)
          setTimeout(button.stopChanging, activateDelay)
        }
      }
    } else {
      const popover = adapter.findClosestPopover(target)

      if (!popover && adapter.findPopover()) {
        dismiss()
      }
    }

    return button
  }
}

function createHoverHandler (adapter, activate, dismiss, settings) {
  const { activateOnHover, allowMultiple } = settings
  return target => {
    if (activateOnHover) {
      const button = adapter.findClosestButton(target)

      if (!button.isActive()) {
        const selector = button.getFootnoteSelector()
        button.hover()
        if (!allowMultiple) {
          dismiss(adapter.invertSelection(selector))
        }
        activate(selector)
      }
    }
  }
}

function createUnhoverHandler (adapter, dismiss, settings) {
  return () => {
    const { dismissOnUnhover, hoverDelay } = settings
    if (dismissOnUnhover) {
      setTimeout(() => {
        if (!adapter.findHoveredFootnote()) {
          dismiss()
        }
      }, hoverDelay)
    }
  }
}

export function createCore (adapter, settings) {
  const activate = activatePopover(adapter, settings)
  const dismiss = dismissPopovers(adapter, settings)

  return {
    activate,
    dismiss,
    layoutPopovers: () => adapter.findAllPopovers().forEach(adapter.layoutPopover),
    resizePopovers: () => adapter.findAllPopovers().forEach(adapter.resizePopover),
    toggleHandler: createToggleHandler(adapter, activate, dismiss, settings),
    hoverHandler: createHoverHandler(adapter, activate, dismiss, settings),
    unhoverHandler: createUnhoverHandler(adapter, dismiss, settings)
  }
}
