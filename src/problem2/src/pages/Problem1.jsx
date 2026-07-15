import { useState } from 'react'

const IMPLEMENTATIONS = [
  {
    id: 'a',
    tag: 'Formula',
    tagClass: 'tag-formula',
    title: 'Approach A — Gauss Formula',
    code: `var sum_to_n_a = function (n) {
  return (n * (n + 1)) / 2;
};`,
    run: (n) => (n * (n + 1)) / 2,
  },
  {
    id: 'b',
    tag: 'Recursive',
    tagClass: 'tag-recursive',
    title: 'Approach B — Recursion',
    code: `var sum_to_n_b = function (n) {
  if (n === 1) {
    return 1;
  }
  return n + sum_to_n_b(n - 1);
};`,
    run: function sumToNB(n) {
      if (n <= 0) return 0
      if (n === 1) return 1
      return n + sumToNB(n - 1)
    },
  },
  {
    id: 'c',
    tag: 'Iterative',
    tagClass: 'tag-iterative',
    title: 'Approach C — While Loop',
    code: `var sum_to_n_c = function (n) {
  let sum = 0;
  while (n > 0) {
    sum += n;
    n--;
  }
  return sum;
};`,
    run: (n) => {
      let sum = 0
      let i = n
      while (i > 0) {
        sum += i
        i--
      }
      return sum
    },
  },
]

function ImplementationCard({ impl, n, result }) {
  return (
    <div className="card">
      <span className={`tag ${impl.tagClass}`}>{impl.tag}</span>
      <h3 className="card-title">{impl.title}</h3>
      <pre className="code-block">{impl.code}</pre>
      <div className="demo-row">
        <span className="result-badge">
          sum_to_n_{impl.id}({n}) = {result}
        </span>
      </div>
    </div>
  )
}

export default function Problem1() {
  const [n, setN] = useState(10)
  const parsed = Math.max(0, Math.min(10000, parseInt(n, 10) || 0))

  return (
    <div>
      <h2 className="page-title">Sum to N — 3 Implementations</h2>

      <div className="card">
        <h3 className="card-title">Live Demo</h3>
        <div className="demo-row">
          <label>
            <span className="card-subtitle" style={{ display: 'block', marginBottom: 4 }}>
              n =
            </span>
            <input
              className="demo-input"
              type="number"
              min="0"
              max="10000"
              value={n}
              onChange={(e) => setN(e.target.value)}
            />
          </label>
        </div>
      </div>

      {IMPLEMENTATIONS.map((impl) => (
        <ImplementationCard
          key={impl.id}
          impl={impl}
          n={parsed}
          result={impl.run(parsed)}
        />
      ))}
    </div>
  )
}
