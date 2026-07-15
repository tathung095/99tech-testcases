export const NETWORKS = [
  {
    id: 'ethereum',
    name: 'Ethereum',
    shortName: 'ETH',
    color: '#627eea',
    icon: '◆',
    description: 'ERC-20 tokens',
  },
  {
    id: 'tron',
    name: 'Tron',
    shortName: 'TRON',
    color: '#eb0029',
    icon: 'T',
    description: 'TRC-20 tokens',
  },
  {
    id: 'bnb',
    name: 'BNB Chain',
    shortName: 'BSC',
    color: '#f0b90b',
    icon: '◈',
    description: 'BEP-20 tokens',
  },
]

const TOKEN_NETWORK_MAP = {
  ETH: 'ethereum',
  WBTC: 'ethereum',
  wstETH: 'ethereum',
  BLUR: 'ethereum',
  GMX: 'ethereum',
  ATOM: 'ethereum',
  OSMO: 'ethereum',
  LUNA: 'ethereum',
  EVMOS: 'ethereum',
  STRD: 'ethereum',
  IRIS: 'ethereum',
  STATOM: 'ethereum',
  STEVMOS: 'ethereum',
  STOSMO: 'ethereum',
  STLUNA: 'ethereum',
  ampLUNA: 'ethereum',
  RATOM: 'ethereum',
  KUJI: 'ethereum',
  IBCX: 'ethereum',
  LSI: 'ethereum',
  ZIL: 'ethereum',
  bNEO: 'ethereum',
  OKB: 'ethereum',
  OKT: 'ethereum',
  BUSD: 'bnb',
  USD: 'tron',
  USDC: 'tron',
  USC: 'tron',
  YieldUSD: 'tron',
  axlUSDC: 'tron',
  SWTH: 'tron',
  rSWTH: 'tron',
}

export function getTokenNetwork(symbol) {
  return TOKEN_NETWORK_MAP[symbol] || 'ethereum'
}

export function getNetworkById(id) {
  return NETWORKS.find((n) => n.id === id) ?? NETWORKS[0]
}
