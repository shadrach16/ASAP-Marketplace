import React from 'react';
import { Link } from 'react-router-dom';
import { Wrench } from 'lucide-react'; // Icon for branding
import RegistrationForm from '../components/features/Auth/RegistrationForm';
 import authBg from '../assets/images/hero-background.jpg';
 
import { useQuery } from '../hooks/useQuery';

const RegisterPage = () => {

const query = useQuery();

  return (
    <div className="min-h-screen flex">
      
      {/* --- Left Side: Branding & Log in CTA --- */}
      <div className="relative hidden lg:flex flex-col justify-between w-1/2 bg-gray-900 text-white p-12">
        {/* Background Image */}
        <div 
          className="absolute inset-0 bg-cover bg-center opacity-30"
          style={{ backgroundImage: `url(${authBg})` }}
        />

        {/* Content */}
        <div className="relative z-10">
       
          <h1 className="text-4xl font-bold mt-8 leading-tight">
            Join the #1 Platform for Artisans Trade Professionals.
          </h1>
          <p className="text-lg text-gray-300 mt-4">
            Whether you're looking to hire for a project or find your next job, get started today.
          </p>
        </div>

        <div className="relative flex space-between items-center w-full " style={{justifyContent:'space-between'}}>
          <p className="text-gray-300">Already have an account?</p>
          <Link
            to="/login"
            className="  text-center px-6 py-3 border border-transparent text-green-700 font-medium rounded-md text-primary bg-white hover:bg-gray-100"
          >
            Log in
          </Link>
        </div>
      </div>

      {/* --- Right Side: Registration Form --- */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-6 sm:p-12 bg-white">
        <div className="w-full max-w-md">
          {/* Logo for Mobile */}
          <div className="lg:hidden mb-8 text-center">
            <Link to="/" className="flex justify-center items-center text-3xl font-bold text-primary">
              <span>Asap</span>
            </Link>
          </div>

          <h2 className="text-2xl sm:text-3xl font-bold text-text-primary mb-6">
            Join as a  <span className='text-green-600 font-bold'> {query.get('role') === 'pro' ?"Professional":"Client"} </span>
          </h2>
          
          <RegistrationForm defaultRole={query.get('role')} />

          {/* Mobile Log in link */}
          <p className="lg:hidden text-center text-sm text-text-secondary mt-8">
            Already have an account?{' '}
            <Link
              to="/login"
              className="font-medium text-primary hover:underline"
            >
              Log in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;