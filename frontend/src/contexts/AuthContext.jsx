import React, { createContext, useState, useEffect, useCallback, useContext } from 'react';
import authService from '../services/authService';
import userService from '../services/userService'; // Using userService for profile actions
import api from '../services/api'; // Axios instance
import { toast } from 'sonner';

// Create Context
export const AuthContext = createContext(null);

// Custom Hook to use Auth Context
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

// Auth Provider Component
export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null); // Holds user object: { _id, name, email, role, token, credits?, skills?, title?, bio?, notificationPreferences?, ... }
  const [loading, setLoading] = useState(true); // Tracks initial authentication check

  // Function to load user profile after login or on initial load
  const loadUserProfile = useCallback(async (token) => {
     setLoading(true); // Indicate loading profile data
     try {
        // Set auth header for the profile request
        api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
        const profileData = await userService.getMyProfile(); // Fetches full profile including prefs, skills etc.
 
        // Ensure preferences are stored conveniently (e.g., as a plain object)
        const prefsObject = profileData.notificationPreferences
            ? profileData.notificationPreferences // Convert Map if backend sends Map
            : {}; // Default empty object

        // Combine token with detailed profile data
        const userData = {
            ...profileData, // Contains _id, name, email, role, credits, skills (populated), title, bio etc.
            notificationPreferences: prefsObject, // Store as plain object
            token: token // Add the token
         };

        setUser(userData);
        localStorage.setItem('user', JSON.stringify(userData)); // Store full user data
        api.defaults.headers.common['Authorization'] = `Bearer ${token}`; // Ensure header persists

      } catch (error) {
          console.error("Failed to load user profile:", error);
          // If profile fetch fails after login/token exists, log out
          setUser(null);
          localStorage.removeItem('user');
          delete api.defaults.headers.common['Authorization'];
      } finally {
          setLoading(false); // Finished loading profile attempt
      }
  }, []); // No dependencies needed here as it relies on passed token

  // Check storage on initial app mount
  useEffect(() => {
    let isMounted = true; // Prevent state update on unmounted component
    const initializeAuth = async () => {
        setLoading(true); // Start initial loading
        try {
            const storedUserString = localStorage.getItem('user');
            if (storedUserString) {
                const storedUserData = JSON.parse(storedUserString);
                if (storedUserData?.token) {
                    // Validate token/Fetch fresh profile instead of just trusting localStorage
                    await loadUserProfile(storedUserData.token);
                } else {
                    // Clear invalid stored data
                    localStorage.removeItem('user');
                }
            }
        } catch (error) {
            console.error('Auth initialization error', error);
            localStorage.removeItem('user'); // Clear potentially corrupted storage
        } finally {
            // Set loading false only if component is still mounted
            if (isMounted) setLoading(false);
        }
    };
    initializeAuth();
    // Cleanup function to set isMounted to false
    return () => { isMounted = false; };
  }, [loadUserProfile]); // loadUserProfile is stable due to useCallback

  // Login function
  const login = useCallback(async (email, password) => {
    setLoading(true); // Indicate activity
    try {
      const loginData = await authService.login({ email, password });
      // After successful login, fetch the full profile
      await loadUserProfile(loginData.token);
      // setLoading(false) is handled by loadUserProfile
      return loginData; // Return data if needed by caller
    } catch (error) {
      console.error('Login failed:', error);
              toast.error(error.message);
      setLoading(false); // Stop loading on error
      throw error; // Re-throw to be caught by the form
    }
  }, [loadUserProfile]);

  // Register function
  const register = useCallback(async (name, email, password, role) => {
    setLoading(true);
    try {
      // Register just creates the user
      const registrationData = await authService.register({ name, email, password, role });
      // Optionally auto-login after registration:
      // await login(email, password);
      return registrationData; // Return registration response if needed
    } catch (error) {
      console.error('Registation failed:', error);
          toast.error(error.message);
      throw error; // Re-throw for form feedback
    } finally {
        setLoading(false); // Stop loading after attempt
    }
  }, []); // Removed login dependency if not auto-logging in

  // Logout function
  const logout = useCallback(() => {
    setUser(null);
    localStorage.removeItem('user');
    delete api.defaults.headers.common['Authorization'];
    // Optionally redirect here or handle in component calling logout
  }, []);

  // Update user state after profile edit (receives API response)
  const updateUser = useCallback((updatedApiData) => {
    setUser((prevUser) => {
      if (!prevUser) return null;
      // Merge updated data with existing state (keeping token etc.)
      const newUserState = {
        ...prevUser, // Keep token, prefs (unless updated separately)
        name: updatedApiData.name,
        email: updatedApiData.email,
        // Update pro-specific fields if they exist in the response
        ...(updatedApiData.role === 'pro' && {
            title: updatedApiData.title,
            bio: updatedApiData.bio,
            skills: updatedApiData.skills, // Assumes API returns populated skills
        }),
        // Ensure credits are updated if API returns them
        credits: updatedApiData.credits ?? prevUser.credits,
      };
      localStorage.setItem('user', JSON.stringify(newUserState));
      return newUserState;
    });
  }, []);

  // Update notification preferences
  const updatePreferences = useCallback(async (newPreferences) => {
     if (!user) throw new Error("User not logged in");
     try {
        const updatedPrefsMapOrObject = await userService.updateMyNotificationPreferences(newPreferences);
        // Ensure it's a plain object for consistency in state/storage
        const prefsObject = updatedPrefsMapOrObject instanceof Map
            ? Object.fromEntries(updatedPrefsMapOrObject)
            : updatedPrefsMapOrObject;

        setUser(prevUser => {
            const newUser = { ...prevUser, notificationPreferences: prefsObject };
            localStorage.setItem('user', JSON.stringify(newUser));
            return newUser;
        });
        return prefsObject; // Return updated prefs
     } catch (error) {
         console.error("Failed to update preferences:", error);
         throw error; // Re-throw for UI feedback
     }
  }, [user]); // Depend on user


  // Value provided by the context
  const value = {
    user, // The authenticated user object (or null)
    loading, // Boolean indicating if initial auth check is happening
    isAuthenticated: !!user, // Convenience boolean
    login,
    register,
    logout,
    updateUser, // Function to update user state after profile edit
    updatePreferences, // Function to update notification preferences
    reloadProfile: () => user ? loadUserProfile(user.token) : Promise.resolve(), // Function to manually refresh profile
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};