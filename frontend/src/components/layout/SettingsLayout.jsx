import React from 'react';
import { NavLink, Outlet } from 'react-router-dom';
import { User, Bell, CreditCard, DollarSign, Star } from 'lucide-react'; // Icons for navigation

// Define navigation links for settings
const settingsNavLinks = [
  { to: '/settings/profile', label: 'My Info', icon: User },
  { to: '/financials', label: 'Billing & Payments', icon: DollarSign },
  // Add password/security link when implemented
  // { to: '/settings/security', label: 'Password & Security', icon: Lock },
  { to: '/settings/notifications', label: 'Notification Settings', icon: Bell },
  { to: '/settings/subscriptions', label: 'Membership', icon: Star },
  // Add other links as needed (e.g., Tax Info, Connected Services)
];

const SettingsLayout = () => {
  // Active NavLink style
  const activeClassName = "bg-primary-light bg-opacity-20 text-primary-dark border-l-4 border-primary";
  const inactiveClassName = "text-text-secondary hover:bg-gray-100 hover:text-text-primary border-l-4 border-transparent";
  const navLinkClass = ({ isActive }) =>
    `flex items-center px-4 py-2.5 text-sm font-medium transition-colors duration-150 ${isActive ? activeClassName : inactiveClassName}`;

  return (
    <div className="container mx-auto max-w-7xl py-8 px-4 sm:px-6 lg:px-8">
      <h1 className="text-3xl font-bold text-text-secondary mb-8">Settings</h1>
      <div className="grid grid-cols-1 md:grid-cols-4 gap-8 items-start">

        {/* --- Sidebar Navigation --- */}
        <aside className="md:col-span-1 bg-white p-4   rounded-lg border border-border sticky top-24">
          <nav className="space-y-1">
            {settingsNavLinks.map((link) => (
              <NavLink
                key={link.to}
                to={link.to}
                className={navLinkClass}
                end // Use 'end' for exact matching on index routes if needed
              >
                <link.icon className="w-5 h-5 mr-3" />
                <span>{link.label}</span>
              </NavLink>
            ))}
          </nav>
        </aside>

        {/* --- Main Content Area --- */}
        <main className="md:col-span-3">
          {/* Outlet renders the specific settings page (ProfilePage, etc.) */}
          <Outlet />
        </main>

      </div>
    </div>
  );
};

export default SettingsLayout;