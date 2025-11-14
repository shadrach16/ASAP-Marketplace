// src/pages/LoginPage.jsx
import React from 'react';
import { Link, useLocation } from 'react-router-dom'; // <-- ADD useLocation
import { Wrench } from 'lucide-react'; // Icon for branding
import LoginForm from '../components/features/Auth/LoginForm';
import authBg from '../assets/images/hero-background.jpg';


const LoginPage = () => {
  const location = useLocation(); // <-- GET LOCATION
  // Determine the redirect path from the state, defaulting to /dashboard
  const from = location.state?.from?.pathname || '/dashboard'; // <-- EXTRACT REDIRECT PATH

  return (
    <div className="min-h-screen flex">
      
      {/* --- Left Side: Branding & Sign Up CTAs --- */}
      <div className="relative hidden lg:flex flex-col justify-between w-1/2 bg-gray-900 text-white p-12">
        {/* Background Image */}
        <div 
          className="absolute inset-0 bg-cover bg-center opacity-30"
          style={{ backgroundImage: `url(${authBg})` }}
        />

        {/* Content */}
        <div className="relative z-10  font-bold">
          
          <h1 className="text-4xl font-bold mt-8 leading-tight sm:w-[80%]  ">
            Connecting Clients to Verified Professional Artisans.
          </h1>
          <p className="text-lg text-gray-300 mt-4">
            Your single platform for secure, compliant hiring of skilled trade professionals. 
          </p>
        </div>

        <div className="relative z-10 space-y-4">
          <p className="text-gray-300">Don't have an account?</p>
          <div className="flex space-x-4">
            <Link
              to="/register?role=client" // We can use query params to set the role on the register page
              className="flex-1 text-center  py-3 border border-transparent text-gray-900 font-medium rounded-md text-gray-800 bg-white hover:bg-gray-100  hover:text-green-600 "
            >
              Sign up as a Client 
            </Link>
            <Link
              to="/register?role=pro"
              className="flex-1 text-center   py-3 border border-gray-400 text-base font-medium rounded-md text-white hover:bg-white hover:text-green-600"
            >
              Sign up as a Trade Professional
            </Link>
          </div>
        </div>
      </div>

      {/* --- Right Side: Login Form --- */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-6 sm:p-12 bg-white">
        <div className="w-full max-w-md">
        

          
          <LoginForm redirectPath={from} /> {/* <-- PASS REDIRECT PATH */}

          {/* Mobile Sign up link */}
          <p className="lg:hidden text-center text-sm text-text-secondary mt-8">
            Don't have an account?{' '}
            <Link
              to="/register"
              className="font-medium text-primary hover:underline"
            >
              Sign up
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;