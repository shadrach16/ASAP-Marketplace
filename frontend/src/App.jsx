import React from 'react';
import {
  Routes,
  Route,
  Navigate,
  useLocation,
  Link,
} from 'react-router-dom';


import { useAuth } from './hooks/useAuth';

import MainLayout from './components/layout/MainLayout'; //
import AdminLayout from './components/layout/AdminLayout'; // <-- Import AdminLayout
import SettingsLayout from './components/layout/SettingsLayout'; // <-- Import AdminLayout
import FullScreenLoader from './components/common/FullScreenLoader'; // <-- Import AdminLayout
import Button from './components/common/Button'; // <-- Import AdminLayout

import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import HomePage from './pages/HomePage';
import DashboardPage from './pages/DashboardPage';
import ProfilePage from './pages/settings/ProfilePage';
import OnboardingPage from './pages/pro/OnboardingPage';
import PostJobPage from './pages/client/jobs/PostJobPage';
import SavedJobsPage from './pages/client/jobs/SavedJobsPage';


import MessagesPage from './pages/messages/MessagesPage';
import FindWorkPage from './pages/pros/FindWorkPage';
import SubmitProposalPage from './pages/pros/SubmitProposalPage';
import JobDetailsPage from './pages/client/jobs/JobDetailsPage';
import ProjectWorkspacePage from './pages/client/jobs/ProjectWorkspacePage';
import ProProfilePage from './pages/pros/ProProfilePage'; // Added for Task 5.4 integration
import SubmitTestimonialPage from './pages/testimonials/SubmitTestimonialPage'; // <-- Import
import ManagePortfolioPage from './pages/pro/profile/ManagePortfolioPage'; // <-- Import
import ManageServicesPage from './pages/pro/settings/ManageServicesPage';
import BuyCreditsPage from './pages/pro/settings/BuyCreditsPage'; // <-- Import
import NotificationSettingsPage from './pages/settings/NotificationSettingsPage'; // <-- Import
import NotificationsPage from './pages/notifications/NotificationsPage'; // <-- Import
import FinancialsPage from './pages/financials/FinancialsPage'; // <-- Import
import SubscriptionSettingsPage from './pages/settings/SubscriptionSettingsPage'; // <-- Import
import ProAnalyticsPage from './pages/pro/ProAnalyticsPage'; // <-- Import
import FindServicesPage from './pages/pros/FindServicesPage'; // <-- IMPORT NEW PAGE
import ServiceDetailPage from './pages/services/ServiceDetailPage'; // <-- IMPORT NEW PAGE

import AdminDashboardPage from './pages/admin/AdminDashboardPage'; // <-- Import
import UserListPage from './pages/admin/users/UserListPage';         // <-- Import
import UserDetailsPage from './pages/admin/users/UserDetailsPage';   // <-- Import
import ProjectListPage from './pages/admin/projects/ProjectListPage'; // <-- Import
import DisputeListPage from './pages/admin/disputes/DisputeListPage';   // <-- Import
import DisputeDetailsPage from './pages/admin/disputes/DisputeDetailsPage'; // <-- Import
import ComplianceManagementPage from './pages/admin/compliance/ComplianceManagementPage'; // <-- Import
import ForgotPasswordPage from './pages/ForgotPasswordPage'; 
import ResetPasswordPage from './pages/ResetPasswordPage';

import { SavedJobsProvider } from './hooks/useSavedJobs';



const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, loading } = useAuth();
  const location = useLocation();

  // --- THIS IS THE FIX ---
  // While loading, just render the children.
  // The global loader from App.jsx will overlay them.
  if (loading) {
    return children;
  }

  // Once loading is false, then check authentication
  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return children;
};

// --- Helper Component: Pro Protected Route ---
const ProProtectedRoute = ({ children }) => {
  const { isAuthenticated, user, loading } = useAuth();
  const location = useLocation();

  // --- THIS IS THE FIX ---
  if (loading) {
    return children;
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (user.role !== 'pro') {
    return <Navigate to="/dashboard" replace />; // Redirect non-pros
  }

  return children;
};

// --- Helper Component: Redirect if already logged in ---
const PublicAuthRoute = ({ children }) => {
  const { isAuthenticated, loading } = useAuth();

  // --- THIS IS THE FIX ---
  if (loading) {
    return children;
  }

  if (isAuthenticated) {
    return <Navigate to="/dashboard" replace />;
  }

  return children;
};

// --- Admin Protected Route ---
// (Your Admin route was already correct, but here it is for consistency)
const AdminProtectedRoute = ({ children }) => {
  const { isAuthenticated, user, loading } = useAuth();
  const location = useLocation();

  // --- THIS IS THE FIX ---
  if (loading) {
    return children;
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (user.role !== 'admin') {
    return <Navigate to="/dashboard" replace />;
  }

  return children;
};




const NotFoundPage = () => (
    <div className="text-center py-20">
        <h1 className="text-4xl font-bold mb-4">404 - Not Found</h1>
        <p className="text-text-secondary mb-6">Sorry, the page you are looking for does not exist.</p>
        <Link to="/"><Button variant="primary">Go Home</Button></Link>
    </div>
);


// --- Main App Component ---
function App() {
  const { loading } = useAuth();

 
  return (<>
  {loading && <FullScreenLoader />}
 <SavedJobsProvider >
<Routes>
      {/* Routes WITHOUT MainLayout */}
      <Route path="/login" element={<PublicAuthRoute><LoginPage /></PublicAuthRoute>} />
      <Route path="/register" element={<PublicAuthRoute><RegisterPage /></PublicAuthRoute>} />
      <Route path="/testimonials/submit/:token" element={<SubmitTestimonialPage />} />
      <Route path="/forgot-password" element={<ForgotPasswordPage />} />
      <Route path="/reset-password/:token" element={<ResetPasswordPage />} />

      {/* Routes WITH MainLayout */}
      <Route path="/" element={<MainLayout><HomePage /></MainLayout>} />
      <Route path="/pros/:proId" element={<MainLayout><ProProfilePage /></MainLayout>} />
      <Route path="/dashboard" element={<ProtectedRoute><MainLayout><DashboardPage /></MainLayout></ProtectedRoute>} />
      <Route path="/jobs/search" element={ <MainLayout><FindWorkPage /></MainLayout>} />
        <Route path="/pro/saved-jobs" element={<ProtectedRoute><MainLayout><SavedJobsPage /></MainLayout></ProtectedRoute>} />
      <Route path="/services/search" element={<MainLayout><FindServicesPage /></MainLayout>} />
<Route path="/services/:serviceId" element={<MainLayout><ServiceDetailPage /></MainLayout>} />
  
      <Route element={<ProtectedRoute><MainLayout><SettingsLayout /></MainLayout></ProtectedRoute>}>
          {/* These routes render inside SettingsLayout's Outlet */}
          <Route path="/settings/profile" element={<ProfilePage />} />
          <Route path="/settings/notifications" element={<NotificationSettingsPage />} />
          <Route path="/settings/subscriptions" element={<SubscriptionSettingsPage />} />
          <Route path="/financials" element={<FinancialsPage />} />
          {/* Add future settings routes here */}
           {/* Optional: Redirect base /settings to profile */}
          <Route path="/settings" element={<Navigate to="/settings/profile" replace />} />
        </Route>

      
          
        <Route path="/notifications" element={<ProtectedRoute><MainLayout><NotificationsPage /></MainLayout></ProtectedRoute>} />
        <Route path="/client/jobs/new" element={<ProtectedRoute><MainLayout><PostJobPage /></MainLayout></ProtectedRoute>} />
        <Route path="/messages" element={<ProtectedRoute><MainLayout><MessagesPage /></MainLayout></ProtectedRoute>} />

<Route path="/jobs/:jobId/propose" element={<ProProtectedRoute><MainLayout><SubmitProposalPage /></MainLayout></ProProtectedRoute>} />
      <Route path="/pro/onboarding" element={<ProProtectedRoute> <OnboardingPage /> </ProProtectedRoute>} />
      <Route path="/pro/settings/portfolio" element={<ProProtectedRoute><MainLayout><ManagePortfolioPage /></MainLayout></ProProtectedRoute>} />
      <Route path="/pro/settings/services" element={<ProProtectedRoute><MainLayout><ManageServicesPage /></MainLayout></ProProtectedRoute>} />
      <Route path="/pro/settings/credits" element={<ProProtectedRoute><MainLayout><BuyCreditsPage /></MainLayout></ProProtectedRoute>} />
      <Route path="/pro/analytics" element={<ProProtectedRoute><MainLayout><ProAnalyticsPage /></MainLayout></ProProtectedRoute>} /> {/* <-- Add route */}
        <Route path="/jobs/:jobId/edit" element={<ProtectedRoute><MainLayout><PostJobPage /></MainLayout></ProtectedRoute>} />
        <Route path="/jobs/:jobId" element={<ProtectedRoute><MainLayout><JobDetailsPage /></MainLayout></ProtectedRoute>} />
      <Route path="/workspace/:bookingId" element={<ProtectedRoute><MainLayout><ProjectWorkspacePage /></MainLayout></ProtectedRoute>} />


      {/* --- Admin Routes --- */}
      <Route
        path="/admin"
        element={
            <AdminProtectedRoute>
                <AdminLayout /> {/* AdminLayout handles sidebar and renders nested content via <Outlet> */}
            </AdminProtectedRoute>
        }
      >
          {/* Nested routes render inside AdminLayout's <Outlet> */}
          <Route path="dashboard" element={<AdminDashboardPage />} />
          <Route path="users" element={<UserListPage />} />
          <Route path="users/:userId" element={<UserDetailsPage />} />
          <Route path="compliance" element={<ComplianceManagementPage />} /> {/* <-- Add compliance route */}
          <Route path="projects" element={<ProjectListPage />} />
          <Route path="disputes" element={<DisputeListPage />} />
          <Route path="disputes/:disputeId" element={<DisputeDetailsPage />} />
           {/* Redirect /admin to /admin/dashboard */}
          <Route index element={<Navigate to="dashboard" replace />} />
      </Route>


      {/* Catch-all 404 Route */}
      <Route path="*" element={<MainLayout><NotFoundPage /></MainLayout>} />

    </Routes>
    </SavedJobsProvider>
    </>
  );
}

export default App;