import { NETWORKS } from '../constants/networks'
import './NetworkTabs.scss'

export default function NetworkTabs({ value, onChange }) {
  return (
    <div className="network-pills" role="tablist" aria-label="Networks">
      {NETWORKS.map((network) => {
        const active = value === network.id

        return (
          <button
            key={network.id}
            type="button"
            role="tab"
            aria-selected={active}
            className={`network-pill ${active ? 'active' : ''}`}
            onClick={() => onChange(network.id)}
          >
            <span
              className="network-pill-icon"
              style={{ background: network.color }}
            >
              {network.icon}
            </span>
            <span className="network-pill-name">{network.name}</span>
          </button>
        )
      })}
    </div>
  )
}
