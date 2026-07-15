const AUTHOR = {
  email: "tathung095@gmail.com",
  github: "https://github.com/tathung095",
  githubLabel: "github.com/tathung095",
};

export default function OverviewPage({ onNavigate }) {
  const solutions = [
    {
      id: "problem1",
      title: "Problem 1 — Sum to N",
      description:
        "Three algorithmic approaches to compute the sum 1 + 2 + … + n: Gauss formula (O(1)), recursion, and iterative loop. Interactive demo with live results.",
      tag: "Algorithms",
    },
    {
      id: "problem2",
      title: "Problem 2 — Token Swap",
      description:
        "A swap UI with multi-network token exchange, slippage settings, wallet connect flow, and persistent swap history.",
      tag: "DeFi UI",
    },
    {
      id: "problem3",
      title: "Problem 3 — Messy React",
      description:
        "Refactor a messy React/TypeScript component: fixes computational bugs and anti-patterns, shown side by side with the original.",
      tag: "Refactor",
    },
  ];

  return (
    <div>
      <h2 className="page-title">Solutions Overview</h2>
      <div className="page-desc overview-intro">
        <p>
          Solution demos and runnable mini code authored by{" "}
          <a href={`mailto:${AUTHOR.email}`}>{AUTHOR.email}</a>.
        </p>
        <p>
          Source on GitHub:{" "}
          <a href={AUTHOR.github} target="_blank" rel="noopener noreferrer">
            {AUTHOR.githubLabel}
          </a>
        </p>
      </div>

      <div className="overview-grid">
        {solutions.map((sol) => (
          <button
            key={sol.id}
            className="overview-card"
            onClick={() => onNavigate(sol.id)}
          >
            <span className="overview-tag">{sol.tag}</span>
            <h3>{sol.title}</h3>
            <p>{sol.description}</p>
            <span className="overview-link">Open →</span>
          </button>
        ))}
      </div>
    </div>
  );
}
