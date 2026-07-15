import { getTokenNetwork } from '../constants/networks'

const PRICES_URL = 'https://interview.switcheo.com/prices.json'

let cachedTokens = null
let inflightPromise = null
const listeners = new Set()

function parseTokens(priceData) {
  const map = new Map()

  for (const item of priceData) {
    const existing = map.get(item.currency)
    if (!existing || new Date(item.date) > new Date(existing.date)) {
      map.set(item.currency, {
        symbol: item.currency,
        price: item.price,
        date: item.date,
        network: getTokenNetwork(item.currency),
      })
    }
  }

  return Array.from(map.values()).sort((a, b) =>
    a.symbol.localeCompare(b.symbol),
  )
}

function notify() {
  listeners.forEach((fn) => fn())
}

export function getCachedTokens() {
  return cachedTokens
}

export function subscribeTokenPrices(listener) {
  listeners.add(listener)
  return () => listeners.delete(listener)
}

export function fetchTokenPrices() {
  if (cachedTokens) {
    return Promise.resolve(cachedTokens)
  }

  if (inflightPromise) {
    return inflightPromise
  }

  inflightPromise = fetch(PRICES_URL)
    .then((res) => {
      if (!res.ok) throw new Error(`Failed to fetch prices (${res.status})`)
      return res.json()
    })
    .then((data) => {
      cachedTokens = parseTokens(data)
      inflightPromise = null
      notify()
      return cachedTokens
    })
    .catch((err) => {
      inflightPromise = null
      throw err
    })

  return inflightPromise
}
