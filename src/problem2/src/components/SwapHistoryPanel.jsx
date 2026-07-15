import TokenIcon from "./TokenIcon";
import { formatAmountDisplay } from "../utils/formatAmount";
import "./SwapHistoryPanel.scss";

function formatTime(date) {
  return date.toLocaleString();
}

export default function SwapHistoryPanel({ history, onClear }) {
  return (
    <aside className="history-panel">
      <div className="history-panel-head">
        <h3 className="history-panel-title">Recent Activity</h3>
        {history.length > 0 && (
          <button
            type="button"
            className="history-clear-btn"
            onClick={onClear}
            title="Clear history"
            aria-label="Clear history"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden="true">
              <path d="M4 7h16" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
              <path d="M10 11v6M14 11v6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
              <path
                d="M6 7l1 12a2 2 0 0 0 2 2h6a2 2 0 0 0 2-2l1-12M9 7V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v3"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </button>
        )}
      </div>

      {history.length === 0 ? (
        <div className="history-empty-state">
          <img
            className="history-empty-img"
            src="/empty-history.svg"
            alt=""
            aria-hidden="true"
          />
          <p className="history-empty-title">No transactions yet</p>
          <p className="history-empty-desc">
            Your swap history will appear here after you complete your first
            trade.
          </p>
        </div>
      ) : (
        <ul className="history-panel-list">
          {history.map((item) => (
            <li key={item.id} className="history-panel-item">
              <div className="history-panel-row">
                <TokenIcon symbol={item.from} size={22} />
                <span className="history-panel-arrow">→</span>
                <TokenIcon symbol={item.to} size={22} />
              </div>
              <div className="history-panel-amounts">
                <span>
                  {formatAmountDisplay(item.fromAmount)} {item.from}
                </span>
                <span className="history-panel-muted">→</span>
                <span>
                  {formatAmountDisplay(item.toAmount)} {item.to}
                </span>
              </div>
              <div className="history-panel-meta">
                <span>{item.network}</span>
                <span>{formatTime(new Date(item.timestamp))}</span>
              </div>
            </li>
          ))}
        </ul>
      )}
    </aside>
  );
}
