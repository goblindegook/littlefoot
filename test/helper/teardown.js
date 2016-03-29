/**
 * Tear down fixtures.
 */
function teardown() {
  while (document.body.firstChild) {
    document.body.removeChild(document.body.firstChild)
  }
}

export default teardown
