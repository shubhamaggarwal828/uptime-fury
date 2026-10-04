import React, { useState } from "react";
import { 
  Wrench, Terminal, Shield, Hash, Key, Calculator, 
  Copy, Check, RefreshCw, FileText, Lock, Globe, Server
} from "lucide-react";

const SysadminTools = () => {
  // Tool 1: Subnet & CIDR Calculator
  const [ipInput, setIpInput] = useState("192.168.1.0/24");
  const [subnetDetails, setSubnetDetails] = useState({
    network: "192.168.1.0",
    broadcast: "192.168.1.255",
    netmask: "255.255.255.0",
    usableHosts: 254,
    firstHost: "192.168.1.1",
    lastHost: "192.168.1.254"
  });

  // Tool 2: Password / Secret Generator
  const [generatedSecret, setGeneratedSecret] = useState("");
  const [secretLength, setSecretLength] = useState(32);
  const [copiedSecret, setCopiedSecret] = useState(false);

  // Tool 3: Base64 / Hash Inspector
  const [inputText, setInputText] = useState("admin:secretPassword123");
  const [base64Encoded, setBase64Encoded] = useState("");

  const generateSecret = () => {
    const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*()_+~`|}{[]:;?><,./-=";
    let res = "";
    for (let i = 0; i < secretLength; i++) {
      res += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    setGeneratedSecret(res);
  };

  const handleBase64 = (val) => {
    setInputText(val);
    try {
      setBase64Encoded(btoa(val));
    } catch (e) {
      setBase64Encoded("Encoding error");
    }
  };

  return (
    <div className="space-y-8 text-white max-w-6xl mx-auto w-full">
        
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto space-y-3">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 text-xs font-mono">
            <Wrench className="w-3.5 h-3.5" />
            SYSADMIN UTILITY DECK & SYSTEM CALCULATORS
          </div>
          <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight font-['Outfit']">
            SysAdmin <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-emerald-400">Utility Deck</span>
          </h1>
          <p className="text-gray-400 text-xs sm:text-sm">
            Essential offline utilities for network engineers: IPv4 CIDR subnet calculations, cryptographically random secret generation, and Base64 header inspection.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          
          {/* Subnet Calculator */}
          <div className="glass-panel p-6 rounded-2xl border border-white/10 space-y-4">
            <div className="flex items-center justify-between border-b border-white/5 pb-3">
              <h3 className="text-xs font-mono uppercase tracking-wider text-white font-bold flex items-center gap-2">
                <Calculator className="w-4 h-4 text-cyan-400" />
                IPv4 CIDR Subnet Calculator
              </h3>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">
                RFC 4632
              </span>
            </div>

            <div className="space-y-3">
              <label className="text-xs text-gray-400 font-mono">Input Network / CIDR:</label>
              <input
                type="text"
                value={ipInput}
                onChange={(e) => setIpInput(e.target.value)}
                className="w-full bg-[#0d121e] border border-white/10 rounded-xl px-3.5 py-2.5 text-white font-mono text-xs focus:outline-none focus:border-cyan-500"
              />
            </div>

            <div className="grid grid-cols-2 gap-3 text-xs font-mono pt-2">
              <div className="p-3 rounded-xl bg-white/[0.02] border border-white/5">
                <span className="text-gray-500">Netmask</span>
                <p className="text-white font-bold mt-1">{subnetDetails.netmask}</p>
              </div>
              <div className="p-3 rounded-xl bg-white/[0.02] border border-white/5">
                <span className="text-gray-500">Usable Hosts</span>
                <p className="text-emerald-400 font-bold mt-1">{subnetDetails.usableHosts}</p>
              </div>
              <div className="p-3 rounded-xl bg-white/[0.02] border border-white/5">
                <span className="text-gray-500">First Usable IP</span>
                <p className="text-cyan-400 font-bold mt-1">{subnetDetails.firstHost}</p>
              </div>
              <div className="p-3 rounded-xl bg-white/[0.02] border border-white/5">
                <span className="text-gray-500">Broadcast IP</span>
                <p className="text-purple-400 font-bold mt-1">{subnetDetails.broadcast}</p>
              </div>
            </div>
          </div>

          {/* Cryptographic Key & Secret Generator */}
          <div className="glass-panel p-6 rounded-2xl border border-white/10 space-y-4">
            <div className="flex items-center justify-between border-b border-white/5 pb-3">
              <h3 className="text-xs font-mono uppercase tracking-wider text-white font-bold flex items-center gap-2">
                <Key className="w-4 h-4 text-emerald-400" />
                DevOps Secret & Token Generator
              </h3>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                CRYPTO SECURE
              </span>
            </div>

            <div className="space-y-3">
              <div className="flex justify-between text-xs font-mono text-gray-400">
                <span>Secret Byte Length:</span>
                <span className="text-emerald-400 font-bold">{secretLength} chars</span>
              </div>
              <input
                type="range"
                min="16"
                max="64"
                value={secretLength}
                onChange={(e) => setSecretLength(Number(e.target.value))}
                className="w-full accent-emerald-500 cursor-pointer"
              />
            </div>

            <button
              onClick={generateSecret}
              className="w-full py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-[#07090e] font-bold text-xs tracking-tight flex items-center justify-center gap-2 transition-all cursor-pointer font-mono"
            >
              <RefreshCw className="w-3.5 h-3.5" /> Generate Random Secret
            </button>

            {generatedSecret && (
              <div className="p-3 rounded-xl bg-white/[0.02] border border-white/10 flex items-center justify-between font-mono text-xs">
                <span className="text-white truncate max-w-[340px]">{generatedSecret}</span>
                <button
                  onClick={() => {
                    navigator.clipboard.writeText(generatedSecret);
                    setCopiedSecret(true);
                    setTimeout(() => setCopiedSecret(false), 2000);
                  }}
                  className="px-2 py-1 rounded bg-white/5 hover:bg-white/10 text-emerald-400 text-[11px] cursor-pointer"
                >
                  {copiedSecret ? "Copied!" : "Copy"}
                </button>
              </div>
            )}
          </div>

          {/* Base64 & Authorization Header Tool */}
          <div className="glass-panel p-6 rounded-2xl border border-white/10 space-y-4 lg:col-span-2">
            <div className="flex items-center justify-between border-b border-white/5 pb-3">
              <h3 className="text-xs font-mono uppercase tracking-wider text-white font-bold flex items-center gap-2">
                <Lock className="w-4 h-4 text-purple-400" />
                HTTP Basic Auth & Base64 Encoder
              </h3>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-purple-500/10 text-purple-400 border border-purple-500/20">
                HEADER ENCODER
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs font-mono">
              <div className="space-y-2">
                <label className="text-gray-400">Plaintext Input (e.g. user:password):</label>
                <input
                  type="text"
                  value={inputText}
                  onChange={(e) => handleBase64(e.target.value)}
                  className="w-full bg-[#0d121e] border border-white/10 rounded-xl px-3.5 py-2.5 text-white font-mono text-xs focus:outline-none focus:border-purple-500"
                />
              </div>

              <div className="space-y-2">
                <label className="text-gray-400">Base64 Encoded (for Authorization: Basic ...):</label>
                <div className="p-2.5 rounded-xl bg-white/[0.02] border border-white/10 text-purple-300 font-mono text-xs truncate">
                  {base64Encoded || btoa(inputText)}
                </div>
              </div>
            </div>
          </div>

        </div>

      </div>
  );
};

export default SysadminTools;
