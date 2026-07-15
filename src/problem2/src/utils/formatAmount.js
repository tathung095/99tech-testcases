export function parseAmount(value) {
  if (!value || value === '.') return 0
  const cleaned = String(value).replace(/,/g, '')
  const num = parseFloat(cleaned)
  return Number.isNaN(num) ? 0 : num
}

export function formatAmountDisplay(value, maxDecimals = 6) {
  const num = typeof value === 'string' ? parseAmount(value) : value
  if (!num) return ''

  // Round to maxDecimals and drop trailing zeros.
  return String(Number(num.toFixed(maxDecimals)))
}

export function formatAmountInput(raw) {
  // Keep only digits and a single decimal point; reject anything else.
  return /^\d*\.?\d*$/.test(raw) ? raw : null
}
