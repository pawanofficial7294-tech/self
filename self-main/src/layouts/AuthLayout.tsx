import React from 'react';
import { Outlet, Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import selfLogo from '../assets/self.png';

export const AuthLayout: React.FC = () => {

  return (
    <div className="min-h-screen flex flex-col bg-gov-bg-alt text-gov-charcoal">
      {/* Mini top bar */}
      <div className="bg-[#0f172a] text-slate-300 text-[10px] md:text-xs py-1 px-4 md:px-8 flex justify-between select-none">
        <span>Socio Economic Lacuna Foundation (SELF)</span>
        <span>Trust Reg: 12627/1739 (2011) • Ratu, Ranchi, Jharkhand - 835222</span>
      </div>

      {/* Main card center container */}
      <div className="flex-1 flex flex-col items-center justify-center p-4 md:p-8">
        {/* Header Branding */}
        <div className="mb-6 text-center select-none flex flex-col items-center gap-2">
          {/* Official Emblem */}
          <div className="h-16 w-16 rounded-full bg-white p-1 border-2 border-emerald-600 shadow-md flex items-center justify-center overflow-hidden">
            <img src={selfLogo} alt="SELF Foundation" className="h-full w-full object-contain" />
          </div>
          <div>
            <h1 className="text-base md:text-lg font-bold uppercase tracking-tight text-gov-charcoal leading-none">
              SELF Grants & Project Portal
            </h1>
            <span className="text-[10px] md:text-xs font-semibold text-emerald-800 uppercase tracking-wider block mt-1">
              Socio Economic Lacuna Foundation
            </span>
          </div>
        </div>

        {/* Back to Home link */}
        <Link
          to="/"
          className="flex items-center gap-1 text-xs text-gov-navy hover:text-gov-navy-hover font-semibold mb-4 self-center group bg-white px-3 py-1.5 rounded-full shadow-sm border border-gov-border hover:shadow transition-all"
        >
          <ArrowLeft className="h-3.5 w-3.5 group-hover:-translate-x-0.5 transition-transform" />
          Back to Portal Homepage
        </Link>

        {/* Auth form outlet */}
        <div className="w-full max-w-md">
          <Outlet />
        </div>
      </div>

      {/* Bottom disclaimer */}
      <div className="bg-[#0f172a] text-slate-400 py-3 text-center text-[10px] border-t border-slate-800 select-none">
        Warning: Unauthorized access to this public portal is strictly prohibited and subject to legal action under the IT Act.
      </div>
    </div>
  );
};
