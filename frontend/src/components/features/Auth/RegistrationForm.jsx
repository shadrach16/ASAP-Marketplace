import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import FormInput from '../../common/FormInput';
import PasswordInput from '../../common/PasswordInput';
import Button from '../../common/Button';
import { useAuth } from '../../../hooks/useAuth';
import { Loader2 } from 'lucide-react'; // Import icons

const RegistrationForm = ({defaultRole}) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  // NEW: State for password confirmation
  const [confirmPassword, setConfirmPassword] = useState(''); 
  const [role, setRole] = useState(defaultRole); // Default role
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const { register } = useAuth(); // Get register function
  const navigate = useNavigate(); // Get navigate function

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    // NEW VALIDATION: Check if passwords match
    if (password !== confirmPassword) {
      setError('Passwords do not match.');
      setLoading(false);
      return;
    }

    if (password.length < 6) {
      setError('Password must be at least 6 characters long.');
      setLoading(false);
      return;
    }

    try {
      // 1. Call the register function
      await register(name, email, password, role);
      
      // 2. Introduce a 4-second delay before navigation
      setTimeout(() => {
        if (role === 'client') {
          // Client: Redirect to login page to sign in
          navigate('/login?registered=true');
        } else {
          // Pro: Show success message, then redirect to onboarding page
          toast.success(
            'Account Created! Check your email to verify your address and start the compliance onboarding process.',
            { 
              duration: 8000, // Keep the message visible for 8 seconds
              position: 'top-center'
            }
          );
          navigate('/pro/onboarding'); 
        }
      }, 4000); // 4000 milliseconds (4 seconds)

      // IMPORTANT: Do NOT set setLoading(false) here, as it would stop the spinner immediately.
      // The spinner will remain visible until navigation unmounts this component.
      
    } catch (err) {
      // Only stop loading and show error on failure
      setError(err.message || 'An unknown error occurred.');
      setLoading(false); 
    }
  };

  return (
    <form className="space-y-6" onSubmit={handleSubmit}>
      {error && (
        <div className="text-red-600 text-sm font-medium p-3 bg-red-50 rounded-md border border-red-200">
          {error}
        </div>
      )}

      <FormInput
        id="name"
        label="Full Name"
        type="text"
        value={name}
        onChange={(e) => setName(e.target.value)}
        required
        autoComplete="name"
        placeholder="John Doe"
        disabled={loading}
      />
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
      />
 


     <PasswordInput 
    id="password" 
    name="password" 
    label="Password" 
    value={password} 
    onChange={(e) => setPassword(e.target.value)}
    required 
    placeholder="Enter a secure password"
    disabled={loading}
/>

<PasswordInput 
    id="confirmPassword" 
    name="confirmPassword" 
    label="Confirm Password" 
     value={confirmPassword}
        onChange={(e) => setConfirmPassword(e.target.value)}
    required 
    placeholder="Repeat your password"
    disabled={loading}
/>
      {/* END NEW INPUT */}

      {/* UPDATED: Disable if loading OR if defaultRole is set */}
      <fieldset disabled={loading || !!defaultRole}>
        <legend className="block text-sm font-medium text-text-secondary">
          I am a:
        </legend>
        <div className="mt-2 flex gap-6">
          <div className="flex items-center">
            <input
              id="role-client"
              name="role"
              type="radio"
              value="client"
              checked={role === 'client'}
              onChange={(e) => setRole(e.target.value)}
              className="h-4 w-4 text-primary border-border focus:ring-primary-light"
            />
            <label
              htmlFor="role-client"
              className="ml-2 block text-sm text-text-primary"
            >
              Client (Hiring)
            </label>
          </div>
          <div className="flex items-center">
            <input
              id="role-pro"
              name="role"
              type="radio"
              value="pro"
              checked={role === 'pro'}
              onChange={(e) => setRole(e.target.value)}
              className="h-4 w-4 text-primary border-border focus:ring-primary-light"
            />
            <label
              htmlFor="role-pro"
              className="ml-2 block text-sm text-text-primary"
            >
              Pro (Working)
            </label>
          </div>
        </div>
      </fieldset>

      <div>
        <Button type="submit" variant='primary' className='bg-blue-600 text-white ' fullWidth disabled={loading}>
          {loading ?  <span className='flex space-x-4   items-center justify-center'> Creating account... <Loader2 className="h-6 w-6 animate-spin text-primary mx-2" /> </span>  : 'Create Account'}
        </Button>
      </div>
    </form>
  );
};

export default RegistrationForm;