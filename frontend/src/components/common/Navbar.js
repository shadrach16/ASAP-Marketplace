// Inside Asap/frontend/src/components/layout/MainLayout.js OR a separate Navbar/Header component

import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import Button from '../common/Button';

// Icon placeholder (use react-icons or similar)
const CreditIcon = () => <span className="mr-1">💰</span>;


const Header = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <header className="bg-white shadow-sm sticky top-0 z-50"> {/* Added sticky */}
      <nav className="container mx-auto px-4 sm:px-6 lg:px-8 py-3 flex justify-between items-center">
        <Link to="/" className="text-2xl font-bold text-primary">
          ASAP
        </Link>
        <div className="space-x-4 flex items-center">
          {user ? (
            <>
               {/* Pro Specific Items */}
               {user.role === 'pro' && (
                 <>
                    <Link to="/jobs/search" className="text-sm font-medium text-text-secondary hover:text-text-primary">
                       Find Work
                    </Link>
                    {/* Credit Balance Display */}
                    <Link to="/pro/settings/credits" className="flex items-center text-sm font-medium text-primary hover:underline bg-primary-light bg-opacity-20 px-2 py-1 rounded-md">
                         <CreditIcon/> {user.credits ?? 0} Credits
                    </Link>
                 </>
               )}

               {/* Client Specific Items */}
               {user.role === 'client' && (
                 <Link to="/client/jobs/new">
                   <Button variant="primary" size="sm">Post a Job</Button>
                 </Link>
              )}

               {/* Common Authenticated Links */}
              <Link
                to="/dashboard"
                className="text-sm font-medium text-text-secondary hover:text-text-primary hidden md:inline-block" // Hide on small screens
              >
                Dashboard
              </Link>
              <Link
                to="/settings/profile"
                className="text-sm font-medium text-text-secondary hover:text-text-primary hidden md:inline-block" // Hide on small screens
              >
                Settings
              </Link>
              <button
                onClick={handleLogout}
                className="text-sm font-medium text-red-600 hover:underline"
              >
                Logout
              </button>
            </>
          ) : (
             // --- Public Links ---
            <>
              {/* Optional: Add public browse links */}
              <Link
                to="/login"
                className="text-sm font-medium text-text-secondary hover:text-text-primary"
              >
                Log in
              </Link>
              <Link to="/register">
                 <Button variant="primary" size="sm">Sign Up</Button>
              </Link>
            </>
          )}
        </div>
      </nav>
    </header>
  );
};

// If MainLayout contains Header, update it there. Otherwise, use Header where needed.
const MainLayout = ({ children }) => {
  return (
    <div className="min-h-screen bg-background-light">
      <Header />
      <main>
        {children}
      </main>
      {/* Footer can be added here */}
    </div>
  );
};

export default MainLayout;