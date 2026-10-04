import React, { useState } from "react";
import axios from "axios";
import { 
  Cpu, Globe, RefreshCw, AlertTriangle, ShieldCheck, 
  Terminal, CheckCircle2, Zap, ArrowRight, CornerDownRight
} from "lucide-react";

const Traceroute = () => {
  const [target, setTarget] = useState("1.1.1.1");
  const [loading, setLoading] = useState(false);
  const [hops, setHops] = useState(null);
  const [error, setError] = useState(null);

  const presets = ["1.1.1.1", "8.8.8.8", "9.9.9.9", "github.com"];

  const runTraceroute = async (destination = target) => {
    if (!destination) return;
    setLoading(true);
    setError(null);
    setHops(null);

    const cleanDest = destination.replace(/^https?:\/\//, '').replace(/\/.*$/, '').trim();

    try {
      const endpoint = import.meta.env.VITE_TRACEROUTE_DATA_STATS_API_ENDPOINT || "http://localhost:5012/api/traceroute";
      const res = await axios.post(endpoint, { url: cleanDest }, { timeout: 30000 });
      setHops(res.data.traceRoute?.tracerouteResults || []);
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.error || err.message || "Traceroute probe timed out across intermediate hops.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-8 text-white max-w-6xl mx-auto w-full">
        
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto space-y-3">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-rose-500/10 border border-rose-500/20 text-rose-400 text-xs font-mono">
            <Cpu className="w-3.5 h-3.5" />
            AUTONOMOUS SYSTEM (AS) & HOP-BY-HOP ROUTE TRACER
          </div>
          <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight font-['Outfit']">
            Network <span className="text-transparent bg-clip-text bg-gradient-to-r from-rose-400 to-amber-400">Traceroute Engine</span>
          </h1>
          <p className="text-gray-400 text-xs sm:text-sm">
            Trace packet routing paths through internet backbones, autonomous systems (ASNs), and pinpoint packet drops or high-latency router gateways.
          </p>
        </div>

        {/* Input */}
        <div className="max-w-2xl mx-auto glass-panel p-3 rounded-2xl border border-white/10 shadow-[0_0_40px_-10px_rgba(244,63,94,0.15)]">
          <form 
            onSubmit={(e) => { e.preventDefault(); runTraceroute(); }}
            className="flex flex-col sm:flex-row items-center gap-2"
          >
            <div className="relative flex-1 w-full">
              <Globe className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
              <input
                type="text"
                value={target}
                onChange={(e) => setTarget(e.target.value)}
                placeholder="Enter destination IP or host (e.g. 1.1.1.1)"
                className="w-full bg-[#0d121e]/90 text-white pl-11 pr-4 py-3.5 rounded-xl border border-white/10 focus:border-rose-500/50 focus:outline-none text-sm font-mono placeholder:text-gray-600"
              />
            </div>
            <button
              type="submit"
              disabled={loading}
              className="w-full sm:w-auto px-6 py-3.5 rounded-xl bg-rose-500 hover:bg-rose-400 text-white font-bold text-xs tracking-tight flex items-center justify-center gap-2 transition-all shadow-[0_0_20px_rgba(244,63,94,0.35)] cursor-pointer disabled:opacity-50"
            >
              {loading ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Zap className="w-4 h-4" />}
              {loading ? "Tracing Path..." : "Trace Routing Hops"}
            </button>
          </form>

          <div className="flex flex-wrap items-center gap-2 pt-3 px-2 border-t border-white/5 mt-2 text-xs text-gray-400">
            <span className="text-[11px] font-mono text-gray-500 uppercase">Presets:</span>
            {presets.map((preset) => (
              <button
                key={preset}
                type="button"
                onClick={() => { setTarget(preset); runTraceroute(preset); }}
                className="px-2.5 py-1 rounded-md bg-white/5 hover:bg-white/10 hover:text-rose-400 border border-white/5 text-[11px] font-mono transition-all"
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

        {/* Hops Table */}
        {hops && (
          <div className="glass-panel max-w-4xl mx-auto rounded-2xl border border-white/10 overflow-hidden shadow-2xl">
            <div className="px-6 py-4 border-b border-white/5 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Cpu className="w-4 h-4 text-rose-400" />
                <h3 className="text-xs font-mono uppercase tracking-wider text-white font-bold">
                  Hop-by-Hop Trace Path for {target} ({hops.length} Hops)
                </h3>
              </div>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-rose-500/10 text-rose-400 border border-rose-500/20">
                RAW TTL PROBE
              </span>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs font-mono">
                <thead className="bg-white/[0.02] text-gray-400 border-b border-white/5 uppercase text-[10px]">
                  <tr>
                    <th className="px-6 py-3">Hop #</th>
                    <th className="px-6 py-3">Router IP</th>
                    <th className="px-6 py-3">Reverse Hostname</th>
                    <th className="px-6 py-3">RTT Latency</th>
                    <th className="px-6 py-3 text-right">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  {hops.map((hop, idx) => (
                    <tr key={idx} className="hover:bg-white/[0.02] transition-colors">
                      <td className="px-6 py-3 text-rose-400 font-bold">#{hop.hop || idx + 1}</td>
                      <td className="px-6 py-3 text-white font-bold">{hop.host?.ip || "N/A"}</td>
                      <td className="px-6 py-3 text-gray-400 truncate max-w-[200px]">{hop.host?.hostname || "N/A"}</td>
                      <td className="px-6 py-3 text-emerald-400 font-bold">{hop.time ? `${hop.time} ms` : "* ms"}</td>
                      <td className="px-6 py-3 text-right">
                        <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] ${
                          hop.time && hop.time !== 'N/A'
                            ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20"
                            : "bg-amber-500/10 text-amber-400 border border-amber-500/20"
                        }`}>
                          {hop.time && hop.time !== 'N/A' ? "DELIVERED" : "MASKED"}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

      </div>
  );
};

export default Traceroute;
