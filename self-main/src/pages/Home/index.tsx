import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  GraduationCap,
  HeartPulse,
  Briefcase,
  Sprout,
  Users2,
  UserCheck,
  Trees,
  Accessibility,
  BarChart3,
  ArrowRight,
  ChevronRight,
  Heart,
  Quote,
  CheckCircle2,
  X,
  Smartphone,
  ShieldCheck,
  Globe2,
  Search,
  Zap,
  Lock,
  Layers,
  FileText
} from 'lucide-react';

import {
  FOCUS_AREAS,
  IMPACT_METRICS,
  FEATURED_PROJECTS,
  PARTNERS,
  LATEST_NEWS,
  TESTIMONIALS,
  ORG_PROFILE,
  type FeaturedProject,
  type FocusArea
} from '../../constants/mockData';
import selfLogo from '../../assets/self.png';

export const Home: React.FC = () => {
  const [selectedProject, setSelectedProject] = useState<FeaturedProject | null>(null);
  const [selectedFocus, setSelectedFocus] = useState<FocusArea | null>(null);
  const [donateModalOpen, setDonateModalOpen] = useState<boolean>(false);
  const [donationAmount, setDonationAmount] = useState<number>(1000);
  const [customAmount, setCustomAmount] = useState<string>('');
  const [donateSuccess, setDonateSuccess] = useState<boolean>(false);

  // Focus area icon mapper
  const renderFocusIcon = (iconName: string) => {
    switch (iconName) {
      case 'GraduationCap': return <GraduationCap className="h-6 w-6 text-[#0d47a1]" />;
      case 'HeartPulse': return <HeartPulse className="h-6 w-6 text-[#c62828]" />;
      case 'Briefcase': return <Briefcase className="h-6 w-6 text-[#b78103]" />;
      case 'Sprout': return <Sprout className="h-6 w-6 text-[#2e7d32]" />;
      case 'Users2': return <Users2 className="h-6 w-6 text-[#6a1b9a]" />;
      case 'UserCheck': return <UserCheck className="h-6 w-6 text-[#4527a0]" />;
      case 'Trees': return <Trees className="h-6 w-6 text-[#1b5e20]" />;
      case 'Accessibility': return <Accessibility className="h-6 w-6 text-[#00838f]" />;
      case 'BarChart3': return <BarChart3 className="h-6 w-6 text-[#37474f]" />;
      default: return <Sprout className="h-6 w-6 text-[#2e7d32]" />;
    }
  };

  const handleDonate = (e: React.FormEvent) => {
    e.preventDefault();
    setDonateSuccess(true);
    setTimeout(() => {
      setDonateModalOpen(false);
      setDonateSuccess(false);
    }, 2500);
  };

  return (
    <div className="space-y-0">
      
      {/* 1. HERO SECTION (EXACT AS INFOGRAPHIC) */}
      <section className="relative bg-[#0f3813] text-white min-h-[520px] lg:min-h-[580px] flex items-center overflow-hidden">
        {/* Background Image: Rural Community Gathering */}
        <div className="absolute inset-0 z-0">
          <img
            src="https://images.unsplash.com/photo-1542810634-71277d95dcbb?auto=format&fit=crop&q=80&w=1600"
            alt="Community Gathering"
            className="w-full h-full object-cover object-center"
          />
          {/* Deep green-to-transparent overlay */}
          <div className="absolute inset-0 bg-gradient-to-r from-[#0f3813]/95 via-[#1b5e20]/85 to-black/40" />
        </div>

        {/* Hero Content */}
        <div className="relative z-10 max-w-7xl mx-auto px-4 md:px-8 py-16 w-full grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          <div className="lg:col-span-7 space-y-6">
            
            <div className="inline-flex items-center gap-2.5 bg-emerald-800/80 border border-emerald-500/50 text-emerald-200 text-xs font-bold px-3.5 py-1.5 rounded-full uppercase tracking-wider select-none shadow-sm">
              <div className="h-4 w-4 rounded-full bg-white p-0.5 flex items-center justify-center overflow-hidden flex-shrink-0">
                <img src={selfLogo} alt="SELF" className="h-full w-full object-contain" />
              </div>
              Socio Economic Lacuna Foundation
            </div>

            <h1 className="text-3xl md:text-5xl font-black text-white leading-tight tracking-tight">
              Together We Create Opportunities for Inclusive Development
            </h1>

            <p className="text-xs md:text-sm lg:text-base text-emerald-100/90 leading-relaxed max-w-xl">
              {ORG_PROFILE.mission}
            </p>

            {/* 4 Action Buttons matching infographic */}
            <div className="flex flex-wrap gap-3 pt-3">
              <Link to="/about">
                <button className="bg-[#2e7d32] hover:bg-[#1b5e20] text-white font-extrabold text-xs md:text-sm uppercase tracking-wider px-5 py-3 rounded-md shadow-lg transition-all cursor-pointer">
                  ABOUT US
                </button>
              </Link>
              
              <Link to="/schemes">
                <button className="bg-[#0d47a1] hover:bg-[#0a3158] text-white font-extrabold text-xs md:text-sm uppercase tracking-wider px-5 py-3 rounded-md shadow-lg transition-all cursor-pointer">
                  OUR PROJECTS
                </button>
              </Link>

              <button
                onClick={() => setDonateModalOpen(true)}
                className="bg-[#e65100] hover:bg-[#bf360c] text-white font-extrabold text-xs md:text-sm uppercase tracking-wider px-5 py-3 rounded-md shadow-lg transition-all cursor-pointer flex items-center gap-1.5"
              >
                <Heart className="h-4 w-4 fill-white" /> DONATE
              </button>

              <Link to="/register-ngo">
                <button className="bg-[#00838f] hover:bg-[#006064] text-white font-extrabold text-xs md:text-sm uppercase tracking-wider px-5 py-3 rounded-md shadow-lg transition-all cursor-pointer">
                  VOLUNTEER
                </button>
              </Link>
            </div>

          </div>

          {/* Hero Right: Official Foundation Emblem Showcase */}
          <div className="hidden lg:flex lg:col-span-5 justify-center items-center">
            <div className="relative group">
              {/* Subtle ambient glow */}
              <div className="absolute -inset-2 bg-gradient-to-tr from-emerald-500/20 via-amber-400/20 to-emerald-400/30 rounded-full blur-xl opacity-75 group-hover:opacity-100 transition duration-1000"></div>
              
              {/* Emblem Card */}
              <div className="relative bg-white/10 backdrop-blur-md p-6 rounded-3xl border border-white/20 shadow-2xl flex flex-col items-center text-center space-y-4">
                <div className="h-56 w-56 rounded-full bg-white p-2 shadow-inner border-4 border-amber-300/80 flex items-center justify-center overflow-hidden">
                  <img
                    src={selfLogo}
                    alt="Official Emblem of Socio Economic Lacuna Foundation"
                    className="h-full w-full object-contain drop-shadow-md hover:scale-105 transition-transform duration-500"
                  />
                </div>
                
                <div className="space-y-1">
                  <span className="text-xs font-black uppercase tracking-wider text-amber-300 block">
                    Official Foundation Emblem
                  </span>
                  <p className="text-[11px] text-emerald-100/90 font-medium">
                    {ORG_PROFILE.trustAct} • Reg: {ORG_PROFILE.registrationNumber} (Est. {ORG_PROFILE.registrationYear})
                  </p>
                </div>

                <div className="flex items-center gap-2 pt-1">
                  <span className="text-[10px] font-bold px-2.5 py-1 rounded bg-emerald-900/80 text-emerald-300 border border-emerald-500/40">
                    80G & 12A Certified
                  </span>
                  <span className="text-[10px] font-bold px-2.5 py-1 rounded bg-emerald-900/80 text-emerald-300 border border-emerald-500/40">
                    CSR-1 Registered
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 2. OUR FOCUS AREAS (9 PILLARS WITH ICONS & CARDS) */}
      <section className="py-16 px-4 md:px-8 bg-white">
        <div className="max-w-7xl mx-auto space-y-10">
          
          <div className="text-center max-w-2xl mx-auto space-y-2">
            <h2 className="text-2xl md:text-3xl font-black text-slate-900 uppercase tracking-tight">
              OUR FOCUS AREAS
            </h2>
            <div className="w-16 h-1 bg-[#2e7d32] mx-auto rounded-full" />
            <p className="text-xs md:text-sm text-slate-600">
              Holistic, multi-sectoral interventions designed to bridge grassroots socio-economic gaps.
            </p>
          </div>

          {/* 9 Grid Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 gap-6">
            {FOCUS_AREAS.map((focus) => (
              <div
                key={focus.id}
                onClick={() => setSelectedFocus(focus)}
                className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm hover:shadow-md hover:border-emerald-500 transition-all cursor-pointer group flex flex-col justify-between"
              >
                <div className="space-y-3">
                  <div className="flex items-center gap-3">
                    <div className="p-3 rounded-lg flex-shrink-0" style={{ backgroundColor: focus.bgColor }}>
                      {renderFocusIcon(focus.icon)}
                    </div>
                    <h3 className="font-extrabold text-base text-slate-800 group-hover:text-[#2e7d32] transition-colors">
                      {focus.title}
                    </h3>
                  </div>

                  <p className="text-xs text-slate-600 leading-relaxed">
                    {focus.description}
                  </p>
                </div>

                <div className="pt-3 mt-3 border-t border-slate-100 flex items-center justify-between text-xs font-bold text-[#2e7d32]">
                  <span>Explore Initiatives</span>
                  <ChevronRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
                </div>
              </div>
            ))}
          </div>

        </div>
      </section>

      {/* 3. OUR IMPACT (5 COLORED METRICS AS INFOGRAPHIC) */}
      <section className="py-12 px-4 md:px-8 bg-[#f8fafc] border-y border-slate-200">
        <div className="max-w-7xl mx-auto space-y-8">
          
          <div className="text-center max-w-xl mx-auto space-y-2">
            <h2 className="text-2xl md:text-3xl font-black text-slate-900 uppercase tracking-tight">
              OUR IMPACT
            </h2>
            <div className="w-16 h-1 bg-[#2e7d32] mx-auto rounded-full" />
          </div>

          {/* 5 Metric Badges */}
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
            {IMPACT_METRICS.map((metric) => (
              <div
                key={metric.id}
                className={`${metric.bgColor} ${metric.textColor} rounded-xl p-6 flex flex-col items-center justify-center text-center shadow-md hover:scale-105 transition-transform select-none`}
              >
                <span className="text-3xl lg:text-4xl font-black tracking-tight mb-1">
                  {metric.value}
                </span>
                <span className="text-xs font-bold uppercase tracking-wider text-white/90">
                  {metric.label}
                </span>
              </div>
            ))}
          </div>

        </div>
      </section>

      {/* 4. FEATURED PROJECTS (6 CARDS AS INFOGRAPHIC) */}
      <section className="py-16 px-4 md:px-8 bg-white">
        <div className="max-w-7xl mx-auto space-y-10">
          
          <div className="text-center max-w-2xl mx-auto space-y-2">
            <h2 className="text-2xl md:text-3xl font-black text-slate-900 uppercase tracking-tight">
              FEATURED PROJECTS
            </h2>
            <div className="w-16 h-1 bg-[#2e7d32] mx-auto rounded-full" />
            <p className="text-xs md:text-sm text-slate-600">
              High-impact grassroots programs currently driving change in rural and tribal districts.
            </p>
          </div>

          {/* 6 Cards Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {FEATURED_PROJECTS.map((project) => (
              <div
                key={project.id}
                className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-sm hover:shadow-lg transition-all flex flex-col group"
              >
                {/* Photo */}
                <div className="h-44 overflow-hidden relative bg-slate-100">
                  <img
                    src={project.imageUrl}
                    alt={project.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <span className="absolute top-3 left-3 bg-[#0f3813]/80 backdrop-blur-sm text-white text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded">
                    {project.category}
                  </span>
                </div>

                {/* Details */}
                <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
                  <div className="space-y-2">
                    <h3 className="font-extrabold text-base text-slate-900 group-hover:text-[#2e7d32] transition-colors leading-tight">
                      {project.title}
                    </h3>
                    <p className="text-xs text-slate-600 leading-relaxed">
                      {project.description}
                    </p>
                  </div>

                  <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
                    <button
                      onClick={() => setSelectedProject(project)}
                      className="text-xs font-extrabold text-[#2e7d32] hover:text-[#1b5e20] flex items-center gap-1 group-hover:underline cursor-pointer"
                    >
                      Read More <ArrowRight className="h-3.5 w-3.5" />
                    </button>
                    <span className="text-[11px] text-slate-500 font-medium">
                      {project.beneficiaries}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>

        </div>
      </section>

      {/* 5. 3-COLUMN SECTION: TESTIMONIALS + OUR PARTNERS + LATEST NEWS */}
      <section className="py-16 px-4 md:px-8 bg-[#f8fafc] border-t border-slate-200">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Column 1: TESTIMONIALS (3 cols) */}
          <div className="lg:col-span-3 space-y-4">
            <h3 className="text-base font-black text-slate-900 uppercase tracking-tight border-b-2 border-[#2e7d32] pb-2">
              TESTIMONIALS
            </h3>

            <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm space-y-4">
              <Quote className="h-8 w-8 text-emerald-300" />
              <p className="text-xs text-slate-700 italic leading-relaxed">
                "{TESTIMONIALS[0].quote}"
              </p>
              <div className="pt-2 border-t border-slate-100 flex items-center gap-3">
                <img
                  src={TESTIMONIALS[0].avatarUrl}
                  alt={TESTIMONIALS[0].author}
                  className="h-10 w-10 rounded-full object-cover border border-emerald-500"
                />
                <div>
                  <span className="font-bold text-xs text-slate-900 block">— {TESTIMONIALS[0].author}</span>
                  <span className="text-[10px] text-slate-500">{TESTIMONIALS[0].role}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Column 2: OUR PARTNERS (5 cols) */}
          <div className="lg:col-span-5 space-y-4">
            <h3 className="text-base font-black text-slate-900 uppercase tracking-tight border-b-2 border-[#2e7d32] pb-2">
              OUR PARTNERS
            </h3>

            <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm">
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 select-none">
                {PARTNERS.map((partner) => (
                  <div
                    key={partner.id}
                    className="p-3 bg-slate-50 border border-slate-200 rounded-lg flex flex-col items-center justify-center text-center hover:border-emerald-500 hover:bg-emerald-50/50 transition-all"
                    title={partner.description}
                  >
                    <span className="font-extrabold text-xs text-slate-800 tracking-tight leading-tight">
                      {partner.name}
                    </span>
                    <span className="text-[9px] text-slate-500 mt-1 uppercase font-semibold">
                      {partner.type}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Column 3: LATEST NEWS & EVENTS (4 cols) */}
          <div className="lg:col-span-4 space-y-4">
            <div className="flex items-center justify-between border-b-2 border-[#2e7d32] pb-2">
              <h3 className="text-base font-black text-slate-900 uppercase tracking-tight">
                LATEST NEWS & EVENTS
              </h3>
            </div>

            <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm space-y-3.5">
              <ul className="space-y-3 text-xs">
                {LATEST_NEWS.map((item) => (
                  <li key={item.id} className="flex items-start gap-2.5 group">
                    <span className="text-[#2e7d32] mt-1 font-bold">•</span>
                    <div className="flex-1">
                      <a href="#" className="font-semibold text-slate-800 hover:text-[#2e7d32] group-hover:underline leading-relaxed block">
                        {item.title}
                      </a>
                    </div>
                  </li>
                ))}
              </ul>

              <div className="pt-2 border-t border-slate-100 text-center">
                <Link to="/resources#reports">
                  <button className="bg-[#2e7d32] hover:bg-[#1b5e20] text-white font-bold text-xs uppercase tracking-wider px-4 py-1.5 rounded shadow-sm">
                    VIEW ALL NEWS
                  </button>
                </Link>
              </div>
            </div>
          </div>

        </div>
      </section>

      {/* 6. TECHNICAL FEATURES & CAPABILITIES SHOWCASE */}
      <section className="py-14 px-4 md:px-8 bg-white border-t border-slate-200">
        <div className="max-w-7xl mx-auto space-y-8">
          
          <div className="text-center max-w-2xl mx-auto space-y-2">
            <h2 className="text-xl md:text-2xl font-black text-slate-900 uppercase tracking-tight">
              TECHNICAL FEATURES & CAPABILITIES
            </h2>
            <p className="text-xs text-slate-600">
              Built for high reliability, digital transparency, security, and WCAG accessibility.
            </p>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3 text-xs">
            <div className="p-3 bg-slate-50 border border-slate-200 rounded-lg flex items-center gap-2.5">
              <Smartphone className="h-4 w-4 text-[#2e7d32] flex-shrink-0" />
              <span className="font-semibold text-slate-800">Responsive Design</span>
            </div>
            <div className="p-3 bg-slate-50 border border-slate-200 rounded-lg flex items-center gap-2.5">
              <Layers className="h-4 w-4 text-[#0d47a1] flex-shrink-0" />
              <span className="font-semibold text-slate-800">CMS Based</span>
            </div>
            <div className="p-3 bg-slate-50 border border-slate-200 rounded-lg flex items-center gap-2.5">
              <Lock className="h-4 w-4 text-[#e65100] flex-shrink-0" />
              <span className="font-semibold text-slate-800">SSL HTTPS Security</span>
            </div>
            <div className="p-3 bg-slate-50 border border-slate-200 rounded-lg flex items-center gap-2.5">
              <Search className="h-4 w-4 text-[#6a1b9a] flex-shrink-0" />
              <span className="font-semibold text-slate-800">SEO Friendly</span>
            </div>
            <div className="p-3 bg-slate-50 border border-slate-200 rounded-lg flex items-center gap-2.5">
              <Globe2 className="h-4 w-4 text-[#00838f] flex-shrink-0" />
              <span className="font-semibold text-slate-800">Multi-language (EN/HI)</span>
            </div>
            <div className="p-3 bg-slate-50 border border-slate-200 rounded-lg flex items-center gap-2.5">
              <BarChart3 className="h-4 w-4 text-[#2e7d32] flex-shrink-0" />
              <span className="font-semibold text-slate-800">Analytics & Tracking</span>
            </div>
            <div className="p-3 bg-slate-50 border border-slate-200 rounded-lg flex items-center gap-2.5">
              <Zap className="h-4 w-4 text-[#0d47a1] flex-shrink-0" />
              <span className="font-semibold text-slate-800">Fast Loading & Cache</span>
            </div>
            <div className="p-3 bg-slate-50 border border-slate-200 rounded-lg flex items-center gap-2.5">
              <Accessibility className="h-4 w-4 text-[#e65100] flex-shrink-0" />
              <span className="font-semibold text-slate-800">WCAG Accessibility</span>
            </div>
            <div className="p-3 bg-slate-50 border border-slate-200 rounded-lg flex items-center gap-2.5">
              <FileText className="h-4 w-4 text-[#6a1b9a] flex-shrink-0" />
              <span className="font-semibold text-slate-800">Online Forms & Apps</span>
            </div>
            <div className="p-3 bg-slate-50 border border-slate-200 rounded-lg flex items-center gap-2.5">
              <ShieldCheck className="h-4 w-4 text-[#00838f] flex-shrink-0" />
              <span className="font-semibold text-slate-800">80G Tax Gateway</span>
            </div>
          </div>

        </div>
      </section>

      {/* PROJECT DETAILS MODAL */}
      {selectedProject && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-fadeIn">
          <div className="bg-white rounded-xl shadow-2xl border border-slate-200 w-full max-w-2xl overflow-hidden animate-scaleIn">
            
            <div className="bg-[#1b5e20] text-white px-6 py-4 flex items-center justify-between">
              <div>
                <span className="text-[10px] font-extrabold uppercase tracking-wider text-amber-300 bg-amber-400/20 px-2 py-0.5 rounded">
                  {selectedProject.category}
                </span>
                <h4 className="font-black text-base md:text-lg mt-1">{selectedProject.title}</h4>
              </div>
              <button
                onClick={() => setSelectedProject(null)}
                className="text-emerald-100 hover:text-white p-1 rounded"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="p-6 space-y-4 max-h-[65vh] overflow-y-auto text-xs leading-relaxed text-slate-700">
              <img
                src={selectedProject.imageUrl}
                alt={selectedProject.title}
                className="w-full h-52 object-cover rounded-lg border border-slate-200"
              />

              <div className="space-y-2">
                <h5 className="font-extrabold text-[#1b5e20] text-sm">Project Scope & Activities</h5>
                <p>{selectedProject.fullDetails}</p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 bg-emerald-50 p-3.5 rounded-lg border border-emerald-200">
                <div>
                  <span className="text-[10px] font-bold text-slate-500 uppercase block">Location</span>
                  <span className="font-bold text-slate-800">{selectedProject.location}</span>
                </div>
                <div>
                  <span className="text-[10px] font-bold text-slate-500 uppercase block">Beneficiaries</span>
                  <span className="font-bold text-slate-800">{selectedProject.beneficiaries}</span>
                </div>
                <div>
                  <span className="text-[10px] font-bold text-slate-500 uppercase block">Partner</span>
                  <span className="font-bold text-[#2e7d32]">{selectedProject.partner}</span>
                </div>
              </div>
            </div>

            <div className="bg-slate-100 px-6 py-3 border-t border-slate-200 flex justify-end">
              <button
                onClick={() => setSelectedProject(null)}
                className="bg-slate-200 hover:bg-slate-300 text-slate-800 text-xs font-semibold px-4 py-2 rounded-md"
              >
                Close
              </button>
            </div>

          </div>
        </div>
      )}

      {/* FOCUS AREA DETAILS MODAL */}
      {selectedFocus && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-fadeIn">
          <div className="bg-white rounded-xl shadow-2xl border border-slate-200 w-full max-w-lg overflow-hidden animate-scaleIn">
            
            <div className="bg-[#1b5e20] text-white px-6 py-4 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-md bg-white/10 text-white">
                  {renderFocusIcon(selectedFocus.icon)}
                </div>
                <h4 className="font-black text-base">{selectedFocus.title}</h4>
              </div>
              <button
                onClick={() => setSelectedFocus(null)}
                className="text-emerald-100 hover:text-white p-1 rounded"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="p-6 space-y-4 text-xs leading-relaxed text-slate-700">
              <p className="font-medium text-slate-800">{selectedFocus.description}</p>

              <div>
                <h5 className="font-extrabold text-[#1b5e20] mb-2 uppercase text-[11px] tracking-wider">Key Interventions & Programs</h5>
                <ul className="space-y-2">
                  {selectedFocus.points.map((pt, i) => (
                    <li key={i} className="flex items-center gap-2 text-slate-700 bg-slate-50 p-2 rounded border border-slate-100">
                      <CheckCircle2 className="h-4 w-4 text-[#2e7d32] flex-shrink-0" />
                      <span>{pt}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            <div className="bg-slate-100 px-6 py-3 border-t border-slate-200 flex justify-end">
              <button
                onClick={() => setSelectedFocus(null)}
                className="bg-[#2e7d32] text-white text-xs font-bold px-4 py-2 rounded-md"
              >
                Close
              </button>
            </div>

          </div>
        </div>
      )}

      {/* DONATE MODAL */}
      {donateModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-fadeIn">
          <div className="bg-white rounded-xl shadow-2xl border border-slate-200 w-full max-w-md overflow-hidden animate-scaleIn">
            
            <div className="bg-[#2e7d32] text-white px-6 py-4 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Heart className="h-5 w-5 fill-white" />
                <h4 className="font-extrabold text-base">Contribute to SELF</h4>
              </div>
              <button
                onClick={() => setDonateModalOpen(false)}
                className="text-emerald-100 hover:text-white p-1 rounded"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {donateSuccess ? (
              <div className="p-8 text-center space-y-3">
                <CheckCircle2 className="h-12 w-12 text-[#2e7d32] mx-auto" />
                <h3 className="text-lg font-bold text-slate-900">Contribution Received!</h3>
                <p className="text-xs text-slate-600">80G tax rebate certificate generated.</p>
              </div>
            ) : (
              <form onSubmit={handleDonate} className="p-6 space-y-4 text-xs">
                <div>
                  <label className="font-bold text-slate-700 block mb-2">Select Donation Amount (₹)</label>
                  <div className="grid grid-cols-3 gap-2">
                    {[500, 1000, 2500, 5000, 10000].map((amt) => (
                      <button
                        type="button"
                        key={amt}
                        onClick={() => {
                          setDonationAmount(amt);
                          setCustomAmount('');
                        }}
                        className={`py-2 rounded-lg border font-bold text-center ${
                          donationAmount === amt && !customAmount
                            ? 'bg-[#2e7d32] text-white border-[#2e7d32]'
                            : 'bg-slate-50 text-slate-700 border-slate-200'
                        }`}
                      >
                        ₹{amt.toLocaleString('en-IN')}
                      </button>
                    ))}
                    <input
                      type="number"
                      placeholder="Other ₹"
                      value={customAmount}
                      onChange={(e) => {
                        setCustomAmount(e.target.value);
                        setDonationAmount(Number(e.target.value) || 0);
                      }}
                      className="py-2 px-2 border border-slate-200 rounded-lg text-center font-bold"
                    />
                  </div>
                </div>

                <div className="pt-2 flex justify-end gap-2">
                  <button
                    type="button"
                    onClick={() => setDonateModalOpen(false)}
                    className="px-4 py-2 border border-slate-200 rounded text-slate-600"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2 bg-[#2e7d32] text-white font-bold rounded shadow"
                  >
                    Pay ₹{(customAmount ? Number(customAmount) : donationAmount).toLocaleString('en-IN')}
                  </button>
                </div>
              </form>
            )}

          </div>
        </div>
      )}

    </div>
  );
};
