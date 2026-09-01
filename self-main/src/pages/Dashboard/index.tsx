import React, { useState } from 'react';
import { Breadcrumb } from '../../components/common/States';
import { useAuth } from '../../context/AuthContext';
import { AdminPanel } from './AdminPanel';
import { UserPanel } from './UserPanel';
import { ArrowLeft, Eye } from 'lucide-react';

export const Dashboard: React.FC = () => {
  const { user } = useAuth();
  const isAdmin = user?.role === 'ADMIN';

  // Admin can preview the User Panel to see how individual users experience their permissions
  const [adminPreviewMode, setAdminPreviewMode] = useState<boolean>(false);

  return (
    <div className="bg-gov-bg-alt min-h-screen pb-12">
      <div className="max-w-7xl mx-auto px-4 md:px-8 pt-4 pb-2">
        <Breadcrumb
          items={[
            { label: 'Workspace' },
            {
              label: isAdmin
                ? adminPreviewMode
                  ? 'Delegated User Workspace (Admin Preview)'
                  : 'Executive Admin Control Center'
                : `${user?.role || 'Member'} Workspace Panel`
            }
          ]}
        />
      </div>

      <div className="max-w-7xl mx-auto px-4 md:px-8 space-y-6">
        {/* Admin Preview Mode Floating Bar */}
        {isAdmin && adminPreviewMode && (
          <div className="bg-amber-500 text-slate-950 px-5 py-3 rounded-2xl flex flex-col sm:flex-row items-center justify-between gap-3 shadow-md border border-amber-600 animate-fadeIn">
            <div className="flex items-center gap-2.5 text-xs font-bold">
              <Eye className="h-4 w-4" />
              <span>
                <strong>Admin Preview Active:</strong> You are currently viewing the adaptive Individual User Panel interface.
              </span>
            </div>
            <button
              onClick={() => setAdminPreviewMode(false)}
              className="text-xs font-black px-4 py-1.5 rounded-xl bg-slate-950 text-white hover:bg-slate-900 flex items-center gap-1.5 transition-all shadow-sm cursor-pointer"
            >
              <ArrowLeft className="h-3.5 w-3.5" /> Return to Admin Control Center
            </button>
          </div>
        )}

        {/* Dynamic Panel Selection */}
        {isAdmin && !adminPreviewMode ? (
          <AdminPanel onSwitchToUserView={() => setAdminPreviewMode(true)} />
        ) : (
          <UserPanel />
        )}
      </div>
    </div>
  );
};
