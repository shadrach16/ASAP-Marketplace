import React from 'react';
import { Link } from 'react-router-dom';
import { Wrench } from 'lucide-react';
import authBg from '../../assets/images/hero-background.jpg'; // Assuming you have this from the auth pages

const OnboardingLayout = ({ children }) => {
  return (
    <div className="min-h-screen flex">
      {/* --- Left Side: Branding --- */}
      <div className="relative hidden lg:flex flex-col justify-between w-1/3 bg-gray-900 text-white p-8">
        {/* Background Image */}
        <div 
          className="absolute inset-0 bg-cover bg-center opacity-30"
          style={{ backgroundImage: `url(${authBg})` }}
        />
        {/* Content */}
        <div className="relative z-10">
         
          <h1 className="text-3xl font-bold mt-8 leading-tight">
            Let's build your
            <br />
            professional profile.
          </h1>
          <p className="text-lg text-gray-300 mt-4">
            Completing these steps will help clients find you and build trust.
          </p>
        </div>
        <div className="relative z-10 text-sm text-gray-400">
          &copy; {new Date().getFullYear()} ASAP. All rights reserved.
        </div>
      </div>

      {/* --- Right Side: Form Content --- */}
      <div className="w-full lg:w-2/3 flex items-center justify-center p-6 sm:p-12">
        <div className="w-full max-w-5xl">
          {/* Logo for Mobile */}
          <div className="lg:hidden mb-8 text-center">
            <Link to="/" className="flex justify-center items-center text-3xl font-bold text-primary">
              <Wrench className="w-8 h-8 mr-2" />
              <span>ASAP</span>
            </Link>
          </div>
          
          {/* Form steps will be rendered here */}
          <div className="bg-white p-6 sm:p-10    rounded-lg">
            {children}
          </div>
        </div>
      </div>
    </div>
  );
};

export default OnboardingLayout;