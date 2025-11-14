// src/components/features/Auth/LoginForm.js
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import FormInput from '../../common/FormInput';
import GoogleSignInButton from '../../common/GoogleSignInButton';
import Button from '../../common/Button';
import PasswordInput from '../../common/PasswordInput';
import { useAuth } from '../../../hooks/useAuth';
import { Mail, Lock,Loader2 } from 'lucide-react'; // Import icons

// ACCEPT redirectPath PROP
const LoginForm = ({ redirectPath = '/dashboard' }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      await login(email, password);
      
      // Use the redirectPath passed from LoginPage.jsx.
      // This path is either the original protected route OR the default ('/dashboard').
      navigate(redirectPath, { replace: true });

    } catch (err) {
      setError(err.message || 'Invalid email or password.');
      setLoading(false);
    }
  };

  const handleGoogleLogin = () => {
    // Implement your OAuth login logic here
    // e.g., window.location.href = 'http://localhost:5000/api/auth/google';
    console.log('Initiating Google Login...');
  };

  return (
    // Use a Fragment, the parent component provides the padding/margins
    <>
      {/* --- Social Logins (OAuth) --- */}
    

      {/* --- Email & Password Form --- */}
      <form className="space-y-6" onSubmit={handleSubmit}>
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
          // Assuming FormInput is modified to accept an icon prop
          // If not, this prop will just be ignored
          icon={<Mail className="w-5 h-5 text-gray-400" />}
        />
      

           <PasswordInput 
    id="password" 
    name="password" 
    label="Password" 
    value={password}
   onChange={(e) => setPassword(e.target.value)}
    required 
        autoComplete="current-password"
          placeholder="••••••••"
    disabled={loading}
/>



        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <input
              id="remember-me"
              name="remember-me"
              type="checkbox"
              className="h-4 w-4 text-primary border-border rounded focus:ring-primary-light"
              disabled={loading}
            />
            <label
              htmlFor="remember-me"
              className="ml-2 block text-sm text-text-secondary"
            >
              Remember me
            </label>
          </div>

          <div className="text-sm">
            <Link
              to="/forgot-password" // Ensure this route exists in App.jsx
              className="font-medium text-primary hover:underline"
            >
              Forgot your password?
            </Link>
          </div>
        </div>

        <div>
          <Button variant='primary' className='bg-blue-600 text-white '  type="submit" fullWidth disabled={loading}>
            {loading ? <span className='flex space-x-4   items-center justify-center'> Logging in... <Loader2 className="h-6 w-6 animate-spin text-primary mx-2" /> </span> : 'Log in'}
          </Button>
        </div>
      </form>

    
      {/* --- OR Separator --- */}
      <div className="relative my-6">
        <div className="absolute inset-0 flex items-center">
          <span className="w-full border-t border-border-light" />
        </div>
        <div className="relative flex justify-center text-sm">
          <span className="bg-white px-2 text-text-light">OR</span>
        </div>
      </div>
      <GoogleSignInButton />


    </>
  );
};

export default LoginForm;