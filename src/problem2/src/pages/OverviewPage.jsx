const AUTHOR = {
  email: "tathung095@gmail.com",
  github: "https://github.com/tathung095",
  githubLabel: "github.com/tathung095",
};

export default function OverviewPage({ onNavigate }) {
  const solutions = [
    {
      id: "main",
      title: "Token Swap",
      description:
        "A swap UI with multi-network token exchange, slippage settings, wallet connect flow, and persistent swap history.",
      tag: "DeFi UI",
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
