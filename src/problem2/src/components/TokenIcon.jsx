import { useState } from "react";

// Real logos from Switcheo's icon set (via jsDelivr); fall back to a letter avatar.
const ICON_BASE =
  "https://cdn.jsdelivr.net/gh/Switcheo/token-icons@main/tokens";

export default function TokenIcon({ symbol, size = 32 }) {
  // Remember the failed src so a token change still retries the new logo.
  const [failedSrc, setFailedSrc] = useState(null);
  const src = symbol ? `${ICON_BASE}/${symbol}.svg` : null;

  if (src && failedSrc !== src) {
    return (
      <img
        src={src}
        width={size}
        height={size}
        className="token-svg-icon"
        alt={symbol}
        loading="lazy"
        onError={() => setFailedSrc(src)}
        style={{ borderRadius: "50%", display: "block" }}
      />
    );
  }

  const label = symbol ? symbol[0].toUpperCase() : "-";

  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 32 32"
      className="token-svg-icon"
      aria-hidden="true"
    >
      <circle cx="16" cy="16" r="16" fill="#2563eb" />
      <text
        x="16"
        y="16"
        textAnchor="middle"
        dominantBaseline="central"
        fill="#fff"
        fontSize={size * 0.45}
        fontWeight="700"
        fontFamily="system-ui, sans-serif"
      >
        {label}
      </text>
    </svg>
  );
}
