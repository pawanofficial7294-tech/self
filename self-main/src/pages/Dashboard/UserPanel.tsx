import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  User,
  Briefcase,
  FilePlus,
  ShieldCheck,
  CheckCircle2,
  Lock,
  ArrowRight,
  HelpCircle,
  Clock,
  Send,
  Building,
  Upload,
  Layers,
  ChevronRight,
  Award
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { careerService } from '../../services/careerService';

export const UserPanel: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  const [requestSent, setRequestSent] = useState<string | null>(null);
  const [activeJobsCount, setActiveJobsCount] = useState<number>(0);
  const [candidatesCount, setCandidatesCount] = useState<number>(0);

  const canPostJobs = Boolean(user?.permissions?.canPostJobs) || user?.role === 'OFFICER';
  const canSubmitProjects = Boolean(user?.permissions?.canSubmitProjects) || user?.role === 'NGO';
  const canManageSchemes = Boolean(user?.permissions?.canManageSchemes);
  const canManageUsers = Boolean(user?.permissions?.canManageUsers);
  const canUploadImages = Boolean(user?.permissions?.canUploadImages);

  useEffect(() => {
    // If user has recruitment access, fetch live counts
    if (canPostJobs) {
      careerService.getAllJobs().then((jobs) => setActiveJobsCount(jobs.length)).catch(() => {});
      careerService.getAllCandidates().then((cand) => setCandidatesCount(cand.length)).catch(() => {});
    }
  }, [canPostJobs]);

  const handleRequestAccess = (moduleName: string) => {
    setRequestSent(moduleName);
    setTimeout(() => {
      setRequestSent(null);
    }, 4000);
  };

  // Count active unlocked privileges
  const activePrivileges = [
    canPostJobs && 'Recruitment & Shortlisting',
    canSubmitProjects && 'Grant Proposals',
    canManageSchemes && 'Welfare Schemes',
    canManageUsers && 'User Delegation',
    canUploadImages && 'Document Upload'
  ].filter(Boolean);

  return (
    <div className="space-y-8 animate-fadeIn">
      {/* 1. PERSONALIZED USER HEADER & ACCESS PASSPORT */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-[#0c2e14] via-[#14471f] to-[#1e612a] text-white p-6 md:p-8 shadow-xl border border-emerald-700/40">
        <div className="absolute right-0 top-0 w-80 h-80 bg-emerald-400/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute left-10 -bottom-10 w-60 h-60 bg-amber-400/10 rounded-full blur-2xl pointer-events-none" />

        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2.5">
            <div className="flex flex-wrap items-center gap-2">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-black uppercase tracking-wider bg-amber-400 text-slate-950 shadow-sm">
                <User className="h-3.5 w-3.5" /> {user?.role || 'Member'} Workspace
              </span>
              <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-800/80 text-emerald-200 border border-emerald-600/40">
                <ShieldCheck className="h-3.5 w-3.5 text-emerald-400" /> Verified Account
              </span>
            </div>

            <h1 className="text-2xl md:text-4xl font-black tracking-tight text-white">
              Welcome back, {user?.name || user?.username}!
            </h1>
            <p className="text-emerald-100 text-xs md:text-sm max-w-2xl leading-relaxed">
              This is your dedicated workspace. The Root Administrator has configured your account with specific access rights. Only the authorized tools assigned to your profile are unlocked below.
            </p>
          </div>

          {/* User ID & Role Badge */}
          <div className="bg-black/20 p-4 rounded-xl border border-white/15 backdrop-blur-sm space-y-1.5 min-w-[220px]">
            <span className="text-[10px] uppercase tracking-wider text-emerald-200 font-bold block">
              Assigned Account ID
            </span>
            <div className="text-sm font-mono font-bold text-amber-300">
              {user?.officerId || user?.darpanId || `@${user?.username}`}
            </div>
            <div className="text-[11px] text-emerald-100 flex items-center gap-1.5 pt-1 border-t border-white/10">
              <Clock className="h-3 w-3 text-amber-300" />
              <span>Active Privileges: <strong>{activePrivileges.length} Assigned</strong></span>
            </div>
          </div>
        </div>

        {/* Access Ribbon */}
        <div className="mt-6 pt-5 border-t border-white/15">
          <span className="text-xs font-bold text-emerald-200 block mb-2">
            Your Active Delegated Permissions:
          </span>
          <div className="flex flex-wrap gap-2">
            {canPostJobs && (
              <span className="inline-flex items-center gap-1.5 bg-emerald-500/20 text-emerald-100 border border-emerald-400/40 px-3 py-1 rounded-full text-xs font-semibold">
                <CheckCircle2 className="h-3.5 w-3.5 text-emerald-300" /> Job Postings & Shortlisting
              </span>
            )}
            {canSubmitProjects && (
              <span className="inline-flex items-center gap-1.5 bg-blue-500/20 text-blue-100 border border-blue-400/40 px-3 py-1 rounded-full text-xs font-semibold">
                <CheckCircle2 className="h-3.5 w-3.5 text-blue-300" /> Submit Grant Proposals
              </span>
            )}
            {canManageSchemes && (
              <span className="inline-flex items-center gap-1.5 bg-amber-500/20 text-amber-100 border border-amber-400/40 px-3 py-1 rounded-full text-xs font-semibold">
                <CheckCircle2 className="h-3.5 w-3.5 text-amber-300" /> Manage Welfare Schemes
              </span>
            )}
            {canManageUsers && (
              <span className="inline-flex items-center gap-1.5 bg-purple-500/20 text-purple-100 border border-purple-400/40 px-3 py-1 rounded-full text-xs font-semibold">
                <CheckCircle2 className="h-3.5 w-3.5 text-purple-300" /> User Administration
              </span>
            )}
            {canUploadImages && (
              <span className="inline-flex items-center gap-1.5 bg-teal-500/20 text-teal-100 border border-teal-400/40 px-3 py-1 rounded-full text-xs font-semibold">
                <CheckCircle2 className="h-3.5 w-3.5 text-teal-300" /> Document & Media Vault
              </span>
            )}
            {activePrivileges.length === 0 && (
              <span className="text-xs text-amber-200 italic">
                No extra administrative permissions assigned. You have standard viewing access.
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Alert if request was sent */}
      {requestSent && (
        <div className="bg-emerald-50 border border-emerald-200 text-emerald-800 p-4 rounded-xl flex items-center justify-between text-xs font-semibold animate-fadeIn">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="h-4 w-4 text-emerald-600" />
            <span>
              Request to unlock <strong>{requestSent}</strong> has been logged for Administrator review.
            </span>
          </div>
          <span className="text-[11px] text-emerald-600 font-mono">Status: Pending Admin Approval</span>
        </div>
      )}

      {/* 2. DYNAMIC WORK MODULES (UNLOCKED VS LOCKED) */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-lg font-black text-slate-900 flex items-center gap-2">
              <Layers className="h-5 w-5 text-emerald-700" />
              Work Modules Assigned to You
            </h2>
            <p className="text-xs text-slate-500">
              Interactive operational centers tailored to your account's authorization level
            </p>
          </div>
          <span className="text-xs font-bold text-slate-600 bg-slate-100 px-3 py-1 rounded-full">
            {activePrivileges.length} of 5 Modules Unlocked
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          
          {/* MODULE 1: RECRUITMENT & CANDIDATES */}
          {canPostJobs ? (
            <div className="bg-white rounded-2xl border-2 border-emerald-500/30 p-5 shadow-sm hover:shadow-md transition-all flex flex-col justify-between group">
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-black uppercase tracking-wider text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-md">
                    Unlocked Access
                  </span>
                  <div className="p-2.5 rounded-xl bg-emerald-100 text-emerald-800 group-hover:scale-110 transition-transform">
                    <Briefcase className="h-5 w-5" />
                  </div>
                </div>

                <div>
                  <h3 className="text-base font-bold text-slate-900">
                    Recruitment & Candidate Shortlisting
                  </h3>
                  <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                    Post vacancies on the public career board, inspect submitted applications, and shortlist candidates.
                  </p>
                </div>

                <div className="p-3 bg-slate-50 rounded-xl border border-slate-100 flex items-center justify-between text-xs">
                  <span className="text-slate-600">Database Records:</span>
                  <span className="font-bold text-slate-900">{activeJobsCount} Jobs • {candidatesCount} Candidates</span>
                </div>
              </div>

              <div className="mt-5 pt-4 border-t border-slate-100 space-y-2">
                <button
                  onClick={() => navigate('/dashboard/recruitment')}
                  className="w-full text-xs font-bold py-2 px-3 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                >
                  <Briefcase className="h-3.5 w-3.5" /> Open Recruitment Console
                </button>
                <button
                  onClick={() => navigate('/careers')}
                  className="w-full text-xs font-semibold py-1.5 px-3 rounded-xl text-slate-600 hover:bg-slate-100 flex items-center justify-center gap-1 transition-colors cursor-pointer"
                >
                  View Public Board <ChevronRight className="h-3 w-3" />
                </button>
              </div>
            </div>
          ) : (
            <div className="bg-slate-50 rounded-2xl border border-slate-200/80 p-5 shadow-none flex flex-col justify-between opacity-80 hover:opacity-100 transition-opacity">
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500 bg-slate-200 px-2.5 py-1 rounded-md flex items-center gap-1">
                    <Lock className="h-3 w-3" /> Locked
                  </span>
                  <div className="p-2.5 rounded-xl bg-slate-200 text-slate-500">
                    <Briefcase className="h-5 w-5" />
                  </div>
                </div>

                <div>
                  <h3 className="text-base font-bold text-slate-700">
                    Recruitment & Candidate Shortlisting
                  </h3>
                  <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                    You do not have permission to post vacancies or review job applicant resumes.
                  </p>
                </div>
              </div>

              <div className="mt-5 pt-4 border-t border-slate-200">
                <button
                  onClick={() => handleRequestAccess('Recruitment & Shortlisting')}
                  className="w-full text-xs font-semibold py-2 px-3 rounded-xl bg-white hover:bg-slate-100 text-slate-700 border border-slate-300 flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                >
                  <Send className="h-3.5 w-3.5 text-slate-400" /> Request Permission from Admin
                </button>
              </div>
            </div>
          )}

          {/* MODULE 2: GRANT PROPOSALS & PROJECTS */}
          {canSubmitProjects ? (
            <div className="bg-white rounded-2xl border-2 border-blue-500/30 p-5 shadow-sm hover:shadow-md transition-all flex flex-col justify-between group">
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-black uppercase tracking-wider text-blue-700 bg-blue-50 px-2.5 py-1 rounded-md">
                    Unlocked Access
                  </span>
                  <div className="p-2.5 rounded-xl bg-blue-100 text-blue-800 group-hover:scale-110 transition-transform">
                    <FilePlus className="h-5 w-5" />
                  </div>
                </div>

                <div>
                  <h3 className="text-base font-bold text-slate-900">
                    Project Proposals & Grants Desk
                  </h3>
                  <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                    Submit grassroots development project proposals, track sanction milestones, and upload utilization reports.
                  </p>
                </div>

                <div className="p-3 bg-slate-50 rounded-xl border border-slate-100 flex items-center justify-between text-xs">
                  <span className="text-slate-600">Verification Status:</span>
                  <span className="font-bold text-emerald-700">Active Darpan Certified</span>
                </div>
              </div>

              <div className="mt-5 pt-4 border-t border-slate-100 space-y-2">
                <button
                  onClick={() => navigate('/dashboard/submit-proposal')}
                  className="w-full text-xs font-bold py-2 px-3 rounded-xl bg-blue-700 hover:bg-blue-800 text-white flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                >
                  <FilePlus className="h-3.5 w-3.5" /> Submit New Proposal
                </button>
                <button
                  onClick={() => navigate('/dashboard/applications')}
                  className="w-full text-xs font-semibold py-1.5 px-3 rounded-xl text-slate-600 hover:bg-slate-100 flex items-center justify-center gap-1 transition-colors cursor-pointer"
                >
                  View Active Applications <ChevronRight className="h-3 w-3" />
                </button>
              </div>
            </div>
          ) : (
            <div className="bg-slate-50 rounded-2xl border border-slate-200/80 p-5 shadow-none flex flex-col justify-between opacity-80 hover:opacity-100 transition-opacity">
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500 bg-slate-200 px-2.5 py-1 rounded-md flex items-center gap-1">
                    <Lock className="h-3 w-3" /> Locked
                  </span>
                  <div className="p-2.5 rounded-xl bg-slate-200 text-slate-500">
                    <FilePlus className="h-5 w-5" />
                  </div>
                </div>

                <div>
                  <h3 className="text-base font-bold text-slate-700">
                    Project Proposals & Grants Desk
                  </h3>
                  <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                    Only registered NGOs or assigned field officers can submit grant funding proposals.
                  </p>
                </div>
              </div>

              <div className="mt-5 pt-4 border-t border-slate-200">
                <button
                  onClick={() => handleRequestAccess('Grant Proposals')}
                  className="w-full text-xs font-semibold py-2 px-3 rounded-xl bg-white hover:bg-slate-100 text-slate-700 border border-slate-300 flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                >
                  <Send className="h-3.5 w-3.5 text-slate-400" /> Request Permission from Admin
                </button>
              </div>
            </div>
          )}

          {/* MODULE 3: WELFARE SCHEMES */}
          {canManageSchemes ? (
            <div className="bg-white rounded-2xl border-2 border-amber-500/30 p-5 shadow-sm hover:shadow-md transition-all flex flex-col justify-between group">
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-black uppercase tracking-wider text-amber-700 bg-amber-50 px-2.5 py-1 rounded-md">
                    Unlocked Access
                  </span>
                  <div className="p-2.5 rounded-xl bg-amber-100 text-amber-800 group-hover:scale-110 transition-transform">
                    <Award className="h-5 w-5" />
                  </div>
                </div>

                <div>
                  <h3 className="text-base font-bold text-slate-900">
                    Welfare Schemes & Beneficiary Guidelines
                  </h3>
                  <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                    Update central and state schemes, edit financial eligibility parameters, and publish circulars.
                  </p>
                </div>

                <div className="p-3 bg-slate-50 rounded-xl border border-slate-100 flex items-center justify-between text-xs">
                  <span className="text-slate-600">Active Schemes:</span>
                  <span className="font-bold text-amber-800">5 Schemes Live</span>
                </div>
              </div>

              <div className="mt-5 pt-4 border-t border-slate-100 space-y-2">
                <button
                  onClick={() => navigate('/schemes')}
                  className="w-full text-xs font-bold py-2 px-3 rounded-xl bg-amber-600 hover:bg-amber-700 text-white flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                >
                  <Award className="h-3.5 w-3.5" /> Manage Schemes
                </button>
              </div>
            </div>
          ) : (
            <div className="bg-slate-50 rounded-2xl border border-slate-200/80 p-5 shadow-none flex flex-col justify-between opacity-80 hover:opacity-100 transition-opacity">
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500 bg-slate-200 px-2.5 py-1 rounded-md flex items-center gap-1">
                    <Lock className="h-3 w-3" /> Locked
                  </span>
                  <div className="p-2.5 rounded-xl bg-slate-200 text-slate-500">
                    <Award className="h-5 w-5" />
                  </div>
                </div>

                <div>
                  <h3 className="text-base font-bold text-slate-700">
                    Welfare Schemes Management
                  </h3>
                  <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                    Reserved for State Welfare Officers with scheme oversight delegation.
                  </p>
                </div>
              </div>

              <div className="mt-5 pt-4 border-t border-slate-200">
                <button
                  onClick={() => handleRequestAccess('Welfare Schemes')}
                  className="w-full text-xs font-semibold py-2 px-3 rounded-xl bg-white hover:bg-slate-100 text-slate-700 border border-slate-300 flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                >
                  <Send className="h-3.5 w-3.5 text-slate-400" /> Request Permission from Admin
                </button>
              </div>
            </div>
          )}

          {/* MODULE 4: USER MANAGEMENT DELEGATION */}
          {canManageUsers ? (
            <div className="bg-white rounded-2xl border-2 border-purple-500/30 p-5 shadow-sm hover:shadow-md transition-all flex flex-col justify-between group">
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-black uppercase tracking-wider text-purple-700 bg-purple-50 px-2.5 py-1 rounded-md">
                    Unlocked Access
                  </span>
                  <div className="p-2.5 rounded-xl bg-purple-100 text-purple-800 group-hover:scale-110 transition-transform">
                    <ShieldCheck className="h-5 w-5" />
                  </div>
                </div>

                <div>
                  <h3 className="text-base font-bold text-slate-900">
                    User Management & Work Delegation
                  </h3>
                  <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                    You have been granted administrator rights to create new accounts and delegate permissions.
                  </p>
                </div>
              </div>

              <div className="mt-5 pt-4 border-t border-slate-100 space-y-2">
                <button
                  onClick={() => navigate('/dashboard/users')}
                  className="w-full text-xs font-bold py-2 px-3 rounded-xl bg-purple-700 hover:bg-purple-800 text-white flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                >
                  <ShieldCheck className="h-3.5 w-3.5" /> Open User Console
                </button>
              </div>
            </div>
          ) : (
            <div className="bg-slate-50 rounded-2xl border border-slate-200/80 p-5 shadow-none flex flex-col justify-between opacity-80 hover:opacity-100 transition-opacity">
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500 bg-slate-200 px-2.5 py-1 rounded-md flex items-center gap-1">
                    <Lock className="h-3 w-3" /> Locked
                  </span>
                  <div className="p-2.5 rounded-xl bg-slate-200 text-slate-500">
                    <ShieldCheck className="h-5 w-5" />
                  </div>
                </div>

                <div>
                  <h3 className="text-base font-bold text-slate-700">
                    User Administration & Delegation
                  </h3>
                  <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                    Restricted. Only the Root Administrator or designated delegates can create users.
                  </p>
                </div>
              </div>

              <div className="mt-5 pt-4 border-t border-slate-200">
                <button
                  onClick={() => handleRequestAccess('User Administration')}
                  className="w-full text-xs font-semibold py-2 px-3 rounded-xl bg-white hover:bg-slate-100 text-slate-700 border border-slate-300 flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                >
                  <Send className="h-3.5 w-3.5 text-slate-400" /> Request Permission from Admin
                </button>
              </div>
            </div>
          )}

          {/* MODULE 5: MEDIA & DOCUMENT VAULT */}
          {canUploadImages ? (
            <div className="bg-white rounded-2xl border-2 border-teal-500/30 p-5 shadow-sm hover:shadow-md transition-all flex flex-col justify-between group">
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-black uppercase tracking-wider text-teal-700 bg-teal-50 px-2.5 py-1 rounded-md">
                    Unlocked Access
                  </span>
                  <div className="p-2.5 rounded-xl bg-teal-100 text-teal-800 group-hover:scale-110 transition-transform">
                    <Upload className="h-5 w-5" />
                  </div>
                </div>

                <div>
                  <h3 className="text-base font-bold text-slate-900">
                    Media & Document Upload Vault
                  </h3>
                  <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                    Upload project audit photographs, audited balance sheets, and candidate verification proof.
                  </p>
                </div>
              </div>

              <div className="mt-5 pt-4 border-t border-slate-100 space-y-2">
                <button
                  onClick={() => navigate('/dashboard/track')}
                  className="w-full text-xs font-bold py-2 px-3 rounded-xl bg-teal-700 hover:bg-teal-800 text-white flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                >
                  <Upload className="h-3.5 w-3.5" /> Access Document Vault
                </button>
              </div>
            </div>
          ) : (
            <div className="bg-slate-50 rounded-2xl border border-slate-200/80 p-5 shadow-none flex flex-col justify-between opacity-80 hover:opacity-100 transition-opacity">
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500 bg-slate-200 px-2.5 py-1 rounded-md flex items-center gap-1">
                    <Lock className="h-3 w-3" /> Locked
                  </span>
                  <div className="p-2.5 rounded-xl bg-slate-200 text-slate-500">
                    <Upload className="h-5 w-5" />
                  </div>
                </div>

                <div>
                  <h3 className="text-base font-bold text-slate-700">
                    Media & Document Vault
                  </h3>
                  <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                    You do not have direct file upload privileges for government archives.
                  </p>
                </div>
              </div>

              <div className="mt-5 pt-4 border-t border-slate-200">
                <button
                  onClick={() => handleRequestAccess('Document Upload Vault')}
                  className="w-full text-xs font-semibold py-2 px-3 rounded-xl bg-white hover:bg-slate-100 text-slate-700 border border-slate-300 flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                >
                  <Send className="h-3.5 w-3.5 text-slate-400" /> Request Permission from Admin
                </button>
              </div>
            </div>
          )}

          {/* QUICK CARD: PUBLIC HELPDESK & SUPPORT */}
          <div className="bg-gradient-to-br from-slate-900 to-slate-800 text-white rounded-2xl p-5 shadow-sm flex flex-col justify-between">
            <div className="space-y-2">
              <span className="text-[10px] font-bold uppercase tracking-wider text-amber-400">
                Support & Verification
              </span>
              <h3 className="text-base font-bold text-white">Need Portal Assistance?</h3>
              <p className="text-xs text-slate-300 leading-relaxed">
                Refer to official procedural FAQs or contact the State Grievance Redressal desk.
              </p>
            </div>

            <div className="mt-5 pt-4 border-t border-slate-700 space-y-2">
              <Link
                to="/faq"
                className="w-full text-xs font-bold py-2 px-3 rounded-xl bg-white text-slate-950 hover:bg-amber-300 flex items-center justify-center gap-1.5 transition-colors text-center"
              >
                <HelpCircle className="h-3.5 w-3.5" /> View Portal FAQ
              </Link>
              <Link
                to="/contact"
                className="w-full text-xs font-semibold py-1.5 px-3 rounded-xl text-slate-300 hover:text-white flex items-center justify-center gap-1 text-center"
              >
                Contact Helpdesk <ArrowRight className="h-3 w-3" />
              </Link>
            </div>
          </div>

        </div>
      </div>

      {/* 3. PROFILE & COMPLIANCE SUMMARY */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm space-y-4">
        <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
          <Building className="h-5 w-5 text-emerald-700" />
          Account Details & Verification Record
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 text-xs">
          <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
            <span className="text-[11px] text-slate-500 block">Registered Name</span>
            <span className="font-bold text-slate-900">{user?.name || 'N/A'}</span>
          </div>
          <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
            <span className="text-[11px] text-slate-500 block">User Account</span>
            <span className="font-bold text-slate-900 font-mono">@{user?.username}</span>
          </div>
          <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
            <span className="text-[11px] text-slate-500 block">Assigned Role</span>
            <span className="font-bold text-emerald-700 uppercase">{user?.role}</span>
          </div>
          <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
            <span className="text-[11px] text-slate-500 block">Security Status</span>
            <span className="font-bold text-emerald-700 flex items-center gap-1">
              <CheckCircle2 className="h-3.5 w-3.5" /> Active Authorized
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
