// Random demo balance per token, cached so it stays stable across re-renders.
const balances = {};

export function getRandomBalance(symbol, price) {
  if (!symbol || !price || price <= 0) return 0;
  if (balances[symbol] === undefined) {
    balances[symbol] = 80 + Math.random() * 4200; // USD value, picked once
  }
  return balances[symbol] / price;
}
