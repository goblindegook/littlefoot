import template from 'lodash.template'

function createActivate (adapter, settings) {
  return (footnote, className) => {
    const { activateCallback, activateDelay, contentTemplate } = settings
    const render = template(contentTemplate)

    if (!footnote.isChanging()) {
      footnote.startChanging()

      const activated = footnote.activate(render, className, activateCallback)

      adapter.findActiveFootnotes().forEach(fn => {
        fn.reposition()
        fn.resize()
      })

      setTimeout(() => {
        // FIXME: reposition and resize here?
        activated.ready()
        activated.stopChanging()
      }, activateDelay)
    }
  }
}

function createDismiss (settings) {
  return (footnote, delay = settings.dismissDelay) => {
    if (!footnote.isChanging()) {
      footnote.startChanging()
      footnote.dismiss()

      setTimeout(() => {
        footnote.remove()
        footnote.stopChanging()
      }, delay)
    }
  }
}

function createToggleHandler (adapter, activate, dismiss, settings) {
  // FIXME: target -> footnote conversion should not happen here.
  return target => {
    const { allowMultiple } = settings
    const footnote = adapter.findClosestFootnote(target)

    if (footnote) {
      footnote.blur()

      if (footnote.isActive()) {
        dismiss(footnote)
      } else {
        if (!allowMultiple) {
          adapter.findOtherActiveFootnotes(footnote).forEach(dismiss)
        }

        activate(footnote)
      }
    } else if (!adapter.findClosestPopover(target)) {
      adapter.findActiveFootnotes().forEach(dismiss)
    }
  }
}

function createHoverHandler (adapter, activate, dismiss, settings) {
  const { activateOnHover, allowMultiple } = settings
  return target => {
    if (activateOnHover) {
      const footnote = adapter.findClosestFootnote(target)

      if (!footnote.isActive()) {
        footnote.hover()
        if (!allowMultiple) {
          adapter.findOtherActiveFootnotes(footnote).forEach(dismiss)
        }
        activate(footnote)
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
          adapter.findActiveFootnotes().forEach(dismiss)
        }
      }, hoverDelay)
    }
  }
}

// FIXME: activate and dismiss are the core methods,
// most everything else should be moved a driving adapter.
export function createCore (adapter, settings) {
  const activate = createActivate(adapter, settings)
  const dismiss = createDismiss(settings)

  return {
    activate: (selector, className) => {
      if (selector) {
        const { allowMultiple } = settings
        const footnotes = allowMultiple
          ? adapter.findAllFootnotes(selector)
          : [adapter.findFootnote(selector)]

        footnotes
          .filter(footnote => footnote)
          .map(footnote => activate(footnote, className))
      }
    },

    dismiss: (selector, delay) => {
      adapter.findActiveFootnotes(selector)
        .forEach(footnote => dismiss(footnote, delay))
    },

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
