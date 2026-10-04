import React from "react";
import { Link } from "react-router-dom";
import { 
  Server, Terminal, Shield, Globe, Cpu, CheckCircle2, 
  ArrowRight, HardDrive, Layers, Activity, Radio, Lock
} from "lucide-react";

const WebsiteMonitoring = () => {
  const architectures = [
    {
      title: "ICMP Raw Socket Subsystem",
      desc: "Dispatches direct raw network ping requests against target hosts with a 5-packet sample size. Analyzes packet loss, min/max latency boundaries, and standard deviation jitter.",
      badge: "LAYER 3 / IP",
      accent: "text-emerald-400"
    },
    {
      title: "X.509 Cryptographic TLS Handshaker",
      desc: "Connects on TCP port 443 via TLS socket to fetch the peer certificate chain. Audits root Certificate Authorities, validity expiry horizons, SAN wildcard lists, and SHA-256 fingerprints.",
      badge: "LAYER 6 / TLS",
      accent: "text-cyan-400"
    },
    {
      title: "Anycast Recursive DNS Resolver",
      desc: "Resolves canonical DNS records across primary resolvers (Google 8.8.8.8, Cloudflare 1.1.1.1). Supports A, AAAA, MX, NS, CNAME, SOA, TXT, and CAA records.",
      badge: "LAYER 7 / DNS",
      accent: "text-teal-400"
    },
    {
      title: "Reverse Proxy & HTTP Header Benchmark",
      desc: "Issues HTTP/1.1 and HTTP/2 GET probes to measure server response latency, inspect Content-Security-Policy & HSTS enforcement, and identify reverse-proxy software (Nginx, Apache, Cloudflare).",
      badge: "LAYER 7 / HTTP",
      accent: "text-purple-400"
    },
    {
      title: "Authoritative WHOIS Domain Ledger",
      desc: "Queries port 43 TCP WHOIS daemons to retrieve authoritative ICANN registrar records, registration lifecycles, and registry lock statuses.",
      badge: "REGISTRY LEDGER",
      accent: "text-amber-400"
    },
    {
      title: "Autonomous System Traceroute Engine",
      desc: "Executes hop-by-hop router discovery to identify network transit hops, gateway packet drops, and carrier routing anomalies.",
      badge: "ROUTING HOPS",
      accent: "text-rose-400"
    }
  ];

  return (
    <div className="space-y-12 text-white max-w-6xl mx-auto w-full">
        
        {/* Title */}
        <div className="text-center max-w-3xl mx-auto space-y-4">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 text-xs font-mono">
            <Layers className="w-3.5 h-3.5" />
            ENGINEERING & ARCHITECTURE SPECIFICATION
          </div>
          <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight font-['Outfit']">
            SysAdmin Diagnostics <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-emerald-400">Architecture</span>
          </h1>
          <p className="text-gray-400 text-sm leading-relaxed">
            Detailed breakdown of how the SysOps diagnostic daemon probes network endpoints, captures raw socket telemetry, and verifies server vitals in real-time.
          </p>
        </div>

        {/* Diagnostic Pipeline Architecture */}
        <div className="glass-panel p-6 sm:p-8 rounded-2xl border border-white/10 space-y-6">
          <div className="flex items-center justify-between border-b border-white/5 pb-4">
            <h2 className="text-base font-bold font-['Outfit'] text-white flex items-center gap-2">
              <Server className="w-4 h-4 text-cyan-400" />
              Real-Time Diagnostic Pipeline
            </h2>
            <span className="text-xs font-mono px-2.5 py-1 rounded bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">
              SOCKET DAEMON (5012)
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-4 rounded-xl bg-white/[0.02] border border-white/5 space-y-2">
              <div className="text-xs font-mono text-cyan-400 font-bold">01. INGEST & DISCOVERY</div>
              <p className="text-xs text-gray-400">
                Normalizes target FQDN / IPv4 input, handles protocol stripping, and executes recursive DNS resolution to acquire raw destination IPs.
              </p>
            </div>
            <div className="p-4 rounded-xl bg-white/[0.02] border border-white/5 space-y-2">
              <div className="text-xs font-mono text-emerald-400 font-bold">02. MULTI-VECTOR PROBING</div>
              <p className="text-xs text-gray-400">
                Dispatches concurrent probes across raw ICMP sockets, TLS handshakes, HTTP request benchmarks, and WHOIS port 43 servers.
              </p>
            </div>
            <div className="p-4 rounded-xl bg-white/[0.02] border border-white/5 space-y-2">
              <div className="text-xs font-mono text-purple-400 font-bold">03. TELEMETRY SYNTHESIS</div>
              <p className="text-xs text-gray-400">
                Aggregates response times, calculates jitter variance, extracts security headers, and streams structured JSON payloads to the frontend.
              </p>
            </div>
          </div>
        </div>

        {/* 6 Subsystem Cards */}
        <div className="space-y-4">
          <h2 className="text-xl font-bold font-['Outfit']">Diagnostic Subsystems</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {architectures.map((item, idx) => (
              <div key={idx} className="glass-panel p-5 rounded-xl border border-white/10 space-y-2">
                <div className="flex items-center justify-between">
                  <h3 className={`text-sm font-bold font-['Outfit'] ${item.accent}`}>
                    {item.title}
                  </h3>
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-white/5 text-gray-400 border border-white/10">
                    {item.badge}
                  </span>
                </div>
                <p className="text-xs text-gray-400 leading-relaxed">
                  {item.desc}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* CTA Launch */}
        <div className="text-center pt-4">
          <Link
            to="/quickstats"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-cyan-500 to-emerald-400 hover:from-cyan-400 hover:to-emerald-300 text-[#07090e] font-bold text-xs tracking-tight transition-all shadow-[0_0_20px_rgba(6,182,212,0.35)]"
          >
            Launch Server Vitals Probe <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

      </div>
  );
};

export default WebsiteMonitoring;
