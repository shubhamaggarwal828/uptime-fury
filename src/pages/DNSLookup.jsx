import React, { useState } from "react";
import axios from "axios";
import { 
  Globe, Search, RefreshCw, AlertTriangle, Database, 
  Terminal, Shield, CheckCircle2, Copy, Check, Zap, ArrowRight
} from "lucide-react";

const DNSLookup = () => {
  const [domain, setDomain] = useState("google.com");
  const [recordType, setRecordType] = useState("A");
  const [dnsServer, setDnsServer] = useState("8.8.8.8");
  const [loading, setLoading] = useState(false);
  const [records, setRecords] = useState(null);
  const [error, setError] = useState(null);

  const supportedTypes = ['ALL', 'A', 'AAAA', 'MX', 'NS', 'CNAME', 'SOA', 'TXT', 'CAA'];
  const dnsResolvers = [
    { name: "Google DNS", ip: "8.8.8.8" },
    { name: "Cloudflare", ip: "1.1.1.1" },
    { name: "Quad9", ip: "9.9.9.9" },
    { name: "OpenDNS", ip: "208.67.222.222" }
  ];

  const runDNSQuery = async (queryDomain = domain, queryType = recordType) => {
    if (!queryDomain) return;
    setLoading(true);
    setError(null);
    setRecords(null);

    const cleanDomain = queryDomain.replace(/^https?:\/\//, '').replace(/\/.*$/, '').trim();

    try {
      const endpoint = import.meta.env.VITE_DNS_LOOKUP_DATA_STATS_API_ENDPOINT || "http://localhost:5012/api/dnslookup";
      const res = await axios.post(endpoint, {
        domain: cleanDomain,
        type: queryType,
        dnsServer: dnsServer
      });
      if (queryType === 'ALL' || !queryType) {
        setRecords(res.data.decodedData || res.data);
      } else {
        setRecords(res.data.records);
      }
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.error || err.message || "DNS Resolver timed out or returned NXDOMAIN.");
    } finally {
      setLoading(false);
    }
  };

  const renderSingleRecord = (rec) => {
    if (typeof rec === 'string' || typeof rec === 'number') {
      return String(rec);
    }
    if (rec && typeof rec === 'object') {
      const entries = Object.entries(rec).filter(([k]) => k !== 'Revalidate in');
      if (entries.length === 1 && typeof entries[0][1] !== 'object') {
        return `${entries[0][1]}`;
      }
      return Object.entries(rec)
        .map(([k, v]) => `${k}: ${typeof v === 'object' ? JSON.stringify(v) : v}`)
        .join(' • ');
    }
    return JSON.stringify(rec);
  };

  return (
    <div className="space-y-8 text-white max-w-6xl mx-auto w-full">
        
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 text-xs font-mono">
            <Globe className="w-3.5 h-3.5" />
            GLOBAL ANYCAST DNS PROPAGATION & RECORD INSPECTOR
          </div>
          <h1 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight font-['Outfit']">
            Authoritative <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-emerald-400">DNS Records</span>
          </h1>
          <p className="text-gray-400 text-sm">
            Query canonical zone file records across recursive resolvers. Validate IPv4/IPv6 endpoint bindings, mail exchangers (MX), and security records.
          </p>
        </div>

        {/* Input & Record Type Selector */}
        <div className="max-w-3xl mx-auto glass-panel p-4 rounded-2xl border border-white/10 space-y-3 shadow-[0_0_40px_-10px_rgba(6,182,212,0.15)]">
          <form 
            onSubmit={(e) => { e.preventDefault(); runDNSQuery(); }}
            className="flex flex-col sm:flex-row items-center gap-2"
          >
            <div className="relative flex-1 w-full">
              <Globe className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
              <input
                type="text"
                value={domain}
                onChange={(e) => setDomain(e.target.value)}
                placeholder="Enter domain (e.g. microsoft.com)"
                className="w-full bg-[#0d121e]/90 text-white pl-11 pr-4 py-3.5 rounded-xl border border-white/10 focus:border-cyan-500/50 focus:outline-none text-sm font-mono placeholder:text-gray-600"
              />
            </div>
            <button
              type="submit"
              disabled={loading}
              className="w-full sm:w-auto px-6 py-3.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-[#07090e] font-bold text-xs tracking-tight flex items-center justify-center gap-2 transition-all shadow-[0_0_20px_rgba(6,182,212,0.35)] cursor-pointer disabled:opacity-50"
            >
              {loading ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Zap className="w-4 h-4" />}
              {loading ? "Querying..." : (recordType === 'ALL' ? "Query All Records" : `Query ${recordType} Record`)}
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
                  runDNSQuery(domain, type);
                }}
                className={`px-3 py-1 rounded-lg text-xs font-mono font-bold transition-all ${
                  recordType === type
                    ? "bg-cyan-500 text-[#07090e] shadow-[0_0_12px_rgba(6,182,212,0.4)]"
                    : "bg-white/5 text-gray-400 hover:text-white hover:bg-white/10 border border-white/5"
                }`}
              >
                {type}
              </button>
            ))}
          </div>

          {/* Resolver Selector */}
          <div className="flex flex-wrap items-center gap-2 pt-1 text-[11px] font-mono text-gray-400">
            <span className="text-gray-500 uppercase">Resolver:</span>
            {dnsResolvers.map((r) => (
              <button
                key={r.ip}
                type="button"
                onClick={() => setDnsServer(r.ip)}
                className={`px-2 py-0.5 rounded border ${
                  dnsServer === r.ip
                    ? "bg-white/10 text-cyan-400 border-cyan-500/40"
                    : "border-transparent text-gray-500 hover:text-gray-300"
                }`}
              >
                {r.name} ({r.ip})
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

        {/* Results Container */}
        {records && (
          <div className="max-w-5xl mx-auto space-y-6">
            {/* Header bar */}
            <div className="glass-panel p-4 rounded-xl border border-white/10 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Database className="w-4 h-4 text-cyan-400" />
                <h3 className="text-xs font-mono uppercase tracking-wider text-white font-bold">
                  {recordType === 'ALL' ? 'Full Zone File Response' : `${recordType} Zone Response`} for {domain}
                </h3>
              </div>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">
                RESOLVER: {dnsServer}
              </span>
            </div>

            {/* Display ALL records mode */}
            {recordType === 'ALL' && typeof records === 'object' && !Array.isArray(records) ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {Object.entries(records).map(([category, items]) => {
                  const hasData = Array.isArray(items) 
                    ? items.length > 0 && !(items.length === 1 && items[0] === 'No records found.')
                    : Boolean(items);

                  return (
                    <div 
                      key={category} 
                      className={`glass-panel rounded-xl border p-4 transition-all ${
                        hasData ? "border-cyan-500/20 bg-[#0d121e]/80" : "border-white/5 bg-[#090d16]/40 opacity-70"
                      }`}
                    >
                      <div className="flex items-center justify-between pb-3 mb-3 border-b border-white/5">
                        <div className="flex items-center gap-2">
                          <span className={`w-2 h-2 rounded-full ${hasData ? 'bg-cyan-400 shadow-[0_0_8px_rgba(6,182,212,0.8)]' : 'bg-gray-600'}`} />
                          <h4 className="text-xs font-mono font-bold text-white uppercase tracking-wider">
                            {category}
                          </h4>
                        </div>
                        <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-white/5 text-gray-400">
                          {Array.isArray(items) ? (hasData ? `${items.length} records` : '0') : '1'}
                        </span>
                      </div>

                      {Array.isArray(items) && items.length > 0 ? (
                        items.length === 1 && items[0] === 'No records found.' ? (
                          <div className="text-[11px] font-mono text-gray-500 italic py-1">
                            No records published
                          </div>
                        ) : (
                          <div className="space-y-2">
                            {items.map((item, idx) => (
                              <div key={idx} className="p-2.5 rounded-lg bg-black/40 border border-white/5 font-mono text-xs text-cyan-300 break-all flex items-start gap-2">
                                <span className="text-gray-600 text-[10px] pt-0.5 shrink-0">#{idx + 1}</span>
                                <div className="flex-1">
                                  {renderSingleRecord(item)}
                                </div>
                                <span className="text-emerald-400 text-[10px] shrink-0 flex items-center gap-0.5">
                                  <CheckCircle2 className="w-3 h-3" />
                                </span>
                              </div>
                            ))}
                          </div>
                        )
                      ) : (
                        <div className="text-[11px] font-mono text-gray-500 italic py-1">
                          No records published
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            ) : (
              /* Display Single Record mode */
              <div className="glass-panel rounded-2xl border border-white/10 overflow-hidden shadow-2xl p-6">
                {Array.isArray(records) && records.length > 0 ? (
                  <div className="divide-y divide-white/5">
                    {records.map((rec, idx) => (
                      <div key={idx} className="py-3 flex items-center justify-between font-mono text-xs">
                        <div className="flex items-center gap-3">
                          <span className="text-gray-500">#{idx + 1}</span>
                          <span className="px-2 py-0.5 rounded bg-white/5 border border-white/10 text-cyan-400 font-bold">
                            {recordType}
                          </span>
                          <span className="text-white text-sm break-all">
                            {renderSingleRecord(rec)}
                          </span>
                        </div>
                        <span className="text-emerald-400 text-[11px] flex items-center gap-1 shrink-0 ml-4">
                          <CheckCircle2 className="w-3.5 h-3.5" /> Canonical
                        </span>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-xs font-mono text-gray-400 p-4 rounded-xl bg-white/[0.02] border border-white/5">
                    {records && typeof records === 'object' && Object.keys(records).length > 0 
                      ? JSON.stringify(records, null, 2) 
                      : `No ${recordType} records found for ${domain}.`}
                  </div>
                )}
              </div>
            )}
          </div>
        )}

      </div>
  );
};

export default DNSLookup;
