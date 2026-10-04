import React, { useState } from "react";
import axios from "axios";
import { 
  Network, Globe, RefreshCw, AlertTriangle, CheckCircle2, 
  XCircle, Filter, Zap, Terminal, Shield, ArrowRight
} from "lucide-react";
import { getActiveBackendUrl } from "../utils/apiConfig";

const PortScanner = () => {
  const [host, setHost] = useState("google.com");
  const [customPortInput, setCustomPortInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [scanResult, setScanResult] = useState(null);
  const [error, setError] = useState(null);
  const [filter, setFilter] = useState("ALL"); // ALL, OPEN, CLOSED, FILTERED

  const presets = ["google.com", "github.com", "cloudflare.com", "1.1.1.1"];

  const runPortScan = async (targetHost = host) => {
    if (!targetHost) return;
    setLoading(true);
    setError(null);
    setScanResult(null);

    const payload = { host: targetHost.replace(/^https?:\/\//, '').trim() };
    if (customPortInput.trim()) {
      const parsed = customPortInput
        .split(',')
        .map(p => parseInt(p.trim(), 10))
        .filter(p => !isNaN(p));
      if (parsed.length > 0) {
        payload.ports = parsed;
      }
    }

    try {
      const endpoint = `${getActiveBackendUrl()}/api/portscan`;
      const res = await axios.post(endpoint, payload, { timeout: 30000 });
      setScanResult(res.data);
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.error || err.message || "Port scan timed out or host unreachable.");
    } finally {
      setLoading(false);
    }
  };

  const getFilteredResults = () => {
    if (!scanResult?.results) return [];
    if (filter === "OPEN") return scanResult.results.filter(r => r.status === "OPEN");
    if (filter === "CLOSED") return scanResult.results.filter(r => r.status === "CLOSED");
    if (filter === "FILTERED") return scanResult.results.filter(r => r.status.includes("FILTERED"));
    return scanResult.results;
  };

  return (
    <div className="space-y-8 text-white max-w-6xl mx-auto w-full">
      
      {/* Title */}
      <div className="text-center max-w-3xl mx-auto space-y-3">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 text-xs font-mono">
          <Network className="w-3.5 h-3.5" />
          TCP SOCKET & FIREWALL POLICY SCANNER
        </div>
        <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight font-['Outfit']">
          TCP Port Scanner & <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-emerald-400">Socket Probe</span>
        </h1>
        <p className="text-gray-400 text-xs sm:text-sm">
          Audit firewall rule enforcement (iptables/UFW, AWS Security Groups) by dispatching raw TCP handshakes across 25 standardized service ports or custom port lists.
        </p>
      </div>

      {/* Input */}
      <div className="glass-panel p-4 rounded-2xl border border-white/10 shadow-[0_0_40px_-10px_rgba(6,182,212,0.15)] max-w-3xl mx-auto space-y-3">
        <form 
          onSubmit={(e) => { e.preventDefault(); runPortScan(); }}
          className="flex flex-col sm:flex-row items-center gap-2"
        >
          <div className="relative flex-1 w-full">
            <Globe className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
            <input
              type="text"
              value={host}
              onChange={(e) => setHost(e.target.value)}
              placeholder="Enter host domain or IP (e.g. 1.1.1.1, google.com)"
              className="w-full bg-[#0d121e]/90 text-white pl-11 pr-4 py-3.5 rounded-xl border border-white/10 focus:border-cyan-500/50 focus:outline-none text-sm font-mono placeholder:text-gray-600"
            />
          </div>
          <button
            type="submit"
            disabled={loading}
            className="w-full sm:w-auto px-6 py-3.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-[#07090e] font-bold text-xs tracking-tight flex items-center justify-center gap-2 transition-all shadow-[0_0_20px_rgba(6,182,212,0.35)] cursor-pointer disabled:opacity-50 font-mono"
          >
            {loading ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Zap className="w-4 h-4" />}
            {loading ? "Scanning Sockets..." : "Scan 25 Common Ports"}
          </button>
        </form>

        {/* Custom Port input */}
        <div className="flex flex-col sm:flex-row items-center gap-2 pt-2 border-t border-white/5 text-xs font-mono">
          <span className="text-gray-500 shrink-0 text-[11px] uppercase">Custom Ports (Optional):</span>
          <input
            type="text"
            value={customPortInput}
            onChange={(e) => setCustomPortInput(e.target.value)}
            placeholder="e.g. 22, 80, 443, 8080, 9090 (comma separated)"
            className="w-full bg-[#0d121e] border border-white/10 rounded-lg px-3 py-1.5 text-xs text-cyan-300 focus:outline-none focus:border-cyan-500"
          />
        </div>

        <div className="flex flex-wrap items-center gap-2 pt-2 border-t border-white/5 text-xs text-gray-400">
          <span className="text-[11px] font-mono text-gray-500 uppercase">Presets:</span>
          {presets.map((preset) => (
            <button
              key={preset}
              type="button"
              onClick={() => { setHost(preset); runPortScan(preset); }}
              className="px-2.5 py-1 rounded-md bg-white/5 hover:bg-white/10 hover:text-cyan-400 border border-white/5 text-[11px] font-mono transition-all"
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
      {scanResult && (
        <div className="space-y-6">
          
          {/* Top KPI Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
            <div className="glass-panel p-5 rounded-2xl border border-white/10">
              <span className="text-xs font-mono uppercase text-gray-400">Total Probed</span>
              <div className="text-3xl font-extrabold text-white mt-1 font-['Outfit']">
                {scanResult.summary.totalScanned}
              </div>
              <div className="text-[11px] font-mono text-gray-500 mt-2">
                Target: {scanResult.host}
              </div>
            </div>

            <div className="glass-panel p-5 rounded-2xl border border-white/10">
              <span className="text-xs font-mono uppercase text-gray-400">Open Ports</span>
              <div className="text-3xl font-extrabold text-emerald-400 mt-1 font-['Outfit']">
                {scanResult.summary.open}
              </div>
              <div className="text-[11px] font-mono text-emerald-400 mt-2">
                Active & Accepting SYN
              </div>
            </div>

            <div className="glass-panel p-5 rounded-2xl border border-white/10">
              <span className="text-xs font-mono uppercase text-gray-400">Closed Ports</span>
              <div className="text-3xl font-extrabold text-cyan-400 mt-1 font-['Outfit']">
                {scanResult.summary.closed}
              </div>
              <div className="text-[11px] font-mono text-gray-400 mt-2">
                RST Handshake Returned
              </div>
            </div>

            <div className="glass-panel p-5 rounded-2xl border border-white/10">
              <span className="text-xs font-mono uppercase text-gray-400">Filtered / Firewalled</span>
              <div className="text-3xl font-extrabold text-amber-400 mt-1 font-['Outfit']">
                {scanResult.summary.filtered}
              </div>
              <div className="text-[11px] font-mono text-amber-400 mt-2">
                Silent Packet Drop (Timeout)
              </div>
            </div>
          </div>

          {/* Results Table with Filter Tabs */}
          <div className="glass-panel rounded-2xl border border-white/10 overflow-hidden shadow-2xl">
            <div className="px-6 py-4 border-b border-white/5 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <h3 className="text-xs font-mono uppercase tracking-wider text-white font-bold flex items-center gap-2">
                <Terminal className="w-3.5 h-3.5 text-cyan-400" />
                Socket Probing Results ({getFilteredResults().length})
              </h3>

              {/* Filter Tabs */}
              <div className="flex items-center gap-1 bg-white/5 p-1 rounded-xl border border-white/5 text-xs font-mono">
                {["ALL", "OPEN", "CLOSED", "FILTERED"].map((tab) => (
                  <button
                    key={tab}
                    type="button"
                    onClick={() => setFilter(tab)}
                    className={`px-2.5 py-1 rounded-lg text-[11px] font-bold transition-all cursor-pointer ${
                      filter === tab 
                        ? "bg-cyan-500 text-[#07090e]" 
                        : "text-gray-400 hover:text-white"
                    }`}
                  >
                    {tab}
                  </button>
                ))}
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs font-mono">
                <thead className="bg-white/[0.02] text-gray-400 border-b border-white/5 uppercase text-[10px]">
                  <tr>
                    <th className="px-6 py-3">Port</th>
                    <th className="px-6 py-3">Standard Service</th>
                    <th className="px-6 py-3">Category</th>
                    <th className="px-6 py-3">Handshake Latency</th>
                    <th className="px-6 py-3 text-right">Socket State</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  {getFilteredResults().map((p) => {
                    const isOpen = p.status === "OPEN";
                    const isClosed = p.status === "CLOSED";

                    return (
                      <tr key={p.port} className="hover:bg-white/[0.02] transition-colors">
                        <td className="px-6 py-3.5 font-bold text-white text-sm">
                          {p.port}
                        </td>
                        <td className="px-6 py-3.5 text-cyan-300 font-semibold">
                          {p.service}
                          {p.banner && (
                            <span className="block text-[10px] text-gray-500 font-normal truncate max-w-[200px]" title={p.banner}>
                              Banner: {p.banner}
                            </span>
                          )}
                        </td>
                        <td className="px-6 py-3.5 text-gray-400">
                          {p.category}
                        </td>
                        <td className="px-6 py-3.5 text-gray-300">
                          {p.latency}
                        </td>
                        <td className="px-6 py-3.5 text-right">
                          <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-bold border ${
                            isOpen 
                              ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/20" 
                              : isClosed 
                              ? "bg-white/5 text-gray-400 border-white/10"
                              : "bg-amber-500/10 text-amber-400 border-amber-500/20"
                          }`}>
                            <span className={`w-1.5 h-1.5 rounded-full ${
                              isOpen ? "bg-emerald-400 shadow-[0_0_8px_rgba(16,185,129,0.8)]" : isClosed ? "bg-gray-500" : "bg-amber-400"
                            }`} />
                            {p.status}
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

export default PortScanner;
