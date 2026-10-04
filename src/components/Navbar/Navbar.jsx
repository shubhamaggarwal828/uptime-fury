import React from "react";
import { Link, useLocation } from "react-router-dom";
import { Server, Layers, Terminal, Activity, Shield, Globe } from "lucide-react";

const Navbar = () => {
  const location = useLocation();

  return (
    <header className="sticky top-0 z-40 w-full border-b border-white/5 bg-[#07090e]/95 backdrop-blur-xl h-14 flex items-center px-4 sm:px-6 justify-between">
      
      {/* Mobile Brand */}
      <div className="flex md:hidden items-center gap-2">
        <div className="w-7 h-7 rounded-lg bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center">
          <Server className="w-3.5 h-3.5 text-cyan-400" />
        </div>
        <span className="text-sm font-bold text-white font-['Outfit']">
          SysOps<span className="text-cyan-400">Toolkit</span>
        </span>
      </div>

      {/* Breadcrumb / Current Blade Indicator */}
      <div className="hidden md:flex items-center gap-2 text-xs font-mono text-gray-400">
        <span className="text-gray-600">sysops</span>
        <span className="text-gray-600">/</span>
        <span className="text-cyan-400 font-bold uppercase tracking-wider">
          {location.pathname.replace('/', '') || 'home'}
        </span>
      </div>

      {/* Top Header Actions */}
      <div className="flex items-center gap-3">
        <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/20 text-[11px] font-mono text-cyan-400">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
          <span className="hidden sm:inline">Engine Active:</span> 5012
        </div>

        <Link
          to="/multi"
          className="flex items-center gap-1.5 px-3 py-1 rounded-lg bg-gradient-to-r from-cyan-500 to-emerald-400 hover:from-cyan-400 hover:to-emerald-300 text-[#07090e] font-bold text-xs tracking-tight transition-all shadow-[0_0_15px_rgba(6,182,212,0.35)]"
        >
          <Layers className="w-3.5 h-3.5" />
          Multi-Audit
        </Link>
      </div>

    </header>
  );
};

export default Navbar;
