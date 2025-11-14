import React, { useState, useEffect, useCallback } from 'react';
import { useAuth } from '../../hooks/useAuth';
import userService from '../../services/userService';
import FormInput from '../../components/common/FormInput';
import FormTextArea from '../../components/common/FormTextArea';
import Button from '../../components/common/Button';
import MultiSelectSkills from '../../components/common/MultiSelectSkills';
import { Helmet } from 'react-helmet-async';
import { toast } from 'sonner'; // Using sonner for feedback
import { User, Edit, Briefcase, Mail, Type, Text } from 'lucide-react'; // Icons

// Consistent input styling class (if not globally defined)
const inputStyle = "block w-full px-3 py-2 border border-border rounded-md shadow-sm placeholder-text-light focus:outline-none focus:ring-2 focus:ring-primary-light focus:border-transparent sm:text-sm disabled:opacity-70 disabled:bg-gray-100";

const ProfilePage = () => {
  const { user, updateUser, loading: authLoading } = useAuth();

  const [formData, setFormData] = useState({
    name: '', email: '', title: '', bio: '',
  });
  const [selectedSkills, setSelectedSkills] = useState([]);
  const [loading, setLoading] = useState(false); // Form submission loading
  const [error, setError] = useState(null);

  // Populate form state
  useEffect(() => {
    if (user) {
      setFormData({
        name: user.name || '',
        email: user.email || '',
        title: user.role === 'pro' ? (user.title || '') : '',
        bio: user.role === 'pro' ? (user.bio || '') : '',
      });
      setSelectedSkills(user.skills || []);
    }
  }, [user]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setError(null); // Clear error on change
  };

  const handleSkillsChange = useCallback((newSkills) => {
    setSelectedSkills(newSkills);
    setError(null); // Clear error on change
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const updateData = {
      name: formData.name.trim(),
      email: formData.email.trim(),
    };
    if (user?.role === 'pro') {
      updateData.title = formData.title.trim();
      updateData.bio = formData.bio.trim();
      updateData.skills = selectedSkills.map(s => s._id);
    }

    // Basic check if anything changed
    const isUnchanged =
         formData.name.trim() === user?.name &&
         formData.email.trim() === user?.email &&
         (user?.role !== 'pro' || (
             formData.title.trim() === (user?.title || '') &&
             formData.bio.trim() === (user?.bio || '') &&
             JSON.stringify(updateData.skills) === JSON.stringify(user?.skills?.map(s => s._id) || [])
         ));

    if (isUnchanged) {
        setLoading(false);
        toast.info("No changes detected.");
        return;
    }

    try {
      const updatedUserDataFromApi = await userService.updateMyProfile(updateData); //
      updateUser(updatedUserDataFromApi); // Update global context
      toast.success('Profile updated successfully!');
      // Update local skill state to match repopulated data
      setSelectedSkills(updatedUserDataFromApi.skills || []);
    } catch (err) {
      console.error("Profile update error:", err);
      const errMsg = err.message || 'Failed to update profile. Please try again.';
      setError(errMsg);
      toast.error(errMsg);
    } finally {
      setLoading(false);
    }
  };

  // Show loader only if the initial auth load is happening
  if (authLoading && !user) {
    return <div className="p-6 text-center text-text-secondary">Loading profile...</div>;
  }

  return (
    <>
      <Helmet>
        <title>My Info | Settings | ASAP Marketplace</title>
      </Helmet>

      {/* --- Main Form Content --- */}
      <form onSubmit={handleSubmit}>
        <div className="bg-white  rounded-xl overflow-hidden border border-border">
          {/* --- Basic Information Section --- */}
          <div className="p-6 md:p-8 border-b border-border-light">
            <h2 className="text-xl font-semibold text-text-primary mb-1 flex items-center">
               <User className="w-5 h-5 mr-2 text-primary"/> Basic Information
            </h2>
            <p className="text-sm text-text-secondary mb-6 border-b pb-4">Update your name and email address.</p>

            {error && (
              <div className="mb-4 text-red-600 text-sm font-medium p-3 bg-red-50 rounded-md border border-red-200">
                {error}
              </div>
            )}

            <div className="space-y-4">
               <FormInput
                 id="name" label="Full Name *" name="name"
                 value={formData.name} onChange={handleChange} required disabled={loading}
                 icon={<User size={16} className="text-gray-400"/>}
               />
               <FormInput
                 id="email" label="Email Address *" type="email" name="email"
                 value={formData.email} onChange={handleChange} required disabled={loading}
                 icon={<Mail size={16} className="text-gray-400"/>}
               />
            </div>
          </div>

          {/* --- Professional Details Section (Conditional) --- */}
          {user?.role === 'pro' && (
            <div className="p-6 md:p-8 border-b border-border-light">
               <h2 className="text-xl font-semibold text-text-primary mb-1 flex items-center">
                   <Briefcase className="w-5 h-5 mr-2 text-primary"/> Professional Details
               </h2>
               <p className="text-sm text-text-secondary mb-6">Showcase your expertise to potential clients.</p>
               <div className="space-y-4">
                  <FormInput
                    id="title" label="Your Title / Headline *" name="title"
                    value={formData.title} onChange={handleChange}
                    placeholder="e.g., Licensed Master Plumber"
                    disabled={loading} maxLength={100} required
                    icon={<Type size={16} className="text-gray-400"/>}
                  />
                  <FormTextArea
                    id="bio" label="Bio / Summary *" name="bio" rows={6}
                    value={formData.bio} onChange={handleChange}
                    placeholder="Tell clients about your experience, certifications, and what makes you a great pro..."
                    disabled={loading} maxLength={2000} required
                    icon={<Text size={16} className="text-gray-400"/>}
                  />
                  <div className="relative">
                      <MultiSelectSkills
                          selectedSkills={selectedSkills}
                          onChange={handleSkillsChange}
                          disabled={loading}
                      />
                  </div>
               </div>
            </div>
          )}

          {/* --- Form Footer --- */}
          <div className="bg-background-light px-6 py-4 text-right">
            <Button type="submit" variant="primary" disabled={loading || authLoading}>
              {loading ? 'Saving...' : 'Save Changes'}
            </Button>
          </div>
        </div>
      </form>

      {/* Optional: Add sections for Password Change, Account Deletion etc. here */}
      {/* <div className="bg-white shadow-lg rounded-xl border border-border mt-8 p-6 md:p-8"> ... </div> */}
    </>
  );
};

export default ProfilePage;