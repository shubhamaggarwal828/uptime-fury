import React, { useState } from "react";
import axios from "axios";
import { 
  Wifi, Globe, RefreshCw, AlertTriangle, ShieldCheck, 
  Terminal, CheckCircle2, Zap
} from "lucide-react";

const NSLookup = () => {
  const [domain, setDomain] = useState("google.com");
  const [loading, setLoading] = useState(false);
  const [nsResults, setNsResults] = useState(null);
  const [error, setError] = useState(null);

  const presets = ["google.com", "github.com", "cloudflare.com", "microsoft.com"];

  const runNSQuery = async (target = domain) => {
    if (!target) return;
    setLoading(true);
    setError(null);
    setNsResults(null);

    const cleanDomain = target.replace(/^https?:\/\//, '').replace(/\/.*$/, '').trim();

    try {
      const endpoint = import.meta.env.VITE_NSLOOKUP_DATA_STATS_API_ENDPOINT || "http://localhost:5012/api/nslookup";
      const res = await axios.post(endpoint, { url: cleanDomain });
      setNsResults(res.data);
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.error || err.message || "Failed to resolve Name Server authority.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-8 text-white max-w-6xl mx-auto w-full">
        
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto space-y-3">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-purple-500/10 border border-purple-500/20 text-purple-400 text-xs font-mono">
            <Wifi className="w-3.5 h-3.5" />
            AUTHORITATIVE NAME SERVER (NS) DELEGATION AUDITOR
          </div>
          <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight font-['Outfit']">
            Name Server <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-indigo-400">Authority Delegation</span>
          </h1>
          <p className="text-gray-400 text-xs sm:text-sm">
            Inspect authoritative root zone delegation records, primary and secondary nameservers, and verify SOA zone authority.
          </p>
        </div>

        {/* Input */}
        <div className="max-w-2xl mx-auto glass-panel p-3 rounded-2xl border border-white/10 shadow-[0_0_40px_-10px_rgba(168,85,247,0.15)]">
          <form 
            onSubmit={(e) => { e.preventDefault(); runNSQuery(); }}
            className="flex flex-col sm:flex-row items-center gap-2"
          >
            <div className="relative flex-1 w-full">
              <Globe className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
              <input
                type="text"
                value={domain}
                onChange={(e) => setDomain(e.target.value)}
                placeholder="Enter domain name (e.g. google.com)"
                className="w-full bg-[#0d121e]/90 text-white pl-11 pr-4 py-3.5 rounded-xl border border-white/10 focus:border-purple-500/50 focus:outline-none text-sm font-mono placeholder:text-gray-600"
              />
            </div>
            <button
              type="submit"
              disabled={loading}
              className="w-full sm:w-auto px-6 py-3.5 rounded-xl bg-purple-500 hover:bg-purple-400 text-white font-bold text-xs tracking-tight flex items-center justify-center gap-2 transition-all shadow-[0_0_20px_rgba(168,85,247,0.35)] cursor-pointer disabled:opacity-50"
            >
              {loading ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Zap className="w-4 h-4" />}
              {loading ? "Querying..." : "Audit Name Servers"}
            </button>
          </form>

          <div className="flex flex-wrap items-center gap-2 pt-3 px-2 border-t border-white/5 mt-2 text-xs text-gray-400">
            <span className="text-[11px] font-mono text-gray-500 uppercase">Presets:</span>
            {presets.map((preset) => (
              <button
                key={preset}
                type="button"
                onClick={() => { setDomain(preset); runNSQuery(preset); }}
                className="px-2.5 py-1 rounded-md bg-white/5 hover:bg-white/10 hover:text-purple-400 border border-white/5 text-[11px] font-mono transition-all"
              >
                {preset}
              </button>
            ))}
          </div>
        </div>

        {error && (
          <div className="max-w-2xl mx-auto p-4 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-xs flex items-center gap-2 font-mono">
            <AlertTriangle className="w-4 h-4 shrink-0" />
            {error}
          </div>
        )}

        {/* Results */}
        {nsResults && (
          <div className="space-y-6 max-w-4xl mx-auto">
            {/* Overview Metric Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="glass-panel p-4 rounded-xl border border-white/10">
                <span className="text-[11px] font-mono text-gray-500 uppercase">Primary Target</span>
                <p className="text-lg font-bold font-mono text-white truncate mt-1">
                  {nsResults.domain || domain}
                </p>
                <span className="text-[10px] font-mono text-purple-400">Canonical Zone</span>
              </div>
              <div className="glass-panel p-4 rounded-xl border border-white/10">
                <span className="text-[11px] font-mono text-gray-500 uppercase">Delegated Nameservers</span>
                <p className="text-xl font-bold font-mono text-purple-400 mt-1">
                  {(nsResults.nsRecords || []).length} NS Hosts
                </p>
                <span className="text-[10px] font-mono text-emerald-400">Authoritative Root Active</span>
              </div>
              <div className="glass-panel p-4 rounded-xl border border-white/10">
                <span className="text-[11px] font-mono text-gray-500 uppercase">Resolved Edge IP</span>
                <p className="text-sm font-bold font-mono text-emerald-400 truncate mt-1">
                  {nsResults.details?.address || nsResults.dnsInfo?.server || "N/A"}
                </p>
                <span className="text-[10px] font-mono text-gray-500">Anycast Routing</span>
              </div>
            </div>

            {/* Nameservers List */}
            <div className="glass-panel rounded-2xl border border-white/10 overflow-hidden shadow-2xl">
              <div className="px-6 py-4 border-b border-white/5 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Wifi className="w-4 h-4 text-purple-400" />
                  <h3 className="text-xs font-mono uppercase tracking-wider text-white font-bold">
                    Authoritative Name Server (NS) Records
                  </h3>
                </div>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-purple-500/10 text-purple-400 border border-purple-500/20">
                  DELEGATED AUTHORITY
                </span>
              </div>

              <div className="p-6 divide-y divide-white/5 font-mono">
                {Array.isArray(nsResults.nsRecords) && nsResults.nsRecords.length > 0 ? (
                  nsResults.nsRecords.map((ns, idx) => (
                    <div key={idx} className="py-3 flex items-center justify-between text-xs">
                      <div className="flex items-center gap-3">
                        <span className="text-gray-500 text-[11px]">#{idx + 1}</span>
                        <span className="px-2 py-0.5 rounded bg-purple-500/10 border border-purple-500/20 text-purple-300 font-bold text-[11px]">
                          NS
                        </span>
                        <span className="text-white font-semibold text-sm">
                          {typeof ns === 'string' ? ns : (ns.host || JSON.stringify(ns))}
                        </span>
                      </div>
                      <span className="text-emerald-400 text-[11px] flex items-center gap-1.5 shrink-0 ml-4">
                        <CheckCircle2 className="w-3.5 h-3.5" /> DELEGATED
                      </span>
                    </div>
                  ))
                ) : (
                  <div className="text-xs text-gray-400 py-2">
                    No NS records found for this domain.
                  </div>
                )}
              </div>
            </div>

            {/* IP Endpoint Telemetry */}
            {nsResults.dnsInfo && (
              <div className="glass-panel rounded-xl border border-white/10 p-5 space-y-3 font-mono text-xs">
                <div className="flex items-center gap-2 pb-2 border-b border-white/5">
                  <Terminal className="w-4 h-4 text-cyan-400" />
                  <h4 className="text-xs font-bold text-white uppercase tracking-wider">
                    Zone Endpoint Bindings & Telemetry
                  </h4>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-1">
                  <div>
                    <span className="text-gray-500 text-[11px] block mb-1">IPv4 Endpoint Bindings:</span>
                    <div className="space-y-1">
                      {(nsResults.dnsInfo.ipv4Addresses || []).length > 0 ? (
                        nsResults.dnsInfo.ipv4Addresses.map((ip, i) => (
                          <div key={i} className="px-2.5 py-1.5 rounded bg-white/5 border border-white/5 text-cyan-300">
                            {ip}
                          </div>
                        ))
                      ) : (
                        <div className="text-gray-500 italic">None detected</div>
                      )}
                    </div>
                  </div>

                  <div>
                    <span className="text-gray-500 text-[11px] block mb-1">IPv6 Endpoint Bindings:</span>
                    <div className="space-y-1">
                      {(nsResults.dnsInfo.ipv6Addresses || []).length > 0 ? (
                        nsResults.dnsInfo.ipv6Addresses.map((ip, i) => (
                          <div key={i} className="px-2.5 py-1.5 rounded bg-white/5 border border-white/5 text-purple-300">
                            {ip}
                          </div>
                        ))
                      ) : (
                        <div className="text-gray-500 italic">None detected</div>
                      )}
                    </div>
                  </div>
                </div>

                <div className="pt-2 text-[10px] text-gray-500 flex justify-between items-center border-t border-white/5">
                  <span>Resolver Intercept: {nsResults.dnsInfo.server || "System Local"}</span>
                  <span>Timestamp: {nsResults.timestamp || new Date().toISOString()}</span>
                </div>
              </div>
            )}
          </div>
        )}

      </div>
  );
};

export default NSLookup;
