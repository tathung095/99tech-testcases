import { useMemo, useState } from 'react'
import { highlightJs } from '../utils/highlightJs'
import './CodeEditor.scss'

export default function CodeEditor({ title, badge, subtitle, code, language = 'tsx' }) {
  const [copied, setCopied] = useState(false)
  const lines = useMemo(() => code.replace(/\n$/, '').split('\n'), [code])
  const highlighted = useMemo(() => highlightJs(code.replace(/\n$/, '')), [code])
  const highlightedLines = useMemo(() => highlighted.split('\n'), [highlighted])

  async function handleCopy() {
    try {
      await navigator.clipboard.writeText(code.replace(/\n$/, ''))
      setCopied(true)
      window.setTimeout(() => setCopied(false), 1600)
    } catch {
      setCopied(false)
    }
  }

  return (
    <div className="code-editor">
      <div className="code-editor__titlebar">
        <div className="code-editor__dots" aria-hidden="true">
          <span />
          <span />
          <span />
        </div>
        <div className="code-editor__meta">
          <span className="code-editor__title">{title}</span>
          {badge && <span className="code-editor__badge">{badge}</span>}
        </div>
        <div className="code-editor__actions">
          <span className="code-editor__lang">{language}</span>
          <button
            type="button"
            className={`code-editor__copy ${copied ? 'copied' : ''}`}
            onClick={handleCopy}
            title={copied ? 'Copied' : 'Copy code'}
          >
            {copied ? (
              <>
                <svg width="14" height="14" viewBox="0 0 16 16" fill="none" aria-hidden="true">
                  <path
                    d="M3.5 8.5L6.5 11.5L12.5 4.5"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
                Copied
              </>
            ) : (
              <>
                <svg width="14" height="14" viewBox="0 0 16 16" fill="none" aria-hidden="true">
                  <rect x="5" y="5" width="8" height="8" rx="1.5" stroke="currentColor" strokeWidth="1.5" />
                  <path
                    d="M3 10.5V3.5C3 2.67 3.67 2 4.5 2H10.5"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                  />
                </svg>
                Copy
              </>
            )}
          </button>
        </div>
      </div>

      {subtitle && <p className="code-editor__subtitle">{subtitle}</p>}

      <div className="code-editor__body">
        <div className="code-editor__gutter" aria-hidden="true">
          {lines.map((_, i) => (
            <span key={i} className="code-editor__line-no">
              {i + 1}
            </span>
          ))}
        </div>
        <pre className="code-editor__code">
          <code>
            {highlightedLines.map((line, i) => (
              <span key={i} className="code-editor__line" dangerouslySetInnerHTML={{ __html: line || '&nbsp;' }} />
            ))}
          </code>
        </pre>
      </div>
    </div>
  )
}
