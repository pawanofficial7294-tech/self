import React from 'react';
import {
  Sprout,
  Target,
  Eye,
  ShieldCheck
} from 'lucide-react';
import { ORG_PROFILE, PARTNERS } from '../../constants/mockData';
import selfLogo from '../../assets/self.png';

export const About: React.FC = () => {
  return (
    <div className="bg-white text-slate-800">
      
      {/* Banner */}
      <div className="bg-[#0f3813] text-white py-14 px-4 md:px-8 border-b-4 border-[#2e7d32]">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="space-y-4">
            <div className="inline-flex items-center gap-2 bg-emerald-800 text-emerald-200 text-xs font-bold px-3 py-1 rounded-full uppercase">
              <Sprout className="h-3.5 w-3.5" /> About Us
            </div>
            <h1 className="text-3xl md:text-4xl font-black tracking-tight">
              Socio Economic Lacuna Foundation (SELF)
            </h1>
            <p className="text-emerald-100 max-w-2xl text-xs md:text-sm leading-relaxed">
              {ORG_PROFILE.tagline}
            </p>
          </div>
          <div className="h-28 w-28 rounded-full bg-white p-1.5 border-4 border-amber-300/80 shadow-xl flex items-center justify-center overflow-hidden flex-shrink-0">
            <img src={selfLogo} alt="SELF Official Emblem" className="h-full w-full object-contain" />
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 md:px-8 py-14 space-y-16">
        
        {/* 1. OUR STORY & BACKGROUND */}
        <section className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
          <div className="lg:col-span-6 space-y-4">
            <h2 className="text-2xl md:text-3xl font-black text-slate-900 uppercase tracking-tight">
              Our Story & Background
            </h2>
            <div className="w-16 h-1 bg-[#2e7d32] rounded-full" />
            
            <p className="text-xs md:text-sm text-slate-700 leading-relaxed">
              Established in 2011 in Ranchi, Jharkhand under the <strong>Indian Trust Act - 1882</strong> (Registration Number: <strong>12627/1739</strong>), <strong>Socio Economic Lacuna Foundation (SELF)</strong> was founded with the resolute motto of <em>"{ORG_PROFILE.motto}"</em>.
            </p>

            <p className="text-xs md:text-sm text-slate-700 leading-relaxed">
              {ORG_PROFILE.mission}
            </p>

            <div className="grid grid-cols-2 gap-4 pt-2 select-none">
              <div className="p-3.5 bg-emerald-50 border border-emerald-200 rounded-lg">
                <span className="text-2xl font-black text-[#2e7d32] block">250+</span>
                <span className="text-xs font-bold text-slate-700">Villages Transformed</span>
              </div>
              <div className="p-3.5 bg-blue-50 border border-blue-200 rounded-lg">
                <span className="text-2xl font-black text-[#0d47a1] block">150,000+</span>
                <span className="text-xs font-bold text-slate-700">Lives Empowered</span>
              </div>
            </div>
          </div>

          <div className="lg:col-span-6">
            <img
              src="https://images.unsplash.com/photo-1542810634-71277d95dcbb?auto=format&fit=crop&q=80&w=800"
              alt="Community interaction"
              className="rounded-2xl shadow-xl border-4 border-slate-100 object-cover w-full h-80"
            />
          </div>
        </section>

        {/* 2. VISION & MISSION */}
        <section id="vision" className="grid grid-cols-1 md:grid-cols-2 gap-8">
          
          {/* Vision */}
          <div className="bg-[#f8fafc] border border-slate-200 rounded-2xl p-8 space-y-4 hover:border-emerald-500 transition-all shadow-sm">
            <div className="p-3 bg-emerald-100 text-[#2e7d32] rounded-xl w-fit">
              <Eye className="h-8 w-8" />
            </div>
            <h3 className="text-xl font-black text-slate-900 uppercase tracking-tight">Our Vision</h3>
            <p className="text-xs md:text-sm text-slate-700 leading-relaxed">
              {ORG_PROFILE.vision}
            </p>
          </div>

          {/* Mission */}
          <div className="bg-[#f8fafc] border border-slate-200 rounded-2xl p-8 space-y-4 hover:border-blue-500 transition-all shadow-sm">
            <div className="p-3 bg-blue-100 text-[#0d47a1] rounded-xl w-fit">
              <Target className="h-8 w-8" />
            </div>
            <h3 className="text-xl font-black text-slate-900 uppercase tracking-tight">Our Mission</h3>
            <p className="text-xs md:text-sm text-slate-700 leading-relaxed">
              {ORG_PROFILE.mission}
            </p>
          </div>

        </section>

        {/* 3. CORE VALUES */}
        <section id="values" className="space-y-8">
          <div className="text-center max-w-2xl mx-auto space-y-2">
            <h2 className="text-2xl md:text-3xl font-black text-slate-900 uppercase tracking-tight">
              Our Core Values
            </h2>
            <div className="w-16 h-1 bg-[#2e7d32] mx-auto rounded-full" />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {ORG_PROFILE.coreValues.map((val, idx) => (
              <div key={idx} className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm space-y-3 hover:border-emerald-500 transition-all">
                <div className="p-2.5 bg-emerald-50 text-[#2e7d32] rounded-lg w-fit">
                  <ShieldCheck className="h-6 w-6" />
                </div>
                <h4 className="font-extrabold text-base text-slate-900">{val.title}</h4>
                <p className="text-xs text-slate-600 leading-relaxed">{val.desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* 4. STATUTORY COMPLIANCE & LEGAL ACCREDITATIONS */}
        <section className="bg-[#0f3813] text-white rounded-2xl p-8 lg:p-10 space-y-6">
          <div className="space-y-2">
            <h3 className="text-xl md:text-2xl font-black uppercase tracking-tight">
              Statutory Governance & Compliance
            </h3>
            <p className="text-xs text-emerald-100">
              100% compliant with Ministry of Corporate Affairs, Income Tax Department, and NITI Aayog guidelines.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 text-xs">
            <div className="bg-white/10 p-4 rounded-xl border border-white/10 space-y-1">
              <span className="text-[10px] text-emerald-300 uppercase font-bold block">{ORG_PROFILE.trustAct}</span>
              <span className="text-sm font-black text-amber-300">Reg: {ORG_PROFILE.registrationNumber}</span>
              <span className="text-[10px] text-emerald-200 block">Est. Year {ORG_PROFILE.registrationYear}</span>
            </div>
            <div className="bg-white/10 p-4 rounded-xl border border-white/10 space-y-1">
              <span className="text-[10px] text-emerald-300 uppercase font-bold block">NITI Aayog Darpan ID</span>
              <span className="text-base font-black text-white">{ORG_PROFILE.ngoDarpanId}</span>
            </div>
            <div className="bg-white/10 p-4 rounded-xl border border-white/10 space-y-1">
              <span className="text-[10px] text-emerald-300 uppercase font-bold block">Income Tax 80G & 12A</span>
              <span className="text-base font-black text-amber-300">50% Tax Exemption</span>
            </div>
            <div className="bg-white/10 p-4 rounded-xl border border-white/10 space-y-1">
              <span className="text-[10px] text-emerald-300 uppercase font-bold block">MCA CSR Registration</span>
              <span className="text-base font-black text-white">{ORG_PROFILE.csrRegistrationNo}</span>
            </div>
            <div className="bg-white/10 p-4 rounded-xl border border-white/10 space-y-1">
              <span className="text-[10px] text-emerald-300 uppercase font-bold block">Permanent Account No.</span>
              <span className="text-base font-black text-white">{ORG_PROFILE.pan}</span>
            </div>
          </div>
        </section>

        {/* 5. INSTITUTIONAL & CSR PARTNERS */}
        <section id="partners" className="space-y-8">
          <div className="text-center max-w-2xl mx-auto space-y-2">
            <h2 className="text-2xl md:text-3xl font-black text-slate-900 uppercase tracking-tight">
              Our Esteemed Partners
            </h2>
            <div className="w-16 h-1 bg-[#2e7d32] mx-auto rounded-full" />
            <p className="text-xs text-slate-600">
              Co-creating sustainable, scalable impact across multiple state missions.
            </p>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {PARTNERS.map((partner) => (
              <div key={partner.id} className="p-5 bg-[#f8fafc] border border-slate-200 rounded-xl text-center flex flex-col justify-between hover:border-emerald-500 transition-all">
                <span className="font-black text-base text-slate-900 block">{partner.name}</span>
                <span className="text-[10px] text-emerald-700 font-bold uppercase mt-2">{partner.type}</span>
              </div>
            ))}
          </div>
        </section>

      </div>
    </div>
  );
};
