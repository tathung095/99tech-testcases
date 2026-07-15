import TokenIcon from "../components/TokenIcon";
import NetworkTabs from "../components/NetworkTabs";
import SwapHistoryPanel from "../components/SwapHistoryPanel";
import TokenSelectModal from "../components/TokenSelectModal";
import { useSwap } from "../hooks/useSwap";
import { formatAmountDisplay } from "../utils/formatAmount";
import "./Problem2.scss";

const SLIPPAGE_OPTIONS = [0.1, 0.5, 1];

function formatUsd(amount, price) {
  return `≈ $${(amount * price).toFixed(2)}`;
}

function TokenPickerButton({ token, onClick }) {
  return (
    <button type="button" className="token-picker-compact" onClick={onClick}>
      {token ? (
        <>
          <TokenIcon symbol={token.symbol} size={28} />
          <span className="token-picker-compact-symbol">{token.symbol}</span>
        </>
      ) : (
        <span className="token-picker-compact-placeholder">Select</span>
      )}
      <svg width="10" height="10" viewBox="0 0 12 12" fill="none" aria-hidden="true">
        <path d="M3 4.5L6 7.5L9 4.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
      </svg>
    </button>
  );
}

export default function Problem2() {
  const { quote, actions, ...s } = useSwap();

  if (s.loading) {
    return (
      <div className="swap-page">
        <div className="swap-panel swap-status">
          <div className="swap-loader" />
          Loading token prices…
        </div>
      </div>
    );
  }

  if (s.error) {
    return (
      <div className="swap-page">
        <div className="swap-panel swap-status swap-error">
          Failed to load prices: {s.error}
        </div>
      </div>
    );
  }

  const hasAmount = quote.parsedFrom > 0;

  return (
    <div className="swap-page">
      <div className="swap-layout">
        <div className="swap-panel">
          <div className="swap-panel-header">
            <h2 className="swap-panel-title">Swap</h2>
            <button
              type="button"
              className={`wallet-chip ${s.connected ? "connected" : ""}`}
              onClick={actions.toggleWallet}
              disabled={s.submitting}
              title={s.connected ? "Disconnect wallet" : "Connect wallet"}
            >
              <span className="wallet-dot" />
              {s.connected ? "Wallet connected" : "Connect wallet"}
            </button>
          </div>

          <span className="swap-field-label">Network</span>
          <NetworkTabs value={s.network} onChange={s.setNetwork} />

          <div className="swap-io">
            <div className={`swap-box ${quote.insufficientBalance ? "insufficient" : ""}`}>
              <div className="swap-box-header">
                <span className="swap-box-label">You pay</span>
                {s.connected && s.from && (
                  <span className={`swap-box-balance ${quote.insufficientBalance ? "insufficient" : ""}`}>
                    Balance {formatAmountDisplay(quote.fromBalance)} {s.from.symbol}
                    <button
                      type="button"
                      className="max-btn"
                      onClick={actions.fillMax}
                      disabled={s.submitting}
                    >
                      Max
                    </button>
                  </span>
                )}
              </div>
              <div className="swap-box-body">
                <div
                  className={`swap-box-amount ${!s.connected ? "locked" : ""}`}
                  onClick={() => {
                    if (!s.connected) actions.requireWallet();
                  }}
                >
                  <input
                    className="amount-input"
                    type="text"
                    inputMode="decimal"
                    placeholder={s.connected ? "0" : "Connect wallet"}
                    value={s.fromAmount}
                    onChange={(e) => actions.changeAmount(e.target.value)}
                    disabled={!s.connected || !s.from || s.submitting}
                    readOnly={!s.connected}
                    title={!s.connected ? "Connect wallet to enter an amount" : undefined}
                  />
                  <span className="usd-value">
                    {s.from ? formatUsd(quote.parsedFrom, s.from.price) : "≈ $0"}
                  </span>
                </div>
                <TokenPickerButton token={s.from} onClick={() => s.setPicker("from")} />
              </div>
            </div>

            <div className="swap-flip">
              <button
                type="button"
                className="flip-btn"
                onClick={actions.flipTokens}
                title="Flip tokens"
                disabled={s.submitting}
              >
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                  <path d="M4 6L8 2L12 6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                  <path d="M12 10L8 14L4 10" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                </svg>
              </button>
            </div>

            <div className="swap-box">
              <div className="swap-box-header">
                <span className="swap-box-label">You receive</span>
                {s.connected && s.to && (
                  <span className="swap-box-balance">
                    Balance {formatAmountDisplay(quote.toBalance)} {s.to.symbol}
                  </span>
                )}
              </div>
              <div className="swap-box-body">
                <div className="swap-box-amount">
                  <input
                    className="amount-input"
                    type="text"
                    readOnly
                    placeholder="0"
                    value={quote.toAmount > 0 ? formatAmountDisplay(quote.toAmount) : ""}
                  />
                  <span className="usd-value">
                    {s.to ? formatUsd(quote.toAmount, s.to.price) : "≈ $0"}
                  </span>
                </div>
                <TokenPickerButton token={s.to} onClick={() => s.setPicker("to")} />
              </div>
            </div>
          </div>

          <div className="swap-meta">
            {s.from && s.to && (
              <div className="meta-row">
                <span className="meta-label">Rate</span>
                <span className="meta-value">
                  1 {s.from.symbol} = {formatAmountDisplay(quote.rate, 2)} {s.to.symbol}
                </span>
              </div>
            )}

            <div className="meta-row meta-row-slippage">
              <span className="meta-label">Slippage</span>
              <div className="slippage-pills">
                {SLIPPAGE_OPTIONS.map((opt) => (
                  <button
                    key={opt}
                    type="button"
                    className={`slippage-pill ${s.slippage === opt ? "active" : ""}`}
                    onClick={() => s.setSlippage(opt)}
                  >
                    {opt}%
                  </button>
                ))}
              </div>
            </div>

            <div className="meta-row">
              <span className="meta-label">Est. network fee</span>
              <span className="meta-value">
                {hasAmount && s.from ? `≈ $${quote.estNetworkFee.toFixed(2)}` : "—"}
              </span>
            </div>
            <div className="meta-row">
              <span className="meta-label">Min. received</span>
              <span className="meta-value">
                {hasAmount && s.from && s.to
                  ? `${formatAmountDisplay(quote.minReceived)} ${s.to.symbol}`
                  : "—"}
              </span>
            </div>
          </div>

          <button
            className={`swap-submit-btn ${quote.canSwap ? "ready" : ""} ${s.submitting ? "loading" : ""}`}
            type="button"
            onClick={() => (s.connected ? actions.swap() : actions.toggleWallet())}
            disabled={quote.buttonDisabled}
          >
            {s.submitting && <span className="btn-spinner" aria-hidden="true" />}
            {quote.buttonLabel}
          </button>
        </div>

        <SwapHistoryPanel history={s.history} onClear={actions.clearHistory} />
      </div>

      <TokenSelectModal
        open={s.picker !== null}
        onClose={() => s.setPicker(null)}
        tokens={s.tokens}
        network={s.network}
        selectedSymbol={s.picker === "from" ? s.from?.symbol : s.to?.symbol}
        excludeSymbol={s.picker === "from" ? s.to?.symbol : s.from?.symbol}
        onSelect={actions.selectToken}
        title={s.picker === "from" ? "You pay" : "You receive"}
        showBalance={s.connected}
      />
    </div>
  );
}
