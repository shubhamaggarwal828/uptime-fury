import React, { useState, useEffect } from "react";
import { 
  Settings as SettingsIcon, Server, Shield, Terminal, Globe, 
  Check, Save, RefreshCw, Key, Bell, Database, Radio, HardDrive, Cpu,
  Plus, Trash2, ExternalLink
} from "lucide-react";
import { 
  getAllServers, getActiveServerId, setActiveServerId, 
  getActiveBackendUrl, getStoredServers, saveStoredServers 
} from "../utils/apiConfig";

const Settings = () => {
  const [customBackendUrl, setCustomBackendUrl] = useState(
    localStorage.getItem("sysops_custom_backend_url") || ""
  );
  const [selectedServerId, setSelectedServerId] = useState(getActiveServerId());
  const [availableServers, setAvailableServers] = useState(getAllServers());
  
  const [newServerName, setNewServerName] = useState("");
  const [newServerUrl, setNewServerUrl] = useState("");
  const [newServerLocation, setNewServerLocation] = useState("");

  const [defaultDns, setDefaultDns] = useState(
    localStorage.getItem("sysops_default_dns") || "8.8.8.8"
  );
  const [icmpCount, setIcmpCount] = useState(
    localStorage.getItem("sysops_icmp_count") || "5"
  );
  const [requestTimeout, setRequestTimeout] = useState(
    localStorage.getItem("sysops_timeout") || "10"
  );
  const [autoResolveASN, setAutoResolveASN] = useState(
    localStorage.getItem("sysops_auto_asn") !== "false"
  );
  const [saved, setSaved] = useState(false);

  const saveSettings = (e) => {
    e.preventDefault();
    if (customBackendUrl.trim()) {
      localStorage.setItem("sysops_custom_backend_url", customBackendUrl.trim());
    } else {
      localStorage.removeItem("sysops_custom_backend_url");
    }
    setActiveServerId(selectedServerId);
    localStorage.setItem("sysops_default_dns", defaultDns);
    localStorage.setItem("sysops_icmp_count", icmpCount);
    localStorage.setItem("sysops_timeout", requestTimeout);
    localStorage.setItem("sysops_auto_asn", autoResolveASN);
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  };

  const handleAddServer = (e) => {
    e.preventDefault();
    if (!newServerName.trim() || !newServerUrl.trim()) return;

    const newServer = {
      id: `custom-${Date.now()}`,
      name: newServerName.trim(),
      url: newServerUrl.trim().replace(/\/+$/, ""),
      location: newServerLocation.trim() || "Custom Edge Node",
      region: "Remote Probe",
      color: "cyan"
    };

    const currentList = getStoredServers();
    const updated = [...currentList, newServer];
    saveStoredServers(updated);
    setAvailableServers(getAllServers());
    setSelectedServerId(newServer.id);
    setActiveServerId(newServer.id);
    setNewServerName("");
    setNewServerUrl("");
    setNewServerLocation("");
  };

  const handleRemoveServer = (id) => {
    const currentList = getStoredServers().filter(s => s.id !== id);
    saveStoredServers(currentList);
    if (selectedServerId === id) {
      setSelectedServerId("local");
      setActiveServerId("local");
    }
    setAvailableServers(getAllServers());
  };

  return (
    <div className="space-y-8 text-white max-w-4xl mx-auto w-full">
        
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto space-y-3">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 text-xs font-mono">
            <SettingsIcon className="w-3.5 h-3.5" />
            DIAGNOSTIC ENGINE & MULTI-PROBE CONFIGURATION
          </div>
          <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight font-['Outfit']">
            SysOps <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-emerald-400">Settings Vault</span>
          </h1>
          <p className="text-gray-400 text-xs sm:text-sm">
            Configure custom backend daemon URLs, add multiple distributed probe servers to benchmark pings from different locations, and adjust socket timeouts.
          </p>
        </div>

        {/* Settings Form */}
        <form onSubmit={saveSettings} className="space-y-6">
          
          {/* Section 1: Full Backend URL & Active Server Selection */}
          <div className="glass-panel p-6 rounded-2xl border border-white/10 space-y-5">
            <div className="flex items-center justify-between border-b border-white/5 pb-3">
              <h2 className="text-sm font-bold font-['Outfit'] text-white flex items-center gap-2">
                <Server className="w-4 h-4 text-cyan-400" />
                Backend Daemon URL & Active Probe Node
              </h2>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">
                ACTIVE: {getActiveBackendUrl()}
              </span>
            </div>

            {/* Custom Full Backend URL input */}
            <div className="space-y-2">
              <label className="text-xs font-mono text-gray-300 font-semibold block">
                Full Backend API Base URL:
              </label>
              <div className="relative">
                <Globe className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                <input
                  type="text"
                  value={customBackendUrl}
                  onChange={(e) => setCustomBackendUrl(e.target.value)}
                  placeholder="e.g. http://localhost:5012 or https://api.yourdomain.com"
                  className="w-full bg-[#0d121e] border border-white/10 rounded-xl pl-10 pr-3.5 py-3 text-white focus:outline-none focus:border-cyan-500 text-xs font-mono placeholder:text-gray-600"
                />
              </div>
              <p className="text-[11px] text-gray-400 font-mono">
                Enter your complete backend URL (including protocol and port, e.g. <span className="text-cyan-400">http://localhost:5012</span> or a remote server IP/domain). Overrides default local daemon.
              </p>
            </div>

            {/* Active Server Selection Dropdown */}
            <div className="space-y-2 pt-2 border-t border-white/5">
              <label className="text-xs font-mono text-gray-300 font-semibold block">
                Active Diagnostic Probe Node (Default server for tests):
              </label>
              <select
                value={selectedServerId}
                onChange={(e) => {
                  setSelectedServerId(e.target.value);
                  const found = availableServers.find(s => s.id === e.target.value);
                  if (found) {
                    setCustomBackendUrl(found.url);
                  }
                }}
                className="w-full bg-[#0d121e] border border-white/10 rounded-xl px-3.5 py-3 text-white focus:outline-none focus:border-cyan-500 text-xs font-mono cursor-pointer"
              >
                {availableServers.map((srv) => (
                  <option key={srv.id} value={srv.id}>
                    {srv.name} — {srv.location} ({srv.url})
                  </option>
                ))}
              </select>
            </div>
          </div>

            {/* Section 2: Custom Multi-Probe Server Management */}
            <div className="glass-panel p-6 rounded-2xl border border-white/10 space-y-4">
              <div className="flex items-center justify-between border-b border-white/5 pb-3">
                <h2 className="text-sm font-bold font-['Outfit'] text-white flex items-center gap-2">
                  <Radio className="w-4 h-4 text-purple-400" />
                  Distributed Multi-Server Nodes
                </h2>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-purple-500/10 text-purple-400 border border-purple-500/20">
                  {availableServers.length} NODES CONFIGURED
                </span>
              </div>

              {/* Node List */}
              <div className="space-y-2">
                {availableServers.map((s) => (
                  <div key={s.id} className="flex items-center justify-between p-3 rounded-xl bg-white/[0.02] hover:bg-white/[0.04] border border-white/5 text-xs font-mono transition-colors">
                    <div className="flex items-center gap-3">
                      <span className={`w-2.5 h-2.5 rounded-full ${s.id === selectedServerId ? 'bg-cyan-400 shadow-[0_0_8px_rgba(6,182,212,0.8)]' : 'bg-gray-600'}`} />
                      <div>
                        <div className="text-white font-bold flex items-center gap-2">
                          {s.name}
                          {s.id === selectedServerId && (
                            <span className="text-[10px] px-2 py-0.2 rounded bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">
                              Active
                            </span>
                          )}
                        </div>
                        <div className="text-gray-400 text-[11px]">{s.location} • <span className="text-cyan-400">{s.url}</span></div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      {s.id !== "active-daemon" && s.id !== "local" ? (
                        <button
                          type="button"
                          onClick={() => handleRemoveServer(s.id)}
                          title={`Remove ${s.name}`}
                          className="px-2.5 py-1.5 rounded-lg bg-red-500/10 hover:bg-red-500/20 text-red-400 hover:text-red-300 border border-red-500/20 text-[11px] font-mono flex items-center gap-1.5 transition-all cursor-pointer"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                          <span>Remove</span>
                        </button>
                      ) : (
                        <span className="text-[10px] font-mono text-cyan-400 px-2 py-1 bg-cyan-500/10 rounded border border-cyan-500/20">
                          Active Primary
                        </span>
                      )}
                    </div>
                  </div>
                ))}
              </div>

              {/* Add Custom Server Inputs */}
              <div className="pt-3 border-t border-white/5 space-y-3">
                <span className="text-xs font-mono text-gray-300 font-semibold block">
                  Add Additional Server / Edge Node:
                </span>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                  <input
                    type="text"
                    value={newServerName}
                    onChange={(e) => setNewServerName(e.target.value)}
                    placeholder="Node Name (e.g. EU Node 2)"
                    className="bg-[#0d121e] border border-white/10 rounded-xl px-3 py-2 text-white text-xs font-mono focus:outline-none focus:border-purple-500"
                  />
                  <input
                    type="text"
                    value={newServerUrl}
                    onChange={(e) => setNewServerUrl(e.target.value)}
                    placeholder="Backend URL (e.g. http://192.168.1.50:5012)"
                    className="bg-[#0d121e] border border-white/10 rounded-xl px-3 py-2 text-white text-xs font-mono focus:outline-none focus:border-purple-500"
                  />
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={newServerLocation}
                      onChange={(e) => setNewServerLocation(e.target.value)}
                      placeholder="Location (e.g. London, UK)"
                      className="flex-1 bg-[#0d121e] border border-white/10 rounded-xl px-3 py-2 text-white text-xs font-mono focus:outline-none focus:border-purple-500"
                    />
                    <button
                      type="button"
                      onClick={handleAddServer}
                      className="px-3 py-2 rounded-xl bg-purple-500/20 hover:bg-purple-500/30 text-purple-300 border border-purple-500/30 font-bold text-xs flex items-center gap-1 cursor-pointer"
                    >
                      <Plus className="w-3.5 h-3.5" /> Add
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Section 3: Probing Parameters */}
            <div className="glass-panel p-6 rounded-2xl border border-white/10 space-y-4">
              <div className="flex items-center justify-between border-b border-white/5 pb-3">
                <h2 className="text-sm font-bold font-['Outfit'] text-white flex items-center gap-2">
                  <Terminal className="w-4 h-4 text-emerald-400" />
                  Raw Socket & Probe Tuning
                </h2>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">
                  LOW-LEVEL SOCKETS
                </span>
              </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs font-mono">
              <div className="space-y-1.5">
                <label className="text-gray-400">ICMP Packet Sample Count</label>
                <input
                  type="number"
                  min="3"
                  max="20"
                  value={icmpCount}
                  onChange={(e) => setIcmpCount(e.target.value)}
                  className="w-full bg-[#0d121e] border border-white/10 rounded-xl px-3.5 py-2.5 text-white focus:outline-none focus:border-emerald-500 text-xs font-mono"
                />
                <p className="text-[11px] text-gray-500">Packets dispatched per ping benchmark (default: 5)</p>
              </div>

              <div className="space-y-1.5">
                <label className="text-gray-400">TCP Handshake Timeout (Seconds)</label>
                <input
                  type="number"
                  min="2"
                  max="30"
                  value={requestTimeout}
                  onChange={(e) => setRequestTimeout(e.target.value)}
                  className="w-full bg-[#0d121e] border border-white/10 rounded-xl px-3.5 py-2.5 text-white focus:outline-none focus:border-emerald-500 text-xs font-mono"
                />
                <p className="text-[11px] text-gray-500">Max wait for TLS handshake / HTTP headers</p>
              </div>
            </div>

            <div className="pt-2 flex items-center gap-3">
              <input
                type="checkbox"
                id="autoAsn"
                checked={autoResolveASN}
                onChange={(e) => setAutoResolveASN(e.target.checked)}
                className="w-4 h-4 rounded bg-[#0d121e] border-white/20 text-cyan-500 focus:ring-0 cursor-pointer"
              />
              <label htmlFor="autoAsn" className="text-xs text-gray-300 font-mono cursor-pointer">
                Automatically resolve reverse PTR hostnames on intermediate Traceroute hops
              </label>
            </div>
          </div>

          {/* Section 3: Save Actions */}
          <div className="flex items-center justify-between pt-2">
            <span className="text-xs font-mono text-gray-500">
              Settings persist locally across your browser session
            </span>
            <button
              type="submit"
              className="flex items-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-cyan-500 to-emerald-400 hover:from-cyan-400 hover:to-emerald-300 text-[#07090e] font-bold text-xs tracking-tight transition-all shadow-[0_0_20px_rgba(6,182,212,0.35)] cursor-pointer"
            >
              {saved ? <Check className="w-4 h-4 text-[#07090e]" /> : <Save className="w-4 h-4" />}
              {saved ? "Configuration Saved!" : "Save Configuration"}
            </button>
          </div>

        </form>

      </div>
  );
};

export default Settings;
