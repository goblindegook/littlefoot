import template from 'lodash.template'
import { maybeCall } from './helpers'

function activatePopover (adapter, settings) {
  return (selector, className) => {
    if (!selector) {
      return
    }

    const { activateCallback, activateDelay, allowMultiple, contentTemplate } = settings
    const renderPopover = template(contentTemplate)

    const popovers = (allowMultiple ? adapter.findAllFootnotes(selector) : [adapter.findFootnote(selector)])
      .filter(footnote => footnote)
      .map(footnote => {
        // FIXME: Core should not handle DOM elements, activate() should create the popover internally.
        const popover = adapter.insertPopover(footnote.getButtonElement(), renderPopover)
        footnote.activate()
        adapter.addClass(className)(popover)
        maybeCall(null, activateCallback, popover, footnote.getButtonElement())
        return popover
      })

    adapter.findAllPopovers().forEach(adapter.resizePopover)

    setTimeout(() => popovers.forEach(adapter.setActive), activateDelay)
  }
}

function dismissPopover (adapter, delay) {
  return popover => {
    const footnote = adapter.getPopoverFootnote(popover)

    if (!footnote.isChanging()) {
      footnote.startChanging()
      footnote.dismiss()

      setTimeout(() => {
        // FIXME: Create footnote.dismiss() to remove the popover object from the DOM tree.
        adapter.remove(popover)
        footnote.stopChanging()
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
  // FIXME: Core should not handle raw event targets, event handler should convert it beforehand.
  return target => {
    const { activateDelay, allowMultiple } = settings
    const footnote = adapter.findClosestFootnote(target)

    if (footnote) {
      footnote.blur()

      if (!footnote.isChanging()) {
        // FIXME: Selectors should be handled internally.
        const selector = footnote.getSelector()

        if (footnote.isActive()) {
          dismiss(selector)
        } else {
          footnote.startChanging()
          if (!allowMultiple) {
            dismiss(adapter.invertSelection(selector))
          }
          activate(selector)
          setTimeout(footnote.stopChanging, activateDelay)
        }
      }
    } else {
      const popover = adapter.findClosestPopover(target)

      if (!popover && adapter.findPopover()) {
        dismiss()
      }
    }
  }
}

function createHoverHandler (adapter, activate, dismiss, settings) {
  const { activateOnHover, allowMultiple } = settings
  // FIXME: Core should not handle raw event targets, event handler should convert it beforehand.
  return target => {
    if (activateOnHover) {
      const footnote = adapter.findClosestFootnote(target)

      if (!footnote.isActive()) {
        // FIXME: Selectors should be handled internally.
        const selector = footnote.getSelector()
        footnote.hover()
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
        if (!adapter.hasHoveredFootnote()) {
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
