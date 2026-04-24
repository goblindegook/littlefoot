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

function initSectionNavigation() {
  const nav = document.querySelector('.nav')
  const sectionLinks = [...document.querySelectorAll('a[href^="#"]')].filter((link) => {
    const hash = link.getAttribute('href')
    if (!hash || hash === '#') return false
    const target = document.getElementById(hash.slice(1))
    return target instanceof HTMLElement && target.tagName.toLowerCase() === 'section'
  })

  if (sectionLinks.length === 0) return

  const navLinks = sectionLinks.filter((link) => link.closest('.nav__links'))
  const sections = navLinks
    .map((link) => {
      const id = link.getAttribute('href')?.slice(1) ?? ''
      return id ? document.getElementById(id) : null
    })
    .filter(Boolean)

  const prefersReducedMotion = () => document.body.classList.contains('reduced-motion')
  const navOffset = () => (nav instanceof HTMLElement ? nav.offsetHeight + 14 : 0)

  const setActiveNav = (activeId) => {
    navLinks.forEach((link) => {
      const selected = link.getAttribute('href') === `#${activeId}`
      link.classList.toggle('is-current', selected)
      if (selected) link.setAttribute('aria-current', 'true')
      else link.removeAttribute('aria-current')
    })
  }

  const updateActiveSection = () => {
    if (sections.length === 0) return

    const threshold = window.scrollY + navOffset() + 20

    if (threshold < sections[0].offsetTop) {
      setActiveNav('')
      return
    }

    let activeSection = sections[0]

    for (const section of sections) {
      if (section.offsetTop <= threshold) activeSection = section
      else break
    }

    setActiveNav(activeSection.id)
  }

  sectionLinks.forEach((link) => {
    link.addEventListener('click', (event) => {
      const hash = link.getAttribute('href')
      if (!hash) return

      const target = document.getElementById(hash.slice(1))
      if (!(target instanceof HTMLElement)) return

      event.preventDefault()

      const top = Math.max(0, target.getBoundingClientRect().top + window.scrollY - navOffset())
      window.scrollTo({ top, behavior: prefersReducedMotion() ? 'auto' : 'smooth' })
      history.pushState(null, '', hash)
      setActiveNav(target.id)
    })
  })

  let ticking = false
  const onScrollOrResize = () => {
    if (ticking) return
    ticking = true
    requestAnimationFrame(() => {
      updateActiveSection()
      ticking = false
    })
  }

  window.addEventListener('scroll', onScrollOrResize, { passive: true })
  window.addEventListener('resize', onScrollOrResize)
  window.addEventListener('hashchange', updateActiveSection)

  updateActiveSection()
}

initTabs()
initMotion()
initSectionNavigation()

littlefoot({
  scope: '#api',
  anchorPattern: /#fn:(button-template-default|content-template-default)$/i,
})
