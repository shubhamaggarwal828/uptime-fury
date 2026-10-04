import React, { useState } from "react";
import axios from "axios";
import { 
  Globe, RefreshCw, AlertTriangle, CheckCircle2, 
  XCircle, Zap, Terminal, Database, ArrowRight, Layers
} from "lucide-react";
import { getActiveBackendUrl } from "../utils/apiConfig";

const DNSPropagation = () => {
  const [domain, setDomain] = useState("google.com");
  const [recordType, setRecordType] = useState("A");
  const [loading, setLoading] = useState(false);
  const [propResult, setPropResult] = useState(null);
  const [error, setError] = useState(null);

  const supportedTypes = ['A', 'AAAA', 'MX', 'NS', 'CNAME', 'TXT'];
  const presets = ["google.com", "github.com", "cloudflare.com", "microsoft.com"];

  const runPropagationQuery = async (queryDomain = domain, queryType = recordType) => {
    if (!queryDomain) return;
    setLoading(true);
    setError(null);
    setPropResult(null);

    const cleanDomain = queryDomain.replace(/^https?:\/\//, '').replace(/\/.*$/, '').trim();

    try {
      const endpoint = `${getActiveBackendUrl()}/api/propagation`;
      const res = await axios.post(endpoint, { domain: cleanDomain, type: queryType });
      setPropResult(res.data);
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.error || err.message || "Failed to query global DNS resolvers.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-8 text-white max-w-6xl mx-auto w-full">
      
      {/* Title */}
      <div className="text-center max-w-3xl mx-auto space-y-3">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-teal-500/10 border border-teal-500/20 text-teal-400 text-xs font-mono">
          <Layers className="w-3.5 h-3.5" />
          GLOBAL ANYCAST RECURSIVE RESOLVER COMPARISON
        </div>
        <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight font-['Outfit']">
          DNS Propagation & <span className="text-transparent bg-clip-text bg-gradient-to-r from-teal-400 to-cyan-400">Consensus Matrix</span>
        </h1>
        <p className="text-gray-400 text-xs sm:text-sm">
          Simultaneously query 8 global recursive anycast resolvers (Google, Cloudflare, Quad9, OpenDNS, AdGuard, Level3, Comodo, DNS.WATCH) to verify record propagation and cache consistency.
        </p>
      </div>

      {/* Input */}
      <div className="glass-panel p-4 rounded-2xl border border-white/10 shadow-[0_0_40px_-10px_rgba(20,184,166,0.15)] max-w-3xl mx-auto space-y-3">
        <form 
          onSubmit={(e) => { e.preventDefault(); runPropagationQuery(); }}
          className="flex flex-col sm:flex-row items-center gap-2"
        >
          <div className="relative flex-1 w-full">
            <Globe className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
            <input
              type="text"
              value={domain}
              onChange={(e) => setDomain(e.target.value)}
              placeholder="Enter domain (e.g. google.com)"
              className="w-full bg-[#0d121e]/90 text-white pl-11 pr-4 py-3.5 rounded-xl border border-white/10 focus:border-teal-500/50 focus:outline-none text-sm font-mono placeholder:text-gray-600"
            />
          </div>
          <button
            type="submit"
            disabled={loading}
            className="w-full sm:w-auto px-6 py-3.5 rounded-xl bg-teal-500 hover:bg-teal-400 text-[#07090e] font-bold text-xs tracking-tight flex items-center justify-center gap-2 transition-all shadow-[0_0_20px_rgba(20,184,166,0.35)] cursor-pointer disabled:opacity-50 font-mono"
          >
            {loading ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Zap className="w-4 h-4" />}
            {loading ? "Querying 8 Resolvers..." : "Check Global Propagation"}
          </button>
        </form>

        {/* Record Type Pills */}
        <div className="flex flex-wrap items-center gap-1.5 pt-2 border-t border-white/5">
          <span className="text-[11px] font-mono text-gray-500 uppercase mr-2">Record Type:</span>
          {supportedTypes.map((type) => (
            <button
              key={type}
              type="button"
              onClick={() => {
                setRecordType(type);
                runPropagationQuery(domain, type);
              }}
              className={`px-3 py-1 rounded-lg text-xs font-mono font-bold transition-all ${
                recordType === type
                  ? "bg-teal-500 text-[#07090e] shadow-[0_0_12px_rgba(20,184,166,0.4)]"
                  : "bg-white/5 text-gray-400 hover:text-white hover:bg-white/10 border border-white/5"
              }`}
            >
              {type}
            </button>
          ))}
        </div>

        <div className="flex flex-wrap items-center gap-2 pt-2 border-t border-white/5 text-xs text-gray-400">
          <span className="text-[11px] font-mono text-gray-500 uppercase">Presets:</span>
          {presets.map((preset) => (
            <button
              key={preset}
              type="button"
              onClick={() => { setDomain(preset); runPropagationQuery(preset, recordType); }}
              className="px-2.5 py-1 rounded-md bg-white/5 hover:bg-white/10 hover:text-teal-400 border border-white/5 text-[11px] font-mono transition-all"
            >
              {preset}
            </button>
          ))}
        </div>
      </div>

      {error && (
        <div className="p-4 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-xs flex items-center gap-2 font-mono max-w-3xl mx-auto">
          <AlertTriangle className="w-4 h-4 shrink-0" />
          {error}
        </div>
      )}

      {/* Results */}
      {propResult && (
        <div className="space-y-6">
          
          {/* Top KPI Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="glass-panel p-5 rounded-2xl border border-white/10">
              <span className="text-xs font-mono uppercase text-gray-400">Consensus Rate</span>
              <div className="text-3xl font-extrabold text-emerald-400 mt-1 font-['Outfit']">
                {propResult.consensusRate}
              </div>
              <div className="text-[11px] font-mono text-gray-400 mt-2">
                Resolvers Successfully Returning Records
              </div>
            </div>

            <div className="glass-panel p-5 rounded-2xl border border-white/10">
              <span className="text-xs font-mono uppercase text-gray-400">Zone Uniformity</span>
              <div className="text-xl font-bold text-white mt-1 font-mono flex items-center gap-2">
                {propResult.isConsistent ? (
                  <span className="text-emerald-400 flex items-center gap-1.5">
                    <CheckCircle2 className="w-5 h-5" /> SYNCHRONIZED
                  </span>
                ) : (
                  <span className="text-cyan-400 flex items-center gap-1.5">
                    <Layers className="w-5 h-5" /> ANYCAST POOL ({propResult.uniqueOutputsCount} IPs)
                  </span>
                )}
              </div>
              <div className="text-[11px] font-mono text-gray-500 mt-2">
                Record Type: {propResult.recordType}
              </div>
            </div>

            <div className="glass-panel p-5 rounded-2xl border border-white/10">
              <span className="text-xs font-mono uppercase text-gray-400">Total Probed</span>
              <div className="text-3xl font-extrabold text-white mt-1 font-['Outfit']">
                {propResult.results.length} Nodes
              </div>
              <div className="text-[11px] font-mono text-gray-400 mt-2">
                Across 8 Independent Anycast Networks
              </div>
            </div>
          </div>

          {/* Resolvers Comparison Table */}
          <div className="glass-panel rounded-2xl border border-white/10 overflow-hidden shadow-2xl">
            <div className="px-6 py-4 border-b border-white/5 flex items-center justify-between">
              <h3 className="text-xs font-mono uppercase tracking-wider text-white font-bold flex items-center gap-2">
                <Database className="w-3.5 h-3.5 text-teal-400" />
                Global Anycast Resolver Matrix ({propResult.results.length} Locations)
              </h3>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs font-mono">
                <thead className="bg-white/[0.02] text-gray-400 border-b border-white/5 uppercase text-[10px]">
                  <tr>
                    <th className="px-6 py-3">Resolver Name</th>
                    <th className="px-6 py-3">Server IP</th>
                    <th className="px-6 py-3">Region / Network</th>
                    <th className="px-6 py-3">Latency</th>
                    <th className="px-6 py-3">Returned Records</th>
                    <th className="px-6 py-3 text-right">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  {propResult.results.map((r, idx) => {
                    const isSuccess = r.status === "RESOLVED";

                    return (
                      <tr key={idx} className="hover:bg-white/[0.02] transition-colors">
                        <td className="px-6 py-3.5 font-bold text-white">
                          {r.name}
                        </td>
                        <td className="px-6 py-3.5 text-cyan-300">
                          {r.ip}
                        </td>
                        <td className="px-6 py-3.5 text-gray-400">
                          {r.region}
                        </td>
                        <td className="px-6 py-3.5 text-gray-300">
                          {r.latency}
                        </td>
                        <td className="px-6 py-3.5 max-w-xs break-all">
                          {isSuccess && r.records.length > 0 ? (
                            <div className="flex flex-wrap gap-1">
                              {r.records.map((rec, i) => (
                                <span key={i} className="px-2 py-0.5 rounded bg-white/5 text-teal-300 text-[11px] border border-white/5">
                                  {rec}
                                </span>
                              ))}
                            </div>
                          ) : (
                            <span className="text-gray-500 italic">No records returned</span>
                          )}
                        </td>
                        <td className="px-6 py-3.5 text-right">
                          <span className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-bold border ${
                            isSuccess 
                              ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/20" 
                              : "bg-red-500/10 text-red-400 border-red-500/20"
                          }`}>
                            <span className={`w-1.5 h-1.5 rounded-full ${isSuccess ? "bg-emerald-400" : "bg-red-400"}`} />
                            {r.status}
                          </span>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>

        </div>
      )}

    </div>
  );
};

export default DNSPropagation;
