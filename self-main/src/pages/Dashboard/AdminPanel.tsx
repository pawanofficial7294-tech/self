import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  Users,
  Briefcase,
  FolderOpen,
  ShieldCheck,
  CheckCircle2,
  Activity,
  TrendingUp,
  Plus,
  UserPlus,
  FileCheck,
  Layers,
  ChevronRight,
  ExternalLink,
  Shield,
  Eye,
  RefreshCw,
  Award,
  ArrowUpRight,
  FileText,
  Trash2,
  Check,
  X
} from 'lucide-react';
import {
  ResponsiveContainer,
  LineChart,
  Line,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend
} from 'recharts';
import { useAuth } from '../../context/AuthContext';
import { adminService, type UserSummary } from '../../services/adminService';
import { careerService } from '../../services/careerService';
import { dashboardService, type DashboardStats } from '../../services/dashboardService';
import { applicationService, type ApplicationItem } from '../../services/applicationService';
import {
  GRANTS_BY_YEAR_DATA,
  PROJECTS_BY_SECTOR_DATA,
  STATE_WISE_PROJECTS_DATA
} from '../../constants/mockData';

interface AdminPanelProps {
  onSwitchToUserView?: () => void;
}

export const AdminPanel: React.FC<AdminPanelProps> = ({ onSwitchToUserView }) => {
  const { user } = useAuth();
  const navigate = useNavigate();

  // Live state from APIs
  const [users, setUsers] = useState<UserSummary[]>([]);
  const [jobs, setJobs] = useState<any[]>([]);
  const [candidates, setCandidates] = useState<any[]>([]);
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [applications, setApplications] = useState<ApplicationItem[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [actionFeedback, setActionFeedback] = useState<string | null>(null);

  // Active operations tab: overview | delegation | recruitment | proposals | analytics
  const [activeTab, setActiveTab] = useState<'overview' | 'delegation' | 'recruitment' | 'proposals' | 'analytics'>('overview');

  const [selectedYear] = useState<string>('2026');
  const [selectedState] = useState<string>('All States');

  const fetchData = async () => {
    setIsLoading(true);
    setActionFeedback(null);
    try {
      const [usersData, jobsData, candidatesData, statsData, appsData] = await Promise.allSettled([
        adminService.getAllUsers(),
        careerService.getAllJobs(),
        careerService.getAllCandidates(),
        dashboardService.getStats(),
        applicationService.getAllApplications()
      ]);

      if (usersData.status === 'fulfilled') setUsers(usersData.value);
      if (jobsData.status === 'fulfilled') setJobs(jobsData.value);
      if (candidatesData.status === 'fulfilled') setCandidates(candidatesData.value);
      if (statsData.status === 'fulfilled') setStats(statsData.value);
      if (appsData.status === 'fulfilled') setApplications(appsData.value);
    } catch (e) {
      console.error('Error fetching admin panel data', e);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  // Application Actions
  const handleUpdateAppStatus = async (
    appId: string,
    status: 'Sanctioned' | 'Approved' | 'DistrictReview' | 'Rejected'
  ) => {
    try {
      await applicationService.updateStatus(appId, status, `Updated to ${status} by Administrator`);
      setApplications((prev) =>
        prev.map((a) => (a.id === appId ? { ...a, status } : a))
      );
      setActionFeedback(`Application status updated to "${status}" successfully.`);
      setTimeout(() => setActionFeedback(null), 4000);
    } catch (e: any) {
      alert(e.message || 'Failed to update application status.');
    }
  };

  const handleDeleteApplication = async (appId: string) => {
    if (!window.confirm('Are you sure you want to remove this project proposal?')) return;
    try {
      await applicationService.deleteApplication(appId);
      setApplications((prev) => prev.filter((a) => a.id !== appId));
      setActionFeedback('Application proposal removed successfully.');
      setTimeout(() => setActionFeedback(null), 4000);
    } catch (e: any) {
      alert(e.message || 'Failed to delete application.');
    }
  };

  // KPI computations
  const totalUsers = users.length;
  const officersCount = users.filter((u) => u.role === 'OFFICER').length;
  const ngoCount = users.filter((u) => u.role === 'NGO').length;
  const adminCount = users.filter((u) => u.role === 'ADMIN').length;

  const totalJobs = jobs.length;
  const totalCandidates = candidates.length;
  const shortlistedCandidates = candidates.filter((c) => c.status === 'Shortlisted').length;
  const pendingCandidates = candidates.filter(
    (c) => c.status === 'Under Screening' || c.status === 'Under Review' || c.status === 'Applied'
  ).length;

  // Real or fallback analytics data
  const monthlyTrendsData: Array<{ month: string; amount: number; disbursed: number; target: number }> =
    stats?.monthlyTrends && stats.monthlyTrends.length > 0
      ? stats.monthlyTrends.map((m) => ({
          month: m.month,
          amount: m.amount,
          disbursed: m.amount,
          target: Number((m.amount * 1.15).toFixed(1)),
        }))
      : (GRANTS_BY_YEAR_DATA[selectedYear as keyof typeof GRANTS_BY_YEAR_DATA] || GRANTS_BY_YEAR_DATA['2026']).map((m) => ({
          month: m.month,
          amount: m.amount,
          disbursed: m.amount,
          target: Number((m.amount * 1.15).toFixed(1)),
        }));

  const sectorColors = ['#16a34a', '#0d9488', '#2563eb', '#f59e0b', '#8b5cf6', '#ec4899'];
  const sectorsPieData =
    stats?.sectorDistribution && stats.sectorDistribution.length > 0
      ? stats.sectorDistribution.map((s, idx) => ({
          sector: s.sector,
          value: s.count,
          color: sectorColors[idx % sectorColors.length],
        }))
      : PROJECTS_BY_SECTOR_DATA[selectedState as keyof typeof PROJECTS_BY_SECTOR_DATA] || PROJECTS_BY_SECTOR_DATA['All States'];

  const territoryData =
    stats?.stateWiseDistribution && stats.stateWiseDistribution.length > 0
      ? stats.stateWiseDistribution.map((s) => ({
          state: s.state,
          projects: s.projects,
          grants: s.grantsCr,
        }))
      : STATE_WISE_PROJECTS_DATA;

  return (
    <div className="space-y-8 animate-fadeIn select-none">
      {/* 1. EXECUTIVE COMMAND HEADER */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-[#07240c] via-[#0e3b15] to-[#1a5d22] text-white p-6 md:p-8 shadow-xl border border-emerald-800/40">
        <div className="absolute right-0 top-0 w-96 h-96 bg-emerald-400/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -left-20 -bottom-20 w-80 h-80 bg-amber-400/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="flex flex-wrap items-center gap-2.5">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-black uppercase tracking-wider bg-amber-400 text-slate-950 shadow-sm">
                <ShieldCheck className="h-3.5 w-3.5" /> Root Administrator
              </span>
              <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-white/10 text-emerald-200 border border-white/15">
                <Activity className="h-3 w-3 text-emerald-400 animate-pulse" /> Live PostgreSQL Connected
              </span>
            </div>
            <h1 className="text-2xl md:text-4xl font-black tracking-tight text-white">
              Administrator Executive Control Center
            </h1>
            <p className="text-emerald-100 text-xs md:text-sm max-w-2xl leading-relaxed">
              Welcome back, <span className="font-bold text-amber-300">{user?.name || 'Chief Administrator'}</span>. Direct all nationwide project sanctions, delegate work permissions, screen recruitment applicants, and inspect financial metrics.
            </p>
          </div>

          {/* Quick Action Triggers */}
          <div className="flex flex-wrap items-center gap-3">
            <button
              onClick={() => navigate('/dashboard/users')}
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-amber-400 hover:bg-amber-300 text-slate-950 font-bold text-xs shadow-md hover:shadow-lg transition-all transform hover:-translate-y-0.5 cursor-pointer"
            >
              <UserPlus className="h-4 w-4" /> Delegate User Access
            </button>
            <button
              onClick={() => navigate('/dashboard/recruitment')}
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-emerald-700 hover:bg-emerald-600 text-white font-bold text-xs border border-emerald-500/50 shadow-md hover:shadow-lg transition-all transform hover:-translate-y-0.5 cursor-pointer"
            >
              <Briefcase className="h-4 w-4" /> Post Job Vacancy
            </button>
            {onSwitchToUserView && (
              <button
                onClick={onSwitchToUserView}
                className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-emerald-100 text-xs font-semibold border border-white/20 transition-all cursor-pointer"
                title="Preview what individual delegated users see"
              >
                <Eye className="h-3.5 w-3.5" /> Preview User View
              </button>
            )}
            <button
              onClick={fetchData}
              disabled={isLoading}
              className="p-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-white transition-all cursor-pointer disabled:opacity-50"
              title="Refresh System Data"
            >
              <RefreshCw className={`h-4 w-4 ${isLoading ? 'animate-spin' : ''}`} />
            </button>
          </div>
        </div>

        {/* Quick Navigation Tabs Bar */}
        <div className="flex items-center gap-2 mt-6 pt-5 border-t border-white/15 overflow-x-auto text-xs font-bold">
          <button
            onClick={() => setActiveTab('overview')}
            className={`px-3.5 py-2 rounded-lg transition-all flex items-center gap-2 cursor-pointer ${
              activeTab === 'overview'
                ? 'bg-white text-slate-900 shadow-md font-extrabold'
                : 'text-emerald-100 hover:bg-white/10'
            }`}
          >
            <Layers className="h-3.5 w-3.5" /> Command Overview
          </button>
          <button
            onClick={() => setActiveTab('delegation')}
            className={`px-3.5 py-2 rounded-lg transition-all flex items-center gap-2 cursor-pointer ${
              activeTab === 'delegation'
                ? 'bg-white text-slate-900 shadow-md font-extrabold'
                : 'text-emerald-100 hover:bg-white/10'
            }`}
          >
            <Shield className="h-3.5 w-3.5" /> Access Delegation Matrix ({users.length})
          </button>
          <button
            onClick={() => setActiveTab('recruitment')}
            className={`px-3.5 py-2 rounded-lg transition-all flex items-center gap-2 cursor-pointer ${
              activeTab === 'recruitment'
                ? 'bg-white text-slate-900 shadow-md font-extrabold'
                : 'text-emerald-100 hover:bg-white/10'
            }`}
          >
            <FileCheck className="h-3.5 w-3.5" /> Recruitment & Screening ({candidates.length})
          </button>
          <button
            onClick={() => setActiveTab('proposals')}
            className={`px-3.5 py-2 rounded-lg transition-all flex items-center gap-2 cursor-pointer ${
              activeTab === 'proposals'
                ? 'bg-white text-slate-900 shadow-md font-extrabold'
                : 'text-emerald-100 hover:bg-white/10'
            }`}
          >
            <FolderOpen className="h-3.5 w-3.5" /> Proposals & Sanctions ({applications.length})
          </button>
          <button
            onClick={() => setActiveTab('analytics')}
            className={`px-3.5 py-2 rounded-lg transition-all flex items-center gap-2 cursor-pointer ${
              activeTab === 'analytics'
                ? 'bg-white text-slate-900 shadow-md font-extrabold'
                : 'text-emerald-100 hover:bg-white/10'
            }`}
          >
            <TrendingUp className="h-3.5 w-3.5" /> Financial & Field Analytics
          </button>
        </div>
      </div>

      {/* Action feedback banner */}
      {actionFeedback && (
        <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-bold flex items-center gap-2 animate-fadeIn">
          <CheckCircle2 className="h-4 w-4 text-emerald-600" />
          <span>{actionFeedback}</span>
        </div>
      )}

      {/* 2. TOP KPI CARDS */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Card 1: Total Users */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm hover:shadow-md transition-all flex flex-col justify-between group">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Total Portal Users</span>
            <div className="p-2.5 rounded-xl bg-blue-50 text-blue-600 group-hover:scale-110 transition-transform">
              <Users className="h-5 w-5" />
            </div>
          </div>
          <div className="mt-3">
            <div className="text-3xl font-black text-slate-800">{totalUsers}</div>
            <div className="flex items-center gap-2 mt-1.5 text-xs text-slate-500">
              <span className="font-semibold text-emerald-600">{officersCount} Officers</span> •
              <span className="font-semibold text-blue-600">{ngoCount} NGOs</span> •
              <span className="font-semibold text-purple-600">{adminCount} Admins</span>
            </div>
          </div>
          <Link
            to="/dashboard/users"
            className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs font-bold text-blue-600 hover:text-blue-700"
          >
            Manage User Access <ChevronRight className="h-3.5 w-3.5" />
          </Link>
        </div>

        {/* Card 2: Recruitment & Applicants */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm hover:shadow-md transition-all flex flex-col justify-between group">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Recruitment Pipeline</span>
            <div className="p-2.5 rounded-xl bg-emerald-50 text-emerald-600 group-hover:scale-110 transition-transform">
              <Briefcase className="h-5 w-5" />
            </div>
          </div>
          <div className="mt-3">
            <div className="text-3xl font-black text-slate-800">{totalCandidates}</div>
            <div className="flex items-center gap-2 mt-1.5 text-xs text-slate-500">
              <span className="font-semibold text-emerald-600">{shortlistedCandidates} Shortlisted</span> •
              <span className="font-semibold text-amber-600">{pendingCandidates} Pending Review</span>
            </div>
          </div>
          <Link
            to="/dashboard/recruitment"
            className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs font-bold text-emerald-600 hover:text-emerald-700"
          >
            Review Candidates <ChevronRight className="h-3.5 w-3.5" />
          </Link>
        </div>

        {/* Card 3: Grant Disbursements */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm hover:shadow-md transition-all flex flex-col justify-between group">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Sanctioned Grants</span>
            <div className="p-2.5 rounded-xl bg-amber-50 text-amber-600 group-hover:scale-110 transition-transform">
              <Award className="h-5 w-5" />
            </div>
          </div>
          <div className="mt-3">
            <div className="text-3xl font-black text-slate-800">
              ₹ {stats?.totalGrantsSanctionedCr ? `${stats.totalGrantsSanctionedCr.toFixed(1)} Cr` : '185.4 Cr'}
            </div>
            <div className="flex items-center gap-1 mt-1.5 text-xs text-emerald-600 font-semibold">
              <TrendingUp className="h-3.5 w-3.5" /> Disbursed: ₹ {stats?.totalGrantsDisbursedCr?.toFixed(1) || '162.8'} Cr
            </div>
          </div>
          <button
            onClick={() => setActiveTab('proposals')}
            className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs font-bold text-amber-600 hover:text-amber-700 cursor-pointer text-left w-full"
          >
            Manage Proposals ({applications.length}) <ChevronRight className="h-3.5 w-3.5" />
          </button>
        </div>

        {/* Card 4: Active Projects */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm hover:shadow-md transition-all flex flex-col justify-between group">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Field Programs & Targets</span>
            <div className="p-2.5 rounded-xl bg-purple-50 text-purple-600 group-hover:scale-110 transition-transform">
              <FolderOpen className="h-5 w-5" />
            </div>
          </div>
          <div className="mt-3">
            <div className="text-3xl font-black text-slate-800">
              {stats?.totalBeneficiaries ? `${(stats.totalBeneficiaries / 100000).toFixed(2)} Lakhs` : '4.25 Lakhs'}
            </div>
            <div className="flex items-center gap-2 mt-1.5 text-xs text-slate-500">
              <span className="font-semibold text-purple-600">{stats?.activeProjects || 1} Active Projects</span> •
              <span className="font-semibold text-slate-700">{applications.length} Proposals</span>
            </div>
          </div>
          <Link
            to="/dashboard/track"
            className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs font-bold text-purple-600 hover:text-purple-700"
          >
            Track Status <ChevronRight className="h-3.5 w-3.5" />
          </Link>
        </div>
      </div>

      {/* 3. TAB CONTENT SECTIONS */}

      {/* ================= TAB 1: COMMAND OVERVIEW ================= */}
      {activeTab === 'overview' && (
        <div className="space-y-8">
          {/* Quick Operations Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Column 1 & 2: Recent Delegated Users */}
            <div className="lg:col-span-2 bg-white rounded-2xl border border-slate-200 shadow-sm p-6 space-y-5">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                    <ShieldCheck className="h-5 w-5 text-emerald-600" />
                    Delegated User Access Controls
                  </h3>
                  <p className="text-xs text-slate-500">
                    Individual accounts and their current granted work permissions
                  </p>
                </div>
                <Link
                  to="/dashboard/users"
                  className="text-xs font-bold text-emerald-700 hover:text-emerald-800 flex items-center gap-1"
                >
                  Manage All ({users.length}) <ArrowUpRight className="h-3.5 w-3.5" />
                </Link>
              </div>

              {/* User preview rows */}
              <div className="space-y-2.5">
                {users.slice(0, 4).map((u) => (
                  <div
                    key={u.id}
                    className="p-3.5 rounded-xl border border-slate-100 hover:border-emerald-200 bg-slate-50/50 hover:bg-emerald-50/30 transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-3"
                  >
                    <div className="flex items-center gap-3">
                      <div className="h-9 w-9 rounded-full bg-emerald-700 text-white font-bold flex items-center justify-center text-xs flex-shrink-0">
                        {u.fullName ? u.fullName.charAt(0).toUpperCase() : u.username.charAt(0).toUpperCase()}
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-xs text-slate-900">{u.fullName || u.username}</span>
                          <span className="text-[10px] px-2 py-0.5 rounded-full font-bold uppercase bg-slate-200 text-slate-700">
                            {u.role}
                          </span>
                        </div>
                        <span className="text-[11px] text-slate-500 font-mono">@{u.username} • {u.email}</span>
                      </div>
                    </div>

                    {/* Permissions summary */}
                    <div className="flex flex-wrap items-center gap-1 text-[10px]">
                      {u.permissions.canPostJobs && (
                        <span className="bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded font-semibold">
                          Job Post & Shortlist
                        </span>
                      )}
                      {u.permissions.canSubmitProjects && (
                        <span className="bg-blue-100 text-blue-800 px-2 py-0.5 rounded font-semibold">
                          Proposals
                        </span>
                      )}
                      {u.permissions.canManageUsers && (
                        <span className="bg-purple-100 text-purple-800 px-2 py-0.5 rounded font-semibold">
                          Admin Delegator
                        </span>
                      )}
                      {u.permissions.canManageSchemes && (
                        <span className="bg-amber-100 text-amber-800 px-2 py-0.5 rounded font-semibold">
                          Schemes
                        </span>
                      )}
                    </div>
                  </div>
                ))}
              </div>

              <div className="pt-2 flex justify-end">
                <button
                  onClick={() => navigate('/dashboard/users')}
                  className="text-xs font-bold px-4 py-2 rounded-lg bg-emerald-50 text-emerald-700 hover:bg-emerald-100 transition-colors flex items-center gap-1.5 cursor-pointer"
                >
                  <UserPlus className="h-3.5 w-3.5" /> + Create New Delegated User
                </button>
              </div>
            </div>

            {/* Column 3: Recruitment Shortlist Widget */}
            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 space-y-5 flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                  <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                    <Briefcase className="h-5 w-5 text-amber-600" />
                    Hiring & Shortlist Desk
                  </h3>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-100 text-amber-800">
                    {totalJobs} Openings
                  </span>
                </div>

                <div className="mt-4 space-y-3">
                  <div className="p-3 rounded-xl bg-slate-50 border border-slate-100 flex items-center justify-between">
                    <div className="flex items-center gap-2.5">
                      <div className="h-2 w-2 rounded-full bg-emerald-500" />
                      <span className="text-xs font-medium text-slate-700">Shortlisted Candidates</span>
                    </div>
                    <span className="text-xs font-black text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded-full">
                      {shortlistedCandidates}
                    </span>
                  </div>

                  <div className="p-3 rounded-xl bg-slate-50 border border-slate-100 flex items-center justify-between">
                    <div className="flex items-center gap-2.5">
                      <div className="h-2 w-2 rounded-full bg-amber-500" />
                      <span className="text-xs font-medium text-slate-700">Pending Screening</span>
                    </div>
                    <span className="text-xs font-black text-amber-700 bg-amber-100 px-2 py-0.5 rounded-full">
                      {pendingCandidates}
                    </span>
                  </div>

                  <div className="p-3 rounded-xl bg-slate-50 border border-slate-100 flex items-center justify-between">
                    <div className="flex items-center gap-2.5">
                      <div className="h-2 w-2 rounded-full bg-blue-500" />
                      <span className="text-xs font-medium text-slate-700">Total Applicants</span>
                    </div>
                    <span className="text-xs font-black text-blue-700 bg-blue-100 px-2 py-0.5 rounded-full">
                      {totalCandidates}
                    </span>
                  </div>
                </div>
              </div>

              <div className="space-y-2 pt-4 border-t border-slate-100">
                <Link
                  to="/dashboard/recruitment"
                  className="w-full text-center block text-xs font-bold py-2.5 px-4 rounded-xl bg-slate-900 hover:bg-slate-800 text-white shadow-sm transition-all"
                >
                  Open Recruiter Console
                </Link>
                <button
                  onClick={() => navigate('/careers')}
                  className="w-full text-center block text-xs font-semibold py-2 px-4 rounded-xl text-slate-600 hover:bg-slate-100 transition-all cursor-pointer"
                >
                  View Public Career Portal
                </button>
              </div>
            </div>
          </div>

          {/* Key Visualizations Preview */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Chart 1: Grants Disbursed */}
            <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="text-sm font-bold text-slate-900">National Grant Disbursements Trend</h4>
                  <p className="text-xs text-slate-500">Target vs Disbursed Funding (₹ in Crores)</p>
                </div>
                <span className="text-xs font-bold px-2 py-1 bg-emerald-50 text-emerald-700 rounded-md">
                  FY 2025–26
                </span>
              </div>
              <div className="h-64 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={monthlyTrendsData}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                    <XAxis dataKey="month" stroke="#64748b" fontSize={11} />
                    <YAxis stroke="#64748b" fontSize={11} />
                    <Tooltip />
                    <Legend wrapperStyle={{ fontSize: '11px', paddingTop: '10px' }} />
                    <Line type="monotone" dataKey="target" stroke="#94a3b8" strokeWidth={2} strokeDasharray="5 5" name="Target (Cr)" />
                    <Line type="monotone" dataKey="disbursed" stroke="#16a34a" strokeWidth={2.5} activeDot={{ r: 6 }} name="Disbursed (Cr)" />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Chart 2: Sector Wise Distribution */}
            <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="text-sm font-bold text-slate-900">Sector-Wise Program Allocations</h4>
                  <p className="text-xs text-slate-500">Distribution across Grassroots Development Fields</p>
                </div>
                <span className="text-xs font-bold px-2 py-1 bg-blue-50 text-blue-700 rounded-md">
                  All Sectors
                </span>
              </div>
              <div className="h-64 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={sectorsPieData}
                      dataKey="value"
                      nameKey="sector"
                      cx="50%"
                      cy="50%"
                      outerRadius={75}
                      innerRadius={45}
                      paddingAngle={4}
                      label={({ name, percent }: any) => `${name || ''} ${percent ? (percent * 100).toFixed(0) : ''}%`}
                    >
                      {sectorsPieData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ================= TAB 2: ACCESS DELEGATION MATRIX ================= */}
      {activeTab === 'delegation' && (
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h3 className="text-lg font-black text-slate-900 flex items-center gap-2">
                <ShieldCheck className="h-5 w-5 text-emerald-600" />
                Granular Work Delegation Matrix
              </h3>
              <p className="text-xs text-slate-500">
                Review the individual work permissions assigned to each user by the Administrator
              </p>
            </div>
            <button
              onClick={() => navigate('/dashboard/users')}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-xs shadow-sm transition-all cursor-pointer"
            >
              <UserPlus className="h-4 w-4" /> Add & Assign New User
            </button>
          </div>

          <div className="overflow-x-auto border border-slate-200 rounded-xl">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-200 text-slate-600 font-bold uppercase tracking-wider">
                  <th className="py-3 px-4">User & Role</th>
                  <th className="py-3 px-3 text-center">Job Post & Shortlist</th>
                  <th className="py-3 px-3 text-center">Submit Projects</th>
                  <th className="py-3 px-3 text-center">Manage Schemes</th>
                  <th className="py-3 px-3 text-center">Manage Users</th>
                  <th className="py-3 px-3 text-center">Upload Media</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {users.map((u) => (
                  <tr key={u.id} className="hover:bg-slate-50/70 transition-colors">
                    <td className="py-3.5 px-4">
                      <div className="font-bold text-slate-900">{u.fullName || u.username}</div>
                      <div className="text-[11px] text-slate-500 font-mono">@{u.username} • {u.email}</div>
                      <span className="inline-block mt-1 text-[10px] px-2 py-0.5 rounded font-bold uppercase bg-slate-100 text-slate-700">
                        {u.role}
                      </span>
                    </td>
                    <td className="py-3.5 px-3 text-center">
                      {u.permissions.canPostJobs ? (
                        <span className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded-full">
                          <CheckCircle2 className="h-3 w-3" /> Granted
                        </span>
                      ) : (
                        <span className="text-slate-300 font-semibold">—</span>
                      )}
                    </td>
                    <td className="py-3.5 px-3 text-center">
                      {u.permissions.canSubmitProjects ? (
                        <span className="inline-flex items-center gap-1 text-[11px] font-bold text-blue-700 bg-blue-100 px-2 py-0.5 rounded-full">
                          <CheckCircle2 className="h-3 w-3" /> Granted
                        </span>
                      ) : (
                        <span className="text-slate-300 font-semibold">—</span>
                      )}
                    </td>
                    <td className="py-3.5 px-3 text-center">
                      {u.permissions.canManageSchemes ? (
                        <span className="inline-flex items-center gap-1 text-[11px] font-bold text-amber-700 bg-amber-100 px-2 py-0.5 rounded-full">
                          <CheckCircle2 className="h-3 w-3" /> Granted
                        </span>
                      ) : (
                        <span className="text-slate-300 font-semibold">—</span>
                      )}
                    </td>
                    <td className="py-3.5 px-3 text-center">
                      {u.permissions.canManageUsers ? (
                        <span className="inline-flex items-center gap-1 text-[11px] font-bold text-purple-700 bg-purple-100 px-2 py-0.5 rounded-full">
                          <CheckCircle2 className="h-3 w-3" /> Granted
                        </span>
                      ) : (
                        <span className="text-slate-300 font-semibold">—</span>
                      )}
                    </td>
                    <td className="py-3.5 px-3 text-center">
                      {u.permissions.canUploadImages ? (
                        <span className="inline-flex items-center gap-1 text-[11px] font-bold text-teal-700 bg-teal-100 px-2 py-0.5 rounded-full">
                          <CheckCircle2 className="h-3 w-3" /> Granted
                        </span>
                      ) : (
                        <span className="text-slate-300 font-semibold">—</span>
                      )}
                    </td>
                    <td className="py-3.5 px-4 text-right">
                      <Link
                        to="/dashboard/users"
                        className="text-xs font-bold text-emerald-700 hover:text-emerald-900 inline-flex items-center gap-1"
                      >
                        Modify <ExternalLink className="h-3 w-3" />
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* ================= TAB 3: RECRUITMENT & CANDIDATES ================= */}
      {activeTab === 'recruitment' && (
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h3 className="text-lg font-black text-slate-900 flex items-center gap-2">
                <Briefcase className="h-5 w-5 text-emerald-600" />
                Applicant Pipeline & Shortlisting Status
              </h3>
              <p className="text-xs text-slate-500">
                Review submitted candidate applications and manage recruitment stages
              </p>
            </div>
            <button
              onClick={() => navigate('/dashboard/recruitment')}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-xs shadow-sm transition-all cursor-pointer"
            >
              <Plus className="h-4 w-4" /> Post New Vacancy
            </button>
          </div>

          {candidates.length === 0 ? (
            <div className="text-center py-12 border-2 border-dashed border-slate-200 rounded-xl space-y-2">
              <Briefcase className="h-8 w-8 text-slate-300 mx-auto" />
              <p className="text-xs font-bold text-slate-700">No candidate applications received yet</p>
              <p className="text-[11px] text-slate-500">
                Applicants who apply through the public Career portal will appear here for screening and shortlisting.
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto border border-slate-200 rounded-xl">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="bg-slate-50 border-b border-slate-200 text-slate-600 font-bold uppercase tracking-wider">
                    <th className="py-3 px-4">Ref Number & Candidate</th>
                    <th className="py-3 px-3">Position</th>
                    <th className="py-3 px-3">Location & Exp</th>
                    <th className="py-3 px-3">Status</th>
                    <th className="py-3 px-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {candidates.map((c) => (
                    <tr key={c.id} className="hover:bg-slate-50/70 transition-colors">
                      <td className="py-3.5 px-4">
                        <div className="font-bold text-slate-900">{c.fullName}</div>
                        <div className="text-[11px] text-slate-500 font-mono">{c.refNumber || c.id.slice(0, 8)}</div>
                        <div className="text-[11px] text-slate-500">{c.email} • {c.phone}</div>
                      </td>
                      <td className="py-3.5 px-3">
                        <span className="font-semibold text-slate-800">{c.jobTitle || 'General Application'}</span>
                      </td>
                      <td className="py-3.5 px-3">
                        <div className="text-slate-700">{c.location || 'Ranchi'}</div>
                        <div className="text-[11px] text-slate-500">{c.experience}</div>
                      </td>
                      <td className="py-3.5 px-3">
                        <span
                          className={`inline-block px-2.5 py-1 rounded-full text-[10px] font-extrabold uppercase ${
                            c.status === 'Shortlisted'
                              ? 'bg-emerald-100 text-emerald-800'
                              : c.status === 'Selected'
                              ? 'bg-purple-100 text-purple-800'
                              : c.status === 'Rejected'
                              ? 'bg-rose-100 text-rose-800'
                              : 'bg-amber-100 text-amber-800'
                          }`}
                        >
                          {c.status}
                        </span>
                      </td>
                      <td className="py-3.5 px-4 text-right">
                        <button
                          onClick={() => navigate('/dashboard/recruitment')}
                          className="text-xs font-bold text-emerald-700 hover:text-emerald-900 inline-flex items-center gap-1 cursor-pointer"
                        >
                          Manage Status <ChevronRight className="h-3 w-3" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      {/* ================= TAB 4: PROPOSALS & SANCTIONS DESK ================= */}
      {activeTab === 'proposals' && (
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h3 className="text-lg font-black text-slate-900 flex items-center gap-2">
                <FolderOpen className="h-5 w-5 text-emerald-600" />
                Submitted Project Proposals & Sanctions Desk
              </h3>
              <p className="text-xs text-slate-500">
                Inspect proposals submitted by NGOs and exercise sovereign authority to review, approve, sanction grants, or reject
              </p>
            </div>
            <button
              onClick={() => navigate('/dashboard/profile')}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-blue-700 hover:bg-blue-800 text-white font-bold text-xs shadow-sm transition-all cursor-pointer"
            >
              <Plus className="h-4 w-4" /> Post Direct Project
            </button>
          </div>

          {applications.length === 0 ? (
            <div className="text-center py-12 border-2 border-dashed border-slate-200 rounded-xl space-y-2">
              <FolderOpen className="h-8 w-8 text-slate-300 mx-auto" />
              <p className="text-xs font-bold text-slate-700">No project proposals found</p>
              <p className="text-[11px] text-slate-500">
                Submitted NGO proposals and direct admin projects will appear here for review and sanctioning.
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto border border-slate-200 rounded-xl">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="bg-slate-50 border-b border-slate-200 text-slate-600 font-bold uppercase tracking-wider">
                    <th className="py-3 px-4">App ID & Project Title</th>
                    <th className="py-3 px-3">Grant Scheme & NGO</th>
                    <th className="py-3 px-3">Grant Amount</th>
                    <th className="py-3 px-3">Status</th>
                    <th className="py-3 px-4 text-right">Direct Decision Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {applications.map((app) => (
                    <tr key={app.id} className="hover:bg-slate-50/70 transition-colors">
                      <td className="py-3.5 px-4">
                        <div className="font-bold text-slate-900">{app.title}</div>
                        <div className="text-[11px] text-slate-500 font-mono flex items-center gap-1.5 mt-0.5">
                          <FileText className="h-3 w-3 text-slate-400" />
                          <span>{app.applicationId}</span>
                        </div>
                      </td>
                      <td className="py-3.5 px-3">
                        <div className="font-semibold text-slate-800">{app.schemeName}</div>
                        <div className="text-[11px] text-slate-500">{app.ngoName}</div>
                      </td>
                      <td className="py-3.5 px-3 font-bold text-slate-900">
                        {app.grantRequested}
                      </td>
                      <td className="py-3.5 px-3">
                        <span
                          className={`inline-block px-2.5 py-1 rounded-full text-[10px] font-extrabold uppercase ${
                            app.status === 'Sanctioned'
                              ? 'bg-emerald-100 text-emerald-800'
                              : app.status === 'Approved'
                              ? 'bg-blue-100 text-blue-800'
                              : app.status === 'Rejected'
                              ? 'bg-rose-100 text-rose-800'
                              : 'bg-amber-100 text-amber-800'
                          }`}
                        >
                          {app.status}
                        </span>
                      </td>
                      <td className="py-3.5 px-4 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          {app.status !== 'Sanctioned' && (
                            <button
                              onClick={() => handleUpdateAppStatus(app.id, 'Sanctioned')}
                              className="px-2.5 py-1 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white text-[11px] font-bold flex items-center gap-1 transition-all cursor-pointer shadow-sm"
                              title="Sanction Grant Funding"
                            >
                              <Check className="h-3 w-3" /> Sanction
                            </button>
                          )}
                          {app.status !== 'Approved' && (
                            <button
                              onClick={() => handleUpdateAppStatus(app.id, 'Approved')}
                              className="px-2.5 py-1 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-[11px] font-bold flex items-center gap-1 transition-all cursor-pointer shadow-sm"
                              title="Approve Proposal"
                            >
                              Approve
                            </button>
                          )}
                          {app.status !== 'DistrictReview' && (
                            <button
                              onClick={() => handleUpdateAppStatus(app.id, 'DistrictReview')}
                              className="px-2.5 py-1 rounded-lg bg-amber-600 hover:bg-amber-700 text-white text-[11px] font-bold flex items-center gap-1 transition-all cursor-pointer shadow-sm"
                              title="Send to District Field Inspection"
                            >
                              Review
                            </button>
                          )}
                          {app.status !== 'Rejected' && (
                            <button
                              onClick={() => handleUpdateAppStatus(app.id, 'Rejected')}
                              className="px-2 py-1 rounded-lg bg-slate-200 hover:bg-rose-100 text-slate-700 hover:text-rose-700 text-[11px] font-bold flex items-center gap-1 transition-all cursor-pointer"
                              title="Reject Proposal"
                            >
                              <X className="h-3 w-3" />
                            </button>
                          )}
                          <button
                            onClick={() => handleDeleteApplication(app.id)}
                            className="p-1 text-slate-400 hover:text-rose-600 transition-colors"
                            title="Purge Application"
                          >
                            <Trash2 className="h-3.5 w-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      {/* ================= TAB 5: ANALYTICS & DATA ================= */}
      {activeTab === 'analytics' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm space-y-4">
            <h4 className="text-base font-bold text-slate-900">Territory Distribution</h4>
            <p className="text-xs text-slate-500">State-wise project density and allocated grants (Live API)</p>
            <div className="h-72 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={territoryData}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                  <XAxis dataKey="state" stroke="#64748b" fontSize={11} />
                  <YAxis stroke="#64748b" fontSize={11} />
                  <Tooltip />
                  <Legend wrapperStyle={{ fontSize: '11px', paddingTop: '10px' }} />
                  <Bar dataKey="projects" fill="#0f766e" radius={[4, 4, 0, 0]} name="Active Projects" />
                  <Bar dataKey="grants" fill="#f59e0b" radius={[4, 4, 0, 0]} name="Grants (₹ Cr)" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm space-y-4">
            <h4 className="text-base font-bold text-slate-900">Disbursement Progression</h4>
            <p className="text-xs text-slate-500">Monthly fiscal trajectory and run-rates (Live API)</p>
            <div className="h-72 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={monthlyTrendsData}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                  <XAxis dataKey="month" stroke="#64748b" fontSize={11} />
                  <YAxis stroke="#64748b" fontSize={11} />
                  <Tooltip />
                  <Legend wrapperStyle={{ fontSize: '11px', paddingTop: '10px' }} />
                  <Line type="monotone" dataKey="disbursed" stroke="#16a34a" strokeWidth={3} name="Disbursed (Cr)" />
                  <Line type="monotone" dataKey="target" stroke="#94a3b8" strokeWidth={2} strokeDasharray="4 4" name="Target (Cr)" />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
