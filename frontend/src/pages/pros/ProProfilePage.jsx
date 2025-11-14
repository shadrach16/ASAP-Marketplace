import React, { useState, useEffect, useCallback } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { User, Edit, Briefcase, Layers, MessageSquare, Cog, CheckCircle, AlertTriangle, Clock } from 'lucide-react'; // Icons

// Import Child Sections (Ensure paths are correct)
import ReviewSection from '../../components/features/ProProfile/ReviewSection';
import TestimonialSection from '../../components/features/ProProfile/TestimonialSection';
import PortfolioSection from '../../components/features/ProProfile/PortfolioSection';
import ServicesSection from '../../components/features/ProProfile/ServicesSection';
import StarRating from '../../components/common/StarRating';
import Button from '../../components/common/Button';
import FullScreenLoader from '../../components/common/FullScreenLoader';
import ComplianceStatusCard from '../../components/features/ProProfile/ComplianceStatusCard';

import proService from '../../services/proService';
import { useAuth } from '../../hooks/useAuth';

 


// --- Main Pro Profile Page Component ---
const ProProfilePage = () => {
    const { proId } = useParams();
    const { user } = useAuth();
    const [proData, setProData] = useState(null);
    const [reviewSummary, setReviewSummary] = useState({ count: 0, average: 0 });
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // Assume proData might contain isKycVerified if the user is the owner
    const isOwnProfile = user && user.role === 'pro' && user._id === proId;

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
                // Ensure backend is fetching isKycVerified for the owner's profile view
                const data = await proService.getPublicProfile(proId);
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

    // Callback for ReviewSection to update summary
    const handleReviewSummary = (summary) => {
        setReviewSummary({ count: summary.count, average: summary.averageRating });
    };

    if (loading) {
        return <div className="min-h-[60vh] flex items-center justify-center"><FullScreenLoader /></div>;
    }

    if (error && !proData) {
        return <div className="container mx-auto py-10 text-center text-red-600">{error}</div>;
    }

    if (!proData) {
        return <div className="container mx-auto py-10 text-center text-text-secondary">Professional profile not found.</div>;
    }

    // SEO Meta Tags
    const pageTitle = `${proData.name || 'Professional'} ${proData.title ? `- ${proData.title}` : ''} | ASAP Marketplace`;
    const metaDescription = `Hire ${proData.name || 'a professional'} on ASAP Marketplace. ${proData.bio ? proData.bio.slice(0, 120) + '...' : `View their profile, services, portfolio, and reviews.`}`;
    const skillNames = proData.skills?.map(skill => skill.name) || [];

    return (
        <>
            <Helmet>
                <title>{pageTitle}</title>
                <meta name="description" content={metaDescription.slice(0, 160)} />
            </Helmet>

            <div className="bg-gray-50 pt-8 pb-12">
                <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl">
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">

                        {/* --- Left Sidebar (Sticky Profile Info & Actions) --- */}
                        <aside className="lg:col-span-1 space-y-6 lg:sticky lg:top-8"> 
                            
                            {/* Profile Header Card */}
                            <div className="bg-white p-8 rounded-2xl  border  text-center">
                                {/* Avatar Placeholder */}
                                <div className="w-28 h-28 rounded-full bg-gradient-to-br from-primary to-blue-400 mx-auto mb-5 flex items-center justify-center text-white text-5xl font-bold shadow-lg">
                                    {proData.name ? proData.name.charAt(0).toUpperCase() : <User size={50} />}
                                </div>
                                <h1 className="text-3xl font-extrabold text-text-primary mb-1">{proData.name}</h1>
                                {proData.title && <p className="text-lg text-text-secondary mb-3 font-medium">{proData.title}</p>}

                                {/* Review Summary */}
                                <div className="flex flex-col items-center justify-center gap-2 mb-4">
                                    {reviewSummary.count > 0 ? (
                                        <>
                                            <div className='flex items-center gap-1'>
                                                <StarRating rating={reviewSummary.average} size="md" />
                                                <span className="text-xl font-bold text-text-primary">{reviewSummary.average.toFixed(1)}</span>
                                            </div>
                                            <span className="text-sm text-text-light">({reviewSummary.count} reviews)</span>
                                        </>
                                    ) : (
                                        <span className="text-sm text-text-light italic">No reviews yet</span>
                                    )}
                                </div>
                                
                                {/* Member Since */}
                                <p className="text-xs text-text-light mt-4 pt-3 border-t border-gray-100">
                                    Joined: {new Date(proData.createdAt).toLocaleDateString(undefined, { year: 'numeric', month: 'long' })}
                                </p>
                            </div>

                            {/* --- Compliance Status Card (NEW) --- */}
                            <ComplianceStatusCard 
                                isOwner={isOwnProfile} 
                                status={proData.complianceStatus} 
                            />


                            {/* Action Buttons */}
                    {/*        <div className="space-y-3">
                                {!isOwnProfile && (
                                    <Link to={`/messages?userId=${proData._id}`} className='block'>
                                        <Button fullWidth variant="primary" className='flex space-x-3 justify-center items-center py-3'>
                                            <MessageSquare size={20} className='mr-3' /> Message {proData.name?.split(' ')[0] || 'Pro'}
                                        </Button>
                                    </Link>
                                )}
                            </div>*/}

                            {/* Edit Links for Owner */}
                            {isOwnProfile && (
                                <div className="bg-white p-4 rounded-xl  border   space-y-2">
                                    <h3 className="text-sm font-semibold text-text-secondary uppercase tracking-wider px-2 border-b pb-2 mb-2">My Profile Management</h3>
                                    <Link to="/settings/profile" className="flex items-center gap-3 px-3 py-2 rounded-lg text-text-primary hover:bg-gray-100 font-medium transition">
                                        <Cog size={18} /> Edit Info & Settings
                                    </Link>
                                    <Link to="/pro/settings/services" className="flex items-center gap-3 px-3 py-2 rounded-lg text-text-primary hover:bg-gray-100 font-medium transition">
                                        <Briefcase size={18} /> Manage Services
                                    </Link>
                                    <Link to="/pro/settings/portfolio" className="flex items-center gap-3 px-3 py-2 rounded-lg text-text-primary hover:bg-gray-100 font-medium transition">
                                        <Layers size={18} /> Manage Portfolio
                                    </Link>
                                </div>
                            )}
                        </aside>

                        {/* --- Main Content Area --- */}
                        <main className="lg:col-span-2 space-y-8">
                            
                            {/* Bio & Skills Card (About Me) */}
                            <div className="bg-white p-6 rounded-xl  border  ">
                                <h2 className="text-2xl font-bold text-text-primary mb-4 border-b pb-2">About Me</h2>
                                <p className="text-text-secondary mb-6 whitespace-pre-wrap leading-relaxed">{proData.bio || 'No biography provided. This professional should update their profile to give clients more insight.'}</p>

                                {skillNames.length > 0 && (
                                    <>
                                        <h3 className="text-xl font-bold text-text-primary mb-3 pt-4 border-t border-border-light">Expertise & Skills</h3>
                                        <div className="flex flex-wrap gap-3">
                                            {skillNames.map((skillName, index) => (
                                                <span key={index} className="px-4 py-2 bg-primary bg-opacity-10 text-primary-dark text-sm font-medium rounded-full shadow-sm hover:bg-opacity-20 transition">
                                                    {skillName}
                                                </span>
                                            ))}
                                        </div>
                                    </>
                                )}
                            </div>

                            {/* Services Section */}
                            <ServicesSection proId={proId} isOwnProfile={isOwnProfile} />

                            {/* Portfolio Section */}
                            <PortfolioSection portfolioItems={proData.portfolio || []} isOwnProfile={isOwnProfile} />

                            {/* Review Section */}
                            <ReviewSection proId={proId} onSummaryUpdate={handleReviewSummary} />

                            {/* Testimonial Section */}
                            <TestimonialSection proId={proId} />

                        </main>
                    </div>
                </div>
            </div>
        </>
    );
};

export default ProProfilePage;