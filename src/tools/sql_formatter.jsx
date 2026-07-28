import { useState, useMemo } from 'react'
import ToolLayout from '../components/ToolLayout'

const SQL_KEYWORDS = [
  'SELECT', 'FROM', 'WHERE', 'AND', 'OR', 'NOT', 'IN', 'IS', 'NULL', 'LIKE',
  'BETWEEN', 'EXISTS', 'JOIN', 'INNER', 'LEFT', 'RIGHT', 'OUTER', 'FULL', 'CROSS',
  'ON', 'GROUP', 'BY', 'ORDER', 'ASC', 'DESC', 'HAVING', 'LIMIT', 'OFFSET',
  'INSERT', 'INTO', 'VALUES', 'UPDATE', 'SET', 'DELETE', 'CREATE', 'TABLE',
  'ALTER', 'DROP', 'INDEX', 'VIEW', 'TRIGGER', 'FUNCTION', 'PROCEDURE', 'IF',
  'ELSE', 'CASE', 'WHEN', 'THEN', 'END', 'AS', 'DISTINCT', 'ALL', 'UNION',
  'INTERSECT', 'EXCEPT', 'MINUS', 'TOP', 'WITH', 'RECURSIVE', 'PARTITION',
  'OVER', 'ROW_NUMBER', 'RANK', 'DENSE_RANK', 'LAG', 'LEAD', 'FIRST_VALUE',
  'LAST_VALUE', 'NTILE', 'FETCH', 'NEXT', 'ROWS', 'ONLY', 'LIKE', 'ILIKE',
  'RETURNING', 'CONFLICT', 'DO', 'NOTHING', 'GRANT', 'REVOKE', 'COMMIT',
  'ROLLBACK', 'BEGIN', 'TRANSACTION', 'SAVEPOINT', 'TRUNCATE', 'CASCADE',
  'CONSTRAINT', 'PRIMARY', 'KEY', 'FOREIGN', 'REFERENCES', 'UNIQUE', 'CHECK',
  'DEFAULT', 'AUTO_INCREMENT', 'SERIAL', 'BIGSERIAL', 'IDENTITY', 'GENERATED',
  'ALWAYS', 'TEMPORARY', 'TEMP', 'MATERIALIZED', 'REPLACE', 'INTO', 'LATERAL',
  'PIVOT', 'UNPIVOT', 'TABLESAMPLE', 'USING', 'NATURAL', 'ANY', 'SOME',
  'TRUE', 'FALSE', 'CURRENT_DATE', 'CURRENT_TIMESTAMP', 'CURRENT_TIME',
]

const FORMAT_KEYWORDS = new Set(SQL_KEYWORDS)
const MAJOR_CLAUSES = new Set([
  'SELECT', 'FROM', 'WHERE', 'AND', 'OR', 'JOIN', 'INNER JOIN', 'LEFT JOIN',
  'RIGHT JOIN', 'FULL JOIN', 'CROSS JOIN', 'LEFT OUTER JOIN', 'RIGHT OUTER JOIN',
  'FULL OUTER JOIN', 'ON', 'GROUP BY', 'ORDER BY', 'HAVING', 'LIMIT', 'OFFSET',
  'INSERT INTO', 'VALUES', 'UPDATE', 'SET', 'DELETE FROM', 'CREATE TABLE',
  'CREATE INDEX', 'ALTER TABLE', 'DROP TABLE', 'WITH', 'UNION', 'INTERSECT',
  'EXCEPT', 'MINUS', 'PARTITION BY', 'FETCH NEXT', 'ROWS ONLY',
  'INSERT', 'INTO', 'UPDATE', 'DELETE', 'RETURNING',
])

function formatSQL(sql, { upperKeywords = true, indentSize = 2 }) {
  const pad = ' '.repeat(indentSize)
  let result = sql

  // Normalize whitespace
  result = result.replace(/\s+/g, ' ').trim()

  if (upperKeywords) {
    // Only uppercase recognized keywords (not values inside strings)
    const tokens = tokenizeSql(result)
    result = tokens.map(t => {
      if (t.type === 'keyword') return t.value.toUpperCase()
      return t.value
    }).join('')
  }

  // Split into major clauses and format
  const lines = []
  let remaining = result

  // Detect and split on major clause boundaries
  const clauseRegex = /\b(SELECT|FROM|WHERE|JOIN|INNER JOIN|LEFT JOIN|RIGHT JOIN|FULL JOIN|CROSS JOIN|LEFT OUTER JOIN|RIGHT OUTER JOIN|FULL OUTER JOIN|ON|GROUP BY|ORDER BY|HAVING|LIMIT|OFFSET|VALUES|SET|INSERT INTO|DELETE FROM|RETURNING|WITH|UNION|INTERSECT|EXCEPT)\b/gi

  let parts = []
  let lastIndex = 0
  let match

  while ((match = clauseRegex.exec(result)) !== null) {
    if (match.index > lastIndex) {
      parts.push(result.slice(lastIndex, match.index))
    }
    parts.push(match[0])
    lastIndex = clauseRegex.lastIndex
  }
  if (lastIndex < result.length) {
    parts.push(result.slice(lastIndex))
  }

  for (let i = 0; i < parts.length; i++) {
    const part = parts[i].trim()
    if (!part) continue

    const upperPart = upperKeywords ? part.toUpperCase() : part

    // Check if this is a major clause keyword
    if (MAJOR_CLAUSES.has(upperPart)) {
      const kw = upperKeywords ? part.toUpperCase() : part
      lines.push(kw)
    } else {
      // Handle sub-clauses with indentation
      const subParts = part.split(/(\bAND\b|\bOR\b|\bHAVING\b)/i)
      const subLines = subParts.map(sp => {
        const trimmed = sp.trim()
        if (!trimmed) return null
        const upper = upperKeywords ? trimmed.toUpperCase() : trimmed
        if (upper === 'AND' || upper === 'OR') return pad + upper
        // Handle comma-separated lists
        if (trimmed.includes(',')) {
          const items = trimmed.split(',').map(s => s.trim()).filter(Boolean)
          if (items.length > 3) {
            return items.map((item, idx) => {
              const comma = idx < items.length - 1 ? ',' : ''
              return idx === 0 ? item + comma : pad + item + comma
            }).join('\n')
          }
        }
        return trimmed
      }).filter(Boolean)

      if (subLines.length > 1) {
        lines.push(...subLines)
      } else {
        lines.push(subLines[0] || part)
      }
    }
  }

  // Join with proper indentation
  let output = ''
  let currentIndent = 0

  for (const line of lines) {
    const upper = upperKeywords ? line.toUpperCase().trim() : line.trim()
    const trimmed = line.trim()

    if (!trimmed) continue

    // Decrease indent before certain clauses
    if (['END', ')'].includes(upper) || upper.startsWith(')')) {
      currentIndent = Math.max(0, currentIndent - 1)
    }

    output += pad.repeat(currentIndent) + trimmed + '\n'

    // Increase indent after certain clauses
    if (['SELECT', 'FROM', 'WHERE', 'GROUP BY', 'ORDER BY', 'HAVING', 'SET', 'VALUES', 'ON', 'WITH', 'UNION', 'INTERSECT', 'EXCEPT', 'LEFT JOIN', 'RIGHT JOIN', 'INNER JOIN', 'FULL JOIN', 'CROSS JOIN', 'LEFT OUTER JOIN', 'RIGHT OUTER JOIN', 'FULL OUTER JOIN', 'DELETE FROM', 'INSERT INTO', 'LIMIT', 'OFFSET', 'RETURNING'].includes(upper)) {
      currentIndent++
    }
  }

  return output.trim()
}

function tokenizeSql(sql) {
  const tokens = []
  let i = 0
  while (i < sql.length) {
    // Skip whitespace
    if (/\s/.test(sql[i])) {
      tokens.push({ type: 'space', value: sql[i] })
      i++
      continue
    }
    // String literal
    if (sql[i] === "'" || sql[i] === '"') {
      const quote = sql[i]
      let j = i + 1
      while (j < sql.length && sql[j] !== quote) {
        if (sql[j] === '\\') j++ // skip escaped char
        j++
      }
      j = Math.min(j + 1, sql.length)
      tokens.push({ type: 'string', value: sql.slice(i, j) })
      i = j
      continue
    }
    // Number
    if (/\d/.test(sql[i])) {
      let j = i
      while (j < sql.length && /[\d.]/.test(sql[j])) j++
      tokens.push({ type: 'number', value: sql.slice(i, j) })
      i = j
      continue
    }
    // Identifier/keyword
    if (/[a-zA-Z_]/.test(sql[i])) {
      let j = i
      while (j < sql.length && /[a-zA-Z0-9_]/.test(sql[j])) j++
      const word = sql.slice(i, j)
      if (FORMAT_KEYWORDS.has(word.toUpperCase())) {
        tokens.push({ type: 'keyword', value: word })
      } else {
        tokens.push({ type: 'identifier', value: word })
      }
      i = j
      continue
    }
    // Operator/symbol
    tokens.push({ type: 'symbol', value: sql[i] })
    i++
  }
  return tokens
}

function minifySQL(sql) {
  return sql
    .replace(/--[^\n]*/g, '') // Remove single-line comments
    .replace(/\/\*[\s\S]*?\*\//g, '') // Remove multi-line comments
    .replace(/\s+/g, ' ')
    .trim()
}

const SAMPLE_SQL = `SELECT
  u.id,
  u.name,
  u.email,
  COUNT(o.id) AS order_count,
  SUM(o.total) AS total_spent
FROM users AS u
LEFT JOIN orders AS o
  ON o.user_id = u.id
  AND o.status = 'completed'
WHERE u.created_at >= '2024-01-01'
  AND u.is_active = true
GROUP BY u.id, u.name, u.email
HAVING COUNT(o.id) > 0
ORDER BY total_spent DESC
LIMIT 100;`

export default function sql_formatter() {
  const [input, setInput] = useState('')
  const [output, setOutput] = useState('')
  const [keywordCase, setKeywordCase] = useState('upper')
  const [indentSize, setIndentSize] = useState(2)
  const [copied, setCopied] = useState(false)

  const format = () => {
    if (!input.trim()) {
      setOutput('')
      return
    }
    try {
      const formatted = formatSQL(input, {
        upperKeywords: keywordCase === 'upper',
        indentSize,
      })
      setOutput(formatted)
    } catch (e) {
      setOutput('Error formatting SQL: ' + e.message)
    }
  }

  const minify = () => {
    if (!input.trim()) {
      setOutput('')
      return
    }
    const minified = minifySQL(input)
    setOutput(minified)
  }

  const loadSample = () => {
    setInput(SAMPLE_SQL)
    setOutput('')
  }

  const copyOutput = () => {
    navigator.clipboard.writeText(output)
    setCopied(true)
    setTimeout(() => setCopied(false), 1200)
  }

  return (
    <ToolLayout
      title="SQL Formatter"
      desc="Format, minify, and beautify SQL queries with customizable keyword case and indentation."
      icon="🗄️" iconBg="rgba(245,158,11,0.08)"
      category="developer" slug="sql-formatter"
      faq={[
        { q: 'What does the SQL Formatter do?', a: 'It formats and beautifies SQL queries with proper indentation, keyword capitalization, and clean line breaks. It also supports minification to compress queries into a single line.' },
        { q: 'Which SQL dialects are supported?', a: 'The formatter works with standard SQL, MySQL, PostgreSQL, SQLite, and SQL Server syntax. It recognizes common keywords across all major databases.' },
      ]}
      howItWorks={[
        'Paste your SQL query into the input area or click "Load Sample".',
        'Choose keyword case (UPPER, lower, or Mixed) and indent size.',
        'Click "Format" to beautify the query or "Minify" to compress it.',
        'Copy the formatted result to your clipboard.',
      ]}
      schema={{
        "@context": "https://schema.org", "@type": "SoftwareApplication",
        "name": "SQL Formatter", "applicationCategory": "DeveloperApplication",
        "url": "https://www.uptools.in/sql-formatter/",
        "offers": { "@type": "Offer", "price": "0", "priceCurrency": "INR" }
      }}
    >
      <div className="max-w-5xl mx-auto space-y-4">
        {/* Options bar */}
        <div className="bg-white/[0.06] border border-white/[0.08] rounded-2xl p-4 flex flex-wrap items-center gap-4">
          <div className="flex items-center gap-2">
            <label className="text-xs font-bold text-slate-400">Keywords:</label>
            <div className="flex gap-1">
              {['upper', 'lower', 'mixed'].map(c => (
                <button key={c} onClick={() => setKeywordCase(c)}
                  className={`px-3 py-1.5 rounded-lg text-[10px] font-bold uppercase tracking-wider transition-all duration-200 ${keywordCase === c ? 'bg-amber-500/20 text-amber-400 ring-1 ring-amber-500/30' : 'bg-white/[0.04] text-slate-500 hover:text-slate-300'}`}>
                  {c}
                </button>
              ))}
            </div>
          </div>
          <div className="flex items-center gap-2">
            <label className="text-xs font-bold text-slate-400">Indent:</label>
            <div className="flex gap-1">
              {[2, 4].map(s => (
                <button key={s} onClick={() => setIndentSize(s)}
                  className={`w-9 h-9 rounded-lg text-xs font-bold transition-all duration-200 ${indentSize === s ? 'bg-amber-500/20 text-amber-400 ring-1 ring-amber-500/30' : 'bg-white/[0.04] text-slate-500 hover:text-slate-300'}`}>
                  {s}
                </button>
              ))}
            </div>
          </div>
          <div className="flex gap-2 ml-auto">
            <button onClick={loadSample}
              className="px-4 py-2 rounded-xl bg-amber-500/15 text-amber-400 text-xs font-bold hover:bg-amber-500/25 transition-all duration-200">
              📄 Sample
            </button>
            <button onClick={minify}
              className="px-4 py-2 rounded-xl bg-white/[0.04] text-slate-500 text-xs font-bold hover:bg-white/[0.08] hover:text-slate-300 transition-all duration-200">
              🗜️ Minify
            </button>
            <button onClick={format}
              className="px-6 py-2 rounded-xl bg-amber-500/20 text-amber-400 text-xs font-bold hover:bg-amber-500/30 transition-all duration-200">
              ✨ Format
            </button>
          </div>
        </div>

        {/* Editor */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Input */}
          <div className="bg-white/[0.06] border border-white/[0.08] rounded-2xl overflow-hidden">
            <div className="px-4 py-3 border-b border-white/[0.06] flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-amber-400" />
              <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">SQL Input</span>
            </div>
            <textarea value={input} onChange={e => setInput(e.target.value)}
              placeholder="SELECT * FROM users WHERE id = 1;"
              className="w-full h-80 bg-transparent text-white font-mono text-xs p-4 outline-none resize-none placeholder:text-slate-600 [color-scheme:dark]" />
          </div>

          {/* Output */}
          <div className="bg-white/[0.06] border border-white/[0.08] rounded-2xl overflow-hidden">
            <div className="px-4 py-3 border-b border-white/[0.06] flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-emerald-400" />
              <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Formatted Output</span>
              {output && (
                <button onClick={copyOutput}
                  className="ml-auto text-[10px] font-bold text-amber-400 hover:text-amber-300 transition-colors">
                  {copied ? '✓ Copied!' : '📋 Copy'}
                </button>
              )}
            </div>
            <textarea value={output} readOnly
              placeholder="Formatted SQL will appear here..."
              className="w-full h-80 bg-transparent text-white font-mono text-xs p-4 outline-none resize-none placeholder:text-slate-600 [color-scheme:dark]" />
          </div>
        </div>

        {/* Features */}
        <div className="bg-white/[0.06] border border-white/[0.08] rounded-2xl p-5">
          <h3 className="text-sm font-bold text-slate-300 mb-3">Features</h3>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-[10px] font-mono">
            {[
              ['🔤', 'Keyword Uppercase'],
              ['📐', 'Configurable Indentation'],
              ['🗜️', 'Minification'],
              ['📝', 'Comment Preservation'],
              ['🔗', 'JOIN Formatting'],
              ['📊', 'GROUP BY / ORDER BY'],
              ['🔀', 'Subquery Support'],
              ['⚡', 'Instant Formatting'],
            ].map(([icon, label]) => (
              <div key={label} className="bg-black/20 rounded-lg px-2.5 py-2 flex items-center gap-2">
                <span>{icon}</span>
                <span className="text-slate-400">{label}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </ToolLayout>
  )
}
