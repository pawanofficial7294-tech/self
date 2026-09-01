import React, { useState } from 'react';
import { Outlet, Link, useNavigate, useLocation } from 'react-router-dom';
import {
  LayoutDashboard,
  FilePlus,
  Search,
  User,
  LogOut,
  Menu,
  X,
  Accessibility,
  HelpCircle,
  Bell,
  FolderOpen,
  Users,
  Briefcase
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useAccessibility } from '../context/AccessibilityContext';
import selfLogo from '../assets/self.png';

interface MenuItem {
  label: string;
  path: string;
  icon: React.ComponentType<{ className?: string }>;
  visible: boolean;
  badge?: string;
  badgeColor?: string;
}

interface MenuGroup {
  groupTitle: string;
  items: MenuItem[];
}

export const DashboardLayout: React.FC = () => {
  const { user, logout } = useAuth();
  const { decreaseFontSize, resetFontSize, increaseFontSize, highContrast, toggleHighContrast } = useAccessibility();
  const navigate = useNavigate();
  const location = useLocation();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const canManageUsers = user?.role === 'ADMIN' || Boolean(user?.permissions?.canManageUsers);
  const canManageRecruitment = user?.role === 'ADMIN' || user?.role === 'OFFICER' || Boolean(user?.permissions?.canPostJobs);

  const menuGroups: MenuGroup[] = [
    {
      groupTitle: 'WORKSPACE',
      items: [
        {
          label: 'Overview & Analytics',
          path: '/dashboard',
          icon: LayoutDashboard,
          visible: true,
          badge: user?.role === 'ADMIN' ? 'Admin Hub' : 'Home',
          badgeColor: 'bg-emerald-500/20 text-emerald-300 border-emerald-400/30'
        },
        {
          label: 'Submit Proposal',
          path: '/dashboard/submit-proposal',
          icon: FilePlus,
          visible: user?.role === 'NGO',
          badge: 'Apply',
          badgeColor: 'bg-blue-500/20 text-blue-300 border-blue-400/30'
        },
        {
          label: 'Active Proposals',
          path: '/dashboard/applications',
          icon: FolderOpen,
          visible: true
        },
        {
          label: 'Track Application',
          path: '/dashboard/track',
          icon: Search,
          visible: true
        }
      ]
    },
    {
      groupTitle: 'OPERATIONS & DELEGATION',
      items: [
        {
          label: 'Job & Shortlisting',
          path: '/dashboard/recruitment',
          icon: Briefcase,
          visible: canManageRecruitment,
          badge: 'Recruiter',
          badgeColor: 'bg-amber-400 text-slate-950 font-black'
        },
        {
          label: 'User Management',
          path: '/dashboard/users',
          icon: Users,
          visible: canManageUsers,
          badge: 'Admin',
          badgeColor: 'bg-purple-500/20 text-purple-300 border-purple-400/30'
        }
      ]
    },
    {
      groupTitle: 'ACCOUNT & SECURITY',
      items: [
        {
          label: 'Profile Details',
          path: '/dashboard/profile',
          icon: User,
          visible: true
        }
      ]
    }
  ];

  const renderNavLinks = (onItemClick?: () => void) => (
    <div className="space-y-6">
      {menuGroups.map((group, gIdx) => {
        const visibleItems = group.items.filter((item) => item.visible);
        if (visibleItems.length === 0) return null;

        return (
          <div key={gIdx} className="space-y-1.5">
            <span className="px-3 text-[10px] font-extrabold uppercase tracking-wider text-slate-400 block select-none">
              {group.groupTitle}
            </span>
            <div className="space-y-1">
              {visibleItems.map((item, iIdx) => {
                const Icon = item.icon;
                const isActive = location.pathname === item.path;

                return (
                  <Link
                    key={iIdx}
                    to={item.path}
                    onClick={onItemClick}
                    className={`flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-bold transition-all group ${
                      isActive
                        ? 'bg-gradient-to-r from-emerald-800 to-emerald-700 text-white shadow-md border-l-4 border-l-amber-400'
                        : 'text-slate-200 hover:text-white hover:bg-slate-800/90'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <Icon
                        className={`h-4.5 w-4.5 flex-shrink-0 transition-transform group-hover:scale-110 ${
                          isActive ? 'text-amber-300' : 'text-emerald-400'
                        }`}
                      />
                      <span>{item.label}</span>
                    </div>

                    {item.badge && (
                      <span
                        className={`text-[10px] px-2 py-0.5 rounded-full font-extrabold border ${
                          item.badgeColor || 'bg-slate-800 text-slate-300 border-slate-700'
                        }`}
                      >
                        {item.badge}
                      </span>
                    )}
                  </Link>
                );
              })}
            </div>
          </div>
        );
      })}
    </div>
  );

  return (
    <div className="min-h-screen flex bg-slate-100 text-slate-800">
      {/* 1. DESKTOP SIDEBAR */}
      <aside className="hidden md:flex flex-col w-64 bg-slate-900 text-white border-r border-slate-800 flex-shrink-0 shadow-xl z-20">
        {/* Branding Header */}
        <div className="p-4 border-b border-slate-800 bg-slate-950 flex items-center gap-3">
          <div className="h-10 w-10 rounded-xl bg-white p-1 border border-emerald-600 flex items-center justify-center overflow-hidden flex-shrink-0 shadow-md">
            <img src={selfLogo} alt="SELF Foundation Logo" className="h-full w-full object-contain" />
          </div>
          <div className="flex flex-col min-w-0">
            <span className="font-black text-xs uppercase tracking-wider text-white truncate">
              SELF Workspace
            </span>
            <span className="text-[10px] text-amber-400 font-bold truncate">
              Grants & Project Portal
            </span>
          </div>
        </div>

        {/* Navigation List */}
        <nav className="flex-1 px-3 py-5 overflow-y-auto">
          {renderNavLinks()}
        </nav>

        {/* Sidebar Footer User Card */}
        <div className="p-3.5 border-t border-slate-800 bg-slate-950/80 space-y-3">
          <div className="flex items-center gap-3 p-2.5 rounded-xl bg-slate-900/80 border border-slate-800">
            <div className="h-9 w-9 rounded-full bg-gradient-to-br from-emerald-600 to-emerald-800 text-white font-black flex items-center justify-center text-xs flex-shrink-0 shadow-inner">
              {user?.name ? user.name.charAt(0).toUpperCase() : 'U'}
            </div>
            <div className="flex flex-col min-w-0 flex-1">
              <span className="text-xs font-bold text-white truncate" title={user?.name || user?.username}>
                {user?.name || user?.username}
              </span>
              <div className="flex items-center gap-1.5 mt-0.5">
                <span className="text-[10px] px-2 py-0.2 rounded-full font-black uppercase tracking-wider bg-amber-400/20 text-amber-300 border border-amber-400/30">
                  {user?.role}
                </span>
              </div>
            </div>
          </div>

          <button
            onClick={handleLogout}
            className="w-full flex items-center justify-center gap-2 py-2 px-3 bg-slate-900 hover:bg-rose-600 border border-slate-800 hover:border-rose-500 text-slate-300 hover:text-white font-bold rounded-xl transition-all text-xs cursor-pointer shadow-sm"
          >
            <LogOut className="h-4 w-4" />
            <span>Logout Session</span>
          </button>
        </div>
      </aside>

      {/* 2. MAIN WORKING WRAPPER */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Header Toolbar */}
        <header className="bg-white border-b border-slate-200 h-16 flex items-center justify-between px-4 md:px-8 flex-shrink-0 shadow-sm z-10">
          <div className="flex items-center gap-3">
            {/* Mobile Sidebar menu toggle */}
            <button
              onClick={() => setSidebarOpen(true)}
              aria-label="Open Sidebar menu drawer"
              className="md:hidden p-2 text-slate-700 hover:bg-slate-100 rounded-xl transition-colors cursor-pointer"
            >
              <Menu className="h-6 w-6" />
            </button>
            <div>
              <h2 className="font-black text-sm md:text-base text-slate-900 select-none">
                Socio Economic Lacuna Foundation
              </h2>
              <span className="text-[11px] text-slate-500 hidden sm:block">
                National Grants, Project Approval & Recruitment Workspace
              </span>
            </div>
          </div>

          {/* Right Toolbar Items */}
          <div className="flex items-center gap-2 select-none">
            {/* Accessibility Controls */}
            <div className="hidden sm:flex items-center bg-slate-100 p-1 rounded-xl border border-slate-200 text-xs">
              <button
                onClick={decreaseFontSize}
                className="px-2 py-1 font-bold text-slate-700 hover:bg-white rounded-lg transition-colors"
                title="Decrease Font Size"
              >
                A-
              </button>
              <button
                onClick={resetFontSize}
                className="px-2 py-1 font-bold text-slate-700 hover:bg-white rounded-lg transition-colors"
                title="Reset Font Size"
              >
                A
              </button>
              <button
                onClick={increaseFontSize}
                className="px-2 py-1 font-bold text-slate-700 hover:bg-white rounded-lg transition-colors"
                title="Increase Font Size"
              >
                A+
              </button>
              <button
                onClick={toggleHighContrast}
                className={`p-1.5 rounded-lg transition-colors ${
                  highContrast ? 'bg-slate-900 text-white font-bold' : 'text-slate-700 hover:bg-white'
                }`}
                title="Toggle High Contrast"
              >
                <Accessibility className="h-4 w-4" />
              </button>
            </div>

            {/* Notifications */}
            <button
              className="p-2.5 rounded-xl hover:bg-slate-100 border border-slate-200 text-slate-600 relative transition-colors cursor-pointer"
              title="Notifications"
            >
              <Bell className="h-4.5 w-4.5" />
              <span className="absolute top-1.5 right-1.5 h-2 w-2 bg-emerald-500 rounded-full animate-pulse" />
            </button>

            {/* Helpdesk shortcut */}
            <Link
              to="/faq"
              className="p-2.5 rounded-xl hover:bg-slate-100 border border-slate-200 text-slate-600 hidden sm:inline-flex transition-colors"
              title="Portal FAQs"
            >
              <HelpCircle className="h-4.5 w-4.5" />
            </Link>
          </div>
        </header>

        {/* Dashboard Main View Area */}
        <main className="flex-1 overflow-y-auto p-4 md:p-8 focus:outline-none bg-slate-100/70">
          <Outlet />
        </main>
      </div>

      {/* 3. MOBILE SIDEBAR DRAWER OVERLAY */}
      {sidebarOpen && (
        <div className="fixed inset-0 z-50 flex md:hidden animate-fadeIn">
          {/* Backdrop */}
          <div
            className="fixed inset-0 bg-black/60 backdrop-blur-sm transition-opacity"
            onClick={() => setSidebarOpen(false)}
          />

          {/* Drawer Panel */}
          <div className="relative flex flex-col w-72 max-w-xs bg-slate-900 text-white z-10 flex-1 shadow-2xl border-r border-slate-800">
            <div className="p-4 border-b border-slate-800 bg-slate-950 flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="h-9 w-9 rounded-xl bg-white p-1 border border-emerald-600 flex items-center justify-center overflow-hidden flex-shrink-0 shadow-md">
                  <img src={selfLogo} alt="SELF Logo" className="h-full w-full object-contain" />
                </div>
                <span className="font-black text-xs uppercase tracking-wider text-white">SELF Workspace</span>
              </div>
              <button
                onClick={() => setSidebarOpen(false)}
                className="text-slate-400 hover:text-white p-1.5 rounded-lg hover:bg-slate-800 transition-colors"
                aria-label="Close menu drawer"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <nav className="flex-1 px-3 py-5 overflow-y-auto">
              {renderNavLinks(() => setSidebarOpen(false))}
            </nav>

            <div className="p-4 border-t border-slate-800 bg-slate-950/80 space-y-3">
              <div className="flex items-center gap-2.5 p-2 rounded-xl bg-slate-900 border border-slate-800">
                <div className="h-8 w-8 rounded-full bg-emerald-700 text-white font-black flex items-center justify-center text-xs">
                  {user?.name ? user.name.charAt(0).toUpperCase() : 'U'}
                </div>
                <div className="flex flex-col min-w-0">
                  <span className="font-bold text-xs text-white truncate">{user?.name}</span>
                  <span className="text-[10px] text-amber-400 font-mono uppercase">{user?.role}</span>
                </div>
              </div>

              <button
                onClick={handleLogout}
                className="w-full flex items-center justify-center gap-2 py-2 px-3 bg-slate-900 hover:bg-rose-600 border border-slate-800 text-slate-300 hover:text-white font-bold rounded-xl transition-all text-xs cursor-pointer"
              >
                <LogOut className="h-4 w-4" />
                <span>Logout Session</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
