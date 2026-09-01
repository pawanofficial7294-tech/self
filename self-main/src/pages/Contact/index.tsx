import React, { useState } from 'react';
import {
  MapPin,
  Phone,
  Mail,
  Send,
  CheckCircle2,
  Sprout,
  Clock
} from 'lucide-react';
import { ORG_PROFILE } from '../../constants/mockData';

export const Contact: React.FC = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: ''
  });
  const [submitted, setSubmitted] = useState<boolean>(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
    setTimeout(() => {
      setSubmitted(false);
      setFormData({ name: '', email: '', phone: '', subject: '', message: '' });
    }, 4000);
  };

  return (
    <div className="bg-white text-slate-800">
      
      {/* Banner */}
      <div className="bg-[#0f3813] text-white py-14 px-4 md:px-8 border-b-4 border-[#2e7d32]">
        <div className="max-w-7xl mx-auto space-y-4">
          <div className="inline-flex items-center gap-2 bg-emerald-800 text-emerald-200 text-xs font-bold px-3 py-1 rounded-full uppercase">
            <Sprout className="h-3.5 w-3.5" /> Reach Out
          </div>
          <h1 className="text-3xl md:text-4xl font-black tracking-tight">
            Contact SELF Foundation
          </h1>
          <p className="text-emerald-100 max-w-2xl text-xs md:text-sm leading-relaxed">
            Connect with our team for CSR partnerships, volunteer opportunities, research collaborations, or general queries.
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 md:px-8 py-14">
        
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
          
          {/* Left: Contact Directory (5 cols) */}
          <div className="lg:col-span-5 space-y-6">
            
            <div className="space-y-2">
              <h2 className="text-2xl font-black text-slate-900 uppercase tracking-tight">
                Head Office
              </h2>
              <div className="w-12 h-1 bg-[#2e7d32] rounded-full" />
            </div>

            <div className="space-y-4 text-xs text-slate-700">
              
              <div className="flex items-start gap-3 p-4 bg-[#f8fafc] border border-slate-200 rounded-xl hover:border-[#2e7d32] transition-colors">
                <MapPin className="h-5 w-5 text-[#2e7d32] flex-shrink-0 mt-0.5" />
                <div>
                  <strong className="text-slate-900 font-bold block text-sm mb-0.5">Main Office Address</strong>
                  <p className="leading-relaxed">{ORG_PROFILE.address}</p>
                </div>
              </div>

              <div className="flex items-start gap-3 p-4 bg-[#f8fafc] border border-slate-200 rounded-xl hover:border-[#2e7d32] transition-colors">
                <Phone className="h-5 w-5 text-[#2e7d32] flex-shrink-0 mt-0.5" />
                <div>
                  <strong className="text-slate-900 font-bold block text-sm mb-0.5">Contact Numbers</strong>
                  <p className="space-x-2">
                    <a href="tel:+919431775101" className="text-[#2e7d32] font-semibold hover:underline">+91 9431775101</a>
                    <span>/</span>
                    <a href="tel:+917856074123" className="text-[#2e7d32] font-semibold hover:underline">+91 7856074123</a>
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3 p-4 bg-[#f8fafc] border border-slate-200 rounded-xl hover:border-[#2e7d32] transition-colors">
                <Mail className="h-5 w-5 text-[#2e7d32] flex-shrink-0 mt-0.5" />
                <div>
                  <strong className="text-slate-900 font-bold block text-sm mb-0.5">Email Queries</strong>
                  <a href={`mailto:${ORG_PROFILE.email}`} className="text-[#2e7d32] font-semibold hover:underline">
                    {ORG_PROFILE.email}
                  </a>
                </div>
              </div>

              <div className="flex items-start gap-3 p-4 bg-[#f8fafc] border border-slate-200 rounded-xl hover:border-[#2e7d32] transition-colors">
                <Clock className="h-5 w-5 text-[#2e7d32] flex-shrink-0 mt-0.5" />
                <div>
                  <strong className="text-slate-900 font-bold block text-sm mb-0.5">Working Hours</strong>
                  <p>Monday – Saturday: 9:30 AM – 6:00 PM (IST)</p>
                </div>
              </div>

              {/* Legal Trust Accreditation Banner */}
              <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-xl space-y-1.5">
                <span className="text-[10px] uppercase font-bold text-emerald-800 tracking-wider block">
                  {ORG_PROFILE.trustAct}
                </span>
                <p className="font-extrabold text-slate-800 text-xs">
                  Registration Number: <span className="text-[#2e7d32]">{ORG_PROFILE.registrationNumber}</span> • Year: <span className="text-[#2e7d32]">{ORG_PROFILE.registrationYear}</span>
                </p>
                <p className="text-[11px] text-slate-600">
                  Registered Office: Aamtand, Ratu, Ranchi, Jharkhand, 835222.
                </p>
              </div>

              {/* Social Media Directory */}
              <div className="p-4 bg-white border border-slate-200 rounded-xl space-y-3 shadow-sm">
                <strong className="text-slate-900 font-bold block text-xs uppercase tracking-wider">
                  Follow Us Online ({ORG_PROFILE.social.handle})
                </strong>
                <div className="grid grid-cols-2 gap-2 text-xs">
                  <a
                    href={ORG_PROFILE.social.facebook}
                    target="_blank"
                    rel="noreferrer"
                    className="flex items-center gap-2 p-2 bg-[#f8fafc] hover:bg-emerald-50 border border-slate-200 rounded-lg text-slate-700 hover:text-[#2e7d32] transition-colors font-medium"
                  >
                    <span className="w-2 h-2 rounded-full bg-blue-600"></span> Facebook
                  </a>
                  <a
                    href={ORG_PROFILE.social.instagram}
                    target="_blank"
                    rel="noreferrer"
                    className="flex items-center gap-2 p-2 bg-[#f8fafc] hover:bg-emerald-50 border border-slate-200 rounded-lg text-slate-700 hover:text-[#2e7d32] transition-colors font-medium"
                  >
                    <span className="w-2 h-2 rounded-full bg-pink-600"></span> Instagram
                  </a>
                  <a
                    href={ORG_PROFILE.social.youtube}
                    target="_blank"
                    rel="noreferrer"
                    className="flex items-center gap-2 p-2 bg-[#f8fafc] hover:bg-emerald-50 border border-slate-200 rounded-lg text-slate-700 hover:text-[#2e7d32] transition-colors font-medium"
                  >
                    <span className="w-2 h-2 rounded-full bg-red-600"></span> YouTube
                  </a>
                  <a
                    href={ORG_PROFILE.social.twitter}
                    target="_blank"
                    rel="noreferrer"
                    className="flex items-center gap-2 p-2 bg-[#f8fafc] hover:bg-emerald-50 border border-slate-200 rounded-lg text-slate-700 hover:text-[#2e7d32] transition-colors font-medium"
                  >
                    <span className="w-2 h-2 rounded-full bg-slate-900"></span> X (Twitter)
                  </a>
                </div>
              </div>

            </div>

          </div>

          {/* Right: Interactive Query Form (7 cols) */}
          <div className="lg:col-span-7 bg-[#f8fafc] border border-slate-200 rounded-2xl p-8 shadow-sm">
            
            <h3 className="text-xl font-black text-slate-900 uppercase tracking-tight mb-2">
              Send Us a Message
            </h3>
            <p className="text-xs text-slate-600 mb-6">
              Fill in your details and our programme coordinator will respond within 24 business hours.
            </p>

            {submitted ? (
              <div className="p-6 bg-emerald-50 border border-emerald-300 rounded-xl text-center space-y-3">
                <CheckCircle2 className="h-10 w-10 text-[#2e7d32] mx-auto" />
                <h4 className="font-bold text-slate-900 text-base">Message Sent Successfully!</h4>
                <p className="text-xs text-slate-600">
                  Thank you for reaching out to Socio Economic Lacuna Foundation.
                </p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4 text-xs">
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="font-bold text-slate-700 block mb-1">Your Name *</label>
                    <input
                      type="text"
                      placeholder="e.g. Anjali Sharma"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      required
                      className="w-full px-3.5 py-2.5 bg-white border border-slate-200 rounded-lg focus:outline-none focus:border-[#2e7d32]"
                    />
                  </div>
                  <div>
                    <label className="font-bold text-slate-700 block mb-1">Email Address *</label>
                    <input
                      type="email"
                      placeholder="anjali@example.com"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      required
                      className="w-full px-3.5 py-2.5 bg-white border border-slate-200 rounded-lg focus:outline-none focus:border-[#2e7d32]"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="font-bold text-slate-700 block mb-1">Phone Number</label>
                    <input
                      type="tel"
                      placeholder="+91 9876543210"
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      className="w-full px-3.5 py-2.5 bg-white border border-slate-200 rounded-lg focus:outline-none focus:border-[#2e7d32]"
                    />
                  </div>
                  <div>
                    <label className="font-bold text-slate-700 block mb-1">Subject *</label>
                    <select
                      value={formData.subject}
                      onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                      required
                      className="w-full px-3.5 py-2.5 bg-white border border-slate-200 rounded-lg focus:outline-none focus:border-[#2e7d32]"
                    >
                      <option value="">Select Topic</option>
                      <option value="CSR Partnership">CSR Partnership</option>
                      <option value="Volunteer / Internship">Volunteer / Internship</option>
                      <option value="Donation / 80G Query">Donation / 80G Query</option>
                      <option value="Research & M&E Collaboration">Research & M&E Collaboration</option>
                      <option value="General Query">General Query</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="font-bold text-slate-700 block mb-1">Your Message *</label>
                  <textarea
                    rows={4}
                    placeholder="Write your message or inquiry here..."
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    required
                    className="w-full px-3.5 py-2.5 bg-white border border-slate-200 rounded-lg focus:outline-none focus:border-[#2e7d32]"
                  />
                </div>

                <button
                  type="submit"
                  className="px-6 py-3 bg-[#2e7d32] hover:bg-[#1b5e20] text-white font-bold text-xs uppercase tracking-wider rounded-lg shadow-md transition-all flex items-center gap-2 cursor-pointer"
                >
                  <Send className="h-4 w-4" /> Send Message
                </button>

              </form>
            )}

          </div>

        </div>

      </div>
    </div>
  );
};
