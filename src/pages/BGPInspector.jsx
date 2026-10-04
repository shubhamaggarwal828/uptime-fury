import React, { useState } from "react";
import axios from "axios";
import { 
  Network, Globe, RefreshCw, AlertTriangle, CheckCircle2, 
  MapPin, Shield, Terminal, Zap, Cpu, Server, Activity
} from "lucide-react";
import { getActiveBackendUrl } from "../utils/apiConfig";

const BGPInspector = () => {
  const [target, setTarget] = useState("1.1.1.1");
  const [loading, setLoading] = useState(false);
  const [bgpData, setBgpData] = useState(null);
  const [error, setError] = useState(null);

  const presets = ["1.1.1.1", "8.8.8.8", "github.com", "microsoft.com"];

  const runBgpLookup = async (targetHost = target) => {
    if (!targetHost) return;
    setLoading(true);
    setError(null);
    setBgpData(null);

    const clean = targetHost.replace(/^https?:\/\//, '').trim();

    try {
      const endpoint = `${getActiveBackendUrl()}/api/bgp`;
      const res = await axios.post(endpoint, { host: clean });
      setBgpData(res.data);
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.error || err.message || "Failed to inspect BGP route.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-8 text-white max-w-6xl mx-auto w-full">
      
      {/* Title */}
      <div className="text-center max-w-3xl mx-auto space-y-3">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-500/10 border border-purple-500/20 text-purple-400 text-xs font-mono">
          <Network className="w-3.5 h-3.5" />
          AUTONOMOUS SYSTEM NUMBER (ASN) & BGP ROUTING
        </div>
        <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight font-['Outfit']">
          BGP Routing & <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-indigo-400">Subnet CIDR Inspector</span>
        </h1>
        <p className="text-gray-400 text-xs sm:text-sm">
          Resolve autonomous system prefixes (ASNs), BGP routing prefixes, WAN CIDR blocks, Anycast broadcast zones, and localized ISP peering organizations.
        </p>
      </div>

      {/* Input */}
      <div className="glass-panel p-3.5 rounded-2xl border border-white/10 shadow-[0_0_40px_-10px_rgba(168,85,247,0.15)] max-w-3xl mx-auto">
        <form 
          onSubmit={(e) => { e.preventDefault(); runBgpLookup(); }}
          className="flex flex-col sm:flex-row items-center gap-2"
        >
          <div className="relative flex-1 w-full">
            <Globe className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
            <input
              type="text"
              value={target}
              onChange={(e) => setTarget(e.target.value)}
              placeholder="Enter IP address or domain (e.g. 1.1.1.1, github.com)"
              className="w-full bg-[#0d121e]/90 text-white pl-11 pr-4 py-3 rounded-xl border border-white/10 focus:border-purple-500/50 focus:outline-none text-sm font-mono placeholder:text-gray-600"
            />
          </div>
          <button
            type="submit"
            disabled={loading}
            className="w-full sm:w-auto px-6 py-3 rounded-xl bg-purple-500 hover:bg-purple-400 text-white font-bold text-xs tracking-tight flex items-center justify-center gap-2 transition-all shadow-[0_0_20px_rgba(168,85,247,0.35)] cursor-pointer disabled:opacity-50 font-mono"
          >
            {loading ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Zap className="w-4 h-4" />}
            {loading ? "Inspecting BGP..." : "Inspect ASN / BGP"}
          </button>
        </form>

        <div className="flex flex-wrap items-center gap-2 pt-3 px-2 border-t border-white/5 mt-2 text-xs text-gray-400">
          <span className="text-[11px] font-mono text-gray-500 uppercase">Presets:</span>
          {presets.map((preset) => (
            <button
              key={preset}
              type="button"
              onClick={() => { setTarget(preset); runBgpLookup(preset); }}
              className="px-2.5 py-1 rounded-md bg-white/5 hover:bg-white/10 hover:text-purple-400 border border-white/5 text-[11px] font-mono transition-all"
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
      {bgpData && (
        <div className="space-y-6">
          
          {/* Top KPI Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
            <div className="glass-panel p-5 rounded-2xl border border-white/10">
              <span className="text-xs font-mono uppercase text-gray-400">Autonomous System</span>
              <div className="text-2xl font-bold text-purple-400 mt-1 font-mono truncate">
                {bgpData.asnInfo.asn}
              </div>
              <div className="text-[11px] font-mono text-white truncate mt-1">
                {bgpData.asnInfo.holder}
              </div>
            </div>

            <div className="glass-panel p-5 rounded-2xl border border-white/10">
              <span className="text-xs font-mono uppercase text-gray-400">Routed CIDR Prefix</span>
              <div className="text-2xl font-bold text-cyan-400 mt-1 font-mono">
                {bgpData.asnInfo.prefix}
              </div>
              <div className="text-[11px] font-mono text-gray-400 mt-1">
                BGP Route Announcement
              </div>
            </div>

            <div className="glass-panel p-5 rounded-2xl border border-white/10">
              <span className="text-xs font-mono uppercase text-gray-400">Resolved Endpoint</span>
              <div className="text-xl font-bold text-emerald-400 mt-1 font-mono truncate">
                {bgpData.resolvedIp}
              </div>
              <div className="text-[11px] font-mono text-gray-400 mt-1">
                Target: {bgpData.target}
              </div>
            </div>

            <div className="glass-panel p-5 rounded-2xl border border-white/10">
              <span className="text-xs font-mono uppercase text-gray-400">Anycast Routing</span>
              <div className="text-xl font-bold text-white mt-1 font-mono flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 shadow-[0_0_8px_rgba(16,185,129,0.8)]" />
                {bgpData.asnInfo.anycast ? "ACTIVE" : "UNICAST"}
              </div>
              <div className="text-[11px] font-mono text-gray-400 mt-1">
                Global Anycast Border
              </div>
            </div>
          </div>

          {/* Detailed BGP & Geo Specs */}
          <div className="glass-panel rounded-2xl border border-white/10 overflow-hidden shadow-2xl p-6 font-mono text-xs">
            <h3 className="text-xs uppercase tracking-wider text-white font-bold flex items-center gap-2 border-b border-white/5 pb-3 mb-4">
              <Terminal className="w-4 h-4 text-purple-400" />
              BGP Network & Autonomous System Registry Details
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-3">
                <div className="flex justify-between p-2.5 rounded-lg bg-white/[0.02] border border-white/5">
                  <span className="text-gray-400">ASN Entity</span>
                  <span className="text-white font-bold">{bgpData.asnInfo.asn}</span>
                </div>
                <div className="flex justify-between p-2.5 rounded-lg bg-white/[0.02] border border-white/5">
                  <span className="text-gray-400">Organization Holder</span>
                  <span className="text-cyan-300 font-bold truncate max-w-[220px]">{bgpData.asnInfo.holder}</span>
                </div>
                <div className="flex justify-between p-2.5 rounded-lg bg-white/[0.02] border border-white/5">
                  <span className="text-gray-400">BGP Route CIDR</span>
                  <span className="text-purple-300 font-bold">{bgpData.asnInfo.route}</span>
                </div>
              </div>

              <div className="space-y-3">
                <div className="flex justify-between p-2.5 rounded-lg bg-white/[0.02] border border-white/5">
                  <span className="text-gray-400">Geographical Origin</span>
                  <span className="text-white font-bold">{bgpData.asnInfo.country}</span>
                </div>
                <div className="flex justify-between p-2.5 rounded-lg bg-white/[0.02] border border-white/5">
                  <span className="text-gray-400">Regional Edge Node</span>
                  <span className="text-emerald-300">{bgpData.asnInfo.city}, {bgpData.asnInfo.region}</span>
                </div>
                <div className="flex justify-between p-2.5 rounded-lg bg-white/[0.02] border border-white/5">
                  <span className="text-gray-400">Node Timezone</span>
                  <span className="text-gray-300">{bgpData.asnInfo.timezone}</span>
                </div>
              </div>
            </div>
          </div>

        </div>
      )}

    </div>
  );
};

export default BGPInspector;
