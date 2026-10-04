import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { 
  Server, Terminal, Shield, Globe, Cpu, Zap, 
  ArrowRight, ChevronRight, Activity, HardDrive, Network, Wifi, Radio
} from "lucide-react";

const Home = () => {
  const [targetHost, setTargetHost] = useState("");
  const navigate = useNavigate();

  const handleLaunch = (e) => {
    e?.preventDefault();
    const clean = targetHost.replace(/^https?:\/\//, '').trim();
    if (clean) {
      navigate(`/quickstats?target=${encodeURIComponent(clean)}`);
    } else {
      navigate('/quickstats');
    }
  };

  const sysadminTools = [
    {
      title: "Host Vitals & Response Benchmark",
      desc: "Simulate web client handshakes to measure TTFB, HTTP status headers, reverse-proxy caching, and raw server banners.",
      icon: Server,
      path: "/quickstats",
      badge: "HTTP / HEADERS",
      accent: "text-cyan-400",
      border: "hover:border-cyan-500/40"
    },
    {
      title: "TCP Port Scanner & Firewall Audit",
      desc: "Dispatch SYN connection attempts across 25 standardized ports to audit firewall policies and socket availability.",
      icon: Radio,
      path: "/ports",
      badge: "FIREWALL / PORTS",
      accent: "text-cyan-400",
      border: "hover:border-cyan-500/40"
    },
    {
      title: "Security Headers & Posture Score",
      desc: "Audit HSTS, CSP, and X-Frame-Options with A+ to F letter grades and copy-ready Nginx/Apache fix directives.",
      icon: Shield,
      path: "/security-headers",
      badge: "SECURITY / AUDIT",
      accent: "text-emerald-400",
      border: "hover:border-emerald-500/40"
    },
    {
      title: "Global DNS Propagation Grid",
      desc: "Compare DNS resolution across 8 global recursive anycast providers (Google, Cloudflare, Quad9, Cisco OpenDNS).",
      icon: Globe,
      path: "/propagation",
      badge: "ANYCAST DNS",
      accent: "text-teal-400",
      border: "hover:border-teal-500/40"
    },
    {
      title: "BGP Routing & Subnet CIDR Inspector",
      desc: "Resolve Autonomous System Numbers (ASNs), BGP routing prefixes, WAN CIDR blocks, and ISP peering organizations.",
      icon: Network,
      path: "/bgp",
      badge: "BGP / ASN",
      accent: "text-purple-400",
      border: "hover:border-purple-500/40"
    },
    {
      title: "ICMP Multi-Packet Ping & Jitter",
      desc: "Transmit 5 raw socket packets to compute minimum, maximum, average latency, and evaluate network bufferbloat.",
      icon: Terminal,
      path: "/ping",
      badge: "ICMP / JITTER",
      accent: "text-emerald-400",
      border: "hover:border-emerald-500/40"
    },
    {
      title: "X.509 TLS / SSL Certificate Inspector",
      desc: "Audit CA certificate chains, validity expiration countdowns, SAN alternative wildcards, and SHA-256 fingerprints.",
      icon: Shield,
      path: "/ssl",
      badge: "TLS / PKI",
      accent: "text-blue-400",
      border: "hover:border-blue-500/40"
    },
    {
      title: "Anycast DNS Records & Zone Query",
      desc: "Query recursive nameservers for A, AAAA, MX, NS, CNAME, TXT, SOA, and CAA records across Google and Cloudflare resolvers.",
      icon: Globe,
      path: "/DNSLookup",
      badge: "DNS RECORDS",
      accent: "text-teal-400",
      border: "hover:border-teal-500/40"
    },
    {
      title: "Authoritative NS Delegation Check",
      desc: "Inspect delegated Name Server authorities, registrar root delegations, and verify SOA zone serial numbers.",
      icon: Wifi,
      path: "/NSLookup",
      badge: "NS LOOKUP",
      accent: "text-purple-400",
      border: "hover:border-purple-500/40"
    },
    {
      title: "Network Traceroute & Hop Bottlenecks",
      desc: "Trace routing hops across Autonomous Systems (ASNs) and backplane gateways to isolate packet drops.",
      icon: Cpu,
      path: "/TraceRoute",
      badge: "ROUTER HOPS",
      accent: "text-amber-400",
      border: "hover:border-amber-500/40"
    }
  ];

  return (
    <div className="space-y-12 text-white max-w-7xl mx-auto w-full">
      
      {/* Hero Section */}
      <section className="relative pt-6 pb-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto text-center space-y-6">
        
        {/* Status Badge */}
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 text-xs font-mono tracking-wider">
          <Terminal className="w-3.5 h-3.5 text-cyan-400" />
          SYSADMIN & DEVOPS SERVER VITALS DIAGNOSTICS SUITE
        </div>

        {/* Hero Title */}
        <div className="max-w-4xl mx-auto space-y-4">
          <h1 className="text-4xl sm:text-6xl font-extrabold tracking-tight font-['Outfit'] leading-[1.15]">
            Instant Infrastructure Vitals & <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-teal-300 to-emerald-400">Network Diagnostics</span>
          </h1>
          <p className="text-gray-400 text-sm sm:text-base max-w-2xl mx-auto leading-relaxed">
            A developer-first diagnostic workbench for Systems Administrators, SREs, and Network Engineers. Benchmark live server latency, verify TLS certificates, query authoritative DNS, and inspect routing hops.
          </p>
        </div>

        {/* Quick Launch Input */}
        <div className="max-w-xl mx-auto glass-panel p-2.5 rounded-2xl border border-white/10 shadow-[0_0_50px_-15px_rgba(6,182,212,0.25)]">
          <form 
            onSubmit={handleLaunch}
            className="flex items-center gap-2"
          >
            <div className="relative flex-1">
              <Globe className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
              <input
                type="text"
                value={targetHost}
                onChange={(e) => setTargetHost(e.target.value)}
                placeholder="Enter domain or IP (e.g. 1.1.1.1, github.com)"
                className="w-full bg-[#0d121e]/90 text-white pl-11 pr-4 py-3 rounded-xl border border-white/10 focus:border-cyan-500/50 focus:outline-none text-xs font-mono placeholder:text-gray-600"
              />
            </div>
            <button
              type="submit"
              className="px-5 py-3 rounded-xl bg-gradient-to-r from-cyan-500 to-emerald-400 hover:from-cyan-400 hover:to-emerald-300 text-[#07090e] font-bold text-xs tracking-tight flex items-center gap-1.5 transition-all shadow-[0_0_15px_rgba(6,182,212,0.35)] cursor-pointer"
            >
              Run Vitals <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </form>
        </div>

        {/* Live System Capabilities */}
        <div className="pt-6 max-w-4xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-3 text-left">
          <div className="p-3.5 rounded-xl bg-white/[0.02] border border-white/5">
            <div className="text-xs font-mono text-cyan-400 uppercase font-semibold">ICMP Sockets</div>
            <div className="text-xl font-bold font-['Outfit'] text-white mt-1">Raw Ping</div>
            <div className="text-[11px] text-gray-500 font-mono mt-0.5">5 Packet Sampling</div>
          </div>
          <div className="p-3.5 rounded-xl bg-white/[0.02] border border-white/5">
            <div className="text-xs font-mono text-emerald-400 uppercase font-semibold">X.509 Audit</div>
            <div className="text-xl font-bold font-['Outfit'] text-white mt-1">TLS / SSL</div>
            <div className="text-[11px] text-gray-500 font-mono mt-0.5">CA Chain & Expiry</div>
          </div>
          <div className="p-3.5 rounded-xl bg-white/[0.02] border border-white/5">
            <div className="text-xs font-mono text-teal-400 uppercase font-semibold">Zone Resolvers</div>
            <div className="text-xl font-bold font-['Outfit'] text-white mt-1">8 DNS Types</div>
            <div className="text-[11px] text-gray-500 font-mono mt-0.5">A, MX, CNAME, CAA</div>
          </div>
          <div className="p-3.5 rounded-xl bg-white/[0.02] border border-white/5">
            <div className="text-xs font-mono text-amber-400 uppercase font-semibold">Hop Analysis</div>
            <div className="text-xl font-bold font-['Outfit'] text-white mt-1">Traceroute</div>
            <div className="text-[11px] text-gray-500 font-mono mt-0.5">Gateway Bottlenecks</div>
          </div>
        </div>

      </section>

      {/* SysAdmin Tools Grid */}
      <section className="py-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-8">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/5 pb-4">
          <div>
            <h2 className="text-2xl font-bold tracking-tight font-['Outfit']">
              SysAdmin Diagnostics Workbench
            </h2>
            <p className="text-gray-400 text-xs">
              Direct telemetry probing tools for instant root-cause analysis and performance audits.
            </p>
          </div>
          <div className="flex items-center gap-2 text-xs font-mono text-gray-400">
            <span className="w-2 h-2 rounded-full bg-emerald-400" />
            Backend Daemon: Port 5012
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {sysadminTools.map((tool, idx) => {
            const Icon = tool.icon;
            return (
              <Link
                key={idx}
                to={tool.path}
                className={`glass-panel p-5 rounded-2xl border border-white/10 ${tool.border} transition-all group relative flex flex-col justify-between`}
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center">
                      <Icon className={`w-5 h-5 ${tool.accent}`} />
                    </div>
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-white/5 text-gray-400 border border-white/10">
                      {tool.badge}
                    </span>
                  </div>

                  <div>
                    <h3 className="text-base font-bold text-white group-hover:text-cyan-400 transition-colors font-['Outfit']">
                      {tool.title}
                    </h3>
                    <p className="text-xs text-gray-400 mt-1.5 leading-relaxed">
                      {tool.desc}
                    </p>
                  </div>
                </div>

                <div className="pt-5 flex items-center gap-1.5 text-xs font-semibold text-cyan-400 group-hover:translate-x-1 transition-transform">
                  Launch Inspector <ChevronRight className="w-3.5 h-3.5" />
                </div>
              </Link>
            );
          })}
        </div>
      </section>

    </div>
  );
};

export default Home;
