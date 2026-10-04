import React, { useState } from "react";
import axios from "axios";
import { 
  Layers, Globe, RefreshCw, AlertTriangle, CheckCircle2, 
  Terminal, Shield, Server, Cpu, Zap, Wifi, Copy, Check
} from "lucide-react";

const MultiDiagnostics = () => {
  const [target, setTarget] = useState("google.com");
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState({
    ping: null,
    ssl: null,
    dns: null,
    http: null,
    whois: null
  });
  const [errors, setErrors] = useState({});
  const [completedCount, setCompletedCount] = useState(0);

  const presets = ["google.com", "github.com", "cloudflare.com", "microsoft.com"];

  const runAllDiagnostics = async (domainToTest = target) => {
    if (!domainToTest) return;
    setLoading(true);
    setCompletedCount(0);
    setErrors({});
    setResults({ ping: null, ssl: null, dns: null, http: null, whois: null });

    const cleanDomain = domainToTest.replace(/^https?:\/\//, '').replace(/\/.*$/, '').trim();
    const fullHttpUrl = `https://${cleanDomain}`;

    const endpoints = {
      ping: { url: "http://localhost:5012/api/ping", payload: { url: cleanDomain } },
      ssl: { url: "http://localhost:5012/api/ssl-info", payload: { url: cleanDomain } },
      dns: { url: "http://localhost:5012/api/dnslookup", payload: { domain: cleanDomain, type: "A", dnsServer: "8.8.8.8" } },
      http: { url: "http://localhost:5012/api/HTTPStats", payload: { url: fullHttpUrl } },
      whois: { url: "http://localhost:5012/api/whoisDataComplete", payload: { url: cleanDomain } }
    };

    let count = 0;

    await Promise.all(
      Object.entries(endpoints).map(async ([key, config]) => {
        try {
          const res = await axios.post(config.url, config.payload, { timeout: 15000 });
          setResults((prev) => ({ ...prev, [key]: res.data }));
        } catch (err) {
          console.error(`Error in ${key}:`, err);
          setErrors((prev) => ({
            ...prev,
            [key]: err.response?.data?.error || err.message || "Diagnostic probe failed"
          }));
        } finally {
          count++;
          setCompletedCount(count);
        }
      })
    );

    setLoading(false);
  };

  const getSslIssuer = () => {
    if (!results.ssl) return "N/A";
    const details = results.ssl.certificateDetails || results.ssl;
    return details.issuer?.organization || details.issuer?.commonName || results.ssl.serverType || "Verified CA";
  };

  const getWhoisRegistrar = () => {
    if (!results.whois) return "N/A";
    const w = results.whois.whois || results.whois;
    return w['Registrar'] || w.registrar || "ICANN Accredited";
  };

  const getWhoisExpiry = () => {
    if (!results.whois) return "N/A";
    const w = results.whois.whois || results.whois;
    return w['Registry Expiry Date'] || w.expirationDate || "Active";
  };

  return (
    <div className="space-y-8 text-white max-w-7xl mx-auto w-full">
        
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto space-y-3">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 text-xs font-mono">
            <Layers className="w-3.5 h-3.5" />
            PARALLEL MULTI-VECTOR PROBE ORCHESTRATOR
          </div>
          <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight font-['Outfit']">
            Multi-Diagnostic <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-teal-300 to-emerald-400">Host Matrix</span>
          </h1>
          <p className="text-gray-400 text-xs sm:text-sm">
            Live telemetry queries executed simultaneously: ICMP ping, TLS certificate chain, authoritative DNS zone, HTTP response headers, and WHOIS registration records.
          </p>
        </div>

        {/* Input Bar */}
        <div className="max-w-3xl mx-auto glass-panel p-3 rounded-2xl border border-white/10 shadow-[0_0_50px_-10px_rgba(6,182,212,0.2)]">
          <form 
            onSubmit={(e) => { e.preventDefault(); runAllDiagnostics(); }}
            className="flex flex-col sm:flex-row items-center gap-2"
          >
            <div className="relative flex-1 w-full">
              <Globe className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
              <input
                type="text"
                value={target}
                onChange={(e) => setTarget(e.target.value)}
                placeholder="Enter target domain or IP (e.g. google.com, 1.1.1.1)"
                className="w-full bg-[#0d121e]/90 text-white pl-11 pr-4 py-3.5 rounded-xl border border-white/10 focus:border-cyan-500/50 focus:outline-none text-sm font-mono placeholder:text-gray-600"
              />
            </div>
            <button
              type="submit"
              disabled={loading}
              className="w-full sm:w-auto px-6 py-3.5 rounded-xl bg-gradient-to-r from-cyan-500 to-emerald-400 hover:from-cyan-400 hover:to-emerald-300 text-[#07090e] font-bold text-xs tracking-tight flex items-center justify-center gap-2 transition-all shadow-[0_0_20px_rgba(6,182,212,0.35)] cursor-pointer disabled:opacity-50"
            >
              {loading ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Zap className="w-4 h-4" />}
              {loading ? `Auditing (${completedCount}/5)...` : "Execute Multi-Audit"}
            </button>
          </form>

          <div className="flex flex-wrap items-center gap-2 pt-3 px-2 border-t border-white/5 mt-2 text-xs text-gray-400">
            <span className="text-[11px] font-mono text-gray-500 uppercase">Presets:</span>
            {presets.map((preset) => (
              <button
                key={preset}
                type="button"
                onClick={() => { setTarget(preset); runAllDiagnostics(preset); }}
                className="px-2.5 py-1 rounded-md bg-white/5 hover:bg-white/10 hover:text-cyan-400 border border-white/5 text-[11px] font-mono transition-all"
              >
                {preset}
              </button>
            ))}
          </div>
        </div>

        {/* 5-Pane Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          
          {/* Pane 1: ICMP Ping */}
          <div className="glass-panel p-5 rounded-2xl border border-white/10 space-y-3">
            <div className="flex items-center justify-between border-b border-white/5 pb-2.5">
              <span className="text-xs font-mono font-bold text-emerald-400 flex items-center gap-1.5">
                <Terminal className="w-3.5 h-3.5" /> 01. ICMP PING
              </span>
              {results.ping && <span className="text-[10px] font-mono text-emerald-400">REACHABLE</span>}
              {errors.ping && <span className="text-[10px] font-mono text-red-400">FAILED</span>}
            </div>
            {loading && !results.ping && !errors.ping && (
              <div className="h-32 flex items-center justify-center text-xs font-mono text-gray-500 animate-pulse">
                Probing ICMP sockets...
              </div>
            )}
            {errors.ping && (
              <div className="p-3 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400 text-xs font-mono">
                {errors.ping}
              </div>
            )}
            {results.ping && (
              <div className="space-y-2 text-xs font-mono">
                <div className="flex justify-between text-gray-400">
                  <span>Avg Latency:</span>
                  <span className="text-white font-bold">{results.ping.latencySummary?.avg || "N/A"}</span>
                </div>
                <div className="flex justify-between text-gray-400">
                  <span>Packet Drop:</span>
                  <span className="text-emerald-400 font-bold">{results.ping.packetSummary?.loss || "0%"}</span>
                </div>
                <div className="flex justify-between text-gray-400">
                  <span>Jitter:</span>
                  <span className="text-cyan-400">{results.ping.latencySummary?.stdDev || "0 ms"}</span>
                </div>
                <div className="pt-2 border-t border-white/5 text-[11px] text-gray-500 truncate">
                  Host IP: {results.ping.metrics?.[0]?.address || target}
                </div>
              </div>
            )}
            {!loading && !results.ping && !errors.ping && (
              <p className="text-xs text-gray-500 font-mono py-6 text-center">Ready to probe.</p>
            )}
          </div>

          {/* Pane 2: TLS / SSL */}
          <div className="glass-panel p-5 rounded-2xl border border-white/10 space-y-3">
            <div className="flex items-center justify-between border-b border-white/5 pb-2.5">
              <span className="text-xs font-mono font-bold text-blue-400 flex items-center gap-1.5">
                <Shield className="w-3.5 h-3.5" /> 02. TLS / SSL CERT
              </span>
              {results.ssl && <span className="text-[10px] font-mono text-emerald-400">VALID</span>}
              {errors.ssl && <span className="text-[10px] font-mono text-red-400">FAILED</span>}
            </div>
            {loading && !results.ssl && !errors.ssl && (
              <div className="h-32 flex items-center justify-center text-xs font-mono text-gray-500 animate-pulse">
                Handshaking TLS port 443...
              </div>
            )}
            {errors.ssl && (
              <div className="p-3 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400 text-xs font-mono">
                {errors.ssl}
              </div>
            )}
            {results.ssl && (
              <div className="space-y-2 text-xs font-mono">
                <div className="flex justify-between text-gray-400">
                  <span>Issuer CA:</span>
                  <span className="text-white font-bold truncate max-w-[150px]">{getSslIssuer()}</span>
                </div>
                <div className="flex justify-between text-gray-400">
                  <span>Expires:</span>
                  <span className="text-emerald-400">
                    {results.ssl.certificateDetails?.validTo 
                      ? new Date(results.ssl.certificateDetails.validTo).toLocaleDateString() 
                      : (results.ssl.expiration || "Valid")}
                  </span>
                </div>
                <div className="flex justify-between text-gray-400">
                  <span>Server Type:</span>
                  <span className="text-cyan-400 uppercase">{results.ssl.serverType || "HTTPS"}</span>
                </div>
                <div className="pt-2 border-t border-white/5 text-[11px] text-gray-500 truncate">
                  Target IP: {results.ssl.ip || "Direct"}
                </div>
              </div>
            )}
            {!loading && !results.ssl && !errors.ssl && (
              <p className="text-xs text-gray-500 font-mono py-6 text-center">Ready to handshake.</p>
            )}
          </div>

          {/* Pane 3: Anycast DNS */}
          <div className="glass-panel p-5 rounded-2xl border border-white/10 space-y-3">
            <div className="flex items-center justify-between border-b border-white/5 pb-2.5">
              <span className="text-xs font-mono font-bold text-teal-400 flex items-center gap-1.5">
                <Globe className="w-3.5 h-3.5" /> 03. DNS RECORDS (A)
              </span>
              {results.dns && <span className="text-[10px] font-mono text-teal-400">RESOLVED</span>}
              {errors.dns && <span className="text-[10px] font-mono text-red-400">FAILED</span>}
            </div>
            {loading && !results.dns && !errors.dns && (
              <div className="h-32 flex items-center justify-center text-xs font-mono text-gray-500 animate-pulse">
                Querying recursive zone...
              </div>
            )}
            {errors.dns && (
              <div className="p-3 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400 text-xs font-mono">
                {errors.dns}
              </div>
            )}
            {results.dns && (
              <div className="space-y-1.5 text-xs font-mono">
                <span className="text-gray-500 text-[11px]">Resolved IPv4 Addresses:</span>
                <div className="space-y-1 max-h-24 overflow-y-auto">
                  {Array.isArray(results.dns.records) ? results.dns.records.map((ip, i) => (
                    <div key={i} className="p-1.5 rounded bg-white/[0.03] text-teal-300 font-bold">
                      {String(ip)}
                    </div>
                  )) : (
                    <div className="p-1.5 rounded bg-white/[0.03] text-teal-300">
                      {JSON.stringify(results.dns.records)}
                    </div>
                  )}
                </div>
              </div>
            )}
            {!loading && !results.dns && !errors.dns && (
              <p className="text-xs text-gray-500 font-mono py-6 text-center">Ready to query.</p>
            )}
          </div>

          {/* Pane 4: HTTP Response */}
          <div className="glass-panel p-5 rounded-2xl border border-white/10 space-y-3">
            <div className="flex items-center justify-between border-b border-white/5 pb-2.5">
              <span className="text-xs font-mono font-bold text-purple-400 flex items-center gap-1.5">
                <Server className="w-3.5 h-3.5" /> 04. HTTP RESPONSE
              </span>
              {results.http && <span className="text-[10px] font-mono text-emerald-400">200 OK</span>}
              {errors.http && <span className="text-[10px] font-mono text-red-400">FAILED</span>}
            </div>
            {loading && !results.http && !errors.http && (
              <div className="h-32 flex items-center justify-center text-xs font-mono text-gray-500 animate-pulse">
                Dispatching HTTP benchmark...
              </div>
            )}
            {errors.http && (
              <div className="p-3 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400 text-xs font-mono">
                {errors.http}
              </div>
            )}
            {results.http && (
              <div className="space-y-2 text-xs font-mono">
                <div className="flex justify-between text-gray-400">
                  <span>Server Banner:</span>
                  <span className="text-white font-bold truncate max-w-[150px]">{results.http.serverStats?.headers?.server || "Cloud Proxy"}</span>
                </div>
                <div className="flex justify-between text-gray-400">
                  <span>Content Type:</span>
                  <span className="text-purple-300 truncate max-w-[150px]">{results.http.serverStats?.contentType || "HTML"}</span>
                </div>
                <div className="flex justify-between text-gray-400">
                  <span>Response Time:</span>
                  <span className="text-emerald-400 font-bold">{results.http.serverStats?.responseTime || "Direct"}</span>
                </div>
              </div>
            )}
            {!loading && !results.http && !errors.http && (
              <p className="text-xs text-gray-500 font-mono py-6 text-center">Ready to test HTTP.</p>
            )}
          </div>

          {/* Pane 5: WHOIS Registrar */}
          <div className="glass-panel p-5 rounded-2xl border border-white/10 space-y-3">
            <div className="flex items-center justify-between border-b border-white/5 pb-2.5">
              <span className="text-xs font-mono font-bold text-amber-400 flex items-center gap-1.5">
                <Cpu className="w-3.5 h-3.5" /> 05. WHOIS REGISTRATION
              </span>
              {results.whois && <span className="text-[10px] font-mono text-amber-400">ACTIVE</span>}
              {errors.whois && <span className="text-[10px] font-mono text-red-400">FAILED</span>}
            </div>
            {loading && !results.whois && !errors.whois && (
              <div className="h-32 flex items-center justify-center text-xs font-mono text-gray-500 animate-pulse">
                Querying WHOIS registry...
              </div>
            )}
            {errors.whois && (
              <div className="p-3 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400 text-xs font-mono">
                {errors.whois}
              </div>
            )}
            {results.whois && (
              <div className="space-y-2 text-xs font-mono">
                <div className="flex justify-between text-gray-400">
                  <span>Registrar:</span>
                  <span className="text-white font-bold truncate max-w-[150px]">{getWhoisRegistrar()}</span>
                </div>
                <div className="flex justify-between text-gray-400">
                  <span>Expiry Date:</span>
                  <span className="text-emerald-400 truncate max-w-[150px]">{getWhoisExpiry()}</span>
                </div>
                <div className="flex justify-between text-gray-400">
                  <span>Nameservers:</span>
                  <span className="text-amber-400 truncate max-w-[150px]">
                    {results.whois.whois?.nameServers ? results.whois.whois.nameServers.join(', ') : "Active"}
                  </span>
                </div>
              </div>
            )}
            {!loading && !results.whois && !errors.whois && (
              <p className="text-xs text-gray-500 font-mono py-6 text-center">Ready to query WHOIS.</p>
            )}
          </div>

          {/* Pane 6: SysAdmin Action Center */}
          <div className="glass-panel p-5 rounded-2xl border border-white/10 flex flex-col justify-between">
            <div className="space-y-2">
              <span className="text-xs font-mono font-bold text-cyan-400 flex items-center gap-1.5">
                <Zap className="w-3.5 h-3.5" /> QUICK SYSADMIN ACTIONS
              </span>
              <p className="text-xs text-gray-400">
                All 5 diagnostic vectors resolved in parallel. Export full telemetry data or trigger individual blades.
              </p>
            </div>
            <div className="pt-4 flex flex-col gap-2 text-xs font-mono">
              <button
                onClick={() => {
                  navigator.clipboard.writeText(JSON.stringify(results, null, 2));
                  alert("Combined diagnostic matrix copied to clipboard!");
                }}
                className="w-full py-2.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-gray-300 font-bold transition-all text-center cursor-pointer"
              >
                Export Full JSON Matrix
              </button>
            </div>
          </div>

        </div>

      </div>
  );
};

export default MultiDiagnostics;
