import { useEffect, useMemo, useRef, useState } from 'react'
import { getNetworkById } from '../constants/networks'
import { formatAmountDisplay } from '../utils/formatAmount'
import { getRandomBalance } from '../utils/randomBalance'
import TokenIcon from './TokenIcon'
import './TokenSelectModal.scss'

const POPULAR_BY_NETWORK = {
  ethereum: ['ETH', 'WBTC', 'wstETH', 'GMX', 'BLUR', 'ATOM'],
  tron: ['USDC', 'USD', 'USC', 'YieldUSD', 'SWTH', 'axlUSDC'],
  bnb: ['BUSD'],
}

function formatPrice(price) {
  return price >= 1 ? price.toFixed(2) : price.toFixed(4)
}

export default function TokenSelectModal({
  open,
  onClose,
  tokens,
  network,
  selectedSymbol,
  excludeSymbol,
  onSelect,
  title,
  showBalance = false,
}) {
  const [search, setSearch] = useState('')
  const searchRef = useRef(null)

  const networkTokens = useMemo(
    () => tokens.filter((t) => t.network === network),
    [tokens, network],
  )

  const popularTokens = useMemo(() => {
    const popular = POPULAR_BY_NETWORK[network] ?? []
    return popular
      .map((symbol) => networkTokens.find((t) => t.symbol === symbol))
      .filter(Boolean)
      .filter((t) => t.symbol !== excludeSymbol)
  }, [network, networkTokens, excludeSymbol])

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase()
    return networkTokens
      .filter((t) => t.symbol !== excludeSymbol)
      .filter((t) => !q || t.symbol.toLowerCase().includes(q))
  }, [networkTokens, excludeSymbol, search])

  const networkInfo = getNetworkById(network)
  const showPopular = !search.trim() && popularTokens.length > 0

  useEffect(() => {
    if (!open) return
    setSearch('')
    const timer = setTimeout(() => searchRef.current?.focus(), 50)
    return () => clearTimeout(timer)
  }, [open])

  useEffect(() => {
    if (!open) return
    function onKey(e) {
      if (e.key === 'Escape') onClose()
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [open, onClose])

  if (!open) return null

  function handleSelect(symbol) {
    onSelect(symbol)
    setSearch('')
    onClose()
  }

  function handleBackdrop(e) {
    if (e.target === e.currentTarget) onClose()
  }

  return (
    <div className="token-modal-backdrop" onClick={handleBackdrop}>
      <div className="token-modal" role="dialog" aria-modal="true" aria-label={title}>
        <div className="token-modal-header">
          <div>
            <h3>{title}</h3>
            <span
              className="token-modal-network"
              style={{ borderColor: networkInfo.color, color: networkInfo.color }}
            >
              {networkInfo.name}
            </span>
          </div>
          <button className="token-modal-close" onClick={onClose} aria-label="Close" type="button">
            <svg width="15" height="15" viewBox="0 0 16 16" fill="none" aria-hidden="true">
              <path
                d="M4 4L12 12M12 4L4 12"
                stroke="currentColor"
                strokeWidth="1.75"
                strokeLinecap="round"
              />
            </svg>
          </button>
        </div>

        <div className="token-modal-search-wrap">
          <svg className="token-modal-search-icon" width="16" height="16" viewBox="0 0 16 16" fill="none">
            <circle cx="7" cy="7" r="5" stroke="currentColor" strokeWidth="1.5" />
            <path d="M11 11L14 14" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
          </svg>
          <input
            ref={searchRef}
            className="token-modal-search"
            type="text"
            placeholder="Search name or paste address"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          {search && (
            <button
              type="button"
              className="token-modal-search-clear"
              onClick={() => setSearch('')}
              aria-label="Clear search"
            >
              ×
            </button>
          )}
        </div>

        <div className="token-modal-body">
          {showPopular && (
            <section className="token-modal-section">
              <h4 className="token-modal-section-title">Popular tokens</h4>
              <div className="token-popular-grid">
                {popularTokens.map((token) => (
                  <button
                    key={token.symbol}
                    type="button"
                    className={`token-popular-chip ${selectedSymbol === token.symbol ? 'selected' : ''}`}
                    onClick={() => handleSelect(token.symbol)}
                  >
                    <TokenIcon symbol={token.symbol} size={28} />
                    <span>{token.symbol}</span>
                  </button>
                ))}
              </div>
            </section>
          )}

          <section className="token-modal-section token-modal-section-grow">
            <h4 className="token-modal-section-title">
              {search ? `Results (${filtered.length})` : 'All tokens'}
            </h4>
            <ul className="token-modal-list">
              {filtered.length === 0 ? (
                <li className="token-modal-empty">
                  <span className="token-modal-empty-icon">🔍</span>
                  No tokens found on {networkInfo.name}
                </li>
              ) : (
                filtered.map((token) => (
                  <li key={token.symbol}>
                    <button
                      type="button"
                      className={`token-modal-item ${selectedSymbol === token.symbol ? 'selected' : ''}`}
                      onClick={() => handleSelect(token.symbol)}
                    >
                      <TokenIcon symbol={token.symbol} size={40} />
                      <div className="token-modal-item-info">
                        <span className="token-modal-symbol">{token.symbol}</span>
                        <span className="token-modal-network-tag">{networkInfo.shortName}</span>
                      </div>
                      <div className="token-modal-item-price">
                        <span className="token-modal-price">${formatPrice(token.price)}</span>
                        {showBalance ? (
                          <span className="token-modal-balance">
                            {formatAmountDisplay(getRandomBalance(token.symbol, token.price))} {token.symbol}
                          </span>
                        ) : (
                          <span className="token-modal-price-label">USD</span>
                        )}
                      </div>
                      {selectedSymbol === token.symbol && (
                        <span className="token-modal-check">✓</span>
                      )}
                    </button>
                  </li>
                ))
              )}
            </ul>
          </section>
        </div>
      </div>
    </div>
  )
}
