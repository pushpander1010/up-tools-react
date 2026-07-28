import { Component } from 'react'

export default class ErrorBoundary extends Component {
  state = { error: null }
  static getDerivedStateFromError(error) { return { error } }
  render() {
    if (this.state.error) return (
      <div style={{ color: '#ff6b6b', padding: 40, fontFamily: 'monospace', whiteSpace: 'pre-wrap', background: '#0a0a0f', minHeight: '100vh' }}>
        <h2 style={{ color: '#fff' }}>Error</h2>
        <div>{String(this.state.error)}</div>
        <div style={{ fontSize: 11, marginTop: 20, color: '#888' }}>{this.state.error?.stack}</div>
        <a href="/" style={{ display: 'inline-block', marginTop: 20, color: '#6366f1' }}>← Home</a>
      </div>
    )
    return this.props.children
  }
}
