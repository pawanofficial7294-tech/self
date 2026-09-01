import React, { useState } from 'react';
import { Outlet, Link, useLocation } from 'react-router-dom';
import {
  Menu,
  X,
  Accessibility,
  ChevronDown,
  Phone,
  Mail,
  Globe,
  Heart,
  ArrowRight,
  ShieldCheck,
  CheckCircle2
} from 'lucide-react';
import { useAccessibility } from '../context/AccessibilityContext';
import { useAuth } from '../context/AuthContext';
import { ORG_PROFILE } from '../constants/mockData';
import selfLogo from '../assets/self.png';

export const PublicLayout: React.FC = () => {
  const { fontScale, decreaseFontSize, resetFontSize, increaseFontSize, highContrast, toggleHighContrast } = useAccessibility();
  const { user } = useAuth();
  const location = useLocation();

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [donateModalOpen, setDonateModalOpen] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);

  // Donation form state
  const [donationAmount, setDonationAmount] = useState<number>(1000);
  const [customAmount, setCustomAmount] = useState<string>('');
  const [donorName, setDonorName] = useState<string>('');
  const [donorEmail, setDonorEmail] = useState<string>('');
  const [donorPan, setDonorPan] = useState<string>('');
  const [donationSuccess, setDonationSuccess] = useState<boolean>(false);

  // Newsletter state
  const [newsletterEmail, setNewsletterEmail] = useState<string>('');
  const [newsletterSuccess, setNewsletterSuccess] = useState<boolean>(false);

  const toggleDropdown = (name: string) => {
    setActiveDropdown((prev) => (prev === name ? null : name));
  };

  const handleNewsletterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (newsletterEmail) {
      setNewsletterSuccess(true);
      setTimeout(() => {
        setNewsletterEmail('');
        setNewsletterSuccess(false);
      }, 4000);
    }
  };

  const handleDonateSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setDonationSuccess(true);
    setTimeout(() => {
      setDonateModalOpen(false);
      setDonationSuccess(false);
      setDonorName('');
      setDonorEmail('');
      setDonorPan('');
    }, 2500);
  };

  interface SubNavItem {
    label: string;
    path: string;
    desc?: string;
  }

  interface NavGroup {
    title: string;
    items: SubNavItem[];
  }

  interface NavItem {
    label: string;
    path?: string;
    dropdown?: SubNavItem[];
    groups?: NavGroup[];
  }

  const navItems: NavItem[] = [
    { label: 'Home', path: '/' },
    {
      label: 'About Us',
      dropdown: [
        { label: 'Our Story & Background', path: '/about' },
        { label: 'Vision & Mission', path: '/about#vision' },
        { label: 'Core Values & Objectives', path: '/about#values' },
        { label: 'Leadership & Team', path: '/about#team' },
        { label: 'Statutory Compliance (80G & 12A)', path: '/resources#audit' }
      ]
    },
    {
      label: 'Our Services',
      groups: [
        {
          title: 'Thematic Programs & Initiatives',
          items: [
            { label: 'Government Projects & Schemes', path: '/schemes#government', desc: 'Central & state welfare schemes execution' },
            { label: 'Agriculture & Millets', path: '/schemes#agriculture', desc: 'Natural farming & wadi orchards' },
            { label: 'Human Resources & Recruitment', path: '/careers', desc: 'Recruitment, rural staffing & talent pool' },
            { label: 'Education & Digital Labs', path: '/schemes#education', desc: 'Digital literacy & remedial learning' },
            { label: 'Healthcare & Nutrition', path: '/schemes#health', desc: 'Mobile health camps & infant care' },
            { label: 'Skill Development & Livelihoods', path: '/schemes#skills', desc: 'Vocational training & SHG support' },
            { label: 'Disability Rehabilitation', path: '/schemes#disability', desc: 'Assistive devices & inclusive growth' },
            { label: 'Women Empowerment', path: '/schemes#women', desc: 'Leadership & financial literacy' },
            { label: 'Environment & Watershed', path: '/schemes#environment', desc: 'Water conservation & afforestation' }
          ]
        },
        {
          title: 'Consultancy & Technical Services',
          items: [
            { label: 'Monitoring & Evaluation (M&E)', path: '/schemes#research', desc: 'Impact assessment & tracking' },
            { label: 'Baseline & Endline Surveys', path: '/schemes#research', desc: 'Empirical data & field analytics' },
            { label: 'Training & Capacity Building', path: '/schemes#skills', desc: 'Institutional training workshops' },
            { label: 'CSR Implementation Services', path: '/about#csr', desc: 'End-to-end grassroots CSR execution' },
            { label: 'All Schemes & Programs Overview', path: '/schemes', desc: 'Explore all 9 development pillars' }
          ]
        }
      ]
    },
    {
      label: 'Projects',
      dropdown: [
        { label: 'Project Overview', path: '/schemes' },
        { label: 'Ongoing Field Projects', path: '/tracking' },
        { label: 'Project Impact Analytics', path: '/dashboard' }
      ]
    },
    {
      label: 'Resources',
      dropdown: [
        { label: 'Annual Reports', path: '/resources#annual' },
        { label: 'Case Studies', path: '/resources#case' },
        { label: 'Newsletters (Vikas Varta)', path: '/resources#newsletters' },
        { label: 'Audited Statements & 80G', path: '/resources#audit' },
        { label: 'Training Manuals', path: '/resources#manuals' }
      ]
    },
    {
      label: 'Get Involved',
      dropdown: [
        { label: 'Careers & Recruitment', path: '/careers' },
        { label: 'Volunteer Registration', path: '/register-ngo' },
        { label: 'CSR Partnerships', path: '/about#partners' }
      ]
    },
    { label: 'Contact', path: '/contact' },
    { label: 'Career', path: '/careers' }
  ];

  return (
    <div className="min-h-screen flex flex-col bg-white text-slate-800">
      
      {/* 1. TOP UTILITY BAR */}
      <div className="bg-[#0f3813] text-emerald-100 text-xs py-1 px-4 md:px-8 border-b border-emerald-900 select-none">
        <div className="max-w-7xl mx-auto flex flex-wrap justify-between items-center gap-3">
          
          {/* Left: Contact Info */}
          <div className="flex items-center gap-4 text-[11px]">
            <a href="tel:+919431775101" className="hover:text-white flex items-center gap-1">
              <Phone className="h-3 w-3 text-emerald-400" /> {ORG_PROFILE.phoneDisplay}
            </a>
            <span className="text-emerald-700">|</span>
            <a href={`mailto:${ORG_PROFILE.email}`} className="hover:text-white flex items-center gap-1">
              <Mail className="h-3 w-3 text-emerald-400" /> {ORG_PROFILE.email}
            </a>
            <span className="hidden sm:inline text-emerald-700">|</span>
            <span className="hidden sm:inline-flex items-center gap-1 text-amber-300 font-semibold">
              <ShieldCheck className="h-3.5 w-3.5 text-amber-400" /> Trust Reg: {ORG_PROFILE.registrationNumber} (Est. {ORG_PROFILE.registrationYear})
            </span>
          </div>

          {/* Right: Social Media Links & Accessibility Controls */}
          <div className="flex items-center gap-3 text-[11px]">
            {/* Social Media Links (Top Right) */}
            <div className="flex items-center gap-1.5" aria-label="Social Media Links">
              {/* WhatsApp */}
              <a
                href={ORG_PROFILE.social.whatsapp}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-1 bg-[#25D366] hover:bg-[#20ba59] text-white px-2 py-0.5 rounded text-[10px] font-bold shadow-sm transition-all hover:scale-105"
                title="Chat with us on WhatsApp (+91 9431775101)"
              >
                <svg className="h-3 w-3" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12.031 6.172c-3.181 0-5.767 2.586-5.768 5.766-.001 1.298.38 2.27 1.019 3.287l-.711 2.598 2.664-.699c.974.531 1.77.813 2.796.814 3.184 0 5.77-2.587 5.771-5.766.001-3.181-2.585-5.77-5.771-5.77zm3.385 8.163c-.145.409-.84.756-1.168.799-.328.043-.75.059-2.378-.618-1.954-.813-3.218-2.8-3.315-2.929-.098-.129-.785-1.045-.785-1.993 0-.948.498-1.413.675-1.607.177-.194.387-.243.516-.243.129 0 .258.002.37.007.119.006.279-.045.437.334.163.389.554 1.353.603 1.45.049.098.082.213.016.342-.066.129-.098.21-.194.323-.097.113-.204.253-.292.339-.098.097-.2.203-.086.398.113.195.505.834 1.082 1.348.742.662 1.368.868 1.562.965.194.097.307.082.42-.048.113-.13.484-.564.613-.758.13-.194.259-.161.436-.097.177.065 1.121.528 1.314.625.194.097.323.145.371.226.048.08.048.468-.097.877zM12 2C6.477 2 2 6.477 2 12c0 1.891.524 3.66 1.434 5.176L2 22l4.957-1.399C8.423 21.492 10.155 22 12 22c5.523 0 10-4.477 10-10S17.523 2 12 2z"/>
                </svg>
                <span>WhatsApp</span>
              </a>

              {/* Facebook */}
              <a
                href={ORG_PROFILE.social.facebook}
                target="_blank"
                rel="noreferrer"
                className="p-1 bg-[#1877F2] hover:bg-[#1565c0] rounded text-white transition-all hover:scale-110 flex items-center justify-center"
                title="Follow us on Facebook"
              >
                <svg className="h-3 w-3" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                </svg>
              </a>

              {/* YouTube */}
              <a
                href={ORG_PROFILE.social.youtube}
                target="_blank"
                rel="noreferrer"
                className="p-1 bg-[#FF0000] hover:bg-[#cc0000] rounded text-white transition-all hover:scale-110 flex items-center justify-center"
                title="Subscribe on YouTube"
              >
                <svg className="h-3 w-3" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
                </svg>
              </a>

              {/* Instagram */}
              <a
                href={ORG_PROFILE.social.instagram}
                target="_blank"
                rel="noreferrer"
                className="p-1 bg-gradient-to-tr from-[#f09433] via-[#e6683c] via-[#dc2743] to-[#bc1888] rounded text-white transition-all hover:scale-110 flex items-center justify-center"
                title="Follow on Instagram"
              >
                <svg className="h-3 w-3" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
                </svg>
              </a>

              {/* LinkedIn */}
              <a
                href={ORG_PROFILE.social.linkedin}
                target="_blank"
                rel="noreferrer"
                className="p-1 bg-[#0A66C2] hover:bg-[#084e96] rounded text-white transition-all hover:scale-110 flex items-center justify-center"
                title="Connect on LinkedIn"
              >
                <svg className="h-3 w-3" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M19 3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14m-.5 15.5v-5.3a3.26 3.26 0 0 0-3.26-3.26c-.85 0-1.84.52-2.28 1.3v-1.11h-2.79v8.37h2.79v-4.93c0-.77.62-1.4 1.39-1.4a1.4 1.4 0 0 1 1.4 1.4v4.93h2.75M6.88 8.56a1.68 1.68 0 0 0 1.68-1.68c0-.93-.75-1.69-1.68-1.69a1.69 1.69 0 0 0-1.69 1.69c0 .93.76 1.68 1.69 1.68m1.39 9.94v-8.37H5.5v8.37h2.77z"/>
                </svg>
              </a>

              {/* Twitter / X */}
              <a
                href={ORG_PROFILE.social.twitter}
                target="_blank"
                rel="noreferrer"
                className="p-1 bg-black hover:bg-slate-800 rounded text-white transition-all hover:scale-110 border border-white/20 flex items-center justify-center"
                title="Follow on X (Twitter)"
              >
                <svg className="h-3 w-3" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
                </svg>
              </a>
            </div>

            <span className="text-emerald-700">|</span>

            {/* Accessibility Font tools */}
            <div className="flex items-center bg-[#1b5e20] rounded border border-emerald-800 overflow-hidden" aria-label="Font sizing">
              <button
                onClick={decreaseFontSize}
                className={`px-2 py-0.5 font-bold hover:bg-emerald-900 text-[10px] ${
                  fontScale === 'small' ? 'bg-amber-400 text-black font-extrabold' : 'text-emerald-100'
                }`}
                title="Decrease Font Size (A-)"
              >
                A-
              </button>
              <button
                onClick={resetFontSize}
                className={`px-2 py-0.5 font-bold hover:bg-emerald-900 text-xs ${
                  fontScale === 'normal' ? 'bg-amber-400 text-black font-extrabold' : 'text-emerald-100'
                }`}
                title="Normal Font Size (A)"
              >
                A
              </button>
              <button
                onClick={increaseFontSize}
                className={`px-2 py-0.5 font-bold hover:bg-emerald-900 text-sm ${
                  fontScale === 'large' ? 'bg-amber-400 text-black font-extrabold' : 'text-emerald-100'
                }`}
                title="Increase Font Size (A+)"
              >
                A+
              </button>
            </div>

            {/* High Contrast */}
            <button
              onClick={toggleHighContrast}
              className={`p-1 rounded bg-[#1b5e20] hover:bg-emerald-900 text-emerald-100 ${
                highContrast ? 'text-amber-400 bg-black border border-amber-400' : ''
              }`}
              title="Toggle High Contrast"
            >
              <Accessibility className="h-3.5 w-3.5" />
            </button>

            {/* Language */}
            <div className="flex items-center gap-1 bg-[#1b5e20] px-2 py-0.5 rounded border border-emerald-800 text-emerald-100 text-[11px]">
              <Globe className="h-3 w-3 text-emerald-400" />
              <select className="bg-transparent outline-none cursor-pointer text-emerald-100 text-[11px]">
                <option value="en" className="bg-[#0f3813] text-white">English</option>
                <option value="hi" className="bg-[#0f3813] text-white">हिन्दी</option>
              </select>
            </div>
          </div>

        </div>
      </div>

      {/* 2. MAIN HEADER BRANDING (MATCHING THE SELF INFOGRAPHIC) */}
      <header className="bg-white py-3.5 px-4 md:px-8 border-b border-slate-200">
        <div className="max-w-7xl mx-auto flex justify-between items-center flex-wrap gap-4">
          
          {/* Logo & Foundation Name */}
          <Link to="/" className="flex items-center gap-3.5 select-none group">
            {/* Official Foundation Emblem Logo */}
            <div className="h-14 w-14 rounded-full bg-white border-2 border-[#2e7d32] p-0.5 flex items-center justify-center shadow-md group-hover:scale-105 transition-transform flex-shrink-0 overflow-hidden">
              <img
                src={selfLogo}
                alt="Socio Economic Lacuna Foundation Logo"
                className="h-full w-full object-contain drop-shadow-sm"
              />
            </div>

            <div className="flex flex-col">
              <div className="flex items-baseline gap-2">
                <span className="text-2xl md:text-3xl font-black text-[#1b5e20] tracking-tight">
                  SELF
                </span>
                <span className="text-sm md:text-base font-extrabold text-slate-800 tracking-tight">
                  Socio Economic Lacuna Foundation
                </span>
              </div>
              <span className="text-[10px] md:text-[11px] font-extrabold text-emerald-800 tracking-wider uppercase">
                {ORG_PROFILE.motto}
              </span>
              <span className="text-[9px] md:text-[10px] font-semibold text-slate-500 tracking-wide">
                Empowering Communities • Enriching Lives • Building a Sustainable Jharkhand
              </span>
            </div>
          </Link>

          {/* Right Verification & Quick Action */}
          <div className="hidden lg:flex items-center gap-4">
            <div className="text-right">
              <span className="text-[11px] font-bold text-slate-800 block uppercase">
                Trust Reg: {ORG_PROFILE.registrationNumber} (Year {ORG_PROFILE.registrationYear})
              </span>
              <span className="text-[10px] text-slate-500">
                {ORG_PROFILE.trustAct} • Ratu, Ranchi - 835222
              </span>
            </div>

            <button
              onClick={() => setDonateModalOpen(true)}
              className="bg-[#2e7d32] hover:bg-[#1b5e20] text-white font-extrabold text-xs uppercase tracking-wider px-5 py-2.5 rounded-md flex items-center gap-1.5 shadow-md hover:shadow-lg transition-all cursor-pointer"
            >
              <Heart className="h-4 w-4 fill-white" /> DONATE NOW
            </button>
          </div>

        </div>
      </header>

      {/* 3. PRIMARY NAVIGATION BAR */}
      <nav className="bg-[#1b5e20] text-white sticky top-0 z-40 shadow-md select-none border-t border-emerald-700">
        <div className="max-w-7xl mx-auto px-4 md:px-8 flex items-center justify-between h-12">
          
          {/* Menu Items */}
          <div className="hidden lg:flex items-center gap-0.5 h-full text-xs font-semibold uppercase tracking-wider">
            {navItems.map((item, idx) => {
              if (item.groups) {
                return (
                  <div
                    key={idx}
                    className="relative h-full flex items-center group cursor-pointer"
                    onMouseEnter={() => toggleDropdown(item.label)}
                    onMouseLeave={() => toggleDropdown('')}
                  >
                    <button className="px-3 py-2 hover:bg-[#0f3813] hover:text-amber-300 flex items-center gap-1 transition-colors h-full outline-none">
                      {item.label}
                      <ChevronDown className="h-3 w-3" />
                    </button>
                    {/* Mega Dropdown Box */}
                    <div className="absolute top-[48px] left-0 bg-white text-slate-800 border border-slate-200 shadow-2xl rounded-b min-w-[560px] hidden group-hover:grid grid-cols-2 p-4 gap-4 z-50 normal-case font-medium">
                      {item.groups.map((grp, gIdx) => (
                        <div key={gIdx} className="space-y-1.5">
                          <div className="text-[11px] font-extrabold uppercase tracking-wider text-[#1b5e20] pb-1.5 border-b border-emerald-100 flex items-center gap-1.5">
                            <span className="w-1.5 h-1.5 rounded-full bg-[#2e7d32]"></span>
                            {grp.title}
                          </div>
                          <div className="flex flex-col">
                            {grp.items.map((sub, sIdx) => (
                              <Link
                                key={sIdx}
                                to={sub.path}
                                className="block p-2 hover:bg-emerald-50 rounded transition-colors group/sub"
                              >
                                <div className="text-xs font-semibold text-slate-800 group-hover/sub:text-[#2e7d32]">
                                  {sub.label}
                                </div>
                                {sub.desc && (
                                  <div className="text-[10px] text-slate-500 font-normal leading-tight mt-0.5">
                                    {sub.desc}
                                  </div>
                                )}
                              </Link>
                            ))}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                );
              }

              if (item.dropdown) {
                return (
                  <div
                    key={idx}
                    className="relative h-full flex items-center group cursor-pointer"
                    onMouseEnter={() => toggleDropdown(item.label)}
                    onMouseLeave={() => toggleDropdown('')}
                  >
                    <button className="px-3 py-2 hover:bg-[#0f3813] hover:text-amber-300 flex items-center gap-1 transition-colors h-full outline-none">
                      {item.label}
                      <ChevronDown className="h-3 w-3" />
                    </button>
                    {/* Dropdown Box */}
                    <div className="absolute top-[48px] left-0 bg-white text-slate-800 border border-slate-200 shadow-2xl rounded-b min-w-[240px] hidden group-hover:block divide-y divide-slate-100 z-50 normal-case font-medium">
                      {item.dropdown.map((sub, sIdx) => (
                        <Link
                          key={sIdx}
                          to={sub.path}
                          className="block px-4 py-2.5 hover:bg-emerald-50 hover:text-[#2e7d32] text-xs transition-colors"
                        >
                          {sub.label}
                        </Link>
                      ))}
                    </div>
                  </div>
                );
              }

              const isActive = location.pathname === item.path;
              return (
                <Link
                  key={idx}
                  to={item.path!}
                  className={`px-3 py-2 hover:bg-[#0f3813] hover:text-amber-300 transition-colors h-full flex items-center ${
                    isActive ? 'bg-[#0f3813] text-amber-300 font-bold border-b-2 border-amber-400' : 'text-slate-100'
                  }`}
                >
                  {item.label}
                </Link>
              );
            })}
          </div>

          {/* Right: Donate & Login buttons */}
          <div className="hidden lg:flex items-center gap-3">
            <button
              onClick={() => setDonateModalOpen(true)}
              className="bg-[#e65100] hover:bg-[#bf360c] text-white font-extrabold text-xs uppercase tracking-wider px-4 py-1.5 rounded flex items-center gap-1.5 transition-all shadow-sm"
            >
              <Heart className="h-3.5 w-3.5 fill-white" /> Donate Now
            </button>
            
            {user ? (
              <Link to="/dashboard">
                <button className="bg-white/20 hover:bg-white/30 text-white font-bold text-xs uppercase px-3 py-1.5 rounded">
                  Workspace
                </button>
              </Link>
            ) : (
              <Link to="/login">
                <button className="bg-transparent border border-white/40 hover:bg-white/10 text-white font-medium text-xs px-3 py-1.5 rounded">
                  Login
                </button>
              </Link>
            )}
          </div>

          {/* Mobile hamburger header */}
          <div className="flex lg:hidden items-center justify-between w-full">
            <Link to="/" className="flex items-center gap-2 select-none">
              <div className="h-9 w-9 rounded-full bg-white p-0.5 border border-emerald-400 flex items-center justify-center shadow-sm overflow-hidden flex-shrink-0">
                <img src={selfLogo} alt="SELF Logo" className="h-full w-full object-contain" />
              </div>
              <span className="text-xs font-bold uppercase tracking-wider text-amber-300">
                SELF Foundation
              </span>
            </Link>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setDonateModalOpen(true)}
                className="bg-[#e65100] text-white text-[11px] font-bold px-3 py-1 rounded"
              >
                Donate
              </button>
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                aria-label="Toggle menu"
                className="text-white p-1 hover:bg-[#0f3813] rounded"
              >
                {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
              </button>
            </div>
          </div>

        </div>

        {/* Mobile menu dropdown drawer */}
        {mobileMenuOpen && (
          <div className="lg:hidden bg-[#0f3813] border-t border-emerald-800 py-3 px-4 flex flex-col gap-2">
            {navItems.map((item, idx) => {
              if (item.groups || item.dropdown) {
                const isOpen = activeDropdown === item.label;
                return (
                  <div key={idx} className="flex flex-col">
                    <button
                      onClick={() => toggleDropdown(item.label)}
                      className="flex items-center justify-between text-left py-2 px-2 hover:bg-[#1b5e20] text-xs font-semibold uppercase rounded w-full text-slate-200"
                    >
                      <span>{item.label}</span>
                      <ChevronDown className={`h-4 w-4 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
                    </button>
                    {isOpen && (
                      <div className="flex flex-col pl-4 bg-black/20 rounded mt-1 py-1 border-l-2 border-amber-400">
                        {item.groups ? (
                          item.groups.map((grp, gIdx) => (
                            <div key={gIdx} className="mb-2 last:mb-0">
                              <span className="text-[10px] font-bold uppercase text-amber-300/90 px-2 pt-1.5 pb-0.5 block tracking-wider">
                                {grp.title}
                              </span>
                              {grp.items.map((sub, sIdx) => (
                                <Link
                                  key={sIdx}
                                  to={sub.path}
                                  onClick={() => setMobileMenuOpen(false)}
                                  className="py-1.5 px-2 text-xs text-emerald-100 hover:text-white block"
                                >
                                  {sub.label}
                                </Link>
                              ))}
                            </div>
                          ))
                        ) : (
                          item.dropdown?.map((sub, sIdx) => (
                            <Link
                              key={sIdx}
                              to={sub.path}
                              onClick={() => setMobileMenuOpen(false)}
                              className="py-1.5 px-2 text-xs text-emerald-100 hover:text-white"
                            >
                              {sub.label}
                            </Link>
                          ))
                        )}
                      </div>
                    )}
                  </div>
                );
              }

              const isActive = location.pathname === item.path;
              return (
                <Link
                  key={idx}
                  to={item.path!}
                  onClick={() => setMobileMenuOpen(false)}
                  className={`py-2 px-2 text-xs font-semibold uppercase rounded hover:bg-[#1b5e20] block ${
                    isActive ? 'bg-[#1b5e20] text-amber-300 font-bold' : 'text-slate-200'
                  }`}
                >
                  {item.label}
                </Link>
              );
            })}
          </div>
        )}
      </nav>

      {/* 4. MAIN PAGE CONTENT OUTLET */}
      <main className="flex-1 focus:outline-none">
        <Outlet />
      </main>

      {/* 5. FOOTER (EXACT 4 COLUMNS FROM SELF INFOGRAPHIC) */}
      <footer className="bg-[#0f3813] text-white border-t-4 border-[#2e7d32] text-xs">
        
        <div className="max-w-7xl mx-auto px-4 md:px-8 py-12 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-8">
          
          {/* Col 1: ABOUT SELF (4 cols) */}
          <div className="lg:col-span-4 space-y-4">
            <div className="flex items-center gap-3">
              <div className="h-12 w-12 rounded-full bg-white border-2 border-emerald-400 p-0.5 flex items-center justify-center flex-shrink-0 shadow-md overflow-hidden">
                <img src={selfLogo} alt="SELF Foundation Logo" className="h-full w-full object-contain" />
              </div>
              <div>
                <span className="font-extrabold text-sm uppercase tracking-wide text-white block">
                  ABOUT SELF
                </span>
                <span className="text-[10px] text-emerald-300">
                  Socio Economic Lacuna Foundation
                </span>
              </div>
            </div>

            <p className="text-[11px] text-emerald-100/80 leading-relaxed">
              {ORG_PROFILE.mission}
            </p>

            <div className="pt-2">
              <h5 className="text-white font-bold text-xs uppercase tracking-wider mb-2">Connect With Us</h5>
              <div className="flex items-center gap-2">
                <a href={ORG_PROFILE.social.whatsapp} target="_blank" rel="noreferrer" className="p-2 bg-[#25D366] hover:bg-[#20ba59] rounded transition-colors text-white" title="WhatsApp (+91 9431775101)">
                  <svg className="h-3.5 w-3.5" fill="currentColor" viewBox="0 0 24 24"><path d="M12.031 6.172c-3.181 0-5.767 2.586-5.768 5.766-.001 1.298.38 2.27 1.019 3.287l-.711 2.598 2.664-.699c.974.531 1.77.813 2.796.814 3.184 0 5.77-2.587 5.771-5.766.001-3.181-2.585-5.77-5.771-5.77zm3.385 8.163c-.145.409-.84.756-1.168.799-.328.043-.75.059-2.378-.618-1.954-.813-3.218-2.8-3.315-2.929-.098-.129-.785-1.045-.785-1.993 0-.948.498-1.413.675-1.607.177-.194.387-.243.516-.243.129 0 .258.002.37.007.119.006.279-.045.437.334.163.389.554 1.353.603 1.45.049.098.082.213.016.342-.066.129-.098.21-.194.323-.097.113-.204.253-.292.339-.098.097-.2.203-.086.398.113.195.505.834 1.082 1.348.742.662 1.368.868 1.562.965.194.097.307.082.42-.048.113-.13.484-.564.613-.758.13-.194.259-.161.436-.097.177.065 1.121.528 1.314.625.194.097.323.145.371.226.048.08.048.468-.097.877zM12 2C6.477 2 2 6.477 2 12c0 1.891.524 3.66 1.434 5.176L2 22l4.957-1.399C8.423 21.492 10.155 22 12 22c5.523 0 10-4.477 10-10S17.523 2 12 2z"/></svg>
                </a>
                <a href={ORG_PROFILE.social.facebook} target="_blank" rel="noreferrer" className="p-2 bg-[#1b5e20] hover:bg-[#1877F2] rounded transition-colors text-white" title="Facebook @selfjharkhand">
                  <svg className="h-3.5 w-3.5" fill="currentColor" viewBox="0 0 24 24"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/></svg>
                </a>
                <a href={ORG_PROFILE.social.youtube} target="_blank" rel="noreferrer" className="p-2 bg-[#1b5e20] hover:bg-[#FF0000] rounded transition-colors text-white" title="YouTube @selfjharkhand">
                  <svg className="h-3.5 w-3.5" fill="currentColor" viewBox="0 0 24 24"><path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/></svg>
                </a>
                <a href={ORG_PROFILE.social.instagram} target="_blank" rel="noreferrer" className="p-2 bg-[#1b5e20] hover:bg-[#dc2743] rounded transition-colors text-white" title="Instagram @selfjharkhand">
                  <svg className="h-3.5 w-3.5" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/></svg>
                </a>
                <a href={ORG_PROFILE.social.linkedin} target="_blank" rel="noreferrer" className="p-2 bg-[#1b5e20] hover:bg-[#0A66C2] rounded transition-colors text-white" title="LinkedIn @selfjharkhand">
                  <svg className="h-3.5 w-3.5" fill="currentColor" viewBox="0 0 24 24"><path d="M19 3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14m-.5 15.5v-5.3a3.26 3.26 0 0 0-3.26-3.26c-.85 0-1.84.52-2.28 1.3v-1.11h-2.79v8.37h2.79v-4.93c0-.77.62-1.4 1.39-1.4a1.4 1.4 0 0 1 1.4 1.4v4.93h2.75M6.88 8.56a1.68 1.68 0 0 0 1.68-1.68c0-.93-.75-1.69-1.68-1.69a1.69 1.69 0 0 0-1.69 1.69c0 .93.76 1.68 1.69 1.68m1.39 9.94v-8.37H5.5v8.37h2.77z"/></svg>
                </a>
                <a href={ORG_PROFILE.social.twitter} target="_blank" rel="noreferrer" className="p-2 bg-[#1b5e20] hover:bg-black rounded transition-colors text-white" title="X (Twitter) @selfjharkhand">
                  <svg className="h-3.5 w-3.5" fill="currentColor" viewBox="0 0 24 24"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg>
                </a>
              </div>
            </div>
          </div>

          {/* Col 2: QUICK LINKS (2 cols) */}
          <div className="lg:col-span-2 space-y-3">
            <h4 className="text-white font-bold uppercase tracking-wider text-xs border-b border-emerald-800 pb-2">
              QUICK LINKS
            </h4>
            <ul className="space-y-1.5 text-[11px] text-emerald-100/80">
              <li><Link to="/about" className="hover:text-amber-300">About Us</Link></li>
              <li><Link to="/schemes" className="hover:text-amber-300">Our Services</Link></li>
              <li><Link to="/tracking" className="hover:text-amber-300">Projects</Link></li>
              <li><Link to="/careers" className="hover:text-amber-300">Careers & Recruitment</Link></li>
              <li><Link to="/resources" className="hover:text-amber-300">Publications</Link></li>
              <li><Link to="/register-ngo" className="hover:text-amber-300">Volunteer</Link></li>
              <li><Link to="/contact" className="hover:text-amber-300">Contact Us</Link></li>
            </ul>
          </div>

          {/* Col 3: CONTACT US (3 cols) */}
          <div className="lg:col-span-3 space-y-3">
            <h4 className="text-white font-bold uppercase tracking-wider text-xs border-b border-emerald-800 pb-2">
              CONTACT US
            </h4>
            <div className="space-y-2 text-[11px] text-emerald-100/80">
              <p className="font-semibold text-white">{ORG_PROFILE.name} ({ORG_PROFILE.shortName})</p>
              <p>{ORG_PROFILE.address}</p>
              <p><strong className="text-emerald-300">Phone:</strong> {ORG_PROFILE.phoneDisplay}</p>
              <p><strong className="text-emerald-300">Email:</strong> {ORG_PROFILE.email}</p>
              <p><strong className="text-emerald-300">Registration:</strong> {ORG_PROFILE.registrationNumber} ({ORG_PROFILE.registrationYear})</p>
            </div>
          </div>

          {/* Col 4: NEWSLETTER (3 cols) */}
          <div className="lg:col-span-3 space-y-3">
            <h4 className="text-white font-bold uppercase tracking-wider text-xs border-b border-emerald-800 pb-2">
              NEWSLETTER
            </h4>
            <p className="text-[11px] text-emerald-100/80">
              Subscribe to our newsletter for latest updates and stories.
            </p>

            {newsletterSuccess ? (
              <div className="p-3 bg-emerald-800 border border-emerald-600 rounded text-[11px] text-amber-300 flex items-center gap-1.5">
                <CheckCircle2 className="h-4 w-4 flex-shrink-0" /> Thank you for subscribing!
              </div>
            ) : (
              <form onSubmit={handleNewsletterSubmit} className="space-y-2">
                <input
                  type="email"
                  placeholder="Enter your email"
                  value={newsletterEmail}
                  onChange={(e) => setNewsletterEmail(e.target.value)}
                  required
                  className="w-full bg-[#1b5e20] border border-emerald-700 text-white placeholder-emerald-300/60 text-xs px-3 py-2 rounded focus:outline-none focus:border-amber-400"
                />
                <button
                  type="submit"
                  className="w-full bg-[#2e7d32] hover:bg-[#1b5e20] border border-emerald-400 text-white font-bold text-xs uppercase tracking-wider py-2 rounded shadow transition-colors"
                >
                  SUBSCRIBE
                </button>
              </form>
            )}
          </div>

        </div>

        {/* Bottom copyright */}
        <div className="bg-[#08200b] border-t border-emerald-900 py-3.5 px-4 text-center text-[11px] text-emerald-300 select-none">
          <div className="max-w-7xl mx-auto flex flex-col sm:flex-row justify-between items-center gap-2">
            <span>
              © 2026 Socio Economic Lacuna Foundation (SELF), All Rights Reserved.
            </span>
            <span className="text-amber-300 font-semibold">
              Empowering Communities • Enriching Lives • Building a Sustainable Jharkhand
            </span>
          </div>
        </div>

      </footer>

      {/* 6. INTERACTIVE DONATION MODAL (80G TAX EXEMPTION) */}
      {donateModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-fadeIn">
          <div className="bg-white rounded-xl shadow-2xl border border-slate-200 w-full max-w-lg overflow-hidden animate-scaleIn">
            
            {/* Modal Header */}
            <div className="bg-[#2e7d32] text-white px-6 py-4 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Heart className="h-5 w-5 fill-white" />
                <div>
                  <h4 className="font-extrabold text-base">Donate to SELF Foundation</h4>
                  <span className="text-[10px] text-emerald-100">All donations are 50% Tax Exempt under Section 80G</span>
                </div>
              </div>
              <button
                onClick={() => setDonateModalOpen(false)}
                className="text-emerald-100 hover:text-white p-1 rounded"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {donationSuccess ? (
              <div className="p-8 text-center space-y-4">
                <div className="h-16 w-16 bg-emerald-100 text-[#2e7d32] rounded-full flex items-center justify-center mx-auto">
                  <CheckCircle2 className="h-10 w-10" />
                </div>
                <h3 className="text-xl font-bold text-slate-800">Thank You For Your Support!</h3>
                <p className="text-xs text-slate-600">
                  Your generous contribution will bring healthcare, education, and livelihood support to rural families. An 80G receipt has been dispatched to your email.
                </p>
              </div>
            ) : (
              <form onSubmit={handleDonateSubmit} className="p-6 space-y-4 text-xs">
                {/* Amount presets */}
                <div>
                  <label className="font-bold text-slate-700 block mb-2">Choose Contribution Amount (₹)</label>
                  <div className="grid grid-cols-3 gap-2">
                    {[500, 1000, 2500, 5000, 10000].map((amt) => (
                      <button
                        type="button"
                        key={amt}
                        onClick={() => {
                          setDonationAmount(amt);
                          setCustomAmount('');
                        }}
                        className={`py-2 px-3 rounded-lg border font-bold text-center transition-all ${
                          donationAmount === amt && !customAmount
                            ? 'bg-[#2e7d32] text-white border-[#2e7d32] shadow-sm'
                            : 'bg-slate-50 text-slate-700 border-slate-200 hover:border-emerald-500'
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
                      className="py-2 px-3 border border-slate-200 rounded-lg text-center font-bold focus:outline-none focus:border-[#2e7d32]"
                    />
                  </div>
                </div>

                {/* Donor Details */}
                <div className="space-y-3 pt-2">
                  <div>
                    <label className="font-semibold text-slate-700 block mb-1">Full Name</label>
                    <input
                      type="text"
                      placeholder="e.g. Ramesh Chandra"
                      value={donorName}
                      onChange={(e) => setDonorName(e.target.value)}
                      required
                      className="w-full px-3 py-2 border border-slate-200 rounded-md focus:outline-none focus:border-[#2e7d32]"
                    />
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="font-semibold text-slate-700 block mb-1">Email Address</label>
                      <input
                        type="email"
                        placeholder="For 80G Tax Receipt"
                        value={donorEmail}
                        onChange={(e) => setDonorEmail(e.target.value)}
                        required
                        className="w-full px-3 py-2 border border-slate-200 rounded-md focus:outline-none focus:border-[#2e7d32]"
                      />
                    </div>
                    <div>
                      <label className="font-semibold text-slate-700 block mb-1">PAN Number (Optional)</label>
                      <input
                        type="text"
                        placeholder="ABCDE1234F"
                        value={donorPan}
                        onChange={(e) => setDonorPan(e.target.value.toUpperCase())}
                        className="w-full px-3 py-2 border border-slate-200 rounded-md uppercase focus:outline-none focus:border-[#2e7d32]"
                      />
                    </div>
                  </div>
                </div>

                {/* Payment Gateway choice */}
                <div className="p-3 bg-emerald-50 rounded-lg border border-emerald-200 flex items-center justify-between">
                  <span className="text-[11px] text-emerald-900 font-semibold">
                    Supported: UPI, QR, Debit/Credit Cards & Net Banking
                  </span>
                  <span className="text-xs font-bold text-[#2e7d32]">
                    Total: ₹{(customAmount ? Number(customAmount) : donationAmount).toLocaleString('en-IN')}
                  </span>
                </div>

                <div className="flex justify-end gap-2 pt-2">
                  <button
                    type="button"
                    onClick={() => setDonateModalOpen(false)}
                    className="px-4 py-2 border border-slate-200 rounded-md text-slate-600 hover:bg-slate-50 font-semibold"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-6 py-2 bg-[#2e7d32] hover:bg-[#1b5e20] text-white font-bold rounded-md shadow flex items-center gap-1.5"
                  >
                    Proceed to Donate <ArrowRight className="h-4 w-4" />
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
