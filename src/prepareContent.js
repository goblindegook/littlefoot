/**
 * Removes any links from the footnote back to the footnote link as these don't
 * make sense when the footnote is shown inline.
 *
 * @param  {String} content      The HTML string of the new footnote.
 * @param  {String} backlinkId   The ID of the footnote link (that is to be
 *                               removed from the footnote HTML).
 * @return {String}              The new HTML string with the relevant links
 *                               taken out.
 */
export default function prepareContent(content, backlinkId) {
  const pattern = backlinkId.trim().replace(/\s+/g, '|')
  const regex   = new RegExp('(\\s|&nbsp;)*<\\s*a[^#<]*#(' + pattern + ')[^>]*>(.*?)<\\s*/\\s*a>', 'g')

  let preparedContent = content.trim().replace(regex, '').replace('[]', '')

  if (preparedContent.indexOf('<') !== 0) {
    preparedContent = '<p>' + preparedContent + '</p>'
  }

  return preparedContent
}
