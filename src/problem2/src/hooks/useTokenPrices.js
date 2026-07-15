import { useEffect, useState } from 'react'
import {
  fetchTokenPrices,
  getCachedTokens,
  subscribeTokenPrices,
} from '../services/tokenPrices'

// Loads token prices from the service (which caches and de-dupes, so no Context needed).
export function useTokenPrices() {
  const [tokens, setTokens] = useState(() => getCachedTokens() ?? [])
  const [loading, setLoading] = useState(() => !getCachedTokens())
  const [error, setError] = useState(null)

  useEffect(() => {
    const sync = () => {
      const cached = getCachedTokens()
      if (cached) {
        setTokens(cached)
        setLoading(false)
      }
    }

    const unsub = subscribeTokenPrices(sync)
    if (getCachedTokens()) return unsub

    let cancelled = false
    fetchTokenPrices()
      .then((data) => {
        if (!cancelled) {
          setTokens(data)
          setError(null)
        }
      })
      .catch((err) => {
        if (!cancelled) setError(err.message)
      })
      .finally(() => {
        if (!cancelled) setLoading(false)
      })

    return () => {
      cancelled = true
      unsub()
    }
  }, [])

  return { tokens, loading, error }
}
