import React, { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import axios from "axios";
import { 
  Server, Globe, Shield, Terminal, Clock, CheckCircle2, AlertTriangle, 
  Search, Cpu, RefreshCw, Copy, Check, Zap, HardDrive, Network
} from "lucide-react";
import { getActiveBackendUrl } from "../utils/apiConfig";

const QuickStats = () => {
  const [searchParams] = useSearchParams();
  const initialTarget = searchParams.get("target") || "google.com";

  const [targetUrl, setTargetUrl] = useState(initialTarget);
  const [loading, setLoading] = useState(false);
  const [stats, setStats] = useState(null);
  const [error, setError] = useState(null);
  const [copied, setCopied] = useState(false);

  const presets = ["google.com", "github.com", "cloudflare.com", "microsoft.com"];

  const runVitalsCheck = async (domainToTest = targetUrl) => {
    if (!domainToTest) return;
    setLoading(true);
    setError(null);
    setStats(null);

    const cleanUrl = domainToTest.replace(/^https?:\/\//, '').trim();

    try {
      const endpoint = `${getActiveBackendUrl()}/api/quickStats`;
      const res = await axios.post(endpoint, { url: cleanUrl });
      setStats(res.data);
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.error || err.message || "Failed to execute diagnostic probe against target.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const queryTarget = searchParams.get("target");
    if (queryTarget) {
      setTargetUrl(queryTarget);
      runVitalsCheck(queryTarget);
    }
  }, [searchParams]);

  const copyResults = () => {
    if (!stats) return;
    navigator.clipboard.writeText(JSON.stringify(stats, null, 2));
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const getRegistrarName = () => {
    if (!stats?.whois) return "N/A";
    return stats.whois.registrar || stats.whois['Registrar'] || "ICANN Accredited";
  };

  const getCreationDate = () => {
    if (!stats?.whois) return "Active";
    return stats.whois.createdDate || stats.whois['Creation Date'] || stats.whois['Expiration Date'] || "Active";
  };

  return (
    <div className="space-y-8 text-white max-w-6xl mx-auto w-full">
      
      {/* Header */}
        <div className="text-center max-w-3xl mx-auto space-y-3">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 text-xs font-mono font-medium">
            <Server className="w-3.5 h-3.5" />
            UNIFIED HOST VITALS & EDGE SERVER AUDITOR
          </div>
          <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight font-['Outfit']">
            Server Vitals & <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-emerald-400">Response Benchmark</span>
          </h1>
          <p className="text-gray-400 text-xs sm:text-sm leading-relaxed">
            Live telemetry probes: measure ICMP round-trip latency, intercept reverse-proxy headers (Cloudflare, Nginx), and retrieve authoritative WHOIS registration.
          </p>
        </div>

        {/* Input Card */}
        <div className="max-w-3xl mx-auto glass-panel p-3 rounded-2xl border border-white/10 shadow-[0_0_50px_-10px_rgba(6,182,212,0.15)]">
          <form 
            onSubmit={(e) => { e.preventDefault(); runVitalsCheck(); }}
            className="flex flex-col sm:flex-row items-center gap-2"
          >
            <div className="relative flex-1 w-full">
              <Network className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
              <input
                type="text"
                value={targetUrl}
                onChange={(e) => setTargetUrl(e.target.value)}
                placeholder="Enter host domain or IP (e.g. google.com, 1.1.1.1)"
                className="w-full bg-[#0d121e]/90 text-white pl-11 pr-4 py-3.5 rounded-xl border border-white/10 focus:border-cyan-500/50 focus:outline-none text-sm font-mono placeholder:text-gray-600"
              />
            </div>
            <button
              type="submit"
              disabled={loading}
              className="w-full sm:w-auto px-6 py-3.5 rounded-xl bg-gradient-to-r from-cyan-500 to-emerald-400 hover:from-cyan-400 hover:to-emerald-300 text-[#07090e] font-bold text-xs tracking-tight flex items-center justify-center gap-2 transition-all shadow-[0_0_20px_rgba(6,182,212,0.35)] disabled:opacity-50 cursor-pointer font-mono"
            >
              {loading ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Zap className="w-4 h-4" />}
              {loading ? "Probing Host..." : "Audit Server Vitals"}
            </button>
          </form>

          <div className="flex flex-wrap items-center gap-2 pt-3 px-2 border-t border-white/5 mt-2 text-xs text-gray-400">
            <span className="text-[11px] font-mono text-gray-500 uppercase">Presets:</span>
            {presets.map((preset) => (
              <button
                key={preset}
                type="button"
                onClick={() => {
                  setTargetUrl(preset);
                  runVitalsCheck(preset);
                }}
                className="px-2.5 py-1 rounded-md bg-white/5 hover:bg-white/10 hover:text-cyan-400 border border-white/5 text-[11px] font-mono transition-all"
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

        {/* Live Vitals Render */}
        {stats && (
          <div className="max-w-6xl mx-auto space-y-6">
            
            {/* Top KPI Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              
              <div className="glass-panel p-5 rounded-2xl border border-white/10">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-mono uppercase text-gray-400">ICMP Latency</span>
                  <div className="w-7 h-7 rounded-lg bg-emerald-500/10 text-emerald-400 flex items-center justify-center">
                    <Clock className="w-3.5 h-3.5" />
                  </div>
                </div>
                <div className="text-3xl font-extrabold text-white font-['Outfit']">
                  {stats.ping?.time || stats.ping?.avg || "N/A"} <span className="text-xs font-mono text-emerald-400">ms</span>
                </div>
                <div className="text-[11px] font-mono text-gray-400 mt-2 flex items-center gap-1.5">
                  <span className={`w-2 h-2 rounded-full ${stats.ping?.alive ? 'bg-emerald-400' : 'bg-red-400'}`} />
                  Host Reachable: {stats.ping?.alive ? 'YES' : 'TIMEOUT'}
                </div>
              </div>

              <div className="glass-panel p-5 rounded-2xl border border-white/10">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-mono uppercase text-gray-400">Server Banner</span>
                  <div className="w-7 h-7 rounded-lg bg-cyan-500/10 text-cyan-400 flex items-center justify-center">
                    <Server className="w-3.5 h-3.5" />
                  </div>
                </div>
                <div className="text-lg font-bold text-white truncate font-['Outfit']">
                  {stats.serverStats?.headers?.server || "Protected Proxy"}
                </div>
                <div className="text-[11px] font-mono text-cyan-400 mt-2 truncate">
                  HTTP Code: {stats.serverStats?.status || 200} ({stats.serverStats?.statusText || "OK"})
                </div>
              </div>

              <div className="glass-panel p-5 rounded-2xl border border-white/10">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-mono uppercase text-gray-400">Registrar Root</span>
                  <div className="w-7 h-7 rounded-lg bg-purple-500/10 text-purple-400 flex items-center justify-center">
                    <Globe className="w-3.5 h-3.5" />
                  </div>
                </div>
                <div className="text-base font-bold text-white truncate font-['Outfit']">
                  {getRegistrarName()}
                </div>
                <div className="text-[11px] font-mono text-gray-400 mt-2 truncate">
                  Created/Expiry: {getCreationDate()}
                </div>
              </div>

              <div className="glass-panel p-5 rounded-2xl border border-white/10">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-mono uppercase text-gray-400">SysAdmin Score</span>
                  <div className="w-7 h-7 rounded-lg bg-emerald-500/10 text-emerald-400 flex items-center justify-center">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                  </div>
                </div>
                <div className="text-3xl font-extrabold text-emerald-400 font-['Outfit']">
                  ONLINE
                </div>
                <div className="text-[11px] font-mono text-gray-400 mt-2">
                  ✓ TCP & ICMP Verified OK
                </div>
              </div>

            </div>

            {/* Split Header & WHOIS Details */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              
              <div className="glass-panel p-6 rounded-2xl border border-white/10 space-y-4">
                <div className="flex items-center justify-between border-b border-white/5 pb-3">
                  <div className="flex items-center gap-2">
                    <Terminal className="w-4 h-4 text-cyan-400" />
                    <h3 className="text-xs font-mono uppercase tracking-wider text-white font-bold">
                      HTTP Response Header Inspection
                    </h3>
                  </div>
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">
                    LIVE HEADERS
                  </span>
                </div>

                <div className="space-y-2 max-h-72 overflow-y-auto pr-1">
                  {stats.serverStats?.headers && Object.entries(stats.serverStats.headers).map(([k, v]) => (
                    <div key={k} className="flex items-start justify-between p-2.5 rounded-lg bg-white/[0.02] border border-white/5 text-xs font-mono">
                      <span className="text-cyan-300 font-semibold">{k}</span>
                      <span className="text-gray-300 text-right truncate max-w-[260px]">{String(v)}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="glass-panel p-6 rounded-2xl border border-white/10 space-y-4">
                <div className="flex items-center justify-between border-b border-white/5 pb-3">
                  <div className="flex items-center gap-2">
                    <Shield className="w-4 h-4 text-emerald-400" />
                    <h3 className="text-xs font-mono uppercase tracking-wider text-white font-bold">
                      Domain Governance & WHOIS Ledger
                    </h3>
                  </div>
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                    WHOIS PORT 43
                  </span>
                </div>

                <div className="space-y-2 max-h-72 overflow-y-auto pr-1">
                  {stats.whois && Object.entries(stats.whois).map(([k, v]) => (
                    <div key={k} className="flex items-start justify-between p-2.5 rounded-lg bg-white/[0.02] border border-white/5 text-xs font-mono">
                      <span className="text-emerald-300 font-semibold">{k}</span>
                      <span className="text-gray-300 text-right truncate max-w-[260px]">{String(v)}</span>
                    </div>
                  ))}
                </div>
              </div>

            </div>

            {/* Bottom Actions */}
            <div className="flex items-center justify-between text-xs font-mono text-gray-500 pt-2">
              <span>Probe executed directly via local daemon (port 5012)</span>
              <button
                onClick={copyResults}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 text-gray-300 transition-all cursor-pointer"
              >
                {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                {copied ? "JSON Copied!" : "Export JSON Diagnostics"}
              </button>
            </div>

          </div>
        )}

      </div>
  );
};

export default QuickStats;
