import './style.css'
import './playground.js'
import { littlefoot } from 'littlefoot'

function initTabs() {
  const tablists = document.querySelectorAll('[role="tablist"]')

  for (const tablist of tablists) {
    const tabs = [...tablist.querySelectorAll('[role="tab"]')]

    tablist.addEventListener('keydown', (e) => {
      const current = tabs.indexOf(document.activeElement)
      if (current === -1) return

      let next = current
      if (e.key === 'ArrowRight') next = (current + 1) % tabs.length
      else if (e.key === 'ArrowLeft') next = (current - 1 + tabs.length) % tabs.length
      else return

      e.preventDefault()
      activateTab(tabs[next], tabs)
      tabs[next].focus()
    })

    for (const tab of tabs) {
      tab.addEventListener('click', () => activateTab(tab, tabs))
    }
  }
}

function activateTab(tab, allTabs) {
  for (const t of allTabs) {
    t.setAttribute('aria-selected', 'false')
    t.classList.remove('is-active')
    t.tabIndex = -1

    const panelId = t.getAttribute('aria-controls')
    const panel = document.getElementById(panelId)
    if (panel) {
      panel.hidden = true
      panel.classList.remove('is-entering')
    }
  }

  tab.setAttribute('aria-selected', 'true')
  tab.classList.add('is-active')
  tab.tabIndex = 0

  const panelId = tab.getAttribute('aria-controls')
  const panel = document.getElementById(panelId)
  if (panel) {
    panel.hidden = false

    if (!document.body.classList.contains('reduced-motion')) {
      panel.classList.remove('is-entering')
      void panel.offsetHeight
      panel.classList.add('is-entering')
      window.setTimeout(() => panel.classList.remove('is-entering'), 320)
    }
  }
}

function initMotion() {
  const reduceMotionMedia = window.matchMedia('(prefers-reduced-motion: reduce)')

  const applyMotionPreference = () => {
    document.body.classList.toggle('reduced-motion', reduceMotionMedia.matches)
  }

  applyMotionPreference()

  if (reduceMotionMedia.addEventListener) {
    reduceMotionMedia.addEventListener('change', applyMotionPreference)
  } else {
    reduceMotionMedia.addListener(applyMotionPreference)
  }

  requestAnimationFrame(() => {
    document.body.classList.add('motion-ready')
  })
}

initTabs()
initMotion()

littlefoot({
  scope: '#api',
  anchorPattern: /#fn:(button-template-default|content-template-default)$/i,
})
