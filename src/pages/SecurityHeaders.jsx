import React, { useState } from "react";
import axios from "axios";
import { 
  ShieldCheck, ShieldAlert, Lock, AlertTriangle, RefreshCw, 
  Globe, Terminal, CheckCircle2, XCircle, Code, Copy, Check, Zap, Server
} from "lucide-react";
import { getActiveBackendUrl } from "../utils/apiConfig";

const SecurityHeaders = () => {
  const [target, setTarget] = useState("google.com");
  const [loading, setLoading] = useState(false);
  const [auditResult, setAuditResult] = useState(null);
  const [error, setError] = useState(null);
  const [copiedKey, setCopiedKey] = useState(null);

  const presets = ["google.com", "github.com", "cloudflare.com", "microsoft.com"];

  const runAudit = async (domain = target) => {
    if (!domain) return;
    setLoading(true);
    setError(null);
    setAuditResult(null);

    try {
      const endpoint = `${getActiveBackendUrl()}/api/security-audit`;
      const res = await axios.post(endpoint, { url: domain });
      setAuditResult(res.data);
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.error || err.message || "Failed to inspect security headers.");
    } finally {
      setLoading(false);
    }
  };

  const copySnippet = (snippet, key) => {
    navigator.clipboard.writeText(snippet);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 2000);
  };

  const getGradeColor = (grade) => {
    switch (grade) {
      case "A+":
      case "A": return "text-emerald-400 border-emerald-500/30 bg-emerald-500/10";
      case "B": return "text-cyan-400 border-cyan-500/30 bg-cyan-500/10";
      case "C": return "text-amber-400 border-amber-500/30 bg-amber-500/10";
      case "D": return "text-orange-400 border-orange-500/30 bg-orange-500/10";
      default: return "text-red-400 border-red-500/30 bg-red-500/10";
    }
  };

  return (
    <div className="space-y-8 text-white max-w-6xl mx-auto w-full">
      
      {/* Title */}
      <div className="text-center max-w-3xl mx-auto space-y-3">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-mono">
          <ShieldCheck className="w-3.5 h-3.5" />
          HTTP SECURITY POSTURE & VULNERABILITY AUDIT
        </div>
        <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight font-['Outfit']">
          Security Headers & <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-teal-400">Posture Score</span>
        </h1>
        <p className="text-gray-400 text-xs sm:text-sm">
          Audit critical web defense headers (HSTS, CSP, X-Frame-Options, Permissions-Policy). Detect software version leakage and generate instant Nginx/Apache remediation snippets.
        </p>
      </div>

      {/* Input */}
      <div className="glass-panel p-3.5 rounded-2xl border border-white/10 shadow-[0_0_40px_-10px_rgba(16,185,129,0.15)] max-w-3xl mx-auto">
        <form 
          onSubmit={(e) => { e.preventDefault(); runAudit(); }}
          className="flex flex-col sm:flex-row items-center gap-2"
        >
          <div className="relative flex-1 w-full">
            <Globe className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
            <input
              type="text"
              value={target}
              onChange={(e) => setTarget(e.target.value)}
              placeholder="Enter domain or URL (e.g. github.com)"
              className="w-full bg-[#0d121e]/90 text-white pl-11 pr-4 py-3 rounded-xl border border-white/10 focus:border-emerald-500/50 focus:outline-none text-sm font-mono placeholder:text-gray-600"
            />
          </div>
          <button
            type="submit"
            disabled={loading}
            className="w-full sm:w-auto px-6 py-3 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-400 hover:from-emerald-400 hover:to-teal-300 text-[#07090e] font-bold text-xs tracking-tight flex items-center justify-center gap-2 transition-all shadow-[0_0_20px_rgba(16,185,129,0.35)] cursor-pointer disabled:opacity-50 font-mono"
          >
            {loading ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Zap className="w-4 h-4" />}
            {loading ? "Auditing..." : "Audit Security Posture"}
          </button>
        </form>

        <div className="flex flex-wrap items-center gap-2 pt-3 px-2 border-t border-white/5 mt-2 text-xs text-gray-400">
          <span className="text-[11px] font-mono text-gray-500 uppercase">Presets:</span>
          {presets.map((preset) => (
            <button
              key={preset}
              type="button"
              onClick={() => { setTarget(preset); runAudit(preset); }}
              className="px-2.5 py-1 rounded-md bg-white/5 hover:bg-white/10 hover:text-emerald-400 border border-white/5 text-[11px] font-mono transition-all"
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
      {auditResult && (
        <div className="space-y-6">
          
          {/* Top Score & Posture Banner */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            
            <div className="glass-panel p-5 rounded-2xl border border-white/10 flex items-center justify-between">
              <div>
                <span className="text-xs font-mono uppercase text-gray-400">Posture Grade</span>
                <div className={`text-4xl font-extrabold font-['Outfit'] mt-1 inline-block px-3 py-0.5 rounded-lg border ${getGradeColor(auditResult.grade)}`}>
                  {auditResult.grade}
                </div>
                <div className="text-[11px] font-mono text-gray-400 mt-2">
                  Score: {auditResult.score} / 100
                </div>
              </div>
              <div className="w-12 h-12 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center">
                <ShieldCheck className="w-6 h-6 text-emerald-400" />
              </div>
            </div>

            <div className="glass-panel p-5 rounded-2xl border border-white/10">
              <span className="text-xs font-mono uppercase text-gray-400">Protocol Handshake</span>
              <div className="text-xl font-bold text-white mt-1 font-mono">
                HTTP/{auditResult.httpVersion}
              </div>
              <div className="text-[11px] font-mono text-cyan-400 mt-2">
                Status: {auditResult.statusCode} Response
              </div>
            </div>

            <div className="glass-panel p-5 rounded-2xl border border-white/10">
              <span className="text-xs font-mono uppercase text-gray-400">Information Leakage</span>
              <div className={`text-base font-bold mt-1 font-mono ${auditResult.infoLeakage?.length > 0 ? 'text-amber-400' : 'text-emerald-400'}`}>
                {auditResult.infoLeakage?.length > 0 ? `${auditResult.infoLeakage.length} Warnings` : "Zero Leakage Detected"}
              </div>
              <div className="text-[11px] font-mono text-gray-400 mt-2">
                Banner Version Exposed: {auditResult.infoLeakage?.length > 0 ? "YES" : "NO"}
              </div>
            </div>

          </div>

          {/* Warnings if any */}
          {auditResult.infoLeakage?.length > 0 && (
            <div className="p-4 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-300 text-xs font-mono space-y-1">
              <div className="font-bold flex items-center gap-1.5">
                <AlertTriangle className="w-4 h-4 text-amber-400" /> Information Disclosure Warnings:
              </div>
              {auditResult.infoLeakage.map((warn, i) => (
                <div key={i} className="pl-5 text-gray-300">• {warn}</div>
              ))}
            </div>
          )}

          {/* Checklist Table */}
          <div className="glass-panel rounded-2xl border border-white/10 overflow-hidden shadow-2xl">
            <div className="px-6 py-4 border-b border-white/5 flex items-center justify-between">
              <h3 className="text-xs font-mono uppercase tracking-wider text-white font-bold flex items-center gap-2">
                <Terminal className="w-4 h-4 text-emerald-400" />
                Security Header Inspection Matrix ({auditResult.checks?.length} Vectored Checks)
              </h3>
            </div>

            <div className="divide-y divide-white/5 font-mono text-xs">
              {auditResult.checks?.map((check) => (
                <div key={check.key} className="p-5 hover:bg-white/[0.02] transition-colors space-y-3">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                    <div className="flex items-center gap-2.5">
                      {check.status === "PASS" ? (
                        <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                      ) : (
                        <XCircle className="w-4 h-4 text-red-400 shrink-0" />
                      )}
                      <div>
                        <span className="text-white font-bold text-sm">{check.title}</span>
                        <span className="text-gray-500 text-[11px] ml-2">+{check.weight} pts</span>
                      </div>
                    </div>
                    <span className={`px-2.5 py-0.5 rounded text-[10px] font-bold border self-start sm:self-auto ${
                      check.status === "PASS" 
                        ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/20" 
                        : "bg-red-500/10 text-red-400 border-red-500/20"
                    }`}>
                      {check.status === "PASS" ? "ACTIVE / SECURE" : "MISSING"}
                    </span>
                  </div>

                  <p className="text-gray-400 text-xs leading-relaxed">
                    {check.description}
                  </p>

                  {check.value && (
                    <div className="p-2.5 rounded-lg bg-black/40 border border-white/5 text-cyan-300 text-xs break-all">
                      <span className="text-gray-500 block text-[10px] mb-0.5">Detected Value:</span>
                      {check.value}
                    </div>
                  )}

                  {check.status === "FAIL" && check.remediation && (
                    <div className="pt-2">
                      <div className="flex items-center justify-between pb-1">
                        <span className="text-[11px] text-amber-400/90 font-bold flex items-center gap-1">
                          <Code className="w-3 h-3" /> Nginx / Web Server Fix Directive:
                        </span>
                        <button
                          type="button"
                          onClick={() => copySnippet(check.remediation, check.key)}
                          className="text-[10px] text-gray-400 hover:text-white flex items-center gap-1 cursor-pointer"
                        >
                          {copiedKey === check.key ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                          {copiedKey === check.key ? "Copied" : "Copy Directive"}
                        </button>
                      </div>
                      <pre className="p-2.5 rounded-lg bg-[#07090e] border border-white/10 text-emerald-300 text-[11px] overflow-x-auto">
                        {check.remediation}
                      </pre>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

        </div>
      )}

    </div>
  );
};

export default SecurityHeaders;
