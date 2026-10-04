import React from "react";
import { Link } from "react-router-dom";
import { Activity, Shield, Terminal, Globe, GitBranch, Heart } from "lucide-react";

const Footer = () => {
  return (
    <footer className="border-t border-white/5 bg-[#07090e] text-gray-400 py-8 px-4 sm:px-6 lg:px-8 mt-12">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-8">
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-emerald-500/20 border border-emerald-500/30 flex items-center justify-center">
              <Activity className="w-4 h-4 text-emerald-400" />
            </div>
            <span className="text-base font-bold text-white font-['Outfit']">
              Uptime<span className="text-emerald-400">Fury</span>
            </span>
          </div>
          <p className="text-xs text-gray-500 leading-relaxed">
            Ultra-fast multi-region network latency diagnostics, SSL chain verifier, real-time packet loss probes, and DNS propagation inspector.
          </p>
          <div className="flex items-center gap-2 text-[11px] font-mono text-emerald-400/90">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
            All telemetry systems operational
          </div>
        </div>

        <div>
          <h4 className="text-xs font-semibold text-white uppercase tracking-wider mb-3 font-mono">Diagnostic Tools</h4>
          <ul className="space-y-2 text-xs">
            <li><Link to="/quickstats" className="hover:text-emerald-400 transition-colors">Unified Quick Diagnostics</Link></li>
            <li><Link to="/ping" className="hover:text-emerald-400 transition-colors">ICMP Multi-Packet Ping</Link></li>
            <li><Link to="/ssl" className="hover:text-emerald-400 transition-colors">SSL Certificate & SAN Chain</Link></li>
            <li><Link to="/http" className="hover:text-emerald-400 transition-colors">HTTP Status & Response Time</Link></li>
          </ul>
        </div>

        <div>
          <h4 className="text-xs font-semibold text-white uppercase tracking-wider mb-3 font-mono">Network Inspector</h4>
          <ul className="space-y-2 text-xs">
            <li><Link to="/DNSLookup" className="hover:text-emerald-400 transition-colors">Global DNS Record Queries</Link></li>
            <li><Link to="/NSLookup" className="hover:text-emerald-400 transition-colors">Name Server Authority Check</Link></li>
            <li><Link to="/whois" className="hover:text-emerald-400 transition-colors">WHOIS Domain Registrar Data</Link></li>
            <li><Link to="/TraceRoute" className="hover:text-emerald-400 transition-colors">Network Hop Traceroute</Link></li>
          </ul>
        </div>

        <div>
          <h4 className="text-xs font-semibold text-white uppercase tracking-wider mb-3 font-mono">Platform</h4>
          <ul className="space-y-2 text-xs">
            <li><Link to="/websitemonitoring" className="hover:text-emerald-400 transition-colors">Architecture Overview</Link></li>
            <li><Link to="/about-us" className="hover:text-emerald-400 transition-colors">About Engineering Team</Link></li>
            <li><Link to="/contact-us" className="hover:text-emerald-400 transition-colors">API Integration Support</Link></li>
            <li>
              <a
                href="https://github.com/shubhamaggarwal828/up-time-fury-deployement-final-prod-app"
                target="_blank"
                rel="noreferrer"
                className="hover:text-emerald-400 transition-colors flex items-center gap-1.5"
              >
                <GitBranch className="w-3.5 h-3.5" /> GitHub Repository
              </a>
            </li>
          </ul>
        </div>
      </div>

      <div className="max-w-7xl mx-auto pt-8 mt-8 border-t border-white/5 flex flex-col sm:flex-row items-center justify-between text-xs text-gray-500 gap-4 font-mono">
        <p>© 2024–2026 SysOpsToolkit / UptimeFury Network Diagnostics Engine. All rights reserved.</p>
        <p className="flex items-center gap-1">
          Engineered for reliability & precision performance
        </p>
      </div>
    </footer>
  );
};

export default Footer;
