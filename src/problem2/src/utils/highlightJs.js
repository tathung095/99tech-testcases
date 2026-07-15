const KEYWORDS = new Set([
  'interface', 'type', 'const', 'let', 'var', 'function', 'return', 'if', 'else',
  'switch', 'case', 'default', 'break', 'true', 'false', 'null', 'undefined',
  'extends', 'from', 'import', 'export', 'new', 'typeof', 'keyof', 'as', 'of',
  'in', 'void', 'any', 'number', 'string', 'boolean', 'Record',
])

const TOKEN_RE =
  /(\/\/[^\n]*|\/\*[\s\S]*?\*\/)|('(?:\\.|[^'\\])*'|"(?:\\.|[^"\\])*"|`(?:\\.|[^`\\])*`)|(\b\d+(?:\.\d+)?\b)|(\b[A-Za-z_$][\w$]*\b)|([{}()[\]<>:;,.=+\-*/!?|&%^~@]+)|(\s+)/g

function escapeHtml(text) {
  return text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
}

function classifyIdentifier(word, prevNonSpace) {
  if (KEYWORDS.has(word)) return 'keyword'
  if (prevNonSpace === 'interface' || prevNonSpace === 'type' || prevNonSpace === ':') {
    return 'type'
  }
  if (/^[A-Z]/.test(word)) return 'type'
  return 'ident'
}

/**
 * Highlight JS/TS source into HTML with span class tokens.
 * Classes: comment, string, number, keyword, type, ident, punct
 */
export function highlightJs(source) {
  let html = ''
  let prevNonSpace = ''
  let match

  TOKEN_RE.lastIndex = 0
  while ((match = TOKEN_RE.exec(source)) !== null) {
    const [full, comment, string, number, ident, punct, space] = match
    const text = escapeHtml(full)

    if (comment) {
      html += `<span class="tok-comment">${text}</span>`
    } else if (string) {
      html += `<span class="tok-string">${text}</span>`
    } else if (number) {
      html += `<span class="tok-number">${text}</span>`
    } else if (ident) {
      const cls = classifyIdentifier(full, prevNonSpace)
      html += `<span class="tok-${cls}">${text}</span>`
      prevNonSpace = full
    } else if (punct) {
      html += `<span class="tok-punct">${text}</span>`
      prevNonSpace = full.trim() || prevNonSpace
    } else if (space) {
      html += text
    } else {
      html += text
    }
  }

  return html
}
