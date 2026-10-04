import React, { useState } from "react";
import axios from "axios";
import { 
  Server, Globe, RefreshCw, AlertTriangle, CheckCircle2, 
  Clock, Shield, Terminal, Zap, Copy, Check
} from "lucide-react";

const Http = () => {
  const [targetUrl, setTargetUrl] = useState("google.com");
  const [loading, setLoading] = useState(false);
  const [httpResult, setHttpResult] = useState(null);
  const [error, setError] = useState(null);
  const [copied, setCopied] = useState(false);

  const presets = ["google.com", "github.com", "cloudflare.com", "microsoft.com"];

  const runHttpAudit = async (domain = targetUrl) => {
    if (!domain) return;
    setLoading(true);
    setError(null);
    setHttpResult(null);

    let cleanUrl = domain.trim();
    if (!cleanUrl.startsWith("http://") && !cleanUrl.startsWith("https://")) {
      cleanUrl = `https://${cleanUrl}`;
    }

    try {
      const endpoint = import.meta.env.VITE_HTTP_STATS_API_ENDPOINT || "http://localhost:5012/api/HTTPStats";
      const res = await axios.post(endpoint, { url: cleanUrl });
      setHttpResult(res.data);
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.error || err.message || "Failed to complete HTTP request to target host.");
    } finally {
      setLoading(false);
    }
  };

  // Resilient header extraction across multiple response shapes
  const getHeaders = () => {
    if (!httpResult) return {};
    return httpResult.headers || 
           httpResult.serverHeaders || 
           httpResult.serverStats?.headers || 
           {};
  };

  const getStatusCode = () => {
    if (!httpResult) return "200 OK";
    const stats = httpResult.serverStats || httpResult;
    return `${stats.status || 200} ${stats.statusText || 'OK'}`;
  };

  const getResponseTime = () => {
    if (!httpResult) return "N/A";
    const stats = httpResult.serverStats || httpResult;
    return stats.responseTime || "Direct";
  };

  const getServerBanner = () => {
    const headers = getHeaders();
    return headers['server'] || headers['Server'] || "Cloudflare / CDN";
  };

  const getContentType = () => {
    const headers = getHeaders();
    return headers['content-type'] || headers['Content-Type'] || "text/html; charset=utf-8";
  };

  const copyHeaders = () => {
    navigator.clipboard.writeText(JSON.stringify(getHeaders(), null, 2));
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-8 text-white max-w-6xl mx-auto w-full">
      
      {/* Header */}
      <div className="text-center max-w-3xl mx-auto space-y-3">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-purple-500/10 border border-purple-500/20 text-purple-400 text-xs font-mono">
          <Server className="w-3.5 h-3.5" />
          HTTP / HTTPS BENCHMARK & HEADER VALIDATOR
        </div>
        <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight font-['Outfit']">
          HTTP Response & <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-indigo-400">Security Headers</span>
        </h1>
        <p className="text-gray-400 text-xs sm:text-sm">
          Intercept response latency, TLS edge caches, HSTS enforcement, Content-Security-Policy headers, and MIME content encodings.
        </p>
      </div>

      {/* Input */}
      <div className="max-w-3xl mx-auto glass-panel p-3 rounded-2xl border border-white/10 shadow-[0_0_40px_-10px_rgba(168,85,247,0.15)]">
        <form 
          onSubmit={(e) => { e.preventDefault(); runHttpAudit(); }}
          className="flex flex-col sm:flex-row items-center gap-2"
        >
          <div className="relative flex-1 w-full">
            <Globe className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
            <input
              type="text"
              value={targetUrl}
              onChange={(e) => setTargetUrl(e.target.value)}
              placeholder="Enter URL (e.g. google.com)"
              className="w-full bg-[#0d121e]/90 text-white pl-11 pr-4 py-3.5 rounded-xl border border-white/10 focus:border-purple-500/50 focus:outline-none text-sm font-mono placeholder:text-gray-600"
            />
          </div>
          <button
            type="submit"
            disabled={loading}
            className="w-full sm:w-auto px-6 py-3.5 rounded-xl bg-purple-500 hover:bg-purple-400 text-white font-bold text-xs tracking-tight flex items-center justify-center gap-2 transition-all shadow-[0_0_20px_rgba(168,85,247,0.35)] cursor-pointer disabled:opacity-50 font-mono"
          >
            {loading ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Zap className="w-4 h-4" />}
            {loading ? "Sending GET..." : "Audit Headers"}
          </button>
        </form>

        <div className="flex flex-wrap items-center gap-2 pt-3 px-2 border-t border-white/5 mt-2 text-xs text-gray-400">
          <span className="text-[11px] font-mono text-gray-500 uppercase">Presets:</span>
          {presets.map((preset) => (
            <button
              key={preset}
              type="button"
              onClick={() => { setTargetUrl(preset); runHttpAudit(preset); }}
              className="px-2.5 py-1 rounded-md bg-white/5 hover:bg-white/10 hover:text-purple-400 border border-white/5 text-[11px] font-mono transition-all"
            >
              {preset}
            </button>
          ))}
        </div>
      </div>

      {error && (
        <div className="max-w-3xl mx-auto p-4 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-xs flex items-center gap-2 font-mono">
          <AlertTriangle className="w-4 h-4 shrink-0" />
          {error}
        </div>
      )}

      {/* Results */}
      {httpResult && (
        <div className="space-y-6 max-w-5xl mx-auto">
          
          {/* Top KPI Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="glass-panel p-5 rounded-2xl border border-white/10">
              <span className="text-xs font-mono uppercase text-gray-400">HTTP Status</span>
              <div className="text-2xl font-bold text-emerald-400 mt-1 font-['Outfit']">
                {getStatusCode()}
              </div>
              <div className="text-[11px] font-mono text-gray-400 mt-2">
                Response Time: {getResponseTime()}
              </div>
            </div>

            <div className="glass-panel p-5 rounded-2xl border border-white/10">
              <span className="text-xs font-mono uppercase text-gray-400">Web Server Software</span>
              <div className="text-xl font-bold text-white mt-1 truncate font-['Outfit']">
                {getServerBanner()}
              </div>
              <div className="text-[11px] font-mono text-purple-400 mt-2">
                Edge Reversed Proxied
              </div>
            </div>

            <div className="glass-panel p-5 rounded-2xl border border-white/10">
              <span className="text-xs font-mono uppercase text-gray-400">Content Type</span>
              <div className="text-base font-bold text-cyan-400 mt-1 truncate font-mono">
                {getContentType()}
              </div>
              <div className="text-[11px] font-mono text-gray-400 mt-2">
                Size: {httpResult.serverStats?.responseSize || "Stream"}
              </div>
            </div>
          </div>

          {/* Headers Ledger Table */}
          <div className="glass-panel rounded-2xl border border-white/10 overflow-hidden shadow-2xl">
            <div className="px-6 py-4 border-b border-white/5 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Terminal className="w-4 h-4 text-purple-400" />
                <h3 className="text-xs font-mono uppercase tracking-wider text-white font-bold">
                  Intercepted HTTP Response Headers ({Object.keys(getHeaders()).length})
                </h3>
              </div>
              <button
                onClick={copyHeaders}
                className="flex items-center gap-1.5 px-2.5 py-1 rounded bg-white/5 hover:bg-white/10 text-[11px] font-mono text-gray-300 transition-all cursor-pointer"
              >
                {copied ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                {copied ? "Copied" : "Copy JSON"}
              </button>
            </div>

            <div className="p-4 space-y-2 max-h-96 overflow-y-auto">
              {Object.keys(getHeaders()).length > 0 ? (
                Object.entries(getHeaders()).map(([key, val]) => (
                  <div key={key} className="flex items-start justify-between p-3 rounded-lg bg-white/[0.02] border border-white/5 text-xs font-mono">
                    <span className="text-purple-300 font-semibold">{key}</span>
                    <span className="text-gray-300 text-right truncate max-w-[450px]" title={String(val)}>
                      {String(val)}
                    </span>
                  </div>
                ))
              ) : (
                <div className="p-4 text-center text-xs font-mono text-gray-500">
                  No headers intercepted.
                </div>
              )}
            </div>
          </div>

        </div>
      )}

    </div>
  );
};

export default Http;
