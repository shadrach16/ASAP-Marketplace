// src/pages/ForgotPasswordPage.jsx

import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Mail, Loader2, CheckCircle } from 'lucide-react';
import FormInput from '../components/common/FormInput';
import Button from '../components/common/Button';
import { toast } from 'sonner';
import authService from '../services/authService'; 

const ForgotPasswordPage = () => {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [error, setError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email) return;

    setError(null);
    setLoading(true);

    try {
      await authService.forgotPassword(email); 
      setIsSubmitted(true);
      toast.success(`Password reset link requested for ${email}. Check your email!`);
    } catch (err) {
      console.error(err);
      // Display generic success even on some API errors to prevent enumeration, but show error if known.
      setError(err.message || 'Failed to process request. Please try again.');
      toast.error(err.message || 'Failed to send reset link.');
    } finally {
      setLoading(false);
    }
  };

  if (isSubmitted) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-md w-full space-y-8 p-10 bg-white shadow-lg rounded-lg">
          <div className="text-center">
            <CheckCircle className="mx-auto h-12 w-12 text-green-500" />
            <h2 className="mt-6 text-3xl font-bold text-text-primary">
              Email Sent
            </h2>
            <p className="mt-2 text-text-secondary">
              If an account with that email exists, we've sent a password reset link. Please check your inbox and spam folder.
            </p>
          </div>
          <div className="mt-6 text-center text-sm">
            <Link to="/login" className="font-medium text-primary hover:underline">
              Return to Login
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8 p-10 bg-white shadow-lg rounded-lg">
        <div>
          <h2 className="mt-6 text-3xl font-bold text-text-primary text-center">
            Forgot Your Password?
          </h2>
          <p className="mt-2 text-text-secondary text-center text-sm">
            Enter your email address and we'll send you a link to reset your password.
          </p>
        </div>

        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          {error && (
            <div className="text-red-600 text-sm font-medium p-3 bg-red-50 rounded-md border border-red-200">
              {error}
            </div>
          )}
          <FormInput
            id="email"
            label="Email address"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            autoComplete="email"
            placeholder="you@example.com"
            disabled={loading}
            icon={<Mail className="w-5 h-5 text-gray-400" />}
          />

          <Button
            type="submit"
            variant="primary"
            fullWidth
            disabled={loading}
            className='bg-blue-600 text-white'
          >
            {loading ? (
              <span className='flex space-x-2 items-center justify-center'>
                Sending link... <Loader2 className="h-5 w-5 animate-spin" />
              </span>
            ) : (
              'Send Reset Link'
            )}
          </Button>
        </form>

        <div className="mt-6 text-center text-sm">
          <Link to="/login" className="font-medium text-primary hover:underline">
            Remember your password? Log in
          </Link>
        </div>
      </div>
    </div>
  );
};

export default ForgotPasswordPage;