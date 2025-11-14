import React from 'react';
import { Link } from 'react-router-dom';
import { CheckCircle, AlertTriangle, Clock, Loader2 } from 'lucide-react';
import Button from '../../common/Button'; // Assuming you have a reusable Button component

// --- Configuration Map for Statuses (Owner View) ---
const STATUS_CONFIG = {
    // 1. Initial State
    'pending': { 
        text: 'Verification Not Started', 
        icon: Clock, 
        color: 'blue', 
        action: 'Start Verification Process',
        details: 'Identity verification is required for compliance and trust.',
        isActionable: true,
    },
    // 2. Client-side Uploaded, Waiting for Provider Submission
    'submitted': { 
        text: 'Submission Received', 
        icon: Clock, 
        color: 'yellow',
        details: 'Your documents have been uploaded and are being prepared for external review.',
        isActionable: false,
    },
    // 3. Provider Processing
    'in_review': { 
        text: 'Identity Check In Progress', 
        icon: Loader2, 
        color: 'yellow', 
        isAnimated: true,
        details: 'Review typically takes 1-2 business days. Please wait.',
        isActionable: false,
    },
    // 4. Success
    'approved': { 
        text: 'KYC/Identity Verified', 
        icon: CheckCircle, 
        color: 'green',
        details: 'Your profile now displays a trusted verification badge.',
        isActionable: false,
    },
    // 5. Failure
    'rejected': { 
        text: 'Verification Failed', 
        icon: AlertTriangle, 
        color: 'red', 
        action: 'Re-submit Verification',
        details: 'The submission was rejected. Check your email for details on why.',
        isActionable: true,
    },
    // 6. Maintenance/Re-check Required
    'expired': { 
        text: 'Verification Expired', 
        icon: AlertTriangle, 
        color: 'red', 
        action: 'Re-submit Verification',
        details: 'Periodic re-verification is required to maintain compliance status.',
        isActionable: true,
    },
};

// Tailwind class map for consistency
const COLOR_CLASSES = {
    green: 'text-green-600 bg-green-50 border-green-200',
    yellow: 'text-yellow-700 bg-yellow-50 border-yellow-200',
    blue: 'text-blue-600 bg-blue-50 border-blue-200',
    red: 'text-red-600 bg-red-50 border-red-200',
};

// --- REDESIGNED Component: Compliance Status Card ---
const ComplianceStatusCard = ({ isOwner, status }) => {
    // Use 'pending' as the effective status if the status is null/undefined
    const effectiveStatus = status || 'pending';
    const config = STATUS_CONFIG[effectiveStatus];

    // --- Public View Logic ---
    if (!isOwner) {
        // Only show the card if the status is explicitly 'approved'
        if (effectiveStatus !== 'approved') {
            return null;
        }
        // Simplified Public Approved View
        return (
            <div className={`p-4 rounded-xl border ${COLOR_CLASSES.green} shadow-md`}>
                <div className="flex items-center gap-3">
                    <CheckCircle size={20} className='w-6 h-6' />
                    <h3 className="text-md font-bold">Identity Verified</h3>
                </div>
                <p className="text-xs mt-2 font-medium">This professional's identity has been successfully verified.</p>
            </div>
        );
    }
    
    // --- Owner View Logic ---
    if (!config) return null; // Fallback for unknown status

    const { text, icon, color, action, isAnimated, details, isActionable } = config;
    const finalColorClass = COLOR_CLASSES[color];

    return (
        <div className={`p-5 rounded-2xl border ${finalColorClass}   transition-all duration-300`}>
            {/* Header / Status Display */}
            <div className='flex items-start gap-3'>
                <div className={`p-2 rounded-full bg-white/70 flex-shrink-0 ${isAnimated ? 'animate-spin-slow' : ''}`}>
                    {React.createElement(icon, { size: 24, className: 'w-6 h-6' })}
                </div>
                <div>
                    <h3 className="text-lg font-bold">{text}</h3>
                    {details && <p className={`text-sm mt-1 font-medium`}>{details}</p>}
                </div>
            </div>

            {/* Action Button for Owner */}
            {isActionable && (
                <Link to='/pro/onboarding' className="block mt-4 w-full">
                    <Button fullWidth variant="primary" className='  text-sm font-semibold border-2 border-current hover:bg-gray-50'>
                        {action}
                    </Button>
                </Link>
            )}
        </div>
    );
};

export default ComplianceStatusCard;