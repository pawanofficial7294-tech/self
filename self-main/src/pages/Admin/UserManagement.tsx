import React, { useState, useEffect } from 'react';
import {
  Users,
  UserPlus,
  Shield,
  Briefcase,
  FolderOpen,
  Image,
  FileText,
  CheckCircle2,
  XCircle,
  Trash2,
  Edit2,
  RefreshCw,
  AlertCircle,
  Search
} from 'lucide-react';
import { adminService, type UserSummary, type CreateUserPayload } from '../../services/adminService';

export const UserManagement: React.FC = () => {
  const [users, setUsers] = useState<UserSummary[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedRoleFilter, setSelectedRoleFilter] = useState<string>('All');
  const [actionError, setActionError] = useState<string | null>(null);
  const [actionSuccess, setActionSuccess] = useState<string | null>(null);

  // Modals
  const [showCreateModal, setShowCreateModal] = useState<boolean>(false);
  const [editingUser, setEditingUser] = useState<UserSummary | null>(null);
  const [submitting, setSubmitting] = useState<boolean>(false);

  // Form state for creating a new user
  const initialFormState: CreateUserPayload = {
    fullName: '',
    username: '',
    email: '',
    password: '',
    role: 2, // Default Officer
    darpanId: '',
    officerId: '',
    canUploadImages: true,
    canPostJobs: false,
    canSubmitProjects: true,
    canManageSchemes: false,
    canManageUsers: false,
  };
  const [formData, setFormData] = useState<CreateUserPayload>(initialFormState);

  // Form state for editing permissions
  const [editPermissions, setEditPermissions] = useState({
    canUploadImages: false,
    canPostJobs: false,
    canSubmitProjects: false,
    canManageSchemes: false,
    canManageUsers: false,
    isActive: true,
  });

  const fetchUsers = async () => {
    setLoading(true);
    setActionError(null);
    try {
      const data = await adminService.getAllUsers();
      setUsers(data);
    } catch (err: any) {
      setActionError(err.message || 'Failed to load user list.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleCreateSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setActionError(null);
    setActionSuccess(null);

    if (!formData.fullName || !formData.username || !formData.email || !formData.password) {
      setActionError('Please complete all required fields.');
      return;
    }

    setSubmitting(true);
    try {
      await adminService.createUser(formData);
      setActionSuccess(`User "${formData.username}" created successfully with assigned permissions.`);
      setShowCreateModal(false);
      setFormData(initialFormState);
      fetchUsers();
    } catch (err: any) {
      setActionError(err.message || 'Failed to create user.');
    } finally {
      setSubmitting(false);
    }
  };

  const openEditModal = (user: UserSummary) => {
    setEditingUser(user);
    setEditPermissions({
      canUploadImages: user.permissions?.canUploadImages ?? false,
      canPostJobs: user.permissions?.canPostJobs ?? false,
      canSubmitProjects: user.permissions?.canSubmitProjects ?? false,
      canManageSchemes: user.permissions?.canManageSchemes ?? false,
      canManageUsers: user.permissions?.canManageUsers ?? false,
      isActive: user.isActive,
    });
  };

  const handleUpdatePermissionsSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingUser) return;

    setSubmitting(true);
    setActionError(null);
    setActionSuccess(null);
    try {
      await adminService.updateUserPermissions(editingUser.id, editPermissions);
      setActionSuccess(`Permissions updated for user "${editingUser.username}".`);
      setEditingUser(null);
      fetchUsers();
    } catch (err: any) {
      setActionError(err.message || 'Failed to update permissions.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDeleteUser = async (user: UserSummary) => {
    if (user.username === 'admin') {
      setActionError('Cannot delete the root administrator account.');
      return;
    }

    if (!window.confirm(`Are you sure you want to delete user "${user.username}" (${user.fullName})?`)) {
      return;
    }

    setActionError(null);
    setActionSuccess(null);
    try {
      await adminService.deleteUser(user.id);
      setActionSuccess(`User "${user.username}" was deleted.`);
      fetchUsers();
    } catch (err: any) {
      setActionError(err.message || 'Failed to delete user.');
    }
  };

  const filteredUsers = users.filter((u) => {
    const matchesSearch =
      u.fullName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      u.username.toLowerCase().includes(searchQuery.toLowerCase()) ||
      u.email.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesRole =
      selectedRoleFilter === 'All' || u.role.toUpperCase() === selectedRoleFilter.toUpperCase();
    return matchesSearch && matchesRole;
  });

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="bg-white border border-gov-border rounded-xl p-6 shadow-sm flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2.5">
            <div className="p-2.5 bg-gov-navy/5 text-gov-navy rounded-lg border border-gov-navy/10">
              <Users className="h-6 w-6" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-gov-charcoal">User & Permission Management</h1>
              <p className="text-xs text-gov-muted mt-0.5">
                Create user accounts, delegate operational access, and grant permissions for job posting, proposal submissions, and scheme administration.
              </p>
            </div>
          </div>
        </div>

        <button
          onClick={() => {
            setFormData(initialFormState);
            setShowCreateModal(true);
          }}
          className="flex items-center gap-2 px-4 py-2.5 bg-gov-navy hover:bg-gov-navy-hover text-white text-sm font-semibold rounded-lg shadow-sm transition-all flex-shrink-0 cursor-pointer"
        >
          <UserPlus className="h-4 w-4" />
          Create New User
        </button>
      </div>

      {/* Notifications */}
      {actionError && (
        <div className="p-4 bg-red-50 border border-red-200 text-red-700 rounded-lg text-sm flex items-center justify-between">
          <div className="flex items-center gap-2">
            <AlertCircle className="h-5 w-5 flex-shrink-0 text-red-600" />
            <span>{actionError}</span>
          </div>
          <button onClick={() => setActionError(null)} className="text-xs font-semibold underline">
            Dismiss
          </button>
        </div>
      )}

      {actionSuccess && (
        <div className="p-4 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-lg text-sm flex items-center justify-between">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="h-5 w-5 flex-shrink-0 text-emerald-600" />
            <span>{actionSuccess}</span>
          </div>
          <button onClick={() => setActionSuccess(null)} className="text-xs font-semibold underline">
            Dismiss
          </button>
        </div>
      )}

      {/* Summary Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white border border-gov-border rounded-xl p-4 shadow-sm">
          <span className="text-xs font-semibold text-gov-muted uppercase tracking-wider">Total Accounts</span>
          <p className="text-2xl font-bold text-gov-charcoal mt-1">{users.length}</p>
        </div>
        <div className="bg-white border border-gov-border rounded-xl p-4 shadow-sm">
          <span className="text-xs font-semibold text-gov-muted uppercase tracking-wider">Active Users</span>
          <p className="text-2xl font-bold text-emerald-600 mt-1">
            {users.filter((u) => u.isActive).length}
          </p>
        </div>
        <div className="bg-white border border-gov-border rounded-xl p-4 shadow-sm">
          <span className="text-xs font-semibold text-gov-muted uppercase tracking-wider">With Job Post Access</span>
          <p className="text-2xl font-bold text-gov-navy mt-1">
            {users.filter((u) => u.permissions?.canPostJobs || u.role === 'ADMIN').length}
          </p>
        </div>
        <div className="bg-white border border-gov-border rounded-xl p-4 shadow-sm">
          <span className="text-xs font-semibold text-gov-muted uppercase tracking-wider">Welfare Officers</span>
          <p className="text-2xl font-bold text-gov-saffron mt-1">
            {users.filter((u) => u.role === 'OFFICER').length}
          </p>
        </div>
      </div>

      {/* Filters & Search Toolbar */}
      <div className="bg-white border border-gov-border rounded-xl p-4 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="relative w-full sm:w-80">
          <Search className="h-4 w-4 absolute left-3 top-1/2 -translate-y-1/2 text-gov-muted" />
          <input
            type="text"
            placeholder="Search by name, username, or email..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-3 py-2 text-xs border border-gov-border rounded-lg focus:outline-none focus:ring-2 focus:ring-gov-navy/20 focus:border-gov-navy"
          />
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          <span className="text-xs text-gov-muted font-medium">Role:</span>
          <select
            value={selectedRoleFilter}
            onChange={(e) => setSelectedRoleFilter(e.target.value)}
            className="text-xs border border-gov-border rounded-lg px-3 py-2 bg-white text-gov-charcoal focus:outline-none focus:ring-2 focus:ring-gov-navy/20"
          >
            <option value="All">All Roles</option>
            <option value="ADMIN">ADMIN</option>
            <option value="OFFICER">OFFICER</option>
            <option value="NGO">NGO</option>
          </select>
          <button
            onClick={fetchUsers}
            title="Refresh user list"
            className="p-2 border border-gov-border hover:bg-slate-50 text-gov-muted rounded-lg cursor-pointer"
          >
            <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
          </button>
        </div>
      </div>

      {/* Users Table */}
      <div className="bg-white border border-gov-border rounded-xl shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50 text-[11px] font-bold text-gov-muted uppercase tracking-wider border-b border-gov-border">
                <th className="py-3 px-4">User Details</th>
                <th className="py-3 px-4">Role</th>
                <th className="py-3 px-4">Assigned Work Access</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4">Created Date</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gov-border text-xs">
              {loading ? (
                <tr>
                  <td colSpan={6} className="py-8 text-center text-gov-muted">
                    <div className="flex items-center justify-center gap-2">
                      <RefreshCw className="h-4 w-4 animate-spin text-gov-navy" />
                      <span>Loading users from database...</span>
                    </div>
                  </td>
                </tr>
              ) : filteredUsers.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-8 text-center text-gov-muted">
                    No users found matching your search.
                  </td>
                </tr>
              ) : (
                filteredUsers.map((u) => {
                  const isAdmin = u.role === 'ADMIN';
                  return (
                    <tr key={u.id} className="hover:bg-slate-50/70 transition-colors">
                      {/* Name & Login info */}
                      <td className="py-3 px-4">
                        <div className="flex flex-col">
                          <span className="font-semibold text-gov-charcoal">{u.fullName}</span>
                          <span className="text-[11px] text-gov-muted flex items-center gap-1.5 mt-0.5">
                            <span className="font-mono text-slate-500">@{u.username}</span>
                            <span>•</span>
                            <span>{u.email}</span>
                          </span>
                        </div>
                      </td>

                      {/* Role Badge */}
                      <td className="py-3 px-4">
                        <span
                          className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                            u.role === 'ADMIN'
                              ? 'bg-purple-100 text-purple-800 border border-purple-200'
                              : u.role === 'OFFICER'
                              ? 'bg-amber-100 text-amber-800 border border-amber-200'
                              : 'bg-blue-100 text-blue-800 border border-blue-200'
                          }`}
                        >
                          {u.role}
                        </span>
                      </td>

                      {/* Permissions List */}
                      <td className="py-3 px-4">
                        {isAdmin ? (
                          <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-purple-700 bg-purple-50 px-2 py-0.5 rounded border border-purple-200">
                            <Shield className="h-3 w-3" /> Full Administrator Access
                          </span>
                        ) : (
                          <div className="flex flex-wrap gap-1">
                            {u.permissions?.canPostJobs && (
                              <span className="inline-flex items-center gap-1 text-[10px] bg-emerald-50 text-emerald-700 px-1.5 py-0.5 rounded border border-emerald-200 font-medium">
                                <Briefcase className="h-3 w-3" /> Post Jobs / Shortlist
                              </span>
                            )}
                            {u.permissions?.canSubmitProjects && (
                              <span className="inline-flex items-center gap-1 text-[10px] bg-blue-50 text-blue-700 px-1.5 py-0.5 rounded border border-blue-200 font-medium">
                                <FolderOpen className="h-3 w-3" /> Projects
                              </span>
                            )}
                            {u.permissions?.canManageSchemes && (
                              <span className="inline-flex items-center gap-1 text-[10px] bg-orange-50 text-orange-700 px-1.5 py-0.5 rounded border border-orange-200 font-medium">
                                <FileText className="h-3 w-3" /> Schemes
                              </span>
                            )}
                            {u.permissions?.canManageUsers && (
                              <span className="inline-flex items-center gap-1 text-[10px] bg-indigo-50 text-indigo-700 px-1.5 py-0.5 rounded border border-indigo-200 font-medium">
                                <Users className="h-3 w-3" /> Users
                              </span>
                            )}
                            {u.permissions?.canUploadImages && (
                              <span className="inline-flex items-center gap-1 text-[10px] bg-slate-100 text-slate-700 px-1.5 py-0.5 rounded border border-slate-200 font-medium">
                                <Image className="h-3 w-3" /> Uploads
                              </span>
                            )}
                            {!u.permissions?.canPostJobs &&
                              !u.permissions?.canSubmitProjects &&
                              !u.permissions?.canManageSchemes &&
                              !u.permissions?.canManageUsers &&
                              !u.permissions?.canUploadImages && (
                                <span className="text-[10px] text-gov-muted italic">No custom permissions</span>
                              )}
                          </div>
                        )}
                      </td>

                      {/* Status */}
                      <td className="py-3 px-4">
                        {u.isActive ? (
                          <span className="inline-flex items-center gap-1 text-[11px] text-emerald-700 font-medium">
                            <CheckCircle2 className="h-3.5 w-3.5" /> Active
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 text-[11px] text-red-600 font-medium">
                            <XCircle className="h-3.5 w-3.5" /> Disabled
                          </span>
                        )}
                      </td>

                      {/* Created Date */}
                      <td className="py-3 px-4 text-gov-muted text-[11px]">
                        {new Date(u.createdAt).toLocaleDateString('en-IN', {
                          day: '2-digit',
                          month: 'short',
                          year: 'numeric',
                        })}
                      </td>

                      {/* Actions */}
                      <td className="py-3 px-4 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <button
                            onClick={() => openEditModal(u)}
                            title="Edit Permissions"
                            className="p-1.5 text-gov-navy hover:bg-gov-navy/10 rounded-md transition-colors cursor-pointer"
                          >
                            <Edit2 className="h-4 w-4" />
                          </button>
                          {u.username !== 'admin' && (
                            <button
                              onClick={() => handleDeleteUser(u)}
                              title="Delete User"
                              className="p-1.5 text-red-600 hover:bg-red-50 rounded-md transition-colors cursor-pointer"
                            >
                              <Trash2 className="h-4 w-4" />
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* ================= MODAL: CREATE USER ================= */}
      {showCreateModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="bg-white rounded-2xl border border-gov-border shadow-2xl w-full max-w-xl max-h-[90vh] flex flex-col overflow-hidden">
            <div className="px-6 py-4 border-b border-gov-border flex items-center justify-between bg-slate-50">
              <div className="flex items-center gap-2">
                <div className="p-2 bg-gov-navy/10 text-gov-navy rounded-lg">
                  <UserPlus className="h-5 w-5" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-gov-charcoal">Create New User Account</h3>
                  <p className="text-xs text-gov-muted">Set up user credentials and configure work access.</p>
                </div>
              </div>
              <button
                onClick={() => setShowCreateModal(false)}
                className="text-gov-muted hover:text-gov-charcoal p-1 rounded-md"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleCreateSubmit} className="flex-1 overflow-y-auto p-6 space-y-4 text-xs">
              {/* Personal Details */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block font-semibold text-gov-charcoal mb-1">
                    Full Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Ramesh Chandra Verma"
                    value={formData.fullName}
                    onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                    className="w-full px-3 py-2 border border-gov-border rounded-lg focus:ring-2 focus:ring-gov-navy/20 focus:border-gov-navy"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-gov-charcoal mb-1">
                    Username <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. ramesh_officer"
                    value={formData.username}
                    onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                    className="w-full px-3 py-2 border border-gov-border rounded-lg focus:ring-2 focus:ring-gov-navy/20 focus:border-gov-navy"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-gov-charcoal mb-1">
                    Email Address <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="email"
                    required
                    placeholder="ramesh@jharkhand.gov.in"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full px-3 py-2 border border-gov-border rounded-lg focus:ring-2 focus:ring-gov-navy/20 focus:border-gov-navy"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-gov-charcoal mb-1">
                    Password <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="password"
                    required
                    placeholder="Minimum 6 characters"
                    value={formData.password}
                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                    className="w-full px-3 py-2 border border-gov-border rounded-lg focus:ring-2 focus:ring-gov-navy/20 focus:border-gov-navy"
                  />
                </div>
              </div>

              {/* Role Selection */}
              <div>
                <label className="block font-semibold text-gov-charcoal mb-1">Primary Role</label>
                <div className="grid grid-cols-3 gap-2">
                  <label
                    className={`flex items-center justify-center gap-2 p-2.5 rounded-lg border text-xs font-semibold cursor-pointer transition-all ${
                      formData.role === 2
                        ? 'bg-amber-50 border-amber-400 text-amber-900 ring-2 ring-amber-400/20'
                        : 'border-gov-border hover:bg-slate-50 text-slate-700'
                    }`}
                  >
                    <input
                      type="radio"
                      name="role"
                      className="hidden"
                      checked={formData.role === 2}
                      onChange={() => setFormData({ ...formData, role: 2 })}
                    />
                    OFFICER
                  </label>

                  <label
                    className={`flex items-center justify-center gap-2 p-2.5 rounded-lg border text-xs font-semibold cursor-pointer transition-all ${
                      formData.role === 1
                        ? 'bg-blue-50 border-blue-400 text-blue-900 ring-2 ring-blue-400/20'
                        : 'border-gov-border hover:bg-slate-50 text-slate-700'
                    }`}
                  >
                    <input
                      type="radio"
                      name="role"
                      className="hidden"
                      checked={formData.role === 1}
                      onChange={() => setFormData({ ...formData, role: 1 })}
                    />
                    NGO
                  </label>

                  <label
                    className={`flex items-center justify-center gap-2 p-2.5 rounded-lg border text-xs font-semibold cursor-pointer transition-all ${
                      formData.role === 3
                        ? 'bg-purple-50 border-purple-400 text-purple-900 ring-2 ring-purple-400/20'
                        : 'border-gov-border hover:bg-slate-50 text-slate-700'
                    }`}
                  >
                    <input
                      type="radio"
                      name="role"
                      className="hidden"
                      checked={formData.role === 3}
                      onChange={() => setFormData({ ...formData, role: 3 })}
                    />
                    ADMIN
                  </label>
                </div>
              </div>

              {/* Work Permission Grant Section */}
              <div className="border border-gov-border rounded-xl p-4 bg-slate-50/70 space-y-3">
                <div className="flex items-center gap-2 pb-2 border-b border-gov-border">
                  <Shield className="h-4 w-4 text-gov-navy" />
                  <span className="font-bold text-gov-charcoal">Delegated Work Access & Permissions</span>
                </div>
                <p className="text-[11px] text-gov-muted">
                  Check the options below to grant this user specific operational access:
                </p>

                <div className="space-y-2.5">
                  {/* Can Post Jobs & Shortlist Candidates */}
                  <label className="flex items-start gap-3 p-2.5 bg-white rounded-lg border border-gov-border hover:border-gov-navy/40 cursor-pointer transition-all">
                    <input
                      type="checkbox"
                      checked={formData.canPostJobs}
                      onChange={(e) => setFormData({ ...formData, canPostJobs: e.target.checked })}
                      className="mt-0.5 h-4 w-4 text-gov-navy rounded border-gray-300 focus:ring-gov-navy"
                    />
                    <div>
                      <span className="font-semibold text-gov-charcoal flex items-center gap-1.5">
                        <Briefcase className="h-3.5 w-3.5 text-emerald-600" />
                        Job Postings & Candidate Shortlisting
                      </span>
                      <p className="text-[11px] text-gov-muted mt-0.5">
                        Enables user to post new vacancies on the portal and view, filter, and shortlist candidate applications.
                      </p>
                    </div>
                  </label>

                  {/* Can Submit Projects */}
                  <label className="flex items-start gap-3 p-2.5 bg-white rounded-lg border border-gov-border hover:border-gov-navy/40 cursor-pointer transition-all">
                    <input
                      type="checkbox"
                      checked={formData.canSubmitProjects}
                      onChange={(e) => setFormData({ ...formData, canSubmitProjects: e.target.checked })}
                      className="mt-0.5 h-4 w-4 text-gov-navy rounded border-gray-300 focus:ring-gov-navy"
                    />
                    <div>
                      <span className="font-semibold text-gov-charcoal flex items-center gap-1.5">
                        <FolderOpen className="h-3.5 w-3.5 text-blue-600" />
                        Submit Projects & Grant Proposals
                      </span>
                      <p className="text-[11px] text-gov-muted mt-0.5">
                        Allows user to create, edit, and submit project proposals and budgets.
                      </p>
                    </div>
                  </label>

                  {/* Can Manage Schemes */}
                  <label className="flex items-start gap-3 p-2.5 bg-white rounded-lg border border-gov-border hover:border-gov-navy/40 cursor-pointer transition-all">
                    <input
                      type="checkbox"
                      checked={formData.canManageSchemes}
                      onChange={(e) => setFormData({ ...formData, canManageSchemes: e.target.checked })}
                      className="mt-0.5 h-4 w-4 text-gov-navy rounded border-gray-300 focus:ring-gov-navy"
                    />
                    <div>
                      <span className="font-semibold text-gov-charcoal flex items-center gap-1.5">
                        <FileText className="h-3.5 w-3.5 text-amber-600" />
                        Manage Welfare Schemes
                      </span>
                      <p className="text-[11px] text-gov-muted mt-0.5">
                        Allows updating government scheme criteria, budget allocations, and deadlines.
                      </p>
                    </div>
                  </label>

                  {/* Can Manage Users */}
                  <label className="flex items-start gap-3 p-2.5 bg-white rounded-lg border border-gov-border hover:border-gov-navy/40 cursor-pointer transition-all">
                    <input
                      type="checkbox"
                      checked={formData.canManageUsers}
                      onChange={(e) => setFormData({ ...formData, canManageUsers: e.target.checked })}
                      className="mt-0.5 h-4 w-4 text-gov-navy rounded border-gray-300 focus:ring-gov-navy"
                    />
                    <div>
                      <span className="font-semibold text-gov-charcoal flex items-center gap-1.5">
                        <Users className="h-3.5 w-3.5 text-indigo-600" />
                        User Administration & Delegation
                      </span>
                      <p className="text-[11px] text-gov-muted mt-0.5">
                        Grants authority to create other user accounts and manage their permissions.
                      </p>
                    </div>
                  </label>

                  {/* Can Upload Images */}
                  <label className="flex items-start gap-3 p-2.5 bg-white rounded-lg border border-gov-border hover:border-gov-navy/40 cursor-pointer transition-all">
                    <input
                      type="checkbox"
                      checked={formData.canUploadImages}
                      onChange={(e) => setFormData({ ...formData, canUploadImages: e.target.checked })}
                      className="mt-0.5 h-4 w-4 text-gov-navy rounded border-gray-300 focus:ring-gov-navy"
                    />
                    <div>
                      <span className="font-semibold text-gov-charcoal flex items-center gap-1.5">
                        <Image className="h-3.5 w-3.5 text-slate-600" />
                        Upload Media & Documents
                      </span>
                      <p className="text-[11px] text-gov-muted mt-0.5">
                        Allows uploading files, project certificates, and compliance attachments.
                      </p>
                    </div>
                  </label>
                </div>
              </div>

              {/* Submit Buttons */}
              <div className="flex items-center justify-end gap-3 pt-4 border-t border-gov-border">
                <button
                  type="button"
                  onClick={() => setShowCreateModal(false)}
                  className="px-4 py-2 border border-gov-border rounded-lg text-gov-muted hover:text-gov-charcoal font-semibold text-xs"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="px-5 py-2 bg-gov-navy hover:bg-gov-navy-hover text-white rounded-lg font-semibold text-xs flex items-center gap-2 cursor-pointer shadow-sm"
                >
                  {submitting && <RefreshCw className="h-3.5 w-3.5 animate-spin" />}
                  Create Account
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ================= MODAL: EDIT PERMISSIONS ================= */}
      {editingUser && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="bg-white rounded-2xl border border-gov-border shadow-2xl w-full max-w-md flex flex-col overflow-hidden">
            <div className="px-6 py-4 border-b border-gov-border flex items-center justify-between bg-slate-50">
              <div className="flex items-center gap-2">
                <div className="p-2 bg-gov-navy/10 text-gov-navy rounded-lg">
                  <Shield className="h-5 w-5" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-gov-charcoal">Edit User Permissions</h3>
                  <p className="text-xs text-gov-muted">User: @{editingUser.username} ({editingUser.fullName})</p>
                </div>
              </div>
              <button
                onClick={() => setEditingUser(null)}
                className="text-gov-muted hover:text-gov-charcoal p-1 rounded-md"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleUpdatePermissionsSubmit} className="p-6 space-y-4 text-xs">
              {/* Account Status Toggle */}
              <div className="flex items-center justify-between p-3 bg-slate-50 border border-gov-border rounded-lg">
                <span className="font-semibold text-gov-charcoal">Account Active Status</span>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={editPermissions.isActive}
                    onChange={(e) => setEditPermissions({ ...editPermissions, isActive: e.target.checked })}
                    className="sr-only peer"
                  />
                  <div className="w-9 h-5 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-emerald-600"></div>
                </label>
              </div>

              {/* Permission Checkboxes */}
              <div className="space-y-2.5">
                <label className="flex items-center justify-between p-2.5 border border-gov-border rounded-lg cursor-pointer hover:bg-slate-50">
                  <span className="font-semibold text-gov-charcoal flex items-center gap-2">
                    <Briefcase className="h-4 w-4 text-emerald-600" />
                    Can Post Jobs & Shortlist Candidates
                  </span>
                  <input
                    type="checkbox"
                    checked={editPermissions.canPostJobs}
                    onChange={(e) => setEditPermissions({ ...editPermissions, canPostJobs: e.target.checked })}
                    className="h-4 w-4 text-gov-navy rounded border-gray-300 focus:ring-gov-navy"
                  />
                </label>

                <label className="flex items-center justify-between p-2.5 border border-gov-border rounded-lg cursor-pointer hover:bg-slate-50">
                  <span className="font-semibold text-gov-charcoal flex items-center gap-2">
                    <FolderOpen className="h-4 w-4 text-blue-600" />
                    Can Submit Projects & Proposals
                  </span>
                  <input
                    type="checkbox"
                    checked={editPermissions.canSubmitProjects}
                    onChange={(e) => setEditPermissions({ ...editPermissions, canSubmitProjects: e.target.checked })}
                    className="h-4 w-4 text-gov-navy rounded border-gray-300 focus:ring-gov-navy"
                  />
                </label>

                <label className="flex items-center justify-between p-2.5 border border-gov-border rounded-lg cursor-pointer hover:bg-slate-50">
                  <span className="font-semibold text-gov-charcoal flex items-center gap-2">
                    <FileText className="h-4 w-4 text-amber-600" />
                    Can Manage Schemes
                  </span>
                  <input
                    type="checkbox"
                    checked={editPermissions.canManageSchemes}
                    onChange={(e) => setEditPermissions({ ...editPermissions, canManageSchemes: e.target.checked })}
                    className="h-4 w-4 text-gov-navy rounded border-gray-300 focus:ring-gov-navy"
                  />
                </label>

                <label className="flex items-center justify-between p-2.5 border border-gov-border rounded-lg cursor-pointer hover:bg-slate-50">
                  <span className="font-semibold text-gov-charcoal flex items-center gap-2">
                    <Users className="h-4 w-4 text-indigo-600" />
                    Can Manage Other Users
                  </span>
                  <input
                    type="checkbox"
                    checked={editPermissions.canManageUsers}
                    onChange={(e) => setEditPermissions({ ...editPermissions, canManageUsers: e.target.checked })}
                    className="h-4 w-4 text-gov-navy rounded border-gray-300 focus:ring-gov-navy"
                  />
                </label>

                <label className="flex items-center justify-between p-2.5 border border-gov-border rounded-lg cursor-pointer hover:bg-slate-50">
                  <span className="font-semibold text-gov-charcoal flex items-center gap-2">
                    <Image className="h-4 w-4 text-slate-600" />
                    Can Upload Documents & Media
                  </span>
                  <input
                    type="checkbox"
                    checked={editPermissions.canUploadImages}
                    onChange={(e) => setEditPermissions({ ...editPermissions, canUploadImages: e.target.checked })}
                    className="h-4 w-4 text-gov-navy rounded border-gray-300 focus:ring-gov-navy"
                  />
                </label>
              </div>

              {/* Submit Buttons */}
              <div className="flex items-center justify-end gap-3 pt-4 border-t border-gov-border">
                <button
                  type="button"
                  onClick={() => setEditingUser(null)}
                  className="px-4 py-2 border border-gov-border rounded-lg text-gov-muted hover:text-gov-charcoal font-semibold text-xs"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="px-5 py-2 bg-gov-navy hover:bg-gov-navy-hover text-white rounded-lg font-semibold text-xs flex items-center gap-2 cursor-pointer shadow-sm"
                >
                  {submitting && <RefreshCw className="h-3.5 w-3.5 animate-spin" />}
                  Save Permissions
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
export default UserManagement;
