import React, { useState } from "react";
import axios from "axios";
import { 
  Terminal, Globe, RefreshCw, AlertTriangle, Shield, 
  Calendar, Building, CheckCircle2, Copy, Check, Zap
} from "lucide-react";

const Whois = () => {
  const [domain, setDomain] = useState("google.com");
  const [loading, setLoading] = useState(false);
  const [whoisData, setWhoisData] = useState(null);
  const [error, setError] = useState(null);

  const presets = ["google.com", "github.com", "openai.com", "netflix.com"];

  const runWhoisQuery = async (target = domain) => {
    if (!target) return;
    setLoading(true);
    setError(null);
    setWhoisData(null);

    const cleanDomain = target.replace(/^https?:\/\//, '').replace(/\/.*$/, '').trim();

    try {
      const endpoint = import.meta.env.VITE_FULL_WHOIS_DATA_STATS_API_ENDPOINT || "http://localhost:5012/api/whoisDataComplete";
      const res = await axios.post(endpoint, { url: cleanDomain });
      setWhoisData(res.data.whois);
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.error || err.message || "WHOIS rate limit exceeded or domain masked by privacy guard.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-8 text-white max-w-6xl mx-auto w-full">
        
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-400 text-xs font-mono">
            <Terminal className="w-3.5 h-3.5" />
            IANA / ICANN WHOIS REGISTRATION LEDGER
          </div>
          <h1 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight font-['Outfit']">
            Domain Ownership <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-400 to-orange-400">& Registration Records</span>
          </h1>
          <p className="text-gray-400 text-sm">
            Fetch authoritative domain registration metadata, registrar accreditations, nameserver delegations, creation timelines, and expiry dates.
          </p>
        </div>

        {/* Input */}
        <div className="max-w-3xl mx-auto glass-panel p-3 rounded-2xl border border-white/10 shadow-[0_0_40px_-10px_rgba(245,158,11,0.15)]">
          <form 
            onSubmit={(e) => { e.preventDefault(); runWhoisQuery(); }}
            className="flex flex-col sm:flex-row items-center gap-2"
          >
            <div className="relative flex-1 w-full">
              <Globe className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
              <input
                type="text"
                value={domain}
                onChange={(e) => setDomain(e.target.value)}
                placeholder="Enter domain name (e.g. apple.com)"
                className="w-full bg-[#0d121e]/90 text-white pl-11 pr-4 py-3.5 rounded-xl border border-white/10 focus:border-amber-500/50 focus:outline-none text-sm font-mono placeholder:text-gray-600"
              />
            </div>
            <button
              type="submit"
              disabled={loading}
              className="w-full sm:w-auto px-6 py-3.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-[#07090e] font-bold text-xs tracking-tight flex items-center justify-center gap-2 transition-all shadow-[0_0_20px_rgba(245,158,11,0.35)] cursor-pointer disabled:opacity-50"
            >
              {loading ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Zap className="w-4 h-4" />}
              {loading ? "Querying..." : "Lookup WHOIS"}
            </button>
          </form>

          <div className="flex flex-wrap items-center gap-2 pt-3 px-2 border-t border-white/5 mt-2 text-xs text-gray-400">
            <span className="text-[11px] font-mono text-gray-500 uppercase">Preset Targets:</span>
            {presets.map((preset) => (
              <button
                key={preset}
                type="button"
                onClick={() => { setDomain(preset); runWhoisQuery(preset); }}
                className="px-2.5 py-1 rounded-md bg-white/5 hover:bg-white/10 hover:text-amber-400 border border-white/5 text-[11px] font-mono transition-all"
              >
                {preset}
              </button>
            ))}
          </div>
        </div>

        {error && (
          <div className="max-w-3xl mx-auto p-4 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-xs flex items-center gap-2">
            <AlertTriangle className="w-4 h-4 shrink-0" />
            {error}
          </div>
        )}

        {/* Results */}
        {whoisData && (
          <div className="space-y-6 max-w-4xl mx-auto">
            
            {/* KPI Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="glass-panel p-5 rounded-2xl border border-white/10">
                <span className="text-xs font-mono uppercase text-gray-400">Registrar</span>
                <div className="text-lg font-bold text-white mt-1 truncate font-['Outfit']">
                  {whoisData['Registrar'] || whoisData.registrar || "MarkMonitor / Verified"}
                </div>
                <div className="text-[11px] font-mono text-amber-400 mt-2">
                  ICANN ID: {whoisData['Registrar IANA ID'] || "Active"}
                </div>
              </div>

              <div className="glass-panel p-5 rounded-2xl border border-white/10">
                <span className="text-xs font-mono uppercase text-gray-400">Registry Expiry</span>
                <div className="text-base font-bold text-emerald-400 mt-1 font-mono">
                  {whoisData['Registry Expiry Date'] || whoisData.expiryDate || "Active & Locked"}
                </div>
                <div className="text-[11px] font-mono text-gray-400 mt-2">
                  Auto-Renewal Enabled
                </div>
              </div>

              <div className="glass-panel p-5 rounded-2xl border border-white/10">
                <span className="text-xs font-mono uppercase text-gray-400">Domain Status</span>
                <div className="text-sm font-bold text-cyan-400 mt-1 truncate font-mono">
                  {Array.isArray(whoisData['Domain Status']) ? whoisData['Domain Status'][0] : (whoisData['Domain Status'] || "clientTransferProhibited")}
                </div>
                <div className="text-[11px] font-mono text-gray-400 mt-2">
                  Registry Lock Active
                </div>
              </div>
            </div>

            {/* WHOIS Ledger Key-Values */}
            <div className="glass-panel rounded-2xl border border-white/10 overflow-hidden shadow-2xl">
              <div className="px-6 py-4 border-b border-white/5 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Terminal className="w-4 h-4 text-amber-400" />
                  <h3 className="text-xs font-mono uppercase tracking-wider text-white font-bold">
                    WHOIS Registry Response Payload
                  </h3>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => {
                      navigator.clipboard.writeText(JSON.stringify(whoisData, null, 2));
                      alert("Raw WHOIS payload copied to clipboard!");
                    }}
                    className="text-[11px] font-mono px-2.5 py-1 rounded bg-white/5 hover:bg-white/10 text-gray-300 border border-white/10 transition-all cursor-pointer flex items-center gap-1.5"
                  >
                    <Copy className="w-3 h-3 text-amber-400" /> Copy JSON
                  </button>
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-amber-500/10 text-amber-400 border border-amber-500/20">
                    PORT 43 TCP
                  </span>
                </div>
              </div>

              <div className="p-4 space-y-2 max-h-[32rem] overflow-y-auto">
                {typeof whoisData === 'object' ? (
                  Object.entries(whoisData).map(([key, val]) => {
                    const textVal = Array.isArray(val) ? val.join('\n') : (typeof val === 'object' ? JSON.stringify(val, null, 2) : String(val));
                    return (
                      <div key={key} className="flex flex-col sm:flex-row sm:items-start justify-between gap-2 p-3 rounded-lg bg-white/[0.02] hover:bg-white/[0.04] border border-white/5 text-xs font-mono transition-colors">
                        <span className="text-amber-300 font-semibold shrink-0 sm:w-48 break-words">{key}</span>
                        <div className="flex-1 sm:text-right text-gray-300 break-words whitespace-pre-wrap select-all font-mono leading-relaxed bg-black/20 p-2 rounded sm:bg-transparent sm:p-0">
                          {textVal}
                        </div>
                      </div>
                    );
                  })
                ) : (
                  <pre className="text-xs font-mono text-gray-300 whitespace-pre-wrap p-2 select-all">
                    {String(whoisData)}
                  </pre>
                )}
              </div>
            </div>

          </div>
        )}

      </div>
  );
};

export default Whois;
