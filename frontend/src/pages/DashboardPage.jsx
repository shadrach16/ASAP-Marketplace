// src/pages/DashboardPage.jsx (Updated)

import React from 'react';
import { Navigate } from 'react-router-dom';
import { Loader2 } from 'lucide-react';
import { useAuth } from '../hooks/useAuth';

// Import the role-specific dashboards
import ClientDashboardPage from './dashboard/ClientDashboardPage';
import ProDashboardPage from './dashboard/ProDashboardPage';  

/**
 * A top-level component that acts as a router after login.
 * It checks the authenticated user's role and renders the
 * appropriate dashboard page.
 */
const DashboardPage = () => {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!user) {
    // This shouldn't be hit if your route is protected, but as a safeguard
    return <Navigate to="/login" replace />;
  }

  // --- Role-Based Routing ---
  switch (user.role) {
    case 'client':
      return <ClientDashboardPage />;

    case 'pro':
      return <ProDashboardPage />;

    case 'admin':
      // Redirect to a dedicated admin panel
      return <Navigate to="/admin" replace />;

    default:
      // Fallback for any unknown role
      return (
        <div className="container mx-auto p-4">
          <h1 className="text-2xl font-bold">Error</h1>
          <p>Unknown user role. Please contact support.</p>
        </div>
      );
  }
};

export default DashboardPage;