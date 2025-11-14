import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Search, Code, Palette, Cpu, TrendingUp, FileText, Users, Building, 
Scale, UserCheck, Wrench, ChevronRight,
  Hammer, 
  Bolt, 
  PaintRoller, 
  Home, 
  HardHat, 
  Leaf,
  Wind,
  Shield

   } from 'lucide-react';

 import heroBg from '../assets/images/hero-background.jpg';


const HomePage = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState('work');


const categories = [
    { icon:  <Wrench className="w-8 h-8" />, title: 'Plumbing', color: 'text-blue-600' },
    { icon: <Hammer className="w-8 h-8" />, title: 'Carpentry & Renovations', color: 'text-orange-600' },
    { icon: <Bolt className="w-8 h-8" />, title: 'Electrical', color: 'text-yellow-500' },
    { icon: <PaintRoller className="w-8 h-8" />, title: 'Painting & Decorating', color: 'text-purple-600' },
    { icon: <Home className="w-8 h-8" />, title: 'General Maintenance', color: 'text-green-600' },
    { icon: <HardHat className="w-8 h-8" />, title: 'General Contracting', color: 'text-gray-700' },
    { icon: <Building className="w-8 h-8" />, title: 'Property Management', color: 'text-teal-600' },
    { icon: <Leaf className="w-8 h-8" />, title: 'Landscaping & Outdoors', color: 'text-lime-600' },
    { icon: <Wind className="w-8 h-8" />, title: 'HVAC & Mechanical', color: 'text-cyan-600' },
    { icon: <Shield className="w-8 h-8" />, title: 'Roofing & Siding', color: 'text-red-600' },
  ];



  const howItWorks = [
    {
      title: 'Posting jobs is always free',
      description: 'Get matched with qualified trade professionals for your project',
      color: 'bg-gradient-to-br from-lime-200 to-yellow-200'
    },
    {
      title: 'Get proposals and hire',
      description: 'Review bids, compare profiles, and hire the right professional',
      color: 'bg-gradient-to-br from-orange-100 to-amber-200'
    },
    {
      title: 'Pay when work is done',
      description: 'Secure escrow payments released upon milestone completion',
      color: 'bg-gradient-to-br from-gray-700 to-gray-800'
    }
  ];

const trustedBy = [
    { icon: <svg   className="w-5 h-5"  viewBox="0 0 20 20" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" fill="#000000"><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g><g id="SVGRepo_iconCarrier"> <title>microsoft [#150]</title> <desc>Created with Sketch.</desc> <defs> </defs> <g id="Page-1" stroke="none" stroke-width="1" fill="none" fill-rule="evenodd"> <g id="Dribbble-Light-Preview" transform="translate(-220.000000, -7519.000000)" fill="#000000"> <g id="icons" transform="translate(56.000000, 160.000000)"> <path d="M174,7379 L184,7379 L184,7370 L174,7370 L174,7379 Z M164,7379 L173,7379 L173,7370 L164,7370 L164,7379 Z M174,7369 L184,7369 L184,7359 L174,7359 L174,7369 Z M164,7369 L173,7369 L173,7359 L164,7359 L164,7369 Z" id="microsoft-[#150]"> </path> </g> </g> </g> </g></svg>, title: 'Microsoft'  },
    { icon: <svg  className="w-5 h-5"  viewBox="-3 0 262 262" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="xMidYMid" fill="#000000"><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g><g id="SVGRepo_iconCarrier"><path d="M255.878 133.451c0-10.734-.871-18.567-2.756-26.69H130.55v48.448h71.947c-1.45 12.04-9.283 30.172-26.69 42.356l-.244 1.622 38.755 30.023 2.685.268c24.659-22.774 38.875-56.282 38.875-96.027" fill="#4285F4"></path><path d="M130.55 261.1c35.248 0 64.839-11.605 86.453-31.622l-41.196-31.913c-11.024 7.688-25.82 13.055-45.257 13.055-34.523 0-63.824-22.773-74.269-54.25l-1.531.13-40.298 31.187-.527 1.465C35.393 231.798 79.49 261.1 130.55 261.1" fill="#34A853"></path><path d="M56.281 156.37c-2.756-8.123-4.351-16.827-4.351-25.82 0-8.994 1.595-17.697 4.206-25.82l-.073-1.73L15.26 71.312l-1.335.635C5.077 89.644 0 109.517 0 130.55s5.077 40.905 13.925 58.602l42.356-32.782" fill="#FBBC05"></path><path d="M130.55 50.479c24.514 0 41.05 10.589 50.479 19.438l36.844-35.974C195.245 12.91 165.798 0 130.55 0 79.49 0 35.393 29.301 13.925 71.947l42.211 32.783c10.59-31.477 39.891-54.251 74.414-54.251" fill="#EB4335"></path></g></svg>, title: 'Google'  },
    { icon: <svg  className="w-5 h-5"  viewBox="-1 0 20 20" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" fill="#000000"><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g><g id="SVGRepo_iconCarrier"> <title>airbnb [#179]</title> <desc>Created with Sketch.</desc> <defs> </defs> <g id="Page-1" stroke="none" stroke-width="1" fill="none" fill-rule="evenodd"> <g id="Dribbble-Light-Preview" transform="translate(-261.000000, -7399.000000)" fill="#000000"> <g id="icons" transform="translate(56.000000, 160.000000)"> <path d="M219.770353,7256.58451 C218.225353,7257.4867 216.591353,7256.27747 215.381353,7254.95558 C216.484353,7253.46124 217.537353,7251.64689 217.594353,7249.79167 C217.642353,7248.02816 216.690353,7246.67637 215.284353,7246.16297 C214.541353,7245.88783 213.713353,7245.86191 212.952353,7246.08621 C211.551353,7246.49893 210.547353,7247.71414 210.427353,7249.28525 C210.262353,7251.27006 211.430353,7253.35756 212.626353,7254.95459 C211.920353,7255.73715 210.963353,7256.59348 209.927353,7256.82476 C208.126353,7257.24944 206.591353,7255.54375 207.196353,7253.68355 C207.507353,7252.7365 212.316353,7242.06773 213.133353,7241.42174 C213.626353,7241.02099 214.408353,7241.01202 214.920353,7241.46062 C215.671353,7242.1086 220.592353,7252.87506 220.853353,7253.83109 C221.159353,7254.96157 220.667353,7256.07011 219.770353,7256.58451 M214.002353,7253.23096 C213.584353,7252.62484 213.216353,7252.0277 212.919353,7251.34383 C212.484353,7250.326 212.198353,7248.98717 213.117353,7248.37608 C213.702353,7247.9843 214.529353,7248.03414 215.045353,7248.4987 C215.696353,7249.0749 215.533353,7250.14058 215.238353,7250.96103 C214.923353,7251.81836 214.449353,7252.59294 214.002353,7253.23096 M216.416353,7239.97126 C215.065353,7238.63143 212.829353,7238.71417 211.564353,7239.99518 C210.419353,7241.12267 205.250353,7252.2859 205.050353,7253.77626 C204.629353,7256.63336 206.908353,7259.16148 209.641353,7258.97407 C211.381353,7258.87936 212.807353,7257.80272 214.003353,7256.53566 C216.048353,7258.71388 218.673353,7259.8623 221.041353,7258.22839 C222.263353,7257.392 223.027353,7255.93753 223.002353,7254.3724 C222.979353,7252.30085 217.366353,7240.88342 216.416353,7239.97126" id="airbnb-[#179]"> </path> </g> </g> </g> </g></svg>, title: 'Airbnb'  },
  ];



  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="relative bg-gray-100 overflow-hidden">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-8 items-center py-12 lg:py-20">
            {/* Left Content */}
            <div className="space-y-6 lg:pr-8">
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-gray-900 leading-tight">
                Connecting clients with{' '}
                <span className="text-green-600">vetted trusted artisans</span> who deliver
              </h1>

              {/* Tab Switcher */}
              <div className="flex gap-4 mt-8">
                <button
                  onClick={() => setActiveTab('work')}
                  className={`px-6 py-2.5 rounded-full font-medium transition-all ${
                    activeTab === 'work'
                      ? 'bg-white text-gray-900 shadow-md'
                      : 'bg-transparent text-gray-600  bg-white/30 hover:bg-white/50'
                  }`}
                >
                  Find work
                </button>
                <button
                  onClick={() => setActiveTab('hire')}
                  className={`px-6 py-2.5 rounded-full font-medium transition-all ${
                    activeTab === 'hire'
                      ? 'bg-white text-gray-900 shadow-md'
                      : 'bg-transparent text-gray-600 bg-white/30 hover:bg-white/50'
                  }`}
                >
                  Hire talent
                </button>
              </div>

              {/* Search Bar */}
              <div className="relative mt-6">
                <input
                  type="text"
                  placeholder="Search by role, skills, or keywords"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full px-6 py-4 pr-32 rounded-full border border-gray-300 focus:outline-none ring-2  ring-green-500 focus:border-transparent text-base shadow-sm"
                />
                <Link to={`${activeTab === 'work' ? '/jobs/search':'services/search'}?search=${searchQuery}`}>
                <button className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-green-600 hover:bg-green-700 text-white px-8 py-2.5 rounded-full font-medium transition-colors flex items-center gap-2">
                  <Search className="w-4 h-4" />
                  Search
                </button>
                </Link>
              </div>

              {/* Trusted By */}
              <div className="pt-6">
                <p className="text-sm text-gray-500 mb-4">Trusted by</p>
                <div className="flex items-center gap-8 flex-wrap">

                                 {trustedBy.map((brand, idx) => (
                    <div key={idx} className="flex items-center gap-2 text-gray-400">
                      <div className="  rounded">{brand.icon}</div>
                      <span className="font-medium text-sm">{brand.title}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Right Image */}
          <div className="relative hidden lg:block">
  <div className="relative rounded-2xl overflow-hidden shadow-2xl">
    
    {/* 2. Apply the image using inline style */}
    <div
      className="aspect-[4/3] bg-cover bg-center" // Removed gradient, added bg-cover
      style={{ backgroundImage: `url(${heroBg})` }}
    >
 

      
      
    </div>
  </div>
</div>
          </div>
        </div>
      </section>

      {/* Explore Categories */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-12">
            Explore millions of professionals
          </h2>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
            {categories.map((category, idx) => (
              <Link
                key={idx}
                to="/jobs/search"
                className="group p-6 flex flex-col space-y-1 rounded-xl border border-gray-200 hover:border-green-500 hover:shadow-lg transition-all duration-200 bg-white"
              >
                <div className={`${category.color} mb-3 group-hover:scale-110 transition-transform`}>
                  {category.icon}
                </div>
                <h3 className="font-semibold text-gray-900 text-sm leading-snug">
                  {category.title}
                </h3>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center mb-12">
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900">How it works</h2>
            <div className="hidden sm:flex gap-3">
              <button className="px-6 py-2 rounded-full border-2 border-green-600 text-green-600 font-medium hover:bg-green-50 transition-colors">
                For hiring
              </button>
              <button className="px-6 py-2 rounded-full border-2 border-gray-300 text-gray-600 font-medium hover:bg-gray-100 transition-colors">
                For finding work
              </button>
            </div>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {howItWorks.map((step, idx) => (
              <div key={idx} className="group cursor-pointer">
                <div className={`${step.color} rounded-2xl overflow-hidden mb-4 aspect-[4/3] flex items-center justify-center hover:scale-105 transition-transform shadow-lg`}>
                  {idx === 0 && (
                    <div className="text-center p-8">
                      <div className="text-6xl font-bold text-gray-800 mb-2">ASAP</div>
                      <div className="text-lg text-gray-700">Get started</div>
                    </div>
                  )}
                  {idx === 1 && (
                    <div className="w-full h-full bg-cover bg-center" style={{backgroundImage: 'linear-gradient(rgba(0,0,0,0.1), rgba(0,0,0,0.1))'}}>
                      <div className="flex items-center justify-center h-full">
                        <Users className="w-24 h-24 text-gray-600" />
                      </div>
                    </div>
                  )}
                  {idx === 2 && (
                    <div className="w-full h-full flex items-center justify-center">
                      <div className="text-center text-white">
                        <UserCheck className="w-24 h-24 mx-auto mb-4" />
                        <p className="text-xl font-semibold">Secure Payment</p>
                      </div>
                    </div>
                  )}
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">{step.title}</h3>
                <p className="text-gray-600">{step.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing Insights CTA */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-center bg-gradient-to-br from-gray-900 to-gray-800 rounded-3xl overflow-hidden">
            {/* Left Side */}
            <div className="p-8 lg:p-12 text-white">
              <h2 className="text-3xl sm:text-4xl font-bold mb-4">
                Get insights into trade professional pricing
              </h2>
              <p className="text-gray-300 mb-6">
                Work with exclusive cost for trade professionals within this skill you need
              </p>
              <div className="relative">
                <input
                  type="text"
                  placeholder="Project description what you need done"
                  className="w-full px-6 py-4 pr-24 rounded-full bg-white text-gray-900 focus:outline-none focus:ring-2 focus:ring-green-500"
                />
                <button className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-gray-900 text-white px-6 py-2.5 rounded-full font-medium hover:bg-gray-800 transition-colors">
                  Next
                </button>
              </div>
            </div>

            {/* Right Side */}
            <div className="p-8 lg:p-12 bg-gradient-to-br from-green-900 to-green-700 flex items-center justify-center">
              <div className="text-center text-white">
                <h3 className="text-2xl font-bold mb-4">Describe your job</h3>
                <button className="bg-green-500 hover:bg-green-400 text-white px-8 py-3 rounded-full font-semibold transition-colors shadow-lg">
                  Describe your job
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Payment Protection */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
              Clients only pay after hiring
            </h2>
          </div>

          <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            <div className="bg-white p-8 rounded-xl shadow-sm border border-gray-200">
              <div className="bg-green-100 w-12 h-12 rounded-lg flex items-center justify-center mb-4">
                <span className="text-2xl">💰</span>
              </div>
              <h3 className="font-bold text-lg mb-2">5% fee after hiring</h3>
              <p className="text-gray-600 text-sm mb-4">
                For meeting bid setup with your global trade professional marketplace
              </p>
              <ul className="space-y-2 text-sm text-gray-600">
                <li className="flex items-start gap-2">
                  <ChevronRight className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
                  <span>Payment protection</span>
                </li>
                <li className="flex items-start gap-2">
                  <ChevronRight className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
                  <span>All project types and work approaches</span>
                </li>
              </ul>
            </div>

            <div className="bg-gray-900 p-8 rounded-xl shadow-lg text-white relative overflow-hidden">
              <div className="absolute top-0 right-0 bg-green-500 text-white text-xs font-bold px-3 py-1 rounded-bl-lg">
                POPULAR
              </div>
              <div className="bg-green-600 w-12 h-12 rounded-lg flex items-center justify-center mb-4">
                <span className="text-2xl">⭐</span>
              </div>
              <h3 className="font-bold text-lg mb-2">50% fee after hiring</h3>
              <p className="text-gray-300 text-sm mb-4">
                For growing businesses with premium features and benefits
              </p>
              <ul className="space-y-2 text-sm text-gray-300">
                <li className="flex items-start gap-2">
                  <ChevronRight className="w-4 h-4 text-green-400 mt-0.5 flex-shrink-0" />
                  <span>Premium customer support 24/7</span>
                </li>
                <li className="flex items-start gap-2">
                  <ChevronRight className="w-4 h-4 text-green-400 mt-0.5 flex-shrink-0" />
                  <span>Premium academy support (any)</span>
                </li>
              </ul>
            </div>

            <div className="bg-white p-8 rounded-xl shadow-sm border border-gray-200">
              <div className="bg-purple-100 w-12 h-12 rounded-lg flex items-center justify-center mb-4">
                <span className="text-2xl">🏢</span>
              </div>
              <h3 className="font-bold text-lg mb-2">Enterprise</h3>
              <p className="text-gray-600 text-sm mb-4">
                For leading comprehensive workforce for the entire organization
              </p>
              <ul className="space-y-2 text-sm text-gray-600">
                <li className="flex items-start gap-2">
                  <ChevronRight className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
                  <span>Dedicated account and project management</span>
                </li>
                <li className="flex items-start gap-2">
                  <ChevronRight className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
                  <span>Unlimited access per job</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-16 bg-gradient-to-br from-green-600 to-green-700">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl sm:text-4xl font-bold text-white mb-6">
            Ready to get started?
          </h2>
          <p className="text-xl text-green-100 mb-8 max-w-2xl mx-auto">
            Join thousands of clients and professionals already using ASAP
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              to="/register"
              className="bg-white text-green-600 px-8 py-4 rounded-full font-semibold text-lg hover:bg-gray-100 transition-colors shadow-lg"
            >
              Sign Up Now
            </Link>
            <Link
              to="/jobs/search"
              className="bg-transparent border-2 border-white text-white px-8 py-4 rounded-full font-semibold text-lg hover:bg-white/10 transition-colors"
            >
              Browse Professionals
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default HomePage;