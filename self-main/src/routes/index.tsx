import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

// Layouts
import { PublicLayout } from '../layouts/PublicLayout';
import { AuthLayout } from '../layouts/AuthLayout';
import { DashboardLayout } from '../layouts/DashboardLayout';

// Public Pages
import { Home } from '../pages/Home';
import { About } from '../pages/About';
import { Schemes } from '../pages/Schemes';
import { Resources } from '../pages/Resources';
import { Tracking } from '../pages/Tracking';
import { FAQ } from '../pages/FAQ';
import { Contact } from '../pages/Contact';
import { Careers } from '../pages/Careers';

// Auth Pages
import { Login } from '../pages/Login';
import { Registration } from '../pages/Registration';

import { Dashboard } from '../pages/Dashboard';
import { Applications } from '../pages/Applications';
import { UserManagement } from '../pages/Admin/UserManagement';
import { ProfilePage } from '../pages/Profile';

// Private Route Guard Component
const PrivateRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gov-bg-alt">
        <div className="animate-spin rounded-full h-10 w-10 border-4 border-gov-navy/20 border-t-gov-navy" />
      </div>
    );
  }

  return isAuthenticated ? <>{children}</> : <Navigate to="/login" replace />;
};

export const AppRoutes: React.FC = () => {
  return (
    <Routes>
      {/* 1. PUBLIC ROUTES (Header, Footer, Main Nav) */}
      <Route element={<PublicLayout />}>
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About />} />
        <Route path="/schemes" element={<Schemes />} />
        <Route path="/resources" element={<Resources />} />
        <Route path="/tracking" element={<Tracking />} />
        <Route path="/faq" element={<FAQ />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/careers" element={<Careers />} />
        <Route path="/career" element={<Careers />} />
        <Route path="/recruitment" element={<Careers />} />
      </Route>

      {/* 2. AUTH / REGISTRATION ROUTES (Centered Card Layouts) */}
      <Route element={<AuthLayout />}>
        <Route path="/login" element={<Login />} />
        <Route path="/register-ngo" element={<Registration />} />
        <Route path="/register-officer" element={<Login />} />
        <Route path="/forgot-password" element={<Login />} />
        <Route path="/reset-password" element={<Login />} />
      </Route>

      {/* 3. PRIVATE / authenticated WORKSPACE ROUTES */}
      <Route
        path="/dashboard"
        element={
          <PrivateRoute>
            <DashboardLayout />
          </PrivateRoute>
        }
      >
        <Route index element={<Dashboard />} />
        <Route path="submit-proposal" element={<Applications />} />
        <Route path="applications" element={<Applications />} />
        <Route path="track" element={<Tracking />} />
        <Route path="recruitment" element={<Careers />} />
        <Route path="users" element={<UserManagement />} />
        <Route path="profile" element={<ProfilePage />} />
      </Route>

      {/* Fallback Catch All */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
};
export default AppRoutes;
