import React from 'react';
// You can add a logo component here later
// import Logo from '../common/Logo';

const AuthLayout = ({ title, children }) => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-background-light py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div>
          {/* <Logo className="mx-auto h-12 w-auto" /> */}
          <h2 className="mt-6 text-center text-3xl font-bold text-text-primary">
            {title}
          </h2>
        </div>
        <div className="bg-white p-8 shadow-md rounded-lg space-y-6">
          {children}
        </div>
      </div>
    </div>
  );
};

export default AuthLayout;