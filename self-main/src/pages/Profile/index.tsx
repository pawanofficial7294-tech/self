import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  User,
  Shield,
  Building2,
  Mail,
  Calendar,
  Clock,
  CheckCircle2,
  Briefcase,
  FolderPlus,
  FileText,
  UploadCloud,
  Megaphone,
  Users,
  Edit3,
  Save,
  RefreshCw,
  AlertCircle,
  ExternalLink,
  ChevronRight,
  Award,
  Sparkles,
  Lock,
  Unlock
} from 'lucide-react';
import { profileService, type UserProfile, type UpdateProfilePayload } from '../../services/profileService';

export const ProfilePage: React.FC = () => {
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  // Active Tab: 'overview' | 'edit' | 'security' | 'adminActions'
  const [activeTab, setActiveTab] = useState<'overview' | 'edit' | 'security' | 'adminActions'>('overview');

  // Edit form state
  const [formData, setFormData] = useState<UpdateProfilePayload>({
    fullName: '',
    email: '',
    phone: '',
    address: '',
    contactPerson: '',
  });

  // Admin upload project PDF state
  const [docModalOpen, setDocModalOpen] = useState(false);
  const [docType, setDocType] = useState('Previous Project Report');
  const [docTitle, setDocTitle] = useState('');
  const [docYear, setDocYear] = useState('2026');
  const [docFile, setDocFile] = useState<File | null>(null);
  const [uploadingDoc, setUploadingDoc] = useState(false);
  const [docSuccess, setDocSuccess] = useState<string | null>(null);

  // Admin quick project modal state
  const [projectModalOpen, setProjectModalOpen] = useState(false);
  const [projTitle, setProjTitle] = useState('');
  const [projDistrict, setProjDistrict] = useState('Ranchi');
  const [projAbstract, setProjAbstract] = useState('');
  const [postingProject, setPostingProject] = useState(false);
  const [projSuccess, setProjSuccess] = useState<string | null>(null);

  const fetchProfile = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await profileService.getProfile();
      setProfile(data);
      setFormData({
        fullName: data.fullName || '',
        email: data.email || '',
        phone: data.ngo?.phone || '',
        address: data.ngo?.address || '',
        contactPerson: data.ngo?.contactPerson || '',
      });
    } catch (err: any) {
      console.error('Error fetching profile:', err);
      setError(err.message || 'Unable to retrieve user profile from server.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProfile();
  }, []);

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError(null);
    setSuccessMsg(null);
    try {
      const updated = await profileService.updateProfile(formData);
      setProfile(updated);
      setSuccessMsg('Your profile credentials and records have been saved successfully.');
      setTimeout(() => setSuccessMsg(null), 5000);
    } catch (err: any) {
      setError(err.message || 'Failed to update profile.');
    } finally {
      setSaving(false);
    }
  };

  const handleUploadDoc = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!docFile || !docTitle) {
      setError('Please select a file and enter a title for the document.');
      return;
    }
    setUploadingDoc(true);
    setError(null);
    setDocSuccess(null);
    try {
      await profileService.uploadDocumentOrNews({
        title: docTitle,
        type: docType,
        year: docYear,
        file: docFile,
      });
      setDocSuccess(`Successfully published: "${docTitle}" (${docType})`);
      setDocTitle('');
      setDocFile(null);
      setTimeout(() => {
        setDocModalOpen(false);
        setDocSuccess(null);
      }, 2500);
    } catch (err: any) {
      setError(err.message || 'Failed to upload document.');
    } finally {
      setUploadingDoc(false);
    }
  };

  const handlePostDirectProject = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!projTitle || !projAbstract) {
      setError('Please enter a project title and abstract summary.');
      return;
    }
    setPostingProject(true);
    setError(null);
    setProjSuccess(null);
    try {
      await profileService.submitProject({
        title: projTitle,
        schemeId: 'a1000000-0000-0000-0000-000000000001',
        schemeName: 'Tribal Livelihoods & Micro-Enterprise Grant',
        abstract: projAbstract,
        state: 'Jharkhand',
        district: projDistrict,
        activities: 'Community mobilization, skill training, and equipment disbursement.',
        expectedOutcomes: 'Empowerment of 150 tribal households.',
        declarationChecked: true,
        beneficiaries: {
          maleCount: 60,
          femaleCount: 90,
          totalCount: 150,
          stCount: 140,
        },
        budget: [
          {
            category: 'Operational',
            description: 'Workshops & Field Training',
            quantity: 1,
            unitCost: 250000,
            total: 250000,
          },
        ],
      });
      setProjSuccess(`Project proposal "${projTitle}" posted successfully.`);
      setProjTitle('');
      setProjAbstract('');
      setTimeout(() => {
        setProjectModalOpen(false);
        setProjSuccess(null);
      }, 2500);
    } catch (err: any) {
      setError(err.message || 'Failed to submit project proposal.');
    } finally {
      setPostingProject(false);
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[450px] gap-3">
        <RefreshCw className="h-8 w-8 text-emerald-600 animate-spin" />
        <p className="text-sm font-semibold text-slate-600">Retrieving official profile credentials...</p>
      </div>
    );
  }

  const isAdmin = profile?.role === 'ADMIN';
  const isOfficer = profile?.role === 'OFFICER';

  return (
    <div className="max-w-6xl mx-auto space-y-6 select-none">
      {/* 1. TOP HEADER BANNER */}
      <div className="bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 rounded-2xl p-6 md:p-8 text-white shadow-lg border border-slate-700/80 relative overflow-hidden">
        {/* Subtle decorative glow */}
        <div className="absolute top-0 right-0 w-80 h-80 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 relative z-10">
          <div className="flex items-start md:items-center gap-4">
            {/* Avatar Initials */}
            <div className="h-18 w-18 md:h-20 md:w-20 rounded-2xl bg-gradient-to-br from-emerald-500 to-teal-700 flex items-center justify-center font-black text-2xl md:text-3xl text-white shadow-md border-2 border-white/20 flex-shrink-0">
              {profile?.fullName ? profile.fullName.charAt(0).toUpperCase() : 'U'}
            </div>

            <div className="space-y-1">
              <div className="flex items-center gap-2 flex-wrap">
                <h1 className="text-xl md:text-2xl font-black tracking-tight text-white">
                  {profile?.fullName || profile?.username}
                </h1>
                <span className={`text-[11px] px-2.5 py-0.5 rounded-full font-black uppercase tracking-wider border shadow-sm ${
                  isAdmin
                    ? 'bg-amber-500/20 text-amber-300 border-amber-400/40'
                    : isOfficer
                    ? 'bg-blue-500/20 text-blue-300 border-blue-400/40'
                    : 'bg-emerald-500/20 text-emerald-300 border-emerald-400/40'
                }`}>
                  {profile?.role} Authority
                </span>
                <span className="text-[11px] px-2.5 py-0.5 rounded-full font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-400/30 flex items-center gap-1">
                  <CheckCircle2 className="h-3 w-3" /> Active Verified
                </span>
              </div>

              <p className="text-xs text-slate-300 flex items-center gap-3 flex-wrap">
                <span className="flex items-center gap-1">
                  <Mail className="h-3.5 w-3.5 text-slate-400" /> {profile?.email}
                </span>
                <span className="text-slate-500">•</span>
                <span className="flex items-center gap-1">
                  <User className="h-3.5 w-3.5 text-slate-400" /> Username: <strong className="text-slate-200">{profile?.username}</strong>
                </span>
              </p>

              <div className="text-[11px] text-slate-400 flex items-center gap-4 pt-1 flex-wrap">
                <span className="flex items-center gap-1">
                  <Calendar className="h-3.5 w-3.5 text-slate-400" /> Member since:{' '}
                  {profile?.createdAt ? new Date(profile.createdAt).toLocaleDateString() : '2026'}
                </span>
                {profile?.lastLoginAt && (
                  <span className="flex items-center gap-1">
                    <Clock className="h-3.5 w-3.5 text-slate-400" /> Last authenticated:{' '}
                    {new Date(profile.lastLoginAt).toLocaleTimeString()}
                  </span>
                )}
              </div>
            </div>
          </div>

          {/* Quick Stats / Action */}
          <div className="flex items-center gap-3 self-start md:self-auto">
            <button
              onClick={fetchProfile}
              className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-slate-800/80 hover:bg-slate-700 text-xs font-bold text-slate-200 border border-slate-700 transition-all cursor-pointer shadow-sm"
              title="Refresh profile state"
            >
              <RefreshCw className="h-3.5 w-3.5" /> Refresh
            </button>
            <button
              onClick={() => setActiveTab('edit')}
              className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-xs font-bold text-white transition-all cursor-pointer shadow-sm"
            >
              <Edit3 className="h-3.5 w-3.5" /> Edit Profile
            </button>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="flex items-center gap-2 mt-6 pt-4 border-t border-slate-800 overflow-x-auto">
          <button
            onClick={() => setActiveTab('overview')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 cursor-pointer ${
              activeTab === 'overview'
                ? 'bg-emerald-700 text-white shadow-sm'
                : 'text-slate-300 hover:text-white hover:bg-slate-800'
            }`}
          >
            <User className="h-3.5 w-3.5" /> Overview
          </button>
          <button
            onClick={() => setActiveTab('security')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 cursor-pointer ${
              activeTab === 'security'
                ? 'bg-emerald-700 text-white shadow-sm'
                : 'text-slate-300 hover:text-white hover:bg-slate-800'
            }`}
          >
            <Shield className="h-3.5 w-3.5" /> Access Passport & Permissions
          </button>
          {isAdmin && (
            <button
              onClick={() => setActiveTab('adminActions')}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 cursor-pointer ${
                activeTab === 'adminActions'
                  ? 'bg-amber-600 text-white shadow-sm'
                  : 'text-amber-400 hover:text-amber-300 hover:bg-slate-800'
              }`}
            >
              <Sparkles className="h-3.5 w-3.5" /> Admin Operations Suite
            </button>
          )}
          <button
            onClick={() => setActiveTab('edit')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 cursor-pointer ${
              activeTab === 'edit'
                ? 'bg-emerald-700 text-white shadow-sm'
                : 'text-slate-300 hover:text-white hover:bg-slate-800'
            }`}
          >
            <Edit3 className="h-3.5 w-3.5" /> Update Details
          </button>
        </div>
      </div>

      {/* ALERT BANNERS */}
      {error && (
        <div className="p-4 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-xs flex items-center gap-2 animate-fadeIn">
          <AlertCircle className="h-4 w-4 flex-shrink-0 text-rose-600" />
          <span>{error}</span>
        </div>
      )}
      {successMsg && (
        <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs flex items-center gap-2 animate-fadeIn">
          <CheckCircle2 className="h-4 w-4 flex-shrink-0 text-emerald-600" />
          <span>{successMsg}</span>
        </div>
      )}

      {/* 2. TAB CONTENT: OVERVIEW */}
      {activeTab === 'overview' && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Identity & Account Card */}
          <div className="md:col-span-2 bg-white rounded-2xl p-6 border border-slate-200 shadow-sm space-y-6">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h2 className="text-sm font-black text-slate-800 uppercase tracking-wider flex items-center gap-2">
                <User className="h-4 w-4 text-emerald-600" /> Account Identity Dossier
              </h2>
              <span className="text-[10px] font-mono bg-slate-100 px-2 py-0.5 rounded text-slate-500">
                UUID: {profile?.id.substring(0, 13)}...
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-100">
                <span className="text-slate-400 font-semibold block mb-0.5">Full Official Name</span>
                <span className="text-slate-800 font-bold text-sm">{profile?.fullName}</span>
              </div>
              <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-100">
                <span className="text-slate-400 font-semibold block mb-0.5">System Username</span>
                <span className="text-slate-800 font-bold text-sm">{profile?.username}</span>
              </div>
              <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-100">
                <span className="text-slate-400 font-semibold block mb-0.5">Primary Email Address</span>
                <span className="text-slate-800 font-bold text-sm">{profile?.email}</span>
              </div>
              <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-100">
                <span className="text-slate-400 font-semibold block mb-0.5">Assigned Security Role</span>
                <span className="text-slate-800 font-bold text-sm uppercase">{profile?.role}</span>
              </div>
            </div>

            {/* If NGO: Show NGO details */}
            {profile?.ngo && (
              <div className="space-y-3 pt-2">
                <h3 className="text-xs font-black text-slate-800 uppercase tracking-wider flex items-center gap-2 border-b border-slate-100 pb-2">
                  <Building2 className="h-4 w-4 text-blue-600" /> Registered NGO Entity Information
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                  <div className="p-3 rounded-xl bg-blue-50/50 border border-blue-100">
                    <span className="text-slate-500 block text-[11px]">Organization Name</span>
                    <strong className="text-slate-800">{profile.ngo.name}</strong>
                  </div>
                  <div className="p-3 rounded-xl bg-blue-50/50 border border-blue-100">
                    <span className="text-slate-500 block text-[11px]">NITI Aayog Darpan ID</span>
                    <strong className="text-blue-700 font-mono">{profile.ngo.darpanId}</strong>
                  </div>
                  <div className="p-3 rounded-xl bg-blue-50/50 border border-blue-100">
                    <span className="text-slate-500 block text-[11px]">Tax PAN Registration</span>
                    <strong className="text-slate-800 font-mono">{profile.ngo.panNumber}</strong>
                  </div>
                  <div className="p-3 rounded-xl bg-blue-50/50 border border-blue-100">
                    <span className="text-slate-500 block text-[11px]">Jurisdiction</span>
                    <strong className="text-slate-800">{profile.ngo.district}, {profile.ngo.state}</strong>
                  </div>
                  <div className="sm:col-span-2 p-3 rounded-xl bg-blue-50/50 border border-blue-100">
                    <span className="text-slate-500 block text-[11px]">Registered Address</span>
                    <span className="text-slate-700">{profile.ngo.address || 'Not specified'}</span>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Quick Action Side Panel */}
          <div className="space-y-6">
            <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm space-y-4">
              <h3 className="text-xs font-black text-slate-800 uppercase tracking-wider flex items-center gap-2">
                <Shield className="h-4 w-4 text-amber-500" /> Operational Authority
              </h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                {isAdmin
                  ? 'You possess full administrative authorization across all foundation databases, career desks, project sanctioning, and user privilege delegations.'
                  : `Your account is authenticated under the ${profile?.role} protocol with permissions delegated by the State Foundation Administrator.`}
              </p>

              <div className="space-y-2 pt-2">
                <button
                  onClick={() => setActiveTab('security')}
                  className="w-full flex items-center justify-between p-3 rounded-xl bg-slate-50 hover:bg-slate-100 border border-slate-200 text-xs font-bold text-slate-800 transition-all"
                >
                  <span className="flex items-center gap-2">
                    <Shield className="h-4 w-4 text-emerald-600" /> View Access Passport
                  </span>
                  <ChevronRight className="h-4 w-4 text-slate-400" />
                </button>

                {isAdmin && (
                  <button
                    onClick={() => setActiveTab('adminActions')}
                    className="w-full flex items-center justify-between p-3 rounded-xl bg-amber-50 hover:bg-amber-100 border border-amber-200 text-xs font-bold text-amber-900 transition-all"
                  >
                    <span className="flex items-center gap-2">
                      <Sparkles className="h-4 w-4 text-amber-600" /> Launch Admin Operations
                    </span>
                    <ChevronRight className="h-4 w-4 text-amber-500" />
                  </button>
                )}
              </div>
            </div>

            {/* Portal Support Helpbox */}
            <div className="bg-emerald-50/80 rounded-2xl p-5 border border-emerald-200 space-y-2 text-xs">
              <h4 className="font-bold text-emerald-900 flex items-center gap-1.5">
                <Award className="h-4 w-4 text-emerald-700" /> Certified Foundation Portal
              </h4>
              <p className="text-emerald-800 leading-relaxed">
                Need to escalate permission adjustments or verify your NGO tax exemption certificates? Reach out to the Foundation Directorate directly.
              </p>
              <Link
                to="/faq"
                className="inline-flex items-center gap-1 text-emerald-900 font-black underline hover:text-emerald-700 pt-1"
              >
                View Regulatory FAQs <ExternalLink className="h-3 w-3" />
              </Link>
            </div>
          </div>
        </div>
      )}

      {/* 3. TAB CONTENT: ACCESS PASSPORT & PERMISSIONS */}
      {activeTab === 'security' && (
        <div className="bg-white rounded-2xl p-6 md:p-8 border border-slate-200 shadow-sm space-y-6">
          <div className="border-b border-slate-100 pb-4">
            <h2 className="text-base font-black text-slate-800 flex items-center gap-2">
              <Shield className="h-5 w-5 text-emerald-600" /> Security Privileges & Active Access Passport
            </h2>
            <p className="text-xs text-slate-500 mt-1">
              Every operation within the Socio Economic Lacuna Foundation portal is strictly gated by real-time role-based access control.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* 1. Job Postings */}
            <div className={`p-4 rounded-xl border flex items-start justify-between gap-3 ${
              isAdmin || profile?.permissions.canPostJobs
                ? 'bg-emerald-50/40 border-emerald-200 text-emerald-900'
                : 'bg-slate-50 border-slate-200 text-slate-500 opacity-80'
            }`}>
              <div className="space-y-1">
                <div className="flex items-center gap-2 font-bold text-xs">
                  <Briefcase className="h-4 w-4 text-emerald-700" />
                  <span>Job Postings & Candidate Shortlisting</span>
                </div>
                <p className="text-[11px] text-slate-600">
                  Allows publishing state vacancies, inspecting applicant resumes, and approving candidate shortlists.
                </p>
              </div>
              <span className={`text-[10px] px-2.5 py-1 rounded-full font-black uppercase tracking-wider flex items-center gap-1 flex-shrink-0 ${
                isAdmin || profile?.permissions.canPostJobs
                  ? 'bg-emerald-600 text-white'
                  : 'bg-slate-200 text-slate-600'
              }`}>
                {isAdmin || profile?.permissions.canPostJobs ? <Unlock className="h-3 w-3" /> : <Lock className="h-3 w-3" />}
                {isAdmin ? 'Root Unlocked' : profile?.permissions.canPostJobs ? 'Granted' : 'Locked'}
              </span>
            </div>

            {/* 2. Project Submissions */}
            <div className={`p-4 rounded-xl border flex items-start justify-between gap-3 ${
              isAdmin || profile?.permissions.canSubmitProjects
                ? 'bg-emerald-50/40 border-emerald-200 text-emerald-900'
                : 'bg-slate-50 border-slate-200 text-slate-500 opacity-80'
            }`}>
              <div className="space-y-1">
                <div className="flex items-center gap-2 font-bold text-xs">
                  <FolderPlus className="h-4 w-4 text-emerald-700" />
                  <span>Project Proposals & Sanctions</span>
                </div>
                <p className="text-[11px] text-slate-600">
                  Permits drafting and submitting new grant proposals, budget line items, and tracking sanction milestones.
                </p>
              </div>
              <span className={`text-[10px] px-2.5 py-1 rounded-full font-black uppercase tracking-wider flex items-center gap-1 flex-shrink-0 ${
                isAdmin || profile?.permissions.canSubmitProjects
                  ? 'bg-emerald-600 text-white'
                  : 'bg-slate-200 text-slate-600'
              }`}>
                {isAdmin || profile?.permissions.canSubmitProjects ? <Unlock className="h-3 w-3" /> : <Lock className="h-3 w-3" />}
                {isAdmin ? 'Root Unlocked' : profile?.permissions.canSubmitProjects ? 'Granted' : 'Locked'}
              </span>
            </div>

            {/* 3. Scheme Management */}
            <div className={`p-4 rounded-xl border flex items-start justify-between gap-3 ${
              isAdmin || profile?.permissions.canManageSchemes
                ? 'bg-emerald-50/40 border-emerald-200 text-emerald-900'
                : 'bg-slate-50 border-slate-200 text-slate-500 opacity-80'
            }`}>
              <div className="space-y-1">
                <div className="flex items-center gap-2 font-bold text-xs">
                  <Award className="h-4 w-4 text-emerald-700" />
                  <span>Welfare Schemes Administration</span>
                </div>
                <p className="text-[11px] text-slate-600">
                  Allows defining new grant funding schemes, eligibility guidelines, and funding caps.
                </p>
              </div>
              <span className={`text-[10px] px-2.5 py-1 rounded-full font-black uppercase tracking-wider flex items-center gap-1 flex-shrink-0 ${
                isAdmin || profile?.permissions.canManageSchemes
                  ? 'bg-emerald-600 text-white'
                  : 'bg-slate-200 text-slate-600'
              }`}>
                {isAdmin || profile?.permissions.canManageSchemes ? <Unlock className="h-3 w-3" /> : <Lock className="h-3 w-3" />}
                {isAdmin ? 'Root Unlocked' : profile?.permissions.canManageSchemes ? 'Granted' : 'Locked'}
              </span>
            </div>

            {/* 4. User Management */}
            <div className={`p-4 rounded-xl border flex items-start justify-between gap-3 ${
              isAdmin || profile?.permissions.canManageUsers
                ? 'bg-emerald-50/40 border-emerald-200 text-emerald-900'
                : 'bg-slate-50 border-slate-200 text-slate-500 opacity-80'
            }`}>
              <div className="space-y-1">
                <div className="flex items-center gap-2 font-bold text-xs">
                  <Users className="h-4 w-4 text-emerald-700" />
                  <span>User & Permission Administration</span>
                </div>
                <p className="text-[11px] text-slate-600">
                  Allows creating new delegated officer and recruiter accounts and toggling access checkboxes.
                </p>
              </div>
              <span className={`text-[10px] px-2.5 py-1 rounded-full font-black uppercase tracking-wider flex items-center gap-1 flex-shrink-0 ${
                isAdmin || profile?.permissions.canManageUsers
                  ? 'bg-emerald-600 text-white'
                  : 'bg-slate-200 text-slate-600'
              }`}>
                {isAdmin || profile?.permissions.canManageUsers ? <Unlock className="h-3 w-3" /> : <Lock className="h-3 w-3" />}
                {isAdmin ? 'Root Unlocked' : profile?.permissions.canManageUsers ? 'Granted' : 'Locked'}
              </span>
            </div>

            {/* 5. Document & Image Vault */}
            <div className={`p-4 rounded-xl border flex items-start justify-between gap-3 sm:col-span-2 ${
              isAdmin || profile?.permissions.canUploadImages
                ? 'bg-emerald-50/40 border-emerald-200 text-emerald-900'
                : 'bg-slate-50 border-slate-200 text-slate-500 opacity-80'
            }`}>
              <div className="space-y-1">
                <div className="flex items-center gap-2 font-bold text-xs">
                  <UploadCloud className="h-4 w-4 text-emerald-700" />
                  <span>Document Vault & Media Uploads</span>
                </div>
                <p className="text-[11px] text-slate-600">
                  Allows uploading PDF reports of previous projects, 80G audit certificates, and publishing official foundation news and circulars.
                </p>
              </div>
              <span className={`text-[10px] px-2.5 py-1 rounded-full font-black uppercase tracking-wider flex items-center gap-1 flex-shrink-0 ${
                isAdmin || profile?.permissions.canUploadImages
                  ? 'bg-emerald-600 text-white'
                  : 'bg-slate-200 text-slate-600'
              }`}>
                {isAdmin || profile?.permissions.canUploadImages ? <Unlock className="h-3 w-3" /> : <Lock className="h-3 w-3" />}
                {isAdmin ? 'Root Unlocked' : profile?.permissions.canUploadImages ? 'Granted' : 'Locked'}
              </span>
            </div>
          </div>
        </div>
      )}

      {/* 4. TAB CONTENT: ADMIN OPERATIONS SUITE */}
      {activeTab === 'adminActions' && isAdmin && (
        <div className="space-y-6">
          <div className="bg-amber-50 border border-amber-200 rounded-2xl p-6 text-amber-950 space-y-2">
            <h2 className="text-base font-black flex items-center gap-2 text-amber-900">
              <Sparkles className="h-5 w-5 text-amber-600" /> Administrator Master Operations Suite
            </h2>
            <p className="text-xs text-amber-800 leading-relaxed">
              As Root Administrator, you have full sovereign authority to execute any operation across the foundation:
              create jobs, shortlist applicants, post and sanction projects, upload PDF reports of previous projects, and broadcast official news.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {/* Action 1: Post Jobs */}
            <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm space-y-3 flex flex-col justify-between hover:border-emerald-500 transition-all group">
              <div className="space-y-2">
                <div className="h-10 w-10 rounded-xl bg-amber-100 text-amber-800 flex items-center justify-center">
                  <Briefcase className="h-5 w-5" />
                </div>
                <h3 className="text-sm font-bold text-slate-800">Job Vacancies & Postings</h3>
                <p className="text-xs text-slate-500">
                  Publish openings for field officers, project managers, and financial analysts directly to the public careers board.
                </p>
              </div>
              <Link
                to="/dashboard/recruitment"
                className="w-full py-2.5 px-4 rounded-xl bg-slate-900 hover:bg-emerald-700 text-white font-bold text-xs flex items-center justify-center gap-2 transition-all cursor-pointer"
              >
                <span>Manage & Post Jobs</span>
                <ChevronRight className="h-4 w-4" />
              </Link>
            </div>

            {/* Action 2: Shortlist Candidates */}
            <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm space-y-3 flex flex-col justify-between hover:border-emerald-500 transition-all group">
              <div className="space-y-2">
                <div className="h-10 w-10 rounded-xl bg-purple-100 text-purple-800 flex items-center justify-center">
                  <Award className="h-5 w-5" />
                </div>
                <h3 className="text-sm font-bold text-slate-800">Candidate Screening Desk</h3>
                <p className="text-xs text-slate-500">
                  Screen received candidate applications, inspect uploaded CVs, and update statuses to "Shortlisted" or "Selected".
                </p>
              </div>
              <Link
                to="/dashboard/recruitment"
                className="w-full py-2.5 px-4 rounded-xl bg-purple-700 hover:bg-purple-800 text-white font-bold text-xs flex items-center justify-center gap-2 transition-all cursor-pointer"
              >
                <span>Shortlist Candidates</span>
                <ChevronRight className="h-4 w-4" />
              </Link>
            </div>

            {/* Action 3: Post Direct Project */}
            <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm space-y-3 flex flex-col justify-between hover:border-emerald-500 transition-all group">
              <div className="space-y-2">
                <div className="h-10 w-10 rounded-xl bg-blue-100 text-blue-800 flex items-center justify-center">
                  <FolderPlus className="h-5 w-5" />
                </div>
                <h3 className="text-sm font-bold text-slate-800">Post & Sanction Project</h3>
                <p className="text-xs text-slate-500">
                  Directly post a new government or foundation grant project with budget allocation and demographic targets.
                </p>
              </div>
              <button
                onClick={() => setProjectModalOpen(true)}
                className="w-full py-2.5 px-4 rounded-xl bg-blue-700 hover:bg-blue-800 text-white font-bold text-xs flex items-center justify-center gap-2 transition-all cursor-pointer"
              >
                <span>Post Direct Project</span>
                <ChevronRight className="h-4 w-4" />
              </button>
            </div>

            {/* Action 4: Upload Project PDF Doc */}
            <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm space-y-3 flex flex-col justify-between hover:border-emerald-500 transition-all group">
              <div className="space-y-2">
                <div className="h-10 w-10 rounded-xl bg-emerald-100 text-emerald-800 flex items-center justify-center">
                  <FileText className="h-5 w-5" />
                </div>
                <h3 className="text-sm font-bold text-slate-800">Upload Project PDF Document</h3>
                <p className="text-xs text-slate-500">
                  Upload completion audit reports, project dossiers, or past performance case studies in PDF format.
                </p>
              </div>
              <button
                onClick={() => {
                  setDocType('Previous Project Report');
                  setDocModalOpen(true);
                }}
                className="w-full py-2.5 px-4 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-xs flex items-center justify-center gap-2 transition-all cursor-pointer"
              >
                <span>Upload Project PDF</span>
                <UploadCloud className="h-4 w-4" />
              </button>
            </div>

            {/* Action 5: Mention News / Circular */}
            <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm space-y-3 flex flex-col justify-between hover:border-emerald-500 transition-all group">
              <div className="space-y-2">
                <div className="h-10 w-10 rounded-xl bg-rose-100 text-rose-800 flex items-center justify-center">
                  <Megaphone className="h-5 w-5" />
                </div>
                <h3 className="text-sm font-bold text-slate-800">Publish News & Circulars</h3>
                <p className="text-xs text-slate-500">
                  Broadcast official notifications, grant deadlines, and foundation press releases to all portal users.
                </p>
              </div>
              <button
                onClick={() => {
                  setDocType('News & Announcements');
                  setDocModalOpen(true);
                }}
                className="w-full py-2.5 px-4 rounded-xl bg-rose-700 hover:bg-rose-800 text-white font-bold text-xs flex items-center justify-center gap-2 transition-all cursor-pointer"
              >
                <span>Mention News / Notice</span>
                <Megaphone className="h-4 w-4" />
              </button>
            </div>

            {/* Action 6: Manage Users & Delegation */}
            <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm space-y-3 flex flex-col justify-between hover:border-emerald-500 transition-all group">
              <div className="space-y-2">
                <div className="h-10 w-10 rounded-xl bg-slate-100 text-slate-800 flex items-center justify-center">
                  <Users className="h-5 w-5" />
                </div>
                <h3 className="text-sm font-bold text-slate-800">Delegate User Access</h3>
                <p className="text-xs text-slate-500">
                  Create new accounts for recruiters or field officers and configure their individual access privileges.
                </p>
              </div>
              <Link
                to="/dashboard/users"
                className="w-full py-2.5 px-4 rounded-xl bg-slate-800 hover:bg-slate-900 text-white font-bold text-xs flex items-center justify-center gap-2 transition-all cursor-pointer"
              >
                <span>Open User Matrix</span>
                <ChevronRight className="h-4 w-4" />
              </Link>
            </div>
          </div>
        </div>
      )}

      {/* 5. TAB CONTENT: EDIT DETAILS */}
      {activeTab === 'edit' && (
        <div className="bg-white rounded-2xl p-6 md:p-8 border border-slate-200 shadow-sm space-y-6">
          <div className="border-b border-slate-100 pb-3">
            <h2 className="text-base font-black text-slate-800 flex items-center gap-2">
              <Edit3 className="h-5 w-5 text-emerald-600" /> Update Account & Official Profile
            </h2>
            <p className="text-xs text-slate-500 mt-1">
              Changes made here are permanently committed to the PostgreSQL foundation database and reflected across all services.
            </p>
          </div>

          <form onSubmit={handleUpdateProfile} className="space-y-5">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5 text-xs">
              <div className="space-y-1.5">
                <label className="font-bold text-slate-700 block">Full Name / Directorate Name *</label>
                <input
                  type="text"
                  required
                  value={formData.fullName}
                  onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                  className="w-full px-3.5 py-2.5 border border-slate-300 rounded-xl focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-600 text-slate-800"
                />
              </div>

              <div className="space-y-1.5">
                <label className="font-bold text-slate-700 block">Email Address (Login ID) *</label>
                <input
                  type="email"
                  required
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="w-full px-3.5 py-2.5 border border-slate-300 rounded-xl focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-600 text-slate-800"
                />
              </div>

              {profile?.ngo && (
                <>
                  <div className="space-y-1.5">
                    <label className="font-bold text-slate-700 block">Contact Person</label>
                    <input
                      type="text"
                      value={formData.contactPerson || ''}
                      onChange={(e) => setFormData({ ...formData, contactPerson: e.target.value })}
                      className="w-full px-3.5 py-2.5 border border-slate-300 rounded-xl focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-600 text-slate-800"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="font-bold text-slate-700 block">Contact Phone Number</label>
                    <input
                      type="text"
                      value={formData.phone || ''}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      className="w-full px-3.5 py-2.5 border border-slate-300 rounded-xl focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-600 text-slate-800"
                    />
                  </div>

                  <div className="md:col-span-2 space-y-1.5">
                    <label className="font-bold text-slate-700 block">Physical / Registered Office Address</label>
                    <textarea
                      rows={3}
                      value={formData.address || ''}
                      onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                      className="w-full px-3.5 py-2.5 border border-slate-300 rounded-xl focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-600 text-slate-800"
                    />
                  </div>
                </>
              )}
            </div>

            <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100">
              <button
                type="button"
                onClick={() => setActiveTab('overview')}
                className="px-5 py-2.5 rounded-xl border border-slate-300 text-slate-700 hover:bg-slate-50 font-bold text-xs transition-all cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={saving}
                className="px-6 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs flex items-center gap-2 transition-all cursor-pointer shadow-sm disabled:opacity-50"
              >
                {saving ? <RefreshCw className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
                <span>{saving ? 'Saving...' : 'Save Profile Changes'}</span>
              </button>
            </div>
          </form>
        </div>
      )}

      {/* 6. MODAL: UPLOAD PROJECT PDF / NEWS */}
      {docModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fadeIn">
          <div className="bg-white rounded-2xl w-full max-w-lg p-6 space-y-5 shadow-2xl border border-slate-200">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="text-sm font-black text-slate-800 flex items-center gap-2">
                <UploadCloud className="h-5 w-5 text-emerald-600" />
                <span>Upload Document: {docType}</span>
              </h3>
              <button
                onClick={() => setDocModalOpen(false)}
                className="text-slate-400 hover:text-slate-600 text-sm font-bold"
              >
                ✕
              </button>
            </div>

            {docSuccess && (
              <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4 text-emerald-600 flex-shrink-0" />
                <span>{docSuccess}</span>
              </div>
            )}

            <form onSubmit={handleUploadDoc} className="space-y-4 text-xs">
              <div className="space-y-1.5">
                <label className="font-bold text-slate-700 block">Category / Type *</label>
                <select
                  value={docType}
                  onChange={(e) => setDocType(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-300 rounded-xl focus:ring-2 focus:ring-emerald-500/20"
                >
                  <option value="Previous Project Report">Previous Project Report (PDF)</option>
                  <option value="News & Announcements">News & Announcements / Notice</option>
                  <option value="Official Circular">Official Government Circular</option>
                  <option value="Annual Report">Annual Performance Report</option>
                  <option value="Audit & 80G">Audit & 80G Tax Exemption</option>
                </select>
              </div>

              <div className="space-y-1.5">
                <label className="font-bold text-slate-700 block">Document Title / Headline *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Jharkhand Water Conservation Project Completion Report 2025"
                  value={docTitle}
                  onChange={(e) => setDocTitle(e.target.value)}
                  className="w-full px-3.5 py-2.5 border border-slate-300 rounded-xl focus:ring-2 focus:ring-emerald-500/20"
                />
              </div>

              <div className="space-y-1.5">
                <label className="font-bold text-slate-700 block">Financial / Sanction Year</label>
                <input
                  type="text"
                  value={docYear}
                  onChange={(e) => setDocYear(e.target.value)}
                  className="w-full px-3.5 py-2 border border-slate-300 rounded-xl"
                />
              </div>

              <div className="space-y-1.5">
                <label className="font-bold text-slate-700 block">Select File (PDF, DOCX, or Image) *</label>
                <input
                  type="file"
                  required
                  accept=".pdf,.docx,.doc,.png,.jpg,.jpeg"
                  onChange={(e) => {
                    if (e.target.files && e.target.files.length > 0) {
                      setDocFile(e.target.files[0]);
                    }
                  }}
                  className="w-full p-2 border border-dashed border-slate-300 rounded-xl bg-slate-50 cursor-pointer"
                />
                {docFile && (
                  <p className="text-[11px] text-emerald-700 font-medium pt-1">
                    Selected: {docFile.name} ({(docFile.size / (1024 * 1024)).toFixed(2)} MB)
                  </p>
                )}
              </div>

              <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setDocModalOpen(false)}
                  className="px-4 py-2 rounded-xl border border-slate-300 text-slate-700 font-bold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={uploadingDoc || !docFile || !docTitle}
                  className="px-5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold flex items-center gap-2 disabled:opacity-50"
                >
                  {uploadingDoc && <RefreshCw className="h-4 w-4 animate-spin" />}
                  <span>{uploadingDoc ? 'Uploading...' : 'Publish Document'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* 7. MODAL: POST DIRECT PROJECT */}
      {projectModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fadeIn">
          <div className="bg-white rounded-2xl w-full max-w-lg p-6 space-y-5 shadow-2xl border border-slate-200">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="text-sm font-black text-slate-800 flex items-center gap-2">
                <FolderPlus className="h-5 w-5 text-blue-600" />
                <span>Post Direct Project Proposal</span>
              </h3>
              <button
                onClick={() => setProjectModalOpen(false)}
                className="text-slate-400 hover:text-slate-600 text-sm font-bold"
              >
                ✕
              </button>
            </div>

            {projSuccess && (
              <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4 text-emerald-600 flex-shrink-0" />
                <span>{projSuccess}</span>
              </div>
            )}

            <form onSubmit={handlePostDirectProject} className="space-y-4 text-xs">
              <div className="space-y-1.5">
                <label className="font-bold text-slate-700 block">Project Title *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Santhal Pargana Solar Irrigation & Livelihood Project"
                  value={projTitle}
                  onChange={(e) => setProjTitle(e.target.value)}
                  className="w-full px-3.5 py-2.5 border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500/20"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <label className="font-bold text-slate-700 block">District *</label>
                  <select
                    value={projDistrict}
                    onChange={(e) => setProjDistrict(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-300 rounded-xl"
                  >
                    <option value="Ranchi">Ranchi</option>
                    <option value="Khunti">Khunti</option>
                    <option value="Dumka">Dumka</option>
                    <option value="Hazaribagh">Hazaribagh</option>
                    <option value="East Singhbhum">East Singhbhum</option>
                  </select>
                </div>

                <div className="space-y-1.5">
                  <label className="font-bold text-slate-700 block">Estimated Beneficiaries</label>
                  <input
                    type="number"
                    defaultValue={150}
                    className="w-full px-3 py-2 border border-slate-300 rounded-xl"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="font-bold text-slate-700 block">Project Abstract & Objectives *</label>
                <textarea
                  rows={4}
                  required
                  placeholder="Briefly state key activities, target villages, and expected welfare impact."
                  value={projAbstract}
                  onChange={(e) => setProjAbstract(e.target.value)}
                  className="w-full px-3.5 py-2.5 border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500/20"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setProjectModalOpen(false)}
                  className="px-4 py-2 rounded-xl border border-slate-300 text-slate-700 font-bold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={postingProject || !projTitle || !projAbstract}
                  className="px-5 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold flex items-center gap-2 disabled:opacity-50"
                >
                  {postingProject && <RefreshCw className="h-4 w-4 animate-spin" />}
                  <span>{postingProject ? 'Submitting...' : 'Post Project'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
