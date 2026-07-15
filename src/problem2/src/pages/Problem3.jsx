import CodeEditor from "../components/CodeEditor";
import "./Problem3.scss";

const SAMPLE_CODE = `interface WalletBalance {
  currency: string;
  amount: number;
}
interface FormattedWalletBalance {
  currency: string;
  amount: number;
  formatted: string;
}

interface Props extends BoxProps {

}
const WalletPage: React.FC<Props> = (props: Props) => {
  const { children, ...rest } = props;
  const balances = useWalletBalances();
  const prices = usePrices();

  const getPriority = (blockchain: any): number => {
    switch (blockchain) {
      case 'Osmosis':
        return 100
      case 'Ethereum':
        return 50
      case 'Arbitrum':
        return 30
      case 'Zilliqa':
        return 20
      case 'Neo':
        return 20
      default:
        return -99
    }
  }

  const sortedBalances = useMemo(() => {
    return balances.filter((balance: WalletBalance) => {
      const balancePriority = getPriority(balance.blockchain);
      if (lhsPriority > -99) {
        if (balance.amount <= 0) {
          return true;
        }
      }
      return false
    }).sort((lhs: WalletBalance, rhs: WalletBalance) => {
      const leftPriority = getPriority(lhs.blockchain);
      const rightPriority = getPriority(rhs.blockchain);
      if (leftPriority > rightPriority) {
        return -1;
      } else if (rightPriority > leftPriority) {
        return 1;
      }
    });
  }, [balances, prices]);

  const formattedBalances = sortedBalances.map((balance: WalletBalance) => {
    return {
      ...balance,
      formatted: balance.amount.toFixed()
    }
  })

  const rows = sortedBalances.map((balance: FormattedWalletBalance, index: number) => {
    const usdValue = prices[balance.currency] * balance.amount;
    return (
      <WalletRow
        className={classes.row}
        key={index}
        amount={balance.amount}
        usdValue={usdValue}
        formattedAmount={balance.formatted}
      />
    )
  })

  return (
    <div {...rest}>
      {rows}
    </div>
  )
}`;

const REFACTORED_CODE = `interface WalletBalance {
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
};`;

function hl(text, kind = "code") {
  return <code className={`issue-hl issue-hl--${kind}`}>{text}</code>;
}

const ISSUES = [
  {
    title: "Missing blockchain field on WalletBalance",
    note: (
      <>
        {hl("getPriority", "fn")} used {hl("blockchain: any", "type")} and the
        interface lacked {hl("blockchain", "prop")} — typed it as{" "}
        {hl("string", "type")} on the interface.
      </>
    ),
  },
  {
    title: "FormattedWalletBalance extends WalletBalance",
    note: (
      <>
        Original {hl("FormattedWalletBalance", "type")} duplicated{" "}
        {hl("currency", "prop")} / {hl("amount", "prop")} — now{" "}
        {hl("extends WalletBalance", "fix")} and only adds{" "}
        {hl("formatted: string", "type")}.
      </>
    ),
  },
  {
    title: "Undefined lhsPriority in filter",
    note: (
      <>
        Filter referenced {hl("lhsPriority", "bug")} which does not exist —
        should use {hl("balancePriority", "fix")}.
      </>
    ),
  },
  {
    title: "Inverted amount filter",
    note: (
      <>
        Original logic kept balances with {hl("amount <= 0", "bug")} — now keeps{" "}
        {hl("amount > 0", "fix")} on known chains only.
      </>
    ),
  },
  {
    title: "Incomplete sort comparator",
    note: (
      <>
        When priorities were equal there was no {hl("return", "keyword")} value
        — now sorts with {hl("getPriority(b) - getPriority(a)", "fix")}.
      </>
    ),
  },
  {
    title: "Unused prices in useMemo deps",
    note: (
      <>
        Original {hl("sortedBalances", "prop")} wrapped in {hl("useMemo", "fn")}{" "}
        with unused {hl("prices", "bug")} dep — dropped {hl("useMemo", "fn")}{" "}
        for this list; keep memo only on {hl("rows", "prop")}.
      </>
    ),
  },
  {
    title: "Unused formattedBalances / missing .formatted",
    note: (
      <>
        {hl("formattedBalances", "bug")} was computed then ignored; rows read{" "}
        {hl(".formatted", "bug")} from raw data — format with{" "}
        {hl("toFixed(2)", "fn")} inside rows.
      </>
    ),
  },
  {
    title: "getPriority recreated every render",
    note: (
      <>
        Moved {hl("getPriority", "fn")} outside the component and replaced the{" "}
        {hl("switch", "keyword")} with a {hl("PRIORITY", "prop")} lookup map.
      </>
    ),
  },
  {
    title: "Unstable React list keys",
    note: (
      <>
        Rows used {hl("key={index}", "bug")} — switched to a stable{" "}
        {hl("key={balance.currency}", "fix")}.
      </>
    ),
  },
  {
    title: "Rows rebuilt every render",
    note: (
      <>
        Wrapped rows in {hl("useMemo", "fn")} so they only recompute when{" "}
        {hl("sortedBalances", "prop")} or {hl("prices", "prop")} change.
      </>
    ),
  },
];

export default function Problem3() {
  return (
    <div className="problem3">
      <h2 className="page-title">Problem 3 — Messy React</h2>
      <p className="page-desc">
        Refactor a React/TypeScript component full of anti-patterns and logic
        bugs. Original (left) and refactored (right) are shown side by side.
      </p>

      <div className="problem3__editors">
        <CodeEditor
          title="WalletPage.original.tsx"
          badge="Before"
          subtitle="Original sample with bugs and anti-patterns"
          code={SAMPLE_CODE}
          language="tsx"
        />
        <CodeEditor
          title="WalletPage.refactored.tsx"
          badge="After"
          subtitle="Cleaned-up version with English comments"
          code={REFACTORED_CODE}
          language="tsx"
        />
      </div>

      <div className="problem3__issues">
        <h3 className="problem3__issues-title">Explain</h3>
        <ol className="problem3__issue-list">
          {ISSUES.map((issue, i) => (
            <li key={i} className="problem3__issue-item">
              <span className="problem3__issue-title">{issue.title}</span>
              <p className="problem3__issue-note">{issue.note}</p>
            </li>
          ))}
        </ol>
      </div>
    </div>
  );
}
