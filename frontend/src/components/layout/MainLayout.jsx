 

import React, { useState, Fragment, useRef, useEffect } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import Button from '../common/Button';
import NotificationBell from '../common/NotificationBell';
import {
  Menu,
  X,
  User,
  Briefcase,
  Search,
  LogOut,
  LayoutDashboard,
  Settings,
  DollarSign,
  CreditCard,
  Shield,
  PieChart,
  Grip,
  Plus,
  ChevronDown,
  HelpCircle,
  MessageSquare,
  Bookmark,
  FileText,
  Users,
} from 'lucide-react';

 

 

// Dropdown Component
const NavDropdown = ({ title, children }) => {
  const [isOpen, setIsOpen] = useState(false);
  
  return (
    <div 
      className="relative"
      onMouseEnter={() => setIsOpen(true)}
      onMouseLeave={() => setIsOpen(false)}
    >
      <button className="flex items-center gap-1 text-md font-medium text-gray-700 hover:text-gray-900 py-2 px-3 rounded-lg hover:bg-gray-50 transition-colors">
        {title}
        <ChevronDown className={`w-4 h-4 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} />
      </button>
      
      {isOpen && (
        <div className="absolute left-0 mt-1 w-56 rounded-xl shadow-xl bg-white ring-1 ring-gray-900/5 z-50 animate-in fade-in slide-in-from-top-2 duration-200">
          <div className="py-2" role="menu">
            {children}
          </div>
        </div>
      )}
    </div>
  );
};

const DropdownLink = ({ to, onClick, children }) => (
  <NavLink
    to={to}
    onClick={onClick}
    className={({ isActive }) =>
      `flex items-center gap-3 px-4 py-2.5 text-md transition-colors ${
        isActive 
          ? 'bg-emerald-50 text-emerald-700' 
          : 'text-gray-700 hover:bg-gray-50'
      }`
    }
    role="menuitem"
  >
    {children}
  </NavLink>
);

const Header = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);
  const [isSearchMenuOpen, setIsSearchMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  
  const defaultSearchType = user?.role === 'client' ? 'artisans' : 'jobs';
  const [searchType, setSearchType] = useState(defaultSearchType);

  const searchMenuRef = useRef(null);
  const profileMenuRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (searchMenuRef.current && !searchMenuRef.current.contains(event.target)) {
        setIsSearchMenuOpen(false);
      }
      if (profileMenuRef.current && !profileMenuRef.current.contains(event.target)) {
        setIsProfileMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

 

  const handleLogout = () => {
    logout();
    setIsProfileMenuOpen(false);
    setIsMobileMenuOpen(false);
    navigate('/login');
  };

  const handleNavClick = () => {
    setIsMobileMenuOpen(false);
    setIsProfileMenuOpen(false);
  };

  const navLinkClass = ({ isActive }) =>
    `text-md font-medium py-2 px-3  transition-colors ${
      isActive 
        ? 'text-emerald-700 border-b border-emerald-600 ' 
        : 'text-gray-700 hover:text-gray-900 hover:bg-gray-50'
    }`;
  
  const mobileNavLinkClass = ({ isActive }) =>
    `flex items-center gap-3 px-4 py-3 rounded-xl text-base font-medium transition-colors ${
      isActive
        ? 'bg-emerald-50 text-emerald-700'
        : 'text-gray-700 hover:bg-gray-50'
    }`;

  return (
    <header className="  sticky top-0 z-50 backdrop-blur-sm border-b bg-white ">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          
          {/* Left: Logo & Navigation */}
          <div className="flex items-center gap-8">
            {/* Logo */}
            <Link
              to="/"
              className="flex items-center"
              onClick={handleNavClick}
            >
              <span className="text-4xl logo font-bold  " style={{marginTop:"-4px"}}   >
                Asap.
              </span>
            </Link>

            {/* Desktop Navigation */}
            <nav className="hidden lg:flex items-center gap-1">
              {user ? (
                <>
                  {user.role === 'pro' && (
                    <NavDropdown title="Find Work">
                      <DropdownLink to="/jobs/search" onClick={handleNavClick}>
                        <Search className="w-4 h-4" /> Find Work
                      </DropdownLink>
                      <DropdownLink to="/pro/saved-jobs" onClick={handleNavClick}>
                        <Bookmark className="w-4 h-4" /> Saved Jobs
                      </DropdownLink>
                      <DropdownLink to="/pro/proposals" onClick={handleNavClick}>
                        <FileText className="w-4 h-4" /> Proposals
                      </DropdownLink>  
                    </NavDropdown>
                  )}
                  {user.role === 'client' && (
                    <NavDropdown title="Find Artisans">
                      <DropdownLink to="/services/search" onClick={handleNavClick}>
                        <Search className="w-4 h-4" /> Find Artisans
                      </DropdownLink>
                      <DropdownLink to="/dashboard" onClick={handleNavClick}>
                        <Briefcase className="w-4 h-4" /> My Hires
                      </DropdownLink>
                    </NavDropdown>
                  )}
                  <NavLink to="/dashboard" className={navLinkClass} onClick={handleNavClick}>
                    My Jobs
                  </NavLink>
                  <NavLink to="/messages" className={navLinkClass} onClick={handleNavClick}>
                    Messages
                  </NavLink>
                </>
              ) : (
                <>
                  <NavLink to="/services/search" className={navLinkClass} onClick={handleNavClick}>
                    Find Artisans
                  </NavLink>
                  <NavLink to="/jobs/search" className={navLinkClass} onClick={handleNavClick}>
                    Find Work
                  </NavLink>
                  <NavLink to="/why-asap" className={navLinkClass} onClick={handleNavClick}>
                    Why ASAP
                  </NavLink>
                </>
              )}
            </nav>
          </div>

          {/* Right: Actions */}
          <div className="flex items-center gap-3">
                <div className="hidden md:flex">
                  <form className="relative" onSubmit={(e) => {
                    e.preventDefault()
                    navigate(`${searchType === 'jobs' ? '/jobs/search':'/services/search'}?search=${searchQuery}`)
                  }}>
                    <input
                      type="text"
                      placeholder={`Search by role, skills...`}
                    onChange={(e) => setSearchQuery(e.target.value)}

                      className="w-74 border border-gray-300 rounded-lg pl-10 pr-24 py-2 text-md focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all"
                    />
                    <Search className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
                    
                    {/* Search Type Toggle */}
                    <div className="absolute right-2 top-1/2 -translate-y-1/2" ref={searchMenuRef}>
                      <button
                        type="button"
                        onClick={() => setIsSearchMenuOpen(!isSearchMenuOpen)}
                        className="flex items-center gap-1 px-2 py-1 text-md font-medium  space-3-1  hover:bg-gray-200 text-gray-700 transition-colors"
                      >
                       <span className='px-1' >|</span> {searchType === 'jobs' ? 'Jobs' : 'Artisans'}
                        <ChevronDown className="w-3 h-3" />
                      </button>
                      {isSearchMenuOpen && (
                        <div className="absolute right-0 mt-2 w-40 rounded-lg shadow-xl bg-white ring-1 ring-gray-900/5">
                          <div className="py-1">
                            <button
                              onClick={() => { setSearchType('jobs'); setIsSearchMenuOpen(false); }}
                              className="flex items-center gap-2 w-full px-3 py-2 text-md text-gray-700 hover:bg-gray-50"
                            >
                              <Briefcase className="w-4 h-4" /> Jobs
                            </button>
                            <button
                              onClick={() => { setSearchType('artisans'); setIsSearchMenuOpen(false); }}
                              className="flex items-center gap-2 w-full px-3 py-2 text-md text-gray-700 hover:bg-gray-50"
                            >
                              <Users className="w-4 h-4" /> Artisans
                            </button>
                          </div>
                        </div>
                      )}
                    </div>
                  </form>
                </div>
            {user ? (
              <>
                {/* Search Bar */}

                {/* Post Job Button */}
                {user.role === 'client' && (
                  <Link to="/client/jobs/new" className="hidden lg:block">
                    <Button variant="primary" size="sm" className='flex items-center justify-center' >
                      <Plus className="w-4 h-4 mr-1" />
                      Post Job
                    </Button>
                  </Link>
                )}

                {/* Help */}
                <button className="hidden md:flex p-2 rounded-lg text-gray-600 hover:text-gray-900 hover:bg-gray-100 transition-colors">
                  <HelpCircle className="w-5 h-5" />
                </button>

                {/* Notifications */}
                <NotificationBell />

                {/* Profile Menu */}
                <div className="relative" ref={profileMenuRef}>
                  <button
                    onClick={() => setIsProfileMenuOpen(!isProfileMenuOpen)}
                    className="flex items-center gap-2 p-1 rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    <div className="h-9 w-9 rounded-full bg-gradient-to-br from-emerald-400 to-teal-500 flex items-center justify-center text-white font-semibold text-md shadow-sm">
                      {user.name?.charAt(0).toUpperCase() || 'U'}
                    </div>
                  </button>

                  {isProfileMenuOpen && (
                    <div className="absolute right-0 mt-2 w-72 rounded-xl shadow-xl bg-white ring-1 ring-gray-900/5">
                      {/* User Info */}
                      <div className="p-4 border-b border-gray-100">
                        <p className="font-semibold text-gray-900 truncate">{user.name}</p>
                        <p className="text-md text-gray-500 truncate">{user.email}</p>
                      </div>

                      {/* Menu Items */}
                      <div className="py-2">
                        {user.role === 'admin' && (
                          <Link
                            to="/admin/dashboard"
                            onClick={handleNavClick}
                            className="flex items-center gap-3 px-4 py-2.5 text-md text-gray-700 hover:bg-gray-50 transition-colors"
                          >
                            <Shield className="w-4 h-4" /> Admin Dashboard
                          </Link>
                        )}
                        <Link
                          to="/dashboard"
                          onClick={handleNavClick}
                          className="flex items-center gap-3 px-4 py-2.5 text-md text-gray-700 hover:bg-gray-50 transition-colors"
                        >
                          <LayoutDashboard className="w-4 h-4" /> Dashboard
                        </Link>
                        {user.role === 'pro' && (
                          <>
                            <Link
                              to={`/pros/${user._id}`}
                              onClick={handleNavClick}
                              className="flex items-center gap-3 px-4 py-2.5 text-md text-gray-700 hover:bg-gray-50 transition-colors"
                            >
                              <User className="w-4 h-4" /> My Profile
                            </Link>
                         {/*   <Link
                              to="/pro/analytics"
                              onClick={handleNavClick}
                              className="flex items-center gap-3 px-4 py-2.5 text-md text-gray-700 hover:bg-gray-50 transition-colors"
                            >
                              <PieChart className="w-4 h-4" /> Analytics
                            </Link>*/}
                          </>
                        )}
                      </div>

                      <div className="py-2 border-t border-gray-100">
                        <Link
                          to="/financials"
                          onClick={handleNavClick}
                          className="flex items-center gap-3 px-4 py-2.5 text-md text-gray-700 hover:bg-gray-50 transition-colors"
                        >
                          <DollarSign className="w-4 h-4" /> Financials
                        </Link>
                        <Link
                          to="/settings/profile"
                          onClick={handleNavClick}
                          className="flex items-center gap-3 px-4 py-2.5 text-md text-gray-700 hover:bg-gray-50 transition-colors"
                        >
                          <Settings className="w-4 h-4" /> Settings
                        </Link>
                      </div>

                      <div className="py-2 border-t border-gray-100">
                        <button
                          onClick={handleLogout}
                          className="flex items-center gap-3 w-full px-4 py-2.5 text-md text-red-600 hover:bg-red-50 transition-colors"
                        >
                          <LogOut className="w-4 h-4" /> Logout
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </>
            ) : (
              <div className="hidden sm:flex items-center gap-3">
                <Link
                  to="/login"
                  className="text-md font-medium text-gray-700 hover:text-gray-900 px-4 py-2"
                  onClick={handleNavClick}
                >
                  Log in
                </Link>
                <Link to="/register">
                  <Button variant="primary" size="sm">
                    Sign Up
                  </Button>
                </Link>
              </div>
            )}

            {/* Mobile Menu Button */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="lg:hidden p-2 rounded-lg text-gray-600 hover:bg-gray-100"
            >
              {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="lg:hidden bg-white border-t border-gray-200">
          <div className="px-4 py-4 space-y-1">
            {user ? (
              <>
                <NavLink to="/dashboard" className={mobileNavLinkClass} onClick={handleNavClick}>
                  <LayoutDashboard className="w-5 h-5" /> Dashboard
                </NavLink>
                {user.role === 'client' && (
                  <NavLink to="/client/jobs/new" className={mobileNavLinkClass} onClick={handleNavClick}>
                         <Plus className="w-5 h-5" /> Post a Job
                  </NavLink>
                )}
                {user.role === 'pro' && (
                  <>
                    <NavLink to="/jobs/search" className={mobileNavLinkClass} onClick={handleNavClick}>
                      <Search className="w-5 h-5" /> Find Work
                    </NavLink>
                    <NavLink to={`/pros/${user._id}`} className={mobileNavLinkClass} onClick={handleNavClick}>
                      <User className="w-5 h-5" /> My Profile
                    </NavLink>
                  </>
                )}
                <NavLink to="/messages" className={mobileNavLinkClass} onClick={handleNavClick}>
                  <MessageSquare className="w-5 h-5" /> Messages
                </NavLink>
                <NavLink to="/financials" className={mobileNavLinkClass} onClick={handleNavClick}>
                  <DollarSign className="w-5 h-5" /> Financials
                </NavLink>
                <NavLink to="/settings/profile" className={mobileNavLinkClass} onClick={handleNavClick}>
                  <Settings className="w-5 h-5" /> Settings
                </NavLink>
                <button
                  onClick={handleLogout}
                  className="flex items-center gap-3 w-full px-4 py-3 rounded-xl text-base font-medium text-red-600 hover:bg-red-50"
                >
                  <LogOut className="w-5 h-5" /> Logout
                </button>
              </>
            ) : (
              <>
                <NavLink to="/jobs/search" className={mobileNavLinkClass} onClick={handleNavClick}>
                  <Search className="w-5 h-5" /> Find Work
                </NavLink>
                <NavLink to="/services/search" className={mobileNavLinkClass} onClick={handleNavClick}>
                  <Users className="w-5 h-5" /> Find Artisans
                </NavLink>
                <NavLink to="/login" className={mobileNavLinkClass} onClick={handleNavClick}>
                  Log In
                </NavLink>
                <NavLink to="/register" className={mobileNavLinkClass} onClick={handleNavClick}>
                  Sign Up
                </NavLink>
              </>
            )}
          </div>
        </div>
      )}
    </header>
  );
};


// --- Footer Component (Unchanged) ---
const Footer = () => {
  const tradeCategories = [
    { name: 'Plumbing', href: '#' },
    { name: 'Electrical', href: '#' },
    { name: 'Carpentry', href: '#' },
    { name: 'Landscaping', href: '#' },
    { name: 'Painting', href: '#' },
    { name: 'General Contracting', href: '#' },
  ];
  const aboutLinks = [
    { name: 'About ASAP', href: '#' },
    { name: 'Careers', href: '#' },
    { name: 'Press', href: '#' },
  ];
  const supportLinks = [
    { name: 'Help Center', href: '#' },
    { name: 'Trust & Safety', href: '#' },
    { name: 'Dispute Resolution', href: '#' },
  ];
  const legalLinks = [
    { name: 'Terms of Service', href: '#' },
    { name: 'Privacy Policy', href: '#' },
    { name: 'Compliance', href: '#' },
  ];

  const FooterLinkList = ({ title, links }) => (
    <div>
      <h3 className="text-sm font-semibold text-gray-800 uppercase tracking-wider">
        {title}
      </h3>
      <ul role="list" className="mt-4 space-y-2">
        {links.map((link) => (
          <li key={link.name}>
            <a href={link.href} className="text-sm text-gray-600 hover:text-primary">
              {link.name}
            </a>
          </li>
        ))}
      </ul>
    </div>
  );

  return (
    <footer className="bg-white border-t border-border-light mt-12">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          <FooterLinkList title="Trades" links={tradeCategories} />
          <FooterLinkList title="About" links={aboutLinks} />
          <FooterLinkList title="Support" links={supportLinks} />
          <FooterLinkList title="Legal" links={legalLinks} />
        </div>
        <div className="text-center text-xs text-text-light pt-8 mt-8 border-t border-border-light">
          &copy; {new Date().getFullYear()} ASAP (Artisan Services Access Platform). All rights reserved.
          <br />
          Built for Canada.
        </div>
      </div>
    </footer>
  );
};

// --- Main Layout Component (Unchanged) ---
const MainLayout = ({ children }) => {
  return (
   
    <div className="min-h-screen bg-background-light flex flex-col">
      <Header />
      <main className="flex-grow">{children}</main>
      <Footer />
    </div>
 

  );
};


export default MainLayout;