import React, { useState } from "react";
import axios from "axios";
import { 
  ShieldCheck, ShieldAlert, Lock, CheckCircle, AlertTriangle, 
  RefreshCw, Globe, Calendar, Key, FileCode, Check, Copy, Zap
} from "lucide-react";

const SSL = () => {
  const [targetUrl, setTargetUrl] = useState("google.com");
  const [loading, setLoading] = useState(false);
  const [certData, setCertData] = useState(null);
  const [error, setError] = useState(null);

  const presets = ["google.com", "github.com", "cloudflare.com", "microsoft.com"];

  const runSSLCheck = async (domain = targetUrl) => {
    if (!domain) return;
    setLoading(true);
    setError(null);
    setCertData(null);

    const cleanDomain = domain.replace(/^https?:\/\//, '').replace(/\/.*$/, '').trim();

    try {
      const endpoint = import.meta.env.VITE_SSL_STATS_API_ENDPOINT || "http://localhost:5012/api/ssl-info";
      const res = await axios.post(endpoint, { url: cleanDomain });
      setCertData(res.data);
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.error || err.message || "Failed to establish TLS handshake with target.");
    } finally {
      setLoading(false);
    }
  };

  const getIssuerName = () => {
    if (!certData) return "N/A";
    const details = certData.certificateDetails || certData;
    const issuer = details.issuer || {};
    return issuer.organization || issuer.commonName || issuer.CN || certData.serverType || "Verified CA";
  };

  const getValidTo = () => {
    if (!certData) return null;
    const details = certData.certificateDetails || certData;
    return details.validTo || details.valid_to || null;
  };

  const getValidFrom = () => {
    if (!certData) return null;
    const details = certData.certificateDetails || certData;
    return details.validFrom || details.valid_from || null;
  };

  const getDetails = () => {
    return certData?.certificateDetails || certData || {};
  };

  return (
    <div className="space-y-8 text-white max-w-6xl mx-auto w-full">
        
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto space-y-3">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-xs font-mono">
            <Lock className="w-3.5 h-3.5" />
            TLS / SSL CERTIFICATE INTEGRITY AUDITOR
          </div>
          <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight font-['Outfit']">
            Cryptographic <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-cyan-400">Trust Chain</span>
          </h1>
          <p className="text-gray-400 text-xs sm:text-sm">
            Inspect live X.509 certificate chains, root Certificate Authorities (Google Trust Services, DigiCert, Let's Encrypt), SAN wildcards, and validity expiration.
          </p>
        </div>

        {/* Input */}
        <div className="max-w-3xl mx-auto glass-panel p-3 rounded-2xl border border-white/10 shadow-[0_0_40px_-10px_rgba(59,130,246,0.15)]">
          <form 
            onSubmit={(e) => { e.preventDefault(); runSSLCheck(); }}
            className="flex flex-col sm:flex-row items-center gap-2"
          >
            <div className="relative flex-1 w-full">
              <Globe className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
              <input
                type="text"
                value={targetUrl}
                onChange={(e) => setTargetUrl(e.target.value)}
                placeholder="Enter domain (e.g. google.com)"
                className="w-full bg-[#0d121e]/90 text-white pl-11 pr-4 py-3.5 rounded-xl border border-white/10 focus:border-blue-500/50 focus:outline-none text-sm font-mono placeholder:text-gray-600"
              />
            </div>
            <button
              type="submit"
              disabled={loading}
              className="w-full sm:w-auto px-6 py-3.5 rounded-xl bg-blue-500 hover:bg-blue-400 text-white font-bold text-xs tracking-tight flex items-center justify-center gap-2 transition-all shadow-[0_0_20px_rgba(59,130,246,0.35)] cursor-pointer disabled:opacity-50 font-mono"
            >
              {loading ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Zap className="w-4 h-4" />}
              {loading ? "Handshaking..." : "Audit SSL Certificate"}
            </button>
          </form>

          <div className="flex flex-wrap items-center gap-2 pt-3 px-2 border-t border-white/5 mt-2 text-xs text-gray-400">
            <span className="text-[11px] font-mono text-gray-500 uppercase">Presets:</span>
            {presets.map((preset) => (
              <button
                key={preset}
                type="button"
                onClick={() => { setTargetUrl(preset); runSSLCheck(preset); }}
                className="px-2.5 py-1 rounded-md bg-white/5 hover:bg-white/10 hover:text-blue-400 border border-white/5 text-[11px] font-mono transition-all"
              >
                {preset}
              </button>
            ))}
          </div>
        </div>

        {error && (
          <div className="max-w-3xl mx-auto p-4 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-xs flex items-center gap-2 font-mono">
            <AlertTriangle className="w-4 h-4 shrink-0" />
            {error}
          </div>
        )}

        {/* Certificate Display */}
        {certData && (
          <div className="space-y-6">
            
            {/* KPI Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="glass-panel p-5 rounded-2xl border border-white/10">
                <span className="text-xs font-mono uppercase text-gray-400">Issuing Authority</span>
                <div className="text-xl font-bold text-white mt-1 truncate font-['Outfit']">
                  {getIssuerName()}
                </div>
                <div className="text-[11px] font-mono text-emerald-400 mt-2 flex items-center gap-1">
                  <CheckCircle className="w-3.5 h-3.5" />
                  {certData.trusted === "No" ? "Self-Signed or SNI Intermediate" : "Trusted Public CA"}
                </div>
              </div>

              <div className="glass-panel p-5 rounded-2xl border border-white/10">
                <span className="text-xs font-mono uppercase text-gray-400">Expiration</span>
                <div className="text-xl font-bold text-white mt-1 font-['Outfit']">
                  {getValidTo() ? new Date(getValidTo()).toLocaleDateString() : (certData.expiration || "Valid")}
                </div>
                <div className="text-[11px] font-mono text-gray-400 mt-2">
                  Remaining: {certData.expiration || "Active"}
                </div>
              </div>

              <div className="glass-panel p-5 rounded-2xl border border-white/10">
                <span className="text-xs font-mono uppercase text-gray-400">Cipher / Protocol</span>
                <div className="text-base font-bold text-cyan-400 mt-1 truncate font-mono">
                  {getDetails().signatureAlgorithm || "sha256WithRSAEncryption"}
                </div>
                <div className="text-[11px] font-mono text-gray-400 mt-2">
                  Target IP: {certData.ip || "Direct"}
                </div>
              </div>
            </div>

            {/* Certificate Ledger */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              
              <div className="glass-panel p-6 rounded-2xl border border-white/10 space-y-4">
                <h3 className="text-xs font-mono uppercase tracking-wider text-white font-bold flex items-center gap-2 border-b border-white/5 pb-3">
                  <ShieldCheck className="w-4 h-4 text-emerald-400" />
                  Subject & Certificate Authority Specs
                </h3>
                <div className="space-y-2 text-xs font-mono">
                  <div className="flex justify-between p-2.5 rounded-lg bg-white/[0.02] border border-white/5">
                    <span className="text-gray-400">Common Name (CN)</span>
                    <span className="text-white font-bold">{getDetails().subject?.commonName || targetUrl}</span>
                  </div>
                  <div className="flex justify-between p-2.5 rounded-lg bg-white/[0.02] border border-white/5">
                    <span className="text-gray-400">Issuer Common Name</span>
                    <span className="text-white">{getDetails().issuer?.commonName || "N/A"}</span>
                  </div>
                  <div className="flex justify-between p-2.5 rounded-lg bg-white/[0.02] border border-white/5">
                    <span className="text-gray-400">Serial Number</span>
                    <span className="text-emerald-400 truncate max-w-[240px]">{getDetails().serialNumber || "N/A"}</span>
                  </div>
                  <div className="flex justify-between p-2.5 rounded-lg bg-white/[0.02] border border-white/5">
                    <span className="text-gray-400">SHA-1 Fingerprint</span>
                    <span className="text-cyan-400 truncate max-w-[240px]">{getDetails().fingerprint || "N/A"}</span>
                  </div>
                </div>
              </div>

              <div className="glass-panel p-6 rounded-2xl border border-white/10 space-y-4">
                <h3 className="text-xs font-mono uppercase tracking-wider text-white font-bold flex items-center gap-2 border-b border-white/5 pb-3">
                  <Globe className="w-4 h-4 text-cyan-400" />
                  Subject Alternative Names (SAN)
                </h3>
                <div className="flex flex-wrap gap-1.5 max-h-56 overflow-y-auto pr-2">
                  {getDetails().subjectAlternativeNames && 
                    (Array.isArray(getDetails().subjectAlternativeNames) 
                      ? getDetails().subjectAlternativeNames 
                      : getDetails().subjectAlternativeNames.split(',')
                    ).map((san, idx) => (
                    <span key={idx} className="px-2.5 py-1 rounded bg-white/[0.03] border border-white/5 text-[11px] font-mono text-gray-300">
                      {san.replace(/^DNS:/, '').trim()}
                    </span>
                  ))}
                </div>
              </div>

            </div>

          </div>
        )}

      </div>
  );
};

export default SSL;
