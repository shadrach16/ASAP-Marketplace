import { toast } from 'sonner';
import React from 'react';
import Button from './Button';
import { useAuth } from '../../hooks/useAuth'; // Uses the new useAuth
import { Capacitor } from '@capacitor/core';
import { SocialLogin } from '@capgo/capacitor-social-login';
import authService from '../../services/authService'; // Import authService
import { cn } from '../../lib/utils';

export default function GoogleSignInButton({
  variant = 'default',
  size = 'default',
  className,
  children,
  id,
  onBeforeSignIn,
}) {
  // Use 'loadUserProfile' from the new AuthContext
  const { isAuthenticated, loadUserProfile } = useAuth(); 

  const handleGoogleSignIn = async () => {
    // 1. Call the onBeforeSignIn callback if it exists
    onBeforeSignIn?.();

    if (Capacitor.isNativePlatform()) {
      // --- Native Flow ---
      try {
        await SocialLogin.logout({ provider: 'google' });
      } catch (err) {
        console.warn('Error during pre-login logout:', err);
      }

      try {
        const googleUser = await SocialLogin.login({
          provider: 'google',
          options: { scopes: ['profile', 'email'] },
        });

        if (googleUser && googleUser.result?.idToken) {
          // --- UPDATED LOGIC ---
          try {
            // 1. Send Google token to your backend
            const backendResponse = await authService.googleLogin({
              token: googleUser.result.idToken,
            });

            // 2. Check for your app's token
            if (backendResponse && backendResponse.token) {
              // 3. Load user profile using the app token
              await loadUserProfile(backendResponse.token);

              // 4. Success toast and redirect
              const googleName = googleUser.result.profile.name || 'User';
              toast.success(`Welcome back, ${googleName}! 🎉`);
              const redirectStatus =
                localStorage.getItem('studio_status') === 'landing'
                  ? 'landing'
                  : 'upload';
              window.location.assign(`/?studio_status=${redirectStatus}`);
            } else {
              toast.error('Sign-in failed on the server.', {
                description: 'No session token received.',
              });
            }
          } catch (serverError) {
            // Handle errors from your backend (e.g., user not in DB)
            console.error('Backend Sign-In Error:', serverError);
            toast.error('Sign-in failed on the server.', {
              description: serverError.message || 'An error occurred.',
            });
          }
          // --- END UPDATED LOGIC ---
        } else {
          toast.info('Google sign-in was cancelled or returned no token.');
        }
      } catch (error) {
        console.error('Google Sign-In Error:', error);
        toast.error('Sign-in Failed', {
          description: `${error}`,
          duration: 4000,
        });
      }
    } else {
      // --- Web Flow (Unchanged) ---
      const clientId = import.meta.env.VITE_GOOGLE_CLIENT_ID;
      if (!clientId) {
        toast.error('Configuration Error', {
          description: 'Google Client ID is not configured.',
        });
        return;
      }

      const oauth2Endpoint = 'https://accounts.google.com/o/oauth2/v2/auth';
      const params = {
        client_id: clientId,
        redirect_uri: `${window.location.origin}/auth/callback`,
        response_type: 'id_token',
        scope: 'openid profile email',
        nonce: `nonce-${Math.random()}`,
        prompt: 'select_account',
      };
      const url = `${oauth2Endpoint}?${new URLSearchParams(params)}`;

      // Call onBeforeSignIn for web flow too
      onBeforeSignIn?.();

      window.location.assign(url);
    }
  };

  if (isAuthenticated) {
    return null;
  }

  return (
    <Button
      id={id}
      variant={variant}
      size={size}  
      onClick={handleGoogleSignIn}
         className={cn("flex items-center space-x-4 items-center justify-center py-2 border w-full ", className)}

    >
      <svg
        className="w-4 h-4"
        viewBox="-0.5 0 48 48"
        version="1.1"
        xmlns="http://www.w3.org/2000/svg"
        fill="#000000"
      >
        <g stroke="none" strokeWidth="1" fill="none" fillRule="evenodd">
          
          <path
            d="M9.827,24 C9.827,22.476 10.08,21.014 10.532,19.644 L2.623,13.604 C1.082,16.734 0.214,20.26 0.214,24 C0.214,27.737 1.081,31.261 2.62,34.388 L10.525,28.337 C10.077,26.973 9.827,25.517 9.827,24"
            fill="#FBBC05"
          ></path>
          <path
            d="M23.714,10.133 C27.025,10.133 30.016,11.307 32.366,13.227 L39.202,6.4 C35.036,2.773 29.695,0.533 23.714,0.533 C14.427,0.533 6.445,5.844 2.623,13.604 L10.532,19.644 C12.355,14.112 17.549,10.133 23.714,10.133"
            fill="#EB4335"
          ></path>
          <path
            d="M23.714,37.867 C17.549,37.867 12.355,33.888 10.532,28.356 L2.623,34.395 C6.445,42.156 14.427,47.467 23.714,47.467 C29.445,47.467 34.918,45.431 39.025,41.618 L31.518,35.814 C29.4,37.149 26.732,37.867 23.714,37.867"
            fill="#34A853"
          ></path>
          <path
            d="M46.145,24 C46.145,22.613 45.932,21.12 45.611,19.733 L23.714,19.733 L23.714,28.8 L36.318,28.8 C35.688,31.891 33.972,34.268 31.518,35.814 L39.025,41.618 C43.339,37.614 46.145,31.649 46.145,24"
            fill="#4285F4"
          ></path>
        </g>
      </svg>
      <span>{children || 'Sign in with Google'}</span>
    </Button>
  );
}