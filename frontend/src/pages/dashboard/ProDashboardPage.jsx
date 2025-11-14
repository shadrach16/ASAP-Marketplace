// src/pages/Dashboard/ProDashboardPage.jsx (NEW FILE)

import React, { useState, useEffect } from 'react';
import { Loader2,AlertTriangle,Clock  } from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';
import { Link } from 'react-router-dom';

// Import New Pro Dashboard Components
import DashboardHeader from '../../components/features/Dashboard/DashboardHeader';
import ProStatsCards from '../../components/features/Dashboard/ProStatsCards';
import MyWorkspacesList from '../../components/features/Dashboard/MyWorkspacesList';
import MyProposalsList from '../../components/features/Dashboard/MyProposalsList';
import PortfolioSection from '../../components/features/ProProfile/PortfolioSection';
import ServicesSection from '../../components/features/ProProfile/ServicesSection';

// Import Services
import proService from '../../services/proService'; //

const STATUS_CONFIG = {
    // 1. Initial State
    'pending': { 
        text: 'Verification Not Started', 
        action: 'Start Verification Process',
        details: 'Identity verification is required for compliance and trust.',
    },
    // 2. Client-side Uploaded, Waiting for Provider Submission
    'submitted': { 
        text: 'Submission Received', 
        details: 'Your documents have been uploaded and are being prepared for external review.',
    },
    // 3. Provider Processing
    'in_review': { 
        text: 'Identity Check In Progress', 
        isAnimated: true,
        details: 'Review typically takes 1-2 business days. Please wait.',
    },
    // 4. Success
    'approved': { 
        text: 'KYC/Identity Verified', 
        details: 'Your profile now displays a trusted verification badge.',
    },
    // 5. Failure
    'rejected': { 
        text: 'Verification Failed', 
        action: 'Re-submit Verification',
        details: 'The submission was rejected. Check your email for details on why.',
    },
    // 6. Maintenance/Re-check Required
    'expired': { 
        text: 'Verification Expired', 
        action: 'Re-submit Verification',
        details: 'Periodic re-verification is required to maintain compliance status.',
    },
};


const ProDashboardPage = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [proData, setProData] = useState(null);

const proId = user?._id

  const isOwnProfile = user && user.role === 'pro' ;
  const isComplianceApproved = user?.complianceStatus === 'approved'; // <--- NEW CONSTANT




  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        setLoading(true);
        // Fetch analytics data for the logged-in pro
        const data = await proService.getProAnalytics(); 
        setStats(data);
      } catch (err) {
        setError(err.message || "Failed to load dashboard analytics.");
      } finally {
        setLoading(false);
      }
    };

    fetchAnalytics();
  }, []);


  // Fetch profile data
  useEffect(() => {
    if (!proId) {
      setError("No profile ID specified.");
      setLoading(false);
      return;
    }
    const loadProfile = async () => {
      setLoading(true);
      setError(null);
      try {
        const data = await proService.getPublicProfile(proId); // Fetches name, bio, title, skills, portfolio, createdAt
        setProData(data);
      } catch (err) {
        console.error("Failed to load profile:", err);
        setError(err.message || 'Failed to load profile. The user may not exist or is not a professional.');
        setProData(null);
      } finally {
        setLoading(false);
      }
    };
    loadProfile();
  }, [proId]);

  
  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <>
      {/* Re-using DashboardHeader, but with pro-specific links */}
      <DashboardHeader
        userName={user?.name}
        primaryActionText="Find Work"
        primaryActionLink="/jobs/search"
      />
      <div className="container mx-auto py-6 px-4 sm:px-6 lg:px-8 space-y-6">
        {error && (
          <div className="text-red-600 p-3 bg-red-50 border border-red-200 rounded-md">
            {error}
          </div>
        )}

        {isOwnProfile && !isComplianceApproved && (
            <div className='p-4 bg-yellow-50 border border-yellow-200 rounded-lg flex items-start space-x-4  '>
                <AlertTriangle className='w-5 h-5 text-yellow-600 flex-shrink-0 mt-0.5' />
                <div>
                    <h3 className='text-md font-semibold text-yellow-800'>Compliance Check Required</h3>
                    <p className='text-sm text-yellow-700 mt-1'>
                        Your account compliance status is currently <strong>{user.complianceStatus.replace('_', ' ')}</strong>.  {STATUS_CONFIG[user?.complianceStatus]?.details}
                      <br />  
                       <Link to={user?.complianceStatus === 'in_review'? `/pros/${user._id}`:"/pro/onboarding"} 
                        className='text-yellow-800 border-yellow-600 no-underline font-medium underline ml-1 hover:text-gray-900 border p-2 w-52 mt-3 bg-secondary rounded-md block'>
                           {user?.complianceStatus === 'in_review'? "View Compliance Status":"Continue with Onboarding"}
                        </Link>
                    </p>
                </div>
            </div>
        )}


        {/* 1. Pro Stats Cards */}
        {stats && <ProStatsCards stats={stats} />}

        {/* 2. Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            {/* 3. My Workspaces (Active/Completed Bookings) */}
            <MyWorkspacesList />

    {/* --- Pass isOwnProfile --- */}

             <ServicesSection proId={proId} isOwnProfile={isOwnProfile} />

        {/* --- Pass isOwnProfile --- */}
        <PortfolioSection portfolioItems={proData?.portfolio || []} isOwnProfile={isOwnProfile} />

          </div>
          <div className="lg:col-span-1 space-y-6">
            {/* 4. My Proposals (Pending) */}
            <MyProposalsList />
          </div>
        </div>
      </div>
    </>
  );
};

export default ProDashboardPage;