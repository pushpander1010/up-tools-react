import { useState, useMemo } from 'react'
import ToolLayout from '../components/ToolLayout'

const STATUS_CODES = [
  // 1xx Informational
  { code: 100, title: 'Continue', desc: 'The server has received the request headers, and the client should proceed to send the request body.', category: '1xx' },
  { code: 101, title: 'Switching Protocols', desc: 'The server is switching protocols as requested by the client (e.g., upgrading to WebSocket).', category: '1xx' },
  { code: 102, title: 'Processing', desc: 'The server has accepted and is processing the request, but no response is available yet.', category: '1xx' },
  { code: 103, title: 'Early Hints', desc: 'Used to preload resources while the server prepares a response.', category: '1xx' },
  // 2xx Success
  { code: 200, title: 'OK', desc: 'The request has succeeded. The result depends on the method used (GET, POST, etc.).', category: '2xx' },
  { code: 201, title: 'Created', desc: 'The request has been fulfilled, resulting in the creation of a new resource.', category: '2xx' },
  { code: 202, title: 'Accepted', desc: 'The request has been accepted for processing, but processing is not yet complete.', category: '2xx' },
  { code: 203, title: 'Non-Authoritative Information', desc: 'The request succeeded, but the returned metadata may be from a cached or third-party copy.', category: '2xx' },
  { code: 204, title: 'No Content', desc: 'The request succeeded, but there is no content to send in the response body.', category: '2xx' },
  { code: 205, title: 'Reset Content', desc: 'The request succeeded, and the client should reset the document view that triggered the request.', category: '2xx' },
  { code: 206, title: 'Partial Content', desc: 'The server is delivering only part of the resource due to a Range header in the request.', category: '2xx' },
  { code: 207, title: 'Multi-Status', desc: 'The message body that follows is an XML message and can contain a number of separate response codes.', category: '2xx' },
  { code: 208, title: 'Already Reported', desc: 'The members of a DAV binding have already been enumerated in a preceding part of the response.', category: '2xx' },
  { code: 226, title: 'IM Used', desc: 'The server has fulfilled a request for the resource using Delta encoding.', category: '2xx' },
  // 3xx Redirection
  { code: 300, title: 'Multiple Choices', desc: 'The request has more than one possible response. The user or agent should choose one.', category: '3xx' },
  { code: 301, title: 'Moved Permanently', desc: 'The resource has been permanently moved to a new URL. Future requests should use the new URL.', category: '3xx' },
  { code: 302, title: 'Found', desc: 'The resource has been temporarily moved to a different URL. Future requests should use the original URL.', category: '3xx' },
  { code: 303, title: 'See Other', desc: 'The response can be found at a different URL using a GET request.', category: '3xx' },
  { code: 304, title: 'Not Modified', desc: 'The resource has not been modified since the last request (used with cached responses).', category: '3xx' },
  { code: 305, title: 'Use Proxy', desc: 'The requested resource must be accessed through the specified proxy.', category: '3xx' },
  { code: 307, title: 'Temporary Redirect', desc: 'The resource has been temporarily moved, but the request method should remain the same.', category: '3xx' },
  { code: 308, title: 'Permanent Redirect', desc: 'The resource has been permanently moved, and the request method should remain the same.', category: '3xx' },
  // 4xx Client Errors
  { code: 400, title: 'Bad Request', desc: 'The server cannot process the request due to malformed syntax, invalid request framing, or deceptive request routing.', category: '4xx' },
  { code: 401, title: 'Unauthorized', desc: 'Authentication is required and has either failed or not been provided.', category: '4xx' },
  { code: 402, title: 'Payment Required', desc: 'Reserved for future use. Originally intended for digital payment systems.', category: '4xx' },
  { code: 403, title: 'Forbidden', desc: 'The server understood the request but refuses to authorize it. Authentication won\'t help.', category: '4xx' },
  { code: 404, title: 'Not Found', desc: 'The server cannot find the requested resource. The URL is not recognized or the resource doesn\'t exist.', category: '4xx' },
  { code: 405, title: 'Method Not Allowed', desc: 'The request HTTP method is known by the server but not supported by the target resource.', category: '4xx' },
  { code: 406, title: 'Not Acceptable', desc: 'The server cannot produce a response matching the list of acceptable values defined in the request headers.', category: '4xx' },
  { code: 407, title: 'Proxy Authentication Required', desc: 'The client must first authenticate itself with the proxy before the server will process the request.', category: '4xx' },
  { code: 408, title: 'Request Timeout', desc: 'The server timed out waiting for the request from the client.', category: '4xx' },
  { code: 409, title: 'Conflict', desc: 'The request conflicts with the current state of the target resource.', category: '4xx' },
  { code: 410, title: 'Gone', desc: 'The resource has been permanently removed and will not be available again.', category: '4xx' },
  { code: 411, title: 'Length Required', desc: 'The server requires a Content-Length header in the request.', category: '4xx' },
  { code: 412, title: 'Precondition Failed', desc: 'One or more conditions in the request header fields evaluated to false.', category: '4xx' },
  { code: 413, title: 'Content Too Large', desc: 'The request body is larger than the server is willing or able to process.', category: '4xx' },
  { code: 414, title: 'URI Too Long', desc: 'The URI provided by the client was too long for the server to handle.', category: '4xx' },
  { code: 415, title: 'Unsupported Media Type', desc: 'The request payload format is not supported by the server for the target resource.', category: '4xx' },
  { code: 416, title: 'Range Not Satisfiable', desc: 'The range specified in the request\'s Range header cannot be fulfilled.', category: '4xx' },
  { code: 417, title: 'Expectation Failed', desc: 'The Expect header in the request cannot be met by the server.', category: '4xx' },
  { code: 418, title: "I'm a Teapot", desc: 'The server refuses the attempt to brew coffee with a teapot (Easter egg from RFC 2324).', category: '4xx' },
  { code: 421, title: 'Misdirected Request', desc: 'The request was directed at a server unable to produce a response for the given URI.', category: '4xx' },
  { code: 422, title: 'Unprocessable Content', desc: 'The request was well-formed but semantically errors prevented processing.', category: '4xx' },
  { code: 423, title: 'Locked', desc: 'The resource that is being accessed is locked.', category: '4xx' },
  { code: 424, title: 'Failed Dependency', desc: 'The request failed due to a failure of a previous request.', category: '4xx' },
  { code: 425, title: 'Too Early', desc: 'The server is unwilling to risk processing a request that might be replayed.', category: '4xx' },
  { code: 426, title: 'Upgrade Required', desc: 'The client should switch to a different protocol (e.g., TLS/1.3).', category: '4xx' },
  { code: 428, title: 'Precondition Required', desc: 'The origin server requires the request to be conditional to prevent conflicts.', category: '4xx' },
  { code: 429, title: 'Too Many Requests', desc: 'The client has sent too many requests in a given amount of time (rate limiting).', category: '4xx' },
  { code: 431, title: 'Request Header Fields Too Large', desc: 'The server is refusing to process because individual header fields are too large.', category: '4xx' },
  { code: 451, title: 'Unavailable For Legal Reasons', desc: 'The resource access is denied due to legal demands or censorship.', category: '4xx' },
  // 5xx Server Errors
  { code: 500, title: 'Internal Server Error', desc: 'The server encountered an unexpected condition that prevented it from fulfilling the request.', category: '5xx' },
  { code: 501, title: 'Not Implemented', desc: 'The server does not support the functionality required to fulfill the request.', category: '5xx' },
  { code: 502, title: 'Bad Gateway', desc: 'The server received an invalid response from an upstream server while acting as a gateway or proxy.', category: '5xx' },
  { code: 503, title: 'Service Unavailable', desc: 'The server is not ready to handle the request, often due to maintenance or overload.', category: '5xx' },
  { code: 504, title: 'Gateway Timeout', desc: 'The server acting as a gateway or proxy did not receive a timely response from an upstream server.', category: '5xx' },
  { code: 505, title: 'HTTP Version Not Supported', desc: 'The server does not support the HTTP protocol version used in the request.', category: '5xx' },
  { code: 506, title: 'Variant Also Negotiates', desc: 'The server has an internal configuration error in content negotiation.', category: '5xx' },
  { code: 507, title: 'Insufficient Storage', desc: 'The server is unable to store the representation needed to complete the request.', category: '5xx' },
  { code: 508, title: 'Loop Detected', desc: 'The server detected an infinite loop while processing the request.', category: '5xx' },
  { code: 510, title: 'Not Extended', desc: 'Further extensions to the request are required for the server to fulfill it.', category: '5xx' },
  { code: 511, title: 'Network Authentication Required', desc: 'The client needs to authenticate to gain network access (e.g., captive portal login).', category: '5xx' },
]

const CATEGORY_COLORS = {
  '1xx': { bg: 'from-sky-500/10 to-sky-600/5', border: 'border-sky-500/20', text: 'text-sky-400', badge: 'bg-sky-500/15 text-sky-400', dot: 'bg-sky-400' },
  '2xx': { bg: 'from-emerald-500/10 to-emerald-600/5', border: 'border-emerald-500/20', text: 'text-emerald-400', badge: 'bg-emerald-500/15 text-emerald-400', dot: 'bg-emerald-400' },
  '3xx': { bg: 'from-amber-500/10 to-amber-600/5', border: 'border-amber-500/20', text: 'text-amber-400', badge: 'bg-amber-500/15 text-amber-400', dot: 'bg-amber-400' },
  '4xx': { bg: 'from-rose-500/10 to-rose-600/5', border: 'border-rose-500/20', text: 'text-rose-400', badge: 'bg-rose-500/15 text-rose-400', dot: 'bg-rose-400' },
  '5xx': { bg: 'from-purple-500/10 to-purple-600/5', border: 'border-purple-500/20', text: 'text-purple-400', badge: 'bg-purple-500/15 text-purple-400', dot: 'bg-purple-400' },
}

export default function http_status_codes() {
  const [search, setSearch] = useState('')
  const [activeCategory, setActiveCategory] = useState('all')
  const categories = ['all', '1xx', '2xx', '3xx', '4xx', '5xx']

  const filtered = useMemo(() => {
    return STATUS_CODES.filter(c => {
      const matchCategory = activeCategory === 'all' || c.category === activeCategory
      const q = search.toLowerCase()
      const matchSearch = !q || c.code.toString().includes(q) || c.title.toLowerCase().includes(q) || c.desc.toLowerCase().includes(q)
      return matchCategory && matchSearch
    })
  }, [search, activeCategory])

  const categoryCounts = useMemo(() => {
    const counts = { all: STATUS_CODES.length, '1xx': 0, '2xx': 0, '3xx': 0, '4xx': 0, '5xx': 0 }
    STATUS_CODES.forEach(c => counts[c.category]++)
    return counts
  }, [])

  return (
    <ToolLayout
      title="HTTP Status Codes Reference"
      desc="Complete reference for all HTTP status codes with descriptions. Search and filter by category."
      icon="🌐" iconBg="rgba(14,165,233,0.08)"
      category="developer" slug="http-status-codes"
      faq={[
        { q: 'What are HTTP status codes?', a: 'HTTP status codes are three-digit numbers returned by a server in response to a client\'s request. They indicate whether the request was successful, redirected, or encountered an error.' },
        { q: 'What do the different categories mean?', a: '1xx = Informational, 2xx = Success, 3xx = Redirection, 4xx = Client Error, 5xx = Server Error.' },
      ]}
      howItWorks={[
        'Browse all HTTP status codes in the grid below.',
        'Use the search box to filter by code, title, or description.',
        'Click a category tab to filter by status code class (1xx-5xx).',
      ]}
      schema={{
        "@context": "https://schema.org", "@type": "SoftwareApplication",
        "name": "HTTP Status Codes Reference", "applicationCategory": "DeveloperApplication",
        "url": "https://www.uptools.in/http-status-codes/",
        "offers": { "@type": "Offer", "price": "0", "priceCurrency": "INR" }
      }}
    >
      <div className="max-w-4xl mx-auto space-y-5">
        {/* Search */}
        <div className="bg-white/[0.06] border border-white/[0.08] rounded-2xl p-4">
          <div className="relative">
            <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500 text-sm">🔍</span>
            <input value={search} onChange={e => setSearch(e.target.value)}
              placeholder="Search by code, title, or description..."
              className="w-full bg-white/[0.06] border-2 border-white/[0.08] rounded-xl pl-10 pr-4 py-3 text-white font-medium outline-none focus:border-sky-500/40 transition-all duration-200 placeholder:text-slate-500 [color-scheme:dark] text-sm" />
          </div>
        </div>

        {/* Category Tabs */}
        <div className="flex flex-wrap gap-2">
          {categories.map(cat => {
            const colors = cat === 'all' ? { badge: 'bg-slate-500/15 text-slate-400', dot: 'bg-slate-400' } : CATEGORY_COLORS[cat]
            return (
              <button key={cat} onClick={() => setActiveCategory(cat)}
                className={`px-4 py-2 rounded-xl text-xs font-bold uppercase tracking-wider transition-all duration-200 flex items-center gap-1.5 ${activeCategory === cat ? `${colors.badge} ring-1 ring-current/30` : 'bg-white/[0.04] text-slate-500 hover:bg-white/[0.08] hover:text-slate-300'}`}>
                <span className={`w-1.5 h-1.5 rounded-full ${colors.dot}`} />
                {cat === 'all' ? 'All' : cat}
                <span className="opacity-60">({categoryCounts[cat]})</span>
              </button>
            )
          })}
        </div>

        {/* Results count */}
        <div className="text-xs text-slate-500 font-medium px-1">
          Showing {filtered.length} of {STATUS_CODES.length} status codes
        </div>

        {/* Codes Grid */}
        {filtered.length > 0 ? (
          <div className="space-y-2">
            {filtered.map(item => {
              const colors = CATEGORY_COLORS[item.category]
              return (
                <div key={item.code} className={`bg-gradient-to-r ${colors.bg} border ${colors.border} rounded-xl p-4 flex items-start gap-4 transition-all duration-200 hover:scale-[1.005]`}>
                  <div className={`flex-shrink-0 w-14 h-14 rounded-xl ${colors.badge} flex items-center justify-center font-extrabold text-lg`}>
                    {item.code}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="font-bold text-white text-sm">{item.title}</span>
                      <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full ${colors.badge}`}>{item.category}</span>
                    </div>
                    <p className="text-xs text-slate-400 leading-relaxed">{item.desc}</p>
                  </div>
                </div>
              )
            })}
          </div>
        ) : (
          <div className="text-center py-16 rounded-3xl border-2 border-dashed border-white/[0.08] bg-white/[0.01]">
            <div className="text-4xl mb-3 opacity-20">🔍</div>
            <p className="text-sm text-slate-600 font-medium">No status codes match your search</p>
          </div>
        )}
      </div>
    </ToolLayout>
  )
}
