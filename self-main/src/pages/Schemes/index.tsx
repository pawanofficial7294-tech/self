import React, { useState } from 'react';
import {
  Sprout,
  CheckCircle2,
  ArrowRight,
  X,
  Landmark,
  Users,
  GraduationCap,
  HeartPulse,
  Briefcase,
  Trees,
  Accessibility,
  BarChart3
} from 'lucide-react';
import { FOCUS_AREAS, FEATURED_PROJECTS, type FocusArea, type FeaturedProject } from '../../constants/mockData';

export const Schemes: React.FC = () => {
  const [selectedFocus, setSelectedFocus] = useState<FocusArea | null>(null);
  const [selectedProject, setSelectedProject] = useState<FeaturedProject | null>(null);
  const [activeTab, setActiveTab] = useState<'programs' | 'projects'>('programs');

  const renderIcon = (iconName: string, color: string) => {
    switch (iconName) {
      case 'Landmark':
        return <Landmark className="h-6 w-6" style={{ color }} />;
      case 'Sprout':
        return <Sprout className="h-6 w-6" style={{ color }} />;
      case 'Users':
      case 'Users2':
      case 'UserCheck':
        return <Users className="h-6 w-6" style={{ color }} />;
      case 'GraduationCap':
        return <GraduationCap className="h-6 w-6" style={{ color }} />;
      case 'HeartPulse':
        return <HeartPulse className="h-6 w-6" style={{ color }} />;
      case 'Briefcase':
        return <Briefcase className="h-6 w-6" style={{ color }} />;
      case 'Trees':
        return <Trees className="h-6 w-6" style={{ color }} />;
      case 'Accessibility':
        return <Accessibility className="h-6 w-6" style={{ color }} />;
      case 'BarChart3':
        return <BarChart3 className="h-6 w-6" style={{ color }} />;
      default:
        return <Sprout className="h-6 w-6" style={{ color }} />;
    }
  };

  return (
    <div className="bg-white text-slate-800">
      
      {/* Banner */}
      <div className="bg-[#0f3813] text-white py-14 px-4 md:px-8 border-b-4 border-[#2e7d32]">
        <div className="max-w-7xl mx-auto space-y-4">
          <div className="inline-flex items-center gap-2 bg-emerald-800 text-emerald-200 text-xs font-bold px-3 py-1 rounded-full uppercase">
            <Sprout className="h-3.5 w-3.5" /> Our Initiatives
          </div>
          <h1 className="text-3xl md:text-4xl font-black tracking-tight">
            Programs & Flagship Projects
          </h1>
          <p className="text-emerald-100 max-w-2xl text-xs md:text-sm leading-relaxed">
            Delivering scalable socio-economic solutions across 9 thematic domains for sustainable community growth.
          </p>

          <div className="flex gap-2 pt-2">
            <button
              onClick={() => setActiveTab('programs')}
              className={`px-4 py-2 rounded-lg font-bold text-xs uppercase tracking-wider transition-all ${
                activeTab === 'programs' ? 'bg-[#2e7d32] text-white shadow-md' : 'bg-white/10 text-emerald-100 hover:bg-white/20'
              }`}
            >
              Thematic Programs (9 Pillars)
            </button>
            <button
              onClick={() => setActiveTab('projects')}
              className={`px-4 py-2 rounded-lg font-bold text-xs uppercase tracking-wider transition-all ${
                activeTab === 'projects' ? 'bg-[#2e7d32] text-white shadow-md' : 'bg-white/10 text-emerald-100 hover:bg-white/20'
              }`}
            >
              Featured Field Projects
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 md:px-8 py-14">
        
        {/* TAB 1: THEMATIC PROGRAMS */}
        {activeTab === 'programs' && (
          <div className="space-y-8 animate-fadeIn">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {FOCUS_AREAS.map((focus) => (
                <div
                  key={focus.id}
                  className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm hover:shadow-md hover:border-emerald-500 transition-all flex flex-col justify-between"
                >
                  <div className="space-y-4">
                    <div className="flex items-center gap-3">
                      <div className="p-3 rounded-xl" style={{ backgroundColor: focus.bgColor }}>
                        {renderIcon(focus.icon, focus.color)}
                      </div>
                      <h3 className="font-extrabold text-lg text-slate-900">{focus.title}</h3>
                    </div>

                    <p className="text-xs text-slate-600 leading-relaxed">
                      {focus.description}
                    </p>

                    <div className="space-y-2 pt-2 border-t border-slate-100">
                      <span className="text-[10px] font-extrabold text-slate-400 uppercase tracking-wider block">Key Interventions</span>
                      <ul className="space-y-1 text-xs text-slate-700">
                        {focus.points.map((pt, idx) => (
                          <li key={idx} className="flex items-center gap-1.5">
                            <CheckCircle2 className="h-3.5 w-3.5 text-[#2e7d32] flex-shrink-0" />
                            <span>{pt}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>

                  <button
                    onClick={() => setSelectedFocus(focus)}
                    className="mt-5 w-full bg-[#f8fafc] hover:bg-emerald-50 text-[#2e7d32] font-bold text-xs uppercase tracking-wider py-2.5 rounded-lg border border-slate-200 hover:border-emerald-300 transition-colors"
                  >
                    View Domain Details
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 2: FEATURED PROJECTS */}
        {activeTab === 'projects' && (
          <div className="space-y-8 animate-fadeIn">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {FEATURED_PROJECTS.map((project) => (
                <div
                  key={project.id}
                  className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-sm hover:shadow-lg transition-all flex flex-col group"
                >
                  <div className="h-48 overflow-hidden relative">
                    <img
                      src={project.imageUrl}
                      alt={project.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    <span className="absolute top-3 left-3 bg-[#0f3813]/85 text-white text-[10px] font-bold uppercase px-3 py-1 rounded-full">
                      {project.category}
                    </span>
                  </div>

                  <div className="p-6 flex-1 flex flex-col justify-between space-y-4">
                    <div className="space-y-2">
                      <h3 className="font-extrabold text-base text-slate-900 group-hover:text-[#2e7d32] transition-colors leading-tight">
                        {project.title}
                      </h3>
                      <p className="text-xs text-slate-600 leading-relaxed">
                        {project.description}
                      </p>
                    </div>

                    <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs font-bold text-[#2e7d32]">
                      <button
                        onClick={() => setSelectedProject(project)}
                        className="hover:underline flex items-center gap-1"
                      >
                        Explore Project <ArrowRight className="h-3.5 w-3.5" />
                      </button>
                      <span className="text-slate-500 font-medium text-[11px]">{project.beneficiaries}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

      </div>

      {/* PROJECT MODAL */}
      {selectedProject && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-fadeIn">
          <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 w-full max-w-2xl overflow-hidden animate-scaleIn">
            <div className="bg-[#1b5e20] text-white px-6 py-4 flex items-center justify-between">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-amber-300 bg-amber-400/20 px-2 py-0.5 rounded">
                  {selectedProject.category}
                </span>
                <h4 className="font-black text-base md:text-lg mt-1">{selectedProject.title}</h4>
              </div>
              <button onClick={() => setSelectedProject(null)} className="text-emerald-100 hover:text-white">
                <X className="h-5 w-5" />
              </button>
            </div>
            <div className="p-6 space-y-4 max-h-[65vh] overflow-y-auto text-xs leading-relaxed text-slate-700">
              <img src={selectedProject.imageUrl} alt="" className="w-full h-52 object-cover rounded-xl" />
              <div>
                <h5 className="font-extrabold text-[#1b5e20] text-sm mb-1">Objectives & Implementation Details</h5>
                <p>{selectedProject.fullDetails}</p>
              </div>
              <div className="grid grid-cols-3 gap-3 bg-emerald-50 p-3.5 rounded-xl border border-emerald-200">
                <div>
                  <span className="text-[10px] font-bold text-slate-500 uppercase block">Location</span>
                  <span className="font-bold text-slate-800">{selectedProject.location}</span>
                </div>
                <div>
                  <span className="text-[10px] font-bold text-slate-500 uppercase block">Impact</span>
                  <span className="font-bold text-slate-800">{selectedProject.beneficiaries}</span>
                </div>
                <div>
                  <span className="text-[10px] font-bold text-slate-500 uppercase block">Partner</span>
                  <span className="font-bold text-[#2e7d32]">{selectedProject.partner}</span>
                </div>
              </div>
            </div>
            <div className="bg-slate-100 px-6 py-3 border-t border-slate-200 flex justify-end">
              <button onClick={() => setSelectedProject(null)} className="bg-[#2e7d32] text-white font-bold text-xs px-4 py-2 rounded-lg">
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* FOCUS MODAL */}
      {selectedFocus && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-fadeIn">
          <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 w-full max-w-lg overflow-hidden animate-scaleIn">
            <div className="bg-[#1b5e20] text-white px-6 py-4 flex items-center justify-between">
              <h4 className="font-black text-base">{selectedFocus.title}</h4>
              <button onClick={() => setSelectedFocus(null)} className="text-emerald-100 hover:text-white">
                <X className="h-5 w-5" />
              </button>
            </div>
            <div className="p-6 space-y-4 text-xs text-slate-700">
              <p className="font-medium text-slate-800">{selectedFocus.description}</p>
              <div>
                <h5 className="font-extrabold text-[#1b5e20] uppercase text-[11px] mb-2">Program Components</h5>
                <ul className="space-y-2">
                  {selectedFocus.points.map((pt: string, idx: number) => (
                    <li key={idx} className="flex items-center gap-2 p-2 bg-slate-50 border border-slate-100 rounded-lg">
                      <CheckCircle2 className="h-4 w-4 text-[#2e7d32] flex-shrink-0" />
                      <span>{pt}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
            <div className="bg-slate-100 px-6 py-3 border-t border-slate-200 flex justify-end">
              <button onClick={() => setSelectedFocus(null)} className="bg-[#2e7d32] text-white font-bold text-xs px-4 py-2 rounded-lg">
                Close
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
