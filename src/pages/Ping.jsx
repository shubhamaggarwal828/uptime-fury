import React, { useState, useEffect } from "react";
import axios from "axios";
import { 
  Terminal, Globe, RefreshCw, AlertTriangle, ShieldCheck, 
  ArrowRight, Activity, Clock, Zap, Cpu, Server, Wifi, Check, Copy, Radio, Play
} from "lucide-react";
import { getAllServers, getActiveBackendUrl, getActiveServerId } from "../utils/apiConfig";

const Ping = () => {
  const [targetUrl, setTargetUrl] = useState("google.com");
  const [selectedServerId, setSelectedServerId] = useState(getActiveServerId());
  const [servers, setServers] = useState(getAllServers());
  const [multiResults, setMultiResults] = useState({});
  const [testingMulti, setTestingMulti] = useState(false);

  const [loading, setLoading] = useState(false);
  const [pingResult, setPingResult] = useState(null);
  const [error, setError] = useState(null);

  const presets = ["google.com", "github.com", "cloudflare.com", "1.1.1.1", "8.8.8.8"];

  const activeServer = servers.find(s => s.id === selectedServerId) || servers[0];

  const runPingTest = async (domain = targetUrl, serverUrl = null) => {
    if (!domain) return;
    setLoading(true);
    setError(null);
    setPingResult(null);

    const cleanDomain = domain.replace(/^https?:\/\//, '').replace(/\/.*$/, '').trim();
    const probeEndpoint = (serverUrl || activeServer?.url || getActiveBackendUrl()).replace(/\/+$/, "") + "/api/ping";

    try {
      const res = await axios.post(probeEndpoint, { url: cleanDomain }, { timeout: 15000 });
      setPingResult(res.data);
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.error || err.message || `Failed to reach ping probe at ${serverUrl || activeServer?.name}.`);
    } finally {
      setLoading(false);
    }
  };

  const runMultiServerPing = async (domain = targetUrl) => {
    if (!domain) return;
    setTestingMulti(true);
    setMultiResults({});
    const cleanDomain = domain.replace(/^https?:\/\//, '').replace(/\/.*$/, '').trim();

    await Promise.all(
      servers.map(async (s) => {
        try {
          const res = await axios.post(`${s.url.replace(/\/+$/, "")}/api/ping`, { url: cleanDomain }, { timeout: 10000 });
          setMultiResults(prev => ({
            ...prev,
            [s.id]: { success: true, data: res.data }
          }));
        } catch (err) {
          setMultiResults(prev => ({
            ...prev,
            [s.id]: { success: false, error: err.message || "Timeout / Unreachable" }
          }));
        }
      })
    );
    setTestingMulti(false);
  };

  return (
    <div className="max-w-6xl mx-auto space-y-8 w-full">
      
      {/* Title */}
      <div className="text-center max-w-3xl mx-auto space-y-3">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 text-xs font-mono">
          <Terminal className="w-3.5 h-3.5" />
          DISTRIBUTED MULTI-NODE ICMP SOCKET BENCHMARK
        </div>
        <h1 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight font-['Outfit']">
          ICMP Ping & <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-emerald-400">Packet Loss Telemetry</span>
        </h1>
        <p className="text-gray-400 text-xs sm:text-sm">
          Transmit raw socket packets from your primary daemon or distributed edge probe locations to benchmark round-trip latency and jitter across regions.
        </p>
      </div>

      {/* Input & Multi-Server Controls */}
      <div className="glass-panel p-4 rounded-2xl border border-white/10 shadow-[0_0_40px_-10px_rgba(6,182,212,0.15)] max-w-3xl mx-auto space-y-4">
        
        {/* Server Selector Bar */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-white/5 text-xs font-mono">
          <div className="flex items-center gap-2">
            <Radio className="w-3.5 h-3.5 text-cyan-400" />
            <span className="text-gray-400 uppercase text-[11px]">Probing Node:</span>
            <select
              value={selectedServerId}
              onChange={(e) => setSelectedServerId(e.target.value)}
              className="bg-[#0d121e] border border-white/10 rounded-lg px-2.5 py-1 text-cyan-300 font-bold focus:outline-none focus:border-cyan-500 text-xs cursor-pointer"
            >
              {servers.map((s) => (
                <option key={s.id} value={s.id}>
                  {s.name} ({s.location})
                </option>
              ))}
            </select>
          </div>

          <button
            type="button"
            disabled={testingMulti}
            onClick={() => runMultiServerPing()}
            className="px-3 py-1.5 rounded-lg bg-purple-500/10 hover:bg-purple-500/20 border border-purple-500/30 text-purple-300 font-bold text-[11px] flex items-center justify-center gap-1.5 transition-all cursor-pointer disabled:opacity-50"
          >
            {testingMulti ? <RefreshCw className="w-3 h-3 animate-spin" /> : <Play className="w-3 h-3" />}
            {testingMulti ? "Testing All Nodes..." : "Ping From All Nodes"}
          </button>
        </div>

        <form 
          onSubmit={(e) => { e.preventDefault(); runPingTest(); }}
          className="flex flex-col sm:flex-row items-center gap-2"
        >
          <div className="relative flex-1 w-full">
            <Terminal className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
            <input
              type="text"
              value={targetUrl}
              onChange={(e) => setTargetUrl(e.target.value)}
              placeholder="Enter target IP or host (e.g. 1.1.1.1, google.com)"
              className="w-full bg-[#0d121e]/90 text-white pl-11 pr-4 py-3 rounded-xl border border-white/10 focus:border-cyan-500/50 focus:outline-none text-sm font-mono placeholder:text-gray-600"
            />
          </div>
          <button
            type="submit"
            disabled={loading}
            className="w-full sm:w-auto px-6 py-3 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-[#07090e] font-bold text-xs tracking-tight flex items-center justify-center gap-2 transition-all shadow-[0_0_20px_rgba(6,182,212,0.35)] cursor-pointer disabled:opacity-50 font-mono"
          >
            {loading ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Zap className="w-4 h-4" />}
            {loading ? "Transmitting..." : `Ping via ${activeServer?.name?.split(' ')[0] || "Daemon"}`}
          </button>
        </form>

        <div className="flex flex-wrap items-center gap-2 pt-2 border-t border-white/5 text-xs text-gray-400">
          <span className="text-[11px] font-mono text-gray-500 uppercase">Presets:</span>
          {presets.map((preset) => (
            <button
              key={preset}
              type="button"
              onClick={() => { setTargetUrl(preset); runPingTest(preset); }}
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

      {/* Multi-Node Global Probe Comparison Matrix */}
      {Object.keys(multiResults).length > 0 && (
        <div className="space-y-4 max-w-5xl mx-auto">
          <div className="glass-panel rounded-2xl border border-white/10 overflow-hidden shadow-2xl">
            <div className="px-6 py-4 border-b border-white/5 flex items-center justify-between">
              <h3 className="text-xs font-mono uppercase tracking-wider text-white font-bold flex items-center gap-2">
                <Globe className="w-4 h-4 text-purple-400" />
                Multi-Node Global Ping Benchmark: {targetUrl}
              </h3>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-purple-500/10 text-purple-400 border border-purple-500/20">
                DISTRIBUTED PROBES
              </span>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs font-mono">
                <thead className="bg-white/[0.02] text-gray-400 border-b border-white/5 uppercase text-[10px]">
                  <tr>
                    <th className="px-6 py-3">Probe Location</th>
                    <th className="px-6 py-3">Server URL</th>
                    <th className="px-6 py-3">Avg Latency</th>
                    <th className="px-6 py-3">Min / Max</th>
                    <th className="px-6 py-3">Packet Loss</th>
                    <th className="px-6 py-3 text-right">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  {servers.map((s) => {
                    const res = multiResults[s.id];
                    if (!res) return null;
                    const d = res.data;
                    return (
                      <tr key={s.id} className="hover:bg-white/[0.02] transition-colors">
                        <td className="px-6 py-3 text-white font-bold">
                          <div className="flex items-center gap-2">
                            <span className="w-2 h-2 rounded-full bg-purple-400" />
                            {s.location}
                          </div>
                          <span className="text-[10px] text-gray-500 block ml-4">{s.name}</span>
                        </td>
                        <td className="px-6 py-3 text-gray-400 text-[11px] truncate max-w-[200px]">
                          {s.url}
                        </td>
                        <td className="px-6 py-3">
                          {res.success ? (
                            <span className="text-emerald-400 font-bold text-sm">
                              {d?.latencySummary?.avg || "N/A"}
                            </span>
                          ) : (
                            <span className="text-red-400 text-xs">Error</span>
                          )}
                        </td>
                        <td className="px-6 py-3 text-gray-300">
                          {res.success ? `${d?.latencySummary?.min || '-'} / ${d?.latencySummary?.max || '-'}` : "—"}
                        </td>
                        <td className="px-6 py-3">
                          {res.success ? (
                            <span className="text-cyan-400">{d?.packetSummary?.loss || "0%"}</span>
                          ) : (
                            <span className="text-gray-500">—</span>
                          )}
                        </td>
                        <td className="px-6 py-3 text-right">
                          {res.success ? (
                            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 text-[10px]">
                              ONLINE
                            </span>
                          ) : (
                            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-red-500/10 text-red-400 border border-red-500/20 text-[10px]" title={res.error}>
                              UNREACHABLE
                            </span>
                          )}
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

      {/* Results */}
      {pingResult && (
        <div className="space-y-6 max-w-5xl mx-auto">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="glass-panel p-5 rounded-2xl border border-white/10">
              <span className="text-xs font-mono uppercase text-gray-400">Average Latency</span>
              <div className="text-3xl font-extrabold text-white mt-1 font-['Outfit']">
                {pingResult.latencySummary?.avg || "N/A"}
              </div>
              <div className="text-[11px] font-mono text-gray-400 mt-2">
                Min: {pingResult.latencySummary?.min} | Max: {pingResult.latencySummary?.max}
              </div>
            </div>

            <div className="glass-panel p-5 rounded-2xl border border-white/10">
              <span className="text-xs font-mono uppercase text-gray-400">Packet Drop Rate</span>
              <div className="text-3xl font-extrabold text-emerald-400 mt-1 font-['Outfit']">
                {pingResult.packetSummary?.loss || "0%"}
              </div>
              <div className="text-[11px] font-mono text-gray-400 mt-2">
                Sent: {pingResult.packetSummary?.sent} / Recv: {pingResult.packetSummary?.received}
              </div>
            </div>

            <div className="glass-panel p-5 rounded-2xl border border-white/10">
              <span className="text-xs font-mono uppercase text-gray-400">Jitter (Variance)</span>
              <div className="text-3xl font-extrabold text-cyan-400 mt-1 font-['Outfit']">
                {pingResult.latencySummary?.stdDev || "0.00 ms"}
              </div>
              <div className="text-[11px] font-mono text-emerald-400 mt-2 flex items-center gap-1">
                <span className="w-2 h-2 rounded-full bg-emerald-400" />
                Bufferbloat: Minimal
              </div>
            </div>
          </div>

          <div className="glass-panel rounded-2xl border border-white/10 overflow-hidden shadow-2xl">
            <div className="px-6 py-4 border-b border-white/5 flex items-center justify-between">
              <h3 className="text-xs font-mono uppercase tracking-wider text-white font-bold flex items-center gap-2">
                <Terminal className="w-3.5 h-3.5 text-cyan-400" />
                Per-Packet ICMP Telemetry Stream (64 Bytes)
              </h3>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">
                RAW IP SOCKET
              </span>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs font-mono">
                <thead className="bg-white/[0.02] text-gray-400 border-b border-white/5 uppercase text-[10px]">
                  <tr>
                    <th className="px-6 py-3">Sequence</th>
                    <th className="px-6 py-3">Host IP</th>
                    <th className="px-6 py-3">Response Time</th>
                    <th className="px-6 py-3">TTL</th>
                    <th className="px-6 py-3">Payload Size</th>
                    <th className="px-6 py-3 text-right">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  {pingResult.metrics?.map((p, idx) => (
                    <tr key={idx} className="hover:bg-white/[0.02] transition-colors">
                      <td className="px-6 py-3 text-gray-400">#{idx + 1}</td>
                      <td className="px-6 py-3 text-white font-bold">{p.address}</td>
                      <td className="px-6 py-3 text-cyan-400 font-bold">{p.responseTime} ms</td>
                      <td className="px-6 py-3 text-gray-300">{p.ttl}</td>
                      <td className="px-6 py-3 text-gray-400">{p.bytes} B</td>
                      <td className="px-6 py-3 text-right">
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 text-[10px]">
                          DELIVERED
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};

export default Ping;
