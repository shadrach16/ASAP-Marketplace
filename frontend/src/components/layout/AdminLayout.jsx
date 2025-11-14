import React from 'react';
import { NavLink, Outlet, Link } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';

// Placeholder icons
const DashboardIcon = () => <span>📊</span>;
const UsersIcon = () => <span>👥</span>;
const ProjectsIcon = () => <span>💼</span>;
const DisputesIcon = () => <span>⚠️</span>;
const ComplianceIcon = () => <span>🛡️</span>; // <-- New Icon
const SettingsIcon = () => <span>⚙️</span>;


const AdminLayout = () => {
    const { user, logout } = useAuth();

    const baseLinkClass = "flex items-center px-3 py-2 rounded-md text-sm font-medium transition-colors duration-150";
    const activeLinkClass = "bg-primary text-white";
    const inactiveLinkClass = "text-text-secondary hover:bg-gray-100 hover:text-text-primary";
    const navLinkClass = ({ isActive }) => `${baseLinkClass} ${isActive ? activeLinkClass : inactiveLinkClass}`;

    return (
        <div className="min-h-screen flex bg-background-light">
            {/* Sidebar */}
            <aside className="w-64 bg-white border-r border-border flex flex-col flex-shrink-0">
                <div className="h-16 flex items-center justify-center border-b border-border px-4">
                     <Link to="/admin/dashboard" className="text-xl font-bold text-primary">ASAP Admin</Link>
                </div>
                <nav className="flex-grow p-4 space-y-2 overflow-y-auto">
                    <NavLink to="/admin/dashboard" end className={navLinkClass}>
                        <DashboardIcon /><span className="ml-2">Dashboard</span>
                    </NavLink>
                    <NavLink to="/admin/users" className={navLinkClass}>
                        <UsersIcon /><span className="ml-2">Users</span>
                    </NavLink>
                     <NavLink to="/admin/compliance" className={navLinkClass}> {/* <-- Add Compliance Link */}
                        <ComplianceIcon /><span className="ml-2">Compliance</span>
                    </NavLink>
                    <NavLink to="/admin/projects" className={navLinkClass}>
                        <ProjectsIcon /><span className="ml-2">Projects</span>
                    </NavLink>
                    <NavLink to="/admin/disputes" className={navLinkClass}>
                        <DisputesIcon /><span className="ml-2">Disputes</span>
                    </NavLink>
                    {/* <NavLink to="/admin/settings" className={navLinkClass}>
                        <SettingsIcon /><span className="ml-2">Settings</span>
                    </NavLink> */}
                </nav>
                 {/* Sidebar Footer */}
                 <div className="p-4 border-t border-border mt-auto">
                      <p className="text-xs text-text-light truncate mb-1">{user?.email}</p>
                      <button onClick={logout} className="text-sm font-medium text-red-600 hover:underline w-full text-left">
                          Logout
                      </button>
                 </div>
            </aside>

            {/* Main Content Area */}
            <div className="flex-grow flex flex-col">
                <main className="flex-grow p-6 overflow-y-auto">
                    <Outlet />
                </main>
            </div>
        </div>
    );
};

export default AdminLayout;