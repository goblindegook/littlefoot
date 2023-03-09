# Changelog

All notable changes to this project will be documented in this file. See [standard-version](https://github.com/conventional-changelog/standard-version) for commit guidelines.

## [4.0.0-9](https://github.com/goblindegook/littlefoot/compare/v4.0.0-8...v4.0.0-9) (2023-03-09)

## [4.0.0-7](https://github.com/goblindegook/littlefoot/compare/v4.0.0-6...v4.0.0-7) (2023-03-06)


### Bug Fixes

* vertical scrolling indicator position ([9c1d97a](https://github.com/goblindegook/littlefoot/commit/9c1d97acd3d6ef7bc2e06b678783a2c4f442430f))

## [4.0.0-6](https://github.com/goblindegook/littlefoot/compare/v4.0.0-5...v4.0.0-6) (2021-01-19)


### Bug Fixes

* improve default button contrast ([#419](https://github.com/goblindegook/littlefoot/issues/419)) ([82492d4](https://github.com/goblindegook/littlefoot/commit/82492d493c9f07c910c7e0b624be83e22233c04b))
* popover z-index everywhere ([#658](https://github.com/goblindegook/littlefoot/issues/658)) ([be257e7](https://github.com/goblindegook/littlefoot/commit/be257e7bec067383c6d52a673995470299507e3f))
* sticky scrolling indicator moving on page scroll ([f2c845e](https://github.com/goblindegook/littlefoot/commit/f2c845e5a2860a36320a598913b1abb47b57207e))

## [4.0.0-5](https://github.com/goblindegook/littlefoot/compare/v4.0.0-4...v4.0.0-5) (2021-01-08)


### Bug Fixes

* buttons appearing above the popover on small screens ([#658](https://github.com/goblindegook/littlefoot/issues/658)) ([2805e07](https://github.com/goblindegook/littlefoot/commit/2805e0734349d85e1546463362947e7ce0234197))

## [4.0.0-4](https://github.com/goblindegook/littlefoot/compare/v4.0.0-3...v4.0.0-4) (2020-11-27)


### Bug Fixes

* position is above by default ([45de8ac](https://github.com/goblindegook/littlefoot/commit/45de8ace9de664842541fc56675aa315e7e1e235))

## [4.0.0-3](https://github.com/goblindegook/littlefoot/compare/v4.0.0-2...v4.0.0-3) (2020-11-24)

## [4.0.0-2](https://github.com/goblindegook/littlefoot/compare/v4.0.0-1...v4.0.0-2) (2020-11-22)


### Bug Fixes

* popover margin ([e246f20](https://github.com/goblindegook/littlefoot/commit/e246f20eb659e53bf578030ab6e26e011414fab6))

## [4.0.0-1](https://github.com/goblindegook/littlefoot/compare/v4.0.0-0...v4.0.0-1) (2020-11-22)


### Bug Fixes

* remove aria-expanded from default button template ([a2edfa6](https://github.com/goblindegook/littlefoot/commit/a2edfa674202ea155fe004d937ac06b2c66a3536))
* scope custom properties instead of polluting :root ([88392a3](https://github.com/goblindegook/littlefoot/commit/88392a35676993e9b2ba43afd9657cbd79a44eeb))

## [4.0.0-0](https://github.com/goblindegook/littlefoot/compare/v3.4.1...v4.0.0-0) (2020-10-30)

### ⚠ BREAKING CHANGES

The new version overhauls the style definitions of littlefoot elements. This is
a breaking change because users will experience visual changes.

Additionally, changes may affect users who have customised their button or
popover templates, those who have custom styles applied to footnote elements, or
those targetting elements using custom logic.

### Features

- Theming support through [CSS custom properties](README.md#theming).
- Overhauled default theme.

### Bug Fixes

- More robust selector escaping (uses CSS.escape in supporting browsers).
- Restore popover fade effect ([1dcbdcd](https://github.com/goblindegook/littlefoot/commit/1dcbdcde0da0d778fc4570d4773aadefbc610517)).

### [3.4.1](https://github.com/goblindegook/littlefoot/compare/v3.4.0...v3.4.1) (2020-09-24)

### Bug Fixes

- clears the is-active class on dismiss (fixes [#505](https://github.com/goblindegook/littlefoot/issues/505)) ([4479cc3](https://github.com/goblindegook/littlefoot/commit/4479cc3fac6dfc382796d336678a31eeffacdfc3))

## [3.4.0](https://github.com/goblindegook/littlefoot/compare/v3.3.2...v3.4.0) (2020-08-04)

### Features

- popover dismiss callback (props [@biou](https://github.com/biou), closes [#420](https://github.com/goblindegook/littlefoot/issues/420)) ([2865bd0](https://github.com/goblindegook/littlefoot/commit/2865bd0c2186e5b4b1f2ffb14dda9e8c385d65ca))

### [3.3.2](https://github.com/goblindegook/littlefoot/compare/v3.3.1...v3.3.2) (2020-07-23)

### Bug Fixes

- **a11y:** improve button labeling ([#418](https://github.com/goblindegook/littlefoot/issues/418)) ([3f0bf04](https://github.com/goblindegook/littlefoot/commit/3f0bf04a5995e04d629920b9e2a8369e5fdfdec2))

### [3.3.1](https://github.com/goblindegook/littlefoot/compare/v3.3.0...v3.3.1) (2020-06-24)

### Bug Fixes

- **a11y:** allow tabbing to content when it overflows popover ([0ecde14](https://github.com/goblindegook/littlefoot/commit/0ecde148758d013d01d9e2ac415285a57574fa64))

## [3.3.0](https://github.com/goblindegook/littlefoot/compare/v3.2.5...v3.3.0) (2020-06-23)

### Bug Fixes

- accessibility issues ([#376](https://github.com/goblindegook/littlefoot/issues/376)) ([6d1841c](https://github.com/goblindegook/littlefoot/commit/6d1841c0c107fe4b3809f37f20ead4d367a90d99))

### [3.2.5](https://github.com/goblindegook/littlefoot/compare/v3.2.4...v3.2.5) (2020-05-20)

### Bug Fixes

- fixes empty paragraph injection in footnote content ([98fa7df](https://github.com/goblindegook/littlefoot/commit/98fa7dfcbc7a59bae3b77a060c91b273889ceecb)), closes [#187](https://github.com/goblindegook/littlefoot/issues/187)

### [3.2.4](https://github.com/goblindegook/littlefoot/compare/v3.2.3...v3.2.4) (2020-03-26)

### Bug Fixes

- remove body scroll locking over content shifting issues ([0ce0369](https://github.com/goblindegook/littlefoot/commit/0ce0369194285265a42051ff1fc6d5d072a8fa6b))

### [3.2.3](https://github.com/goblindegook/littlefoot/compare/v3.2.2...v3.2.3) (2020-02-13)

### Bug Fixes

- **styles:** adjust content bottom padding ([93d349c](https://github.com/goblindegook/littlefoot/commit/93d349c37dc0a819e0c1fb61fe7dfbcb8e193de1))

### [3.2.2](https://github.com/goblindegook/littlefoot/compare/v3.2.1...v3.2.2) (2020-02-13)

### Bug Fixes

- **styles:** popover content padding tweaks ([7f99b66](https://github.com/goblindegook/littlefoot/commit/7f99b66b88597fd7de0557cd80949606e8eb1705))
- better locking of body scroll ([d9b609c](https://github.com/goblindegook/littlefoot/commit/d9b609cd5168848e840b20acee7b98bc16def229))
- prevent page scroll when scrolling footnote content ([3192512](https://github.com/goblindegook/littlefoot/commit/3192512b8d2eea53fb00ba707a21ea33b56975d1))
- remove deprecated mousewheel event ([4b17eb6](https://github.com/goblindegook/littlefoot/commit/4b17eb6cc325cba8486c008cccfec3da13bbc3b6))

### [3.2.1](https://github.com/goblindegook/littlefoot/compare/v3.2.0...v3.2.1) (2019-12-03)

### Bug Fixes

- only dismiss unhovered footnotes ([#45](https://github.com/goblindegook/littlefoot/issues/45)) ([73c83a2](https://github.com/goblindegook/littlefoot/commit/73c83a2ff49c0089f8a6359326f2dc8c4a29159d))

## [3.2.0](https://github.com/goblindegook/littlefoot/compare/v3.1.7...v3.2.0) (2019-11-21)

### Features

- allow passing a timeout to activate() ([13563e0](https://github.com/goblindegook/littlefoot/commit/13563e0dc554123bfb6e01cb32ba2ca6a7331cad))

### Bug Fixes

- dismissing popovers on activation ([#31](https://github.com/goblindegook/littlefoot/issues/31)) ([9d73d37](https://github.com/goblindegook/littlefoot/commit/9d73d37ec218474a67446f43fce0c7c856a39a44))

### [3.1.7](https://github.com/goblindegook/littlefoot/compare/v3.1.6...v3.1.7) (2019-11-19)

### Bug Fixes

- delay and callback settings can be changed after init ([#30](https://github.com/goblindegook/littlefoot/issues/30)) ([b157923](https://github.com/goblindegook/littlefoot/commit/b1579232eae92d854c56b2f73d26d678f1e5840a))

### [3.1.6](https://github.com/goblindegook/littlefoot/compare/v3.1.5...v3.1.6) (2019-11-10)

### Bug Fixes

- correctly reset numbers on numberResetSelector [#29](https://github.com/goblindegook/littlefoot/issues/29) ([13d02b4](https://github.com/goblindegook/littlefoot/commit/13d02b4c562fea09f46737ad6f464fd400f930a1))

### [3.1.5](https://github.com/goblindegook/littlefoot/compare/v3.1.4...v3.1.5) (2019-10-07)

### [3.1.4](https://github.com/goblindegook/littlefoot/compare/v3.1.3...v3.1.4) (2019-10-07)

### [3.1.3](https://github.com/goblindegook/littlefoot/compare/v3.1.2...v3.1.3) (2019-09-02)

### Bug Fixes

- use initial font-style in footnote content ([c843357](https://github.com/goblindegook/littlefoot/commit/c843357))

### [3.1.2](https://github.com/goblindegook/littlefoot/compare/v3.1.1...v3.1.2) (2019-08-17)

### Bug Fixes

- improved backlink reference detection ([21941d1](https://github.com/goblindegook/littlefoot/commit/21941d1)), closes [#25](https://github.com/goblindegook/littlefoot/issues/25)

### [3.1.1](https://github.com/goblindegook/littlefoot/compare/v3.1.0...v3.1.1) (2019-08-17)

### Bug Fixes

- footnote reference wrapping elements not properly cleared ([1715727](https://github.com/goblindegook/littlefoot/commit/1715727)), closes [#25](https://github.com/goblindegook/littlefoot/issues/25)

## [3.1.0](https://github.com/goblindegook/littlefoot/compare/v3.0.0...v3.1.0) (2019-08-17)

### Bug Fixes

- preserves empty tags and [] in footnote body ([90bee24](https://github.com/goblindegook/littlefoot/commit/90bee24)), closes [#25](https://github.com/goblindegook/littlefoot/issues/25)

### Features

- strips backlink and its enclosing tags from the footnote body ([4ff80af](https://github.com/goblindegook/littlefoot/commit/4ff80af)), closes [#25](https://github.com/goblindegook/littlefoot/issues/25)

## [3.0.0](https://github.com/goblindegook/littlefoot/compare/v2.0.3...v3.0.0) (2019-08-14)

### ⚠ BREAKING CHANGES

- This change removes a partial check for existing footnote-like elements in the
  document, which adjusted the ID of new footnotes to prevent collisions (an unlikely scenario).

### Bug Fixes

- footnote detection whose links contain a URL before the fragment ([2e24293](https://github.com/goblindegook/littlefoot/commit/2e24293)), closes [#24](https://github.com/goblindegook/littlefoot/issues/24)

- change internal footnote model, create popovers on setup ([728e485](https://github.com/goblindegook/littlefoot/commit/728e485))

## [2.0.3](https://github.com/goblindegook/littlefoot/compare/v2.0.2...v2.0.3) (2019-07-15)

### Changed

- Fixes an issue with the popover's bottom padding on Firefox ([#21](https://github.com/goblindegook/littlefoot/issues/21)).

## [2.0.2](https://github.com/goblindegook/littlefoot/compare/v2.0.0...v2.0.2) (2019-06-27)

### Changed

- Fixed regression with pressing the Escape key to dismiss footnotes.

## [2.0.0](https://github.com/goblindegook/littlefoot/compare/v1.0.9...v2.0.0) (2019-06-10)

littlefoot has been rewritten in [TypeScript](https://www.typescriptlang.org), which enabled a cleaner architecture and slight reduction in bundle size. Browser compatibility is not as extensive as with 1.0.x, and I will no longer support older versions of Internet Explorer.

Testing framework was replaced with [Jest](http://jestjs.io) and [Cypress](http://cypress.io), and tests were adapted for simplicity.

This version introduces a number of breaking changes to advanced features. If you've been using littlefoot without relying on custom templates or its `.activate()` and `.dismiss()` methods, and don't need to provide support for older browsers, it should be safe to upgrade.

### Added

- New `.unmount()` method to completely remove littlefoot footnotes from the document and return it to its original structure.

### Changed

- **Breaking change**: `.activate()` and `.dismiss()` methods now receive the footnote identifier instead of a selector. The identifier is the sequential ordering of all footnotes in the document, starting from 1.
- Default `contentTemplate` and `buttonTemplate` templates include fewer attributes and improperly-defined custom templates are now less likely to break functionality.
- Improved pixel size calculations to determine popover height.
- Improved handling of popover hover state when dismissing.
- Resolved an issue with the `anchorParentSelector` element not being hidden ([#17](https://github.com/goblindegook/littlefoot/issues/17)).
- Resolved an issue with inherited font weights and sizes when a footnote was included inside header or `<strong>` tags ([#18](https://github.com/goblindegook/littlefoot/issues/18)).
- Reduced dependency on DOM element properties for critical functionality.

### Removed

- **Breaking change**: The `.activate()` method no longer takes a custom class name to be added to the popover, as the feature is redundant. You can manipulate both the button and the popover upon activation via the `activateCallback` setting.
- **Breaking change**: The `footnote-processed` class is no longer applied to processed footnotes. Only the `footnote-print-only` is used now.
- **Breaking change**: The `is-hover` class is no longer applied to hovered footnotes.
- The purpose of the `footnoteParentClass` setting ported over from Bigfoot wasn't clear, and it did not appear to change behaviour, so it was removed.

## Differences from Bigfoot.js

In forking the Bigfoot.js project and adapting it for simplicity, I have embraced a [_Decisions, not options_](https://nacin.com/2011/12/18/in-open-source-learn-to-decide/) philosophy. As such, some features provided by Bigfoot.js have been replaced with simpler alternatives, a sensible set of defaults, and in some cases removed altogether.

Users planning to migrate from Bigfoot should therefore be aware of the following changes.

### Settings

#### Changed settings

- `allowMultipleFN` was renamed to `allowMultiple`.
- `anchorParentTagname` was renamed to `anchorParentSelector`.
- `deleteOnUnhover` was renamed to `dismissOnUnhover`.
- `footnoteTagname` was renamed to `footnoteSelector`.
- `popoverCreateDelay` was renamed to `activateDelay`.
- `popoverDeleteDelay` was renamed to `dismissDelay`.
- `buttonMarkup` was replaced with `buttonTemplate`. Please refer to the documentation for a list of valid tokens.
- `contentMarkup` was replaced with `contentTemplate`. Please refer to the documentation for a list of valid tokens.
- `useFootnoteOnlyOnce` was replaced with `allowDuplicates`. The truth value should be flipped.

#### Removed settings

- `actionOriginalFN` was removed. All original footnotes are only hidden, leaving you free to select footnote DOM elements for removal if you need them gone from the document.
- `breakpoints` was removed. All size-aware display changes should be declared via CSS `@media` queries.
- `footnoteParentClass` was removed. After some tests, I couldn't determine its purpose or benefits.
- `maxWidthRelativeTo` was removed. It was undocumented and will not be missed.
- `preventPageScroll` was removed. Scrolling inside a scrollable footnote will not trigger a page scroll.
- `positionContent` was removed. Popover positioning is now always in effect.

### Methods

Methods on the returning object were overhauled, removing breakpoint logic.

#### Changed methods

- `activate()` will no longer return a list of activated popovers, it takes a footnote ID instead of a selector, and no longer allows setting a custom class on the popover element through it. Use `activateCallback` if you wish to manipulate the button or popover elements.
- `close()` was renamed `dismiss()`, it optionally takes a footnote ID instead of a selector, and will no longer return the list of deactivated buttons.

#### Removed methods

- `addBreakpoint()` and `removeBreakpoint()` were removed, set breakpoint-dependent styles using CSS.
- The `createPopover()` alias was removed, use `activate()`.
- The `removePopovers()` alias was removed, use `dismiss()`.
- `reposition()` and `repositionFeet()` were removed.

### Presentation

All style variants have been folded into a single stylesheet. The footnote popover is now automatically fixed to the bottom of the viewport on smaller screens, and you may alter this behaviour by overriding the CSS.

Breakpoint methods were dropped in favour of a CSS-based approach. Override the stylesheets to customize screen width limits.

The markup for the footnote button ellipsis changed from three `<svg>` elements with a `<circle>` each to a single `<svg>` element containing all three `<circle>`s.
