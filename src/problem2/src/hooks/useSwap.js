import { useEffect, useState } from "react";
import { toast } from "sonner";
import { getNetworkById } from "../constants/networks";
import { useTokenPrices } from "./useTokenPrices";
import {
  formatAmountDisplay,
  formatAmountInput,
  parseAmount,
} from "../utils/formatAmount";
import { getRandomBalance } from "../utils/randomBalance";

const HISTORY_LIMIT = 5;
const DEFAULT_PAIRS = {
  ethereum: ["ETH", "WBTC"],
  tron: ["USDC", "USD"],
  bnb: ["BUSD"],
};

function loadHistory() {
  const saved = localStorage.getItem("swap-history");
  return saved ? JSON.parse(saved).slice(0, HISTORY_LIMIT) : [];
}

// All state and actions for the Swap screen.
export function useSwap() {
  const { tokens, loading, error } = useTokenPrices();
  const [network, setNetwork] = useState("ethereum");
  const [fromToken, setFromToken] = useState(null);
  const [toToken, setToToken] = useState(null);
  const [fromAmount, setFromAmount] = useState("");
  const [slippage, setSlippage] = useState(0.5);
  const [connected, setConnected] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [picker, setPicker] = useState(null);
  const [history, setHistory] = useState(loadHistory);

  // Pick default tokens when the network changes.
  useEffect(() => {
    const symbols = tokens
      .filter((t) => t.network === network)
      .map((t) => t.symbol);
    const ordered = [
      ...new Set([...(DEFAULT_PAIRS[network] ?? []), ...symbols]),
    ].filter((s) => symbols.includes(s));
    setFromToken(ordered[0] ?? null);
    setToToken(ordered[1] ?? null);
    setFromAmount("");
  }, [network, tokens.length]);

  const from = tokens.find((t) => t.symbol === fromToken) ?? null;
  const to = tokens.find((t) => t.symbol === toToken) ?? null;
  const parsedFrom = parseAmount(fromAmount);
  const toAmount =
    from && to && parsedFrom > 0 ? (parsedFrom * from.price) / to.price : 0;
  const minReceived = toAmount * (1 - slippage / 100);
  const networkInfo = getNetworkById(network);
  const estNetworkFee =
    parsedFrom > 0 && from ? Math.max(0.5, parsedFrom * from.price * 0.0007) : 0;
  const fromBalance = from ? getRandomBalance(from.symbol, from.price) : 0;
  const toBalance = to ? getRandomBalance(to.symbol, to.price) : 0;
  const insufficientBalance = connected && !!from && parsedFrom > fromBalance;
  const sameToken = !!from && from === to;
  const rate = from && to ? from.price / to.price : 0;
  const canSwap =
    connected && parsedFrom > 0 && from && to && !sameToken && !insufficientBalance;

  const buttonDisabled =
    submitting || !from || !to || sameToken || insufficientBalance || (connected && parsedFrom <= 0);

  function buttonLabel() {
    if (submitting) return "Swapping…";
    if (!connected) return "Connect wallet to swap";
    if (sameToken) return "Select a different token";
    if (parsedFrom <= 0) return "Enter an amount";
    if (insufficientBalance) return `Insufficient ${fromToken} balance`;
    return `Swap ${fromToken} for ${toToken}`;
  }

  function requireWallet(action = "enter an amount") {
    if (connected) return true;
    toast.warning("Connect wallet first", {
      description: `Please connect your wallet before you ${action}.`,
    });
    return false;
  }

  function toggleWallet() {
    if (submitting) return;
    if (connected) {
      setConnected(false);
      setFromAmount("");
      toast.message("Wallet disconnected", {
        description: "Connect again to enter an amount and swap.",
      });
    } else {
      setConnected(true);
      toast.success("Wallet connected", {
        description: "You can now enter an amount and swap.",
      });
    }
  }

  function changeAmount(raw) {
    const next = formatAmountInput(raw);
    if (next !== null) setFromAmount(next);
  }

  function fillMax() {
    if (!requireWallet("use Max")) return;
    const floored = Math.floor(fromBalance * 1e6) / 1e6;
    setFromAmount(formatAmountInput(String(floored)) ?? "");
  }

  function flipTokens() {
    setFromToken(toToken);
    setToToken(fromToken);
    setFromAmount(toAmount > 0 ? formatAmountDisplay(toAmount) : "");
  }

  function selectToken(symbol) {
    if (picker === "from") {
      if (symbol === toToken) setToToken(fromToken);
      setFromToken(symbol);
    } else {
      if (symbol === fromToken) setFromToken(toToken);
      setToToken(symbol);
    }
  }

  function clearHistory() {
    setHistory([]);
    localStorage.removeItem("swap-history");
  }

  async function swap() {
    if (!canSwap || submitting) return;
    setSubmitting(true);
    try {
      await new Promise((resolve) => setTimeout(resolve, 1500));
      const entry = {
        id: Date.now(),
        network: networkInfo.name,
        from: fromToken,
        to: toToken,
        fromAmount: parsedFrom,
        toAmount,
        rate: from.price / to.price,
        slippage,
        timestamp: new Date().toISOString(),
      };
      const next = [entry, ...history].slice(0, HISTORY_LIMIT);
      setHistory(next);
      localStorage.setItem("swap-history", JSON.stringify(next));
      setFromAmount("");
      toast.success("Swap successful!", {
        description: `Swapped ${formatAmountDisplay(parsedFrom)} ${fromToken} → ${formatAmountDisplay(toAmount)} ${toToken} on ${networkInfo.name}.`,
      });
    } catch {
      toast.error("Swap failed", {
        description: "Something went wrong. Please try again.",
      });
    } finally {
      setSubmitting(false);
    }
  }

  return {
    // Core state
    tokens,
    loading,
    error,
    network,
    setNetwork,
    from,
    to,
    fromAmount,
    slippage,
    setSlippage,
    connected,
    submitting,
    picker,
    setPicker,
    history,
    // Derived numbers + button state
    quote: {
      parsedFrom,
      toAmount,
      rate,
      minReceived,
      estNetworkFee,
      fromBalance,
      toBalance,
      insufficientBalance,
      canSwap,
      buttonLabel: buttonLabel(),
      buttonDisabled,
    },
    // Actions
    actions: {
      requireWallet,
      toggleWallet,
      changeAmount,
      fillMax,
      flipTokens,
      selectToken,
      clearHistory,
      swap,
    },
  };
}
