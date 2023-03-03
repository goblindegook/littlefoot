function cssEscapePolyfill(ident: string): string {
  const length = ident.length
  let index = -1
  let result = ''
  while (++index < length) {
    const charCode = ident.charCodeAt(index)
    const isDigit = charCode >= 0x0030 && charCode <= 0x0039

    if (charCode === 0x0000) {
      result += '\uFFFD'
    } else if (
      (charCode >= 0x0001 && charCode <= 0x001f) ||
      charCode === 0x007f ||
      (index === 0 && isDigit) ||
      (index === 1 && isDigit && ident.charCodeAt(0) === 0x002d)
    ) {
      result += '\\' + charCode.toString(16) + ' '
    } else if (index === 0 && length === 1 && charCode === 0x002d) {
      result += '\\' + ident.charAt(index)
    } else if (
      charCode >= 0x0080 ||
      charCode === 0x002d ||
      charCode === 0x005f ||
      isDigit ||
      (charCode >= 0x0041 && charCode <= 0x005a) ||
      (charCode >= 0x0061 && charCode <= 0x007a)
    ) {
      result += ident.charAt(index)
    } else {
      result += '\\' + ident.charAt(index)
    }
  }
  return result
}

export const cssEscape = CSS?.escape ?? cssEscapePolyfill
