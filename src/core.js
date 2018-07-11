import template from 'lodash.template'

function createActivateHandler (adapter, settings) {
  return (footnotes, className) => {
    const { activateCallback, activateDelay, contentTemplate } = settings
    const render = template(contentTemplate)

    const newFootnotes = footnotes
      .filter(footnote => footnote)
      .map(footnote => footnote.activate(render, className, activateCallback))

    adapter.findActiveFootnotes()
      .forEach(footnote => {
        footnote.reposition()
        footnote.resize()
      })

    setTimeout(() => newFootnotes.forEach(footnote => footnote.ready()), activateDelay)
  }
}

function dismissFootnote (delay) {
  return footnote => {
    if (!footnote.isChanging()) {
      footnote.startChanging()
      footnote.dismiss()

      setTimeout(() => {
        footnote.stopChanging()
        footnote.remove()
      }, delay)
    }
  }
}

function dismissFootnotes (adapter, settings) {
  return (selector, delay = settings.dismissDelay) => {
    adapter.findActiveFootnotes(selector)
      .forEach(dismissFootnote(delay))
  }
}

function createToggleHandler (adapter, activate, dismiss, settings) {
  // FIXME: Core should not handle raw event targets,
  // event handler should convert it beforehand.
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
          activate([footnote])
          setTimeout(footnote.stopChanging, activateDelay)
        }
      }
    } else {
      // FIXME: Stop using findClosestPopover.
      const popover = adapter.findClosestPopover(target)

      // FIXME: Stop using findPopover.
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
        footnote.hover()
        if (!allowMultiple) {
          const selector = footnote.getSelector()
          dismiss(adapter.invertSelection(selector))
        }
        activate([footnote])
      }
    }
  }
}

function createUnhoverHandler (adapter, dismiss, settings) {
  return () => {
    const { dismissOnUnhover, hoverDelay } = settings
    if (dismissOnUnhover) {
      setTimeout(() => {
        if (!adapter.hasHoveredFootnotes()) {
          dismiss()
        }
      }, hoverDelay)
    }
  }
}

export function createCore (adapter, settings) {
  const activate = createActivateHandler(adapter, settings)
  const dismiss = dismissFootnotes(adapter, settings)

  return {
    // FIXME: Remove selector -> footnotes conversion from core.
    activate: (selector, className) => {
      if (selector) {
        const { allowMultiple } = settings
        const footnotes = allowMultiple
          ? adapter.findAllFootnotes(selector)
          : [adapter.findFootnote(selector)]
        activate(footnotes, className)
      }
    },

    dismiss,

    reposition: () => {
      adapter.findActiveFootnotes()
        .forEach(footnote => footnote.reposition())
    },

    resize: () => {
      adapter.findActiveFootnotes()
        .forEach(footnote => footnote.resize())
    },

    toggle: createToggleHandler(adapter, activate, dismiss, settings),

    hover: createHoverHandler(adapter, activate, dismiss, settings),

    unhover: createUnhoverHandler(adapter, dismiss, settings)
  }
}
