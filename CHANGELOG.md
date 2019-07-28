# Changelog

The project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html). Starting with version 2.0.0, notable changes to this project will be documented in this file.

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
