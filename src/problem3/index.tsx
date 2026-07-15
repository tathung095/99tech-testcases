interface WalletBalance {
    currency: string;
    amount: number;
    blockchain: string; // was missing but used by getPriority
  }
  
  interface FormattedWalletBalance extends WalletBalance {
    formatted: string;
  }
  
  // Lookup map instead of a switch — defined once outside the component.
  const PRIORITY: Record<string, number> = {
    Osmosis: 100,
    Ethereum: 50,
    Arbitrum: 30,
    Zilliqa: 20,
    Neo: 20,
  };
  
  const getPriority = (blockchain: string): number =>
    PRIORITY[blockchain] || -99;
  
  const WalletPage: React.FC<BoxProps> = ({ children, ...rest }) => {
    const balances = useWalletBalances();
    const prices = usePrices();
  
    // Keep balances that are positive and on a known chain, then sort by priority (high → low).
    const result = [];
    for (const balance of balances) {
      if (balance.amount <= 0) continue;
      if (getPriority(balance.blockchain) <= -99) continue;
      result.push(balance);
    }
    const sortedBalances = result.sort(
      (a, b) => getPriority(b.blockchain) - getPriority(a.blockchain),
    );
  
    // Format amount and compute USD value in one pass.
    const rows = useMemo(
      () =>
        sortedBalances.map((balance) => {
          const usdValue = (prices[balance.currency] || 0) * balance.amount;
          return (
            <WalletRow
              key={balance.currency} // using key should be better than index
              className={classes.row}
              amount={balance.amount}
              usdValue={usdValue}
              formattedAmount={balance.amount.toFixed(2)}
            />
          );
        }),
      [sortedBalances, prices],
    );
  
    return <div {...rest}>{rows}</div>;
  };