import template from 'lodash.template'

function maybeCall (context, fn, ...args) {
  return typeof fn === 'function' && fn.call(context, ...args)
}

function activatePopover (adapter, settings) {
  return (selector, className) => {
    if (!selector) {
      return
    }

    const { activateCallback, activateDelay, allowMultiple, contentTemplate } = settings
    const renderPopover = template(contentTemplate)

    const popovers = (allowMultiple ? adapter.findAllButtons(selector) : [adapter.findButton(selector)])
      .filter(button => button)
      .map(button => {
        const popover = adapter.insertPopover(button, renderPopover)
        adapter.activateButton(button)
        adapter.addClass(className)(popover)
        maybeCall(null, activateCallback, popover, button)
        return popover
      })

    adapter.findAllPopovers().forEach(adapter.resizePopover)

    setTimeout(() => popovers.forEach(adapter.setActive), activateDelay)
  }
}

function dismissPopover (adapter, delay) {
  return popover => {
    const button = adapter.findPopoverButton(popover)

    if (!adapter.isChanging(button)) {
      adapter.setChanging(button)
      adapter.deactivateButton(button)
      adapter.unsetActive(popover)

      setTimeout(() => {
        adapter.remove(popover)
        adapter.unsetChanging(button)
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
  const displayPopover = (selector, button) => {
    const { activateDelay, allowMultiple } = settings
    adapter.setChanging(button)
    if (!allowMultiple) {
      dismiss(adapter.invertSelection(selector))
    }
    activate(selector)
    setTimeout(() => adapter.unsetChanging(button), activateDelay)
  }

  return target => {
    const button = adapter.findClosestButton(target)

    if (button) {
      maybeCall(button, button.blur)
      const selector = adapter.getPopoverSelector(button)

      if (!adapter.isChanging(button)) {
        if (adapter.isActive(button)) {
          dismiss(selector)
        } else {
          displayPopover(selector, button)
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

      if (!adapter.isActive(button)) {
        const selector = adapter.getPopoverSelector(button)
        adapter.setHovered(button)
        !allowMultiple && dismiss(adapter.invertSelection(selector))
        activate(selector)
      }
    }
  }
}

function createUnhoverHandler (adapter, dismiss, settings) {
  return () => {
    const { activateOnHover, dismissOnUnhover, hoverDelay } = settings
    if (dismissOnUnhover && activateOnHover) {
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
