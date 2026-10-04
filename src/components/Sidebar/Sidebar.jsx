import React from "react";
import { Link, useLocation } from "react-router-dom";
import { 
  Server, Layers, Terminal, Shield, Globe, 
  Cpu, Wrench, Settings as SettingsIcon, Wifi, 
  Activity, Radio, Home, Network
} from "lucide-react";
import { getActiveBackendUrl } from "../../utils/apiConfig";

const Sidebar = () => {
  const location = useLocation();

  const primaryNavigation = [
    { name: "Overview Hub", path: "/home", icon: Home, badge: "DASHBOARD" },
    { name: "Server Vitals", path: "/quickstats", icon: Server, badge: "CORE" },
    { name: "Multi-Audit Matrix", path: "/multi", icon: Layers, badge: "PARALLEL" },
  ];

  const diagnosticBlades = [
    { name: "ICMP Raw Ping", path: "/ping", icon: Terminal },
    { name: "TCP Port Scanner", path: "/ports", icon: Radio },
    { name: "Security Headers Audit", path: "/security-headers", icon: Shield },
    { name: "DNS Propagation Grid", path: "/propagation", icon: Globe },
    { name: "BGP / ASN Inspector", path: "/bgp", icon: Network },
    { name: "HTTP / Headers", path: "/http", icon: Server },
    { name: "TLS / SSL Audit", path: "/ssl", icon: Shield },
    { name: "DNS Records Query", path: "/DNSLookup", icon: Globe },
    { name: "NS Authority Check", path: "/NSLookup", icon: Wifi },
    { name: "Network Traceroute", path: "/TraceRoute", icon: Cpu },
    { name: "WHOIS Domain Ledger", path: "/whois", icon: Activity },
  ];

  const utilitySection = [
    { name: "SysAdmin Deck", path: "/tools", icon: Wrench },
    { name: "Architecture Specs", path: "/websitemonitoring", icon: Radio },
    { name: "Settings Vault", path: "/settings", icon: SettingsIcon },
  ];

  return (
    <aside className="w-64 shrink-0 border-r border-white/5 bg-[#07090e]/95 backdrop-blur-xl min-h-screen p-4 flex flex-col justify-between hidden md:flex sticky top-0 h-screen">
      
      {/* Brand & Navigation */}
      <div className="space-y-6 overflow-y-auto pr-1">
        
        {/* Brand */}
        <Link to="/home" className="flex items-center gap-3 px-2 py-1.5 group">
          <div className="w-9 h-9 rounded-xl bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center group-hover:border-cyan-400/60 transition-all shadow-[0_0_15px_-3px_rgba(6,182,212,0.3)]">
            <Server className="w-4 h-4 text-cyan-400" />
          </div>
          <div className="flex flex-col">
            <div className="flex items-center gap-1.5 leading-none">
              <span className="text-base font-bold text-white font-['Outfit'] tracking-tight">
                SysOps<span className="text-cyan-400">Toolkit</span>
              </span>
              <span className="text-[9px] px-1.5 py-0.5 rounded bg-cyan-500/10 text-cyan-400 border border-cyan-500/20 font-mono font-medium">
                CLI
              </span>
            </div>
            <span className="text-[10px] text-gray-500 font-mono tracking-wider uppercase mt-1">
              Server Diagnostics
            </span>
          </div>
        </Link>

        {/* Section 1: Main Workbenches */}
        <div className="space-y-1">
          <p className="px-3 text-[10px] font-mono uppercase tracking-wider text-gray-500 font-bold mb-2">
            Workbenches
          </p>
          {primaryNavigation.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname.toLowerCase() === item.path.toLowerCase();
            return (
              <Link
                key={item.path}
                to={item.path}
                className={`flex items-center justify-between px-3 py-2 rounded-xl text-xs font-medium transition-all ${
                  isActive
                    ? "bg-cyan-500/15 text-cyan-400 border border-cyan-500/30 font-bold shadow-[0_0_12px_-3px_rgba(6,182,212,0.25)]"
                    : "text-gray-400 hover:text-white hover:bg-white/5 border border-transparent"
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <Icon className={`w-4 h-4 ${isActive ? "text-cyan-400" : "text-gray-400"}`} />
                  {item.name}
                </div>
                {item.badge && (
                  <span className={`text-[9px] font-mono px-1.5 py-0.5 rounded ${
                    isActive ? "bg-cyan-500/20 text-cyan-300" : "bg-white/5 text-gray-500"
                  }`}>
                    {item.badge}
                  </span>
                )}
              </Link>
            );
          })}
        </div>

        {/* Section 2: Dedicated Diagnostic Blades */}
        <div className="space-y-1">
          <p className="px-3 text-[10px] font-mono uppercase tracking-wider text-gray-500 font-bold mb-2">
            Individual Blades
          </p>
          {diagnosticBlades.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname.toLowerCase() === item.path.toLowerCase();
            return (
              <Link
                key={item.path}
                to={item.path}
                className={`flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-medium transition-all ${
                  isActive
                    ? "bg-cyan-500/15 text-cyan-400 border border-cyan-500/30 font-bold shadow-[0_0_12px_-3px_rgba(6,182,212,0.25)]"
                    : "text-gray-400 hover:text-white hover:bg-white/5 border border-transparent"
                }`}
              >
                <Icon className={`w-4 h-4 ${isActive ? "text-cyan-400" : "text-gray-400"}`} />
                {item.name}
              </Link>
            );
          })}
        </div>

        {/* Section 3: SysAdmin Tools & Settings */}
        <div className="space-y-1">
          <p className="px-3 text-[10px] font-mono uppercase tracking-wider text-gray-500 font-bold mb-2">
            System & Config
          </p>
          {utilitySection.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname.toLowerCase() === item.path.toLowerCase();
            return (
              <Link
                key={item.path}
                to={item.path}
                className={`flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-medium transition-all ${
                  isActive
                    ? "bg-cyan-500/15 text-cyan-400 border border-cyan-500/30 font-bold shadow-[0_0_12px_-3px_rgba(6,182,212,0.25)]"
                    : "text-gray-400 hover:text-white hover:bg-white/5 border border-transparent"
                }`}
              >
                <Icon className={`w-4 h-4 ${isActive ? "text-cyan-400" : "text-gray-400"}`} />
                {item.name}
              </Link>
            );
          })}
        </div>

      </div>

      {/* Footer Daemon Status */}
      <div className="pt-4 border-t border-white/5">
        <div className="p-3 rounded-xl bg-white/[0.02] border border-white/5 space-y-1 text-xs font-mono">
          <div className="flex items-center justify-between text-gray-400">
            <span className="text-[11px]">Active Backend:</span>
            <span className="text-emerald-400 font-bold flex items-center gap-1 text-[11px]">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
              CONNECTED
            </span>
          </div>
          <div className="text-[10px] text-cyan-400 font-mono truncate" title={getActiveBackendUrl()}>
            {getActiveBackendUrl()}
          </div>
          <div className="text-[10px] text-gray-500 truncate">
            DNS Resolver: {localStorage.getItem("sysops_default_dns") || "1.1.1.1"}
          </div>
        </div>
      </div>

    </aside>
  );
};

export default Sidebar;
