// src/components/features/Dashboard/RecentActivity.js

import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
    Loader2, 
    MessageSquare, 
    FileText, 
    Bell, 
    Zap, // Added for high-priority/status
    CheckCircle // Added for completion/status
} from 'lucide-react';
import { formatDistanceToNow } from 'date-fns'; // Use date-fns for relative time
import userService from '../../../services/userService'; 
import { useAuth } from '../../../hooks/useAuth'; // Assuming useAuth exists to get user context

// --- Component: ActivityItem (Redesigned for Professional/GitHub look) ---
const ActivityItem = ({ notification }) => {
    const { user } = useAuth(); // Get current user for contextual messages
    const isClient = user?.role === 'client';

    let icon, primaryText, secondaryText, link;

    // Use entity titles and sender names if available
    const entityTitle = notification.entityId?.title || 'Unknown Job';
    const senderName = notification.senderId?.name || 'A User';
    const relativeTime = formatDistanceToNow(new Date(notification.createdAt), { addSuffix: true });

    switch (notification.type) {
        case 'NEW_PROPOSAL':
            icon = <FileText className="w-5 h-5 text-green-500" />;
            primaryText = `New proposal submitted on ${entityTitle}`;
            secondaryText = `by ${senderName}`;
            // Client links to job details/proposals
            link = `/jobs/${notification.entityId?._id}`; 
            break;
            
        case 'PROPOSAL_ACCEPTED':
            icon = <CheckCircle className="w-5 h-5 text-blue-600" />;
            primaryText = isClient 
                ? `You accepted a proposal on ${entityTitle}`
                : `Your proposal was accepted for ${entityTitle}!`;
            secondaryText = 'Project officially started.';
            // Both link to the new workspace (assuming entityId is the Job ID, and booking is accessible)
            link = `/jobs/${notification.entityId?._id}`; 
            break;

        case 'NEW_MESSAGE':
            icon = <MessageSquare className="w-5 h-5 text-gray-700" />;
            primaryText = `New message from ${senderName}`;
            secondaryText = notification.message || 'Check your messages.'; // Use actual message snippet if available
            link = `/messages/${notification.entityId}`; // e.g., entityId is chatRoomId
            break;
            
        case 'KYC_APPROVED':
            icon = <Zap className="w-5 h-5 text-purple-600" />;
            primaryText = 'Compliance check complete';
            secondaryText = 'Your account is now fully verified.';
            link = user?.role === 'pro' ? `/pros/${user._id}` : '/settings/compliance';
            break;

        default:
            icon = <Bell className="w-5 h-5 text-text-secondary" />;
            primaryText = notification.message || 'System Notification';
            secondaryText = 'Check the notifications page.';
            link = '/notifications';
    }

    return (
        <Link
            to={link}
            // GitHub-like styling: subtle border on hover, strong text, small timestamp
            className="flex items-start justify-between p-3 -mx-3 border-l-4 border-transparent transition-all duration-150 hover:bg-gray-50 hover:border-primary"
        >
            <div className="flex items-start">
                <div className="flex-shrink-0 pt-1">{icon}</div>
                <div className="ml-4">
                    <p className="text-sm font-medium text-text-primary">
                        {primaryText}
                    </p>
                    <p className="text-xs text-text-secondary mt-0.5">
                        {secondaryText}
                    </p>
                </div>
            </div>
            
            <span className="text-xs text-text-light whitespace-nowrap pt-1">
                {relativeTime}
            </span>
        </Link>
    );
};

// --- Component: RecentActivity (Redesigned Card Structure) ---
const RecentActivity = () => {
    const [notifications, setNotifications] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchActivity = async () => {
            try {
                // Fetch Page 1, Limit 5 from the user service
                // NOTE: userService.getMyNotifications must return data structured like: { data: [notifications], ...}
                const data = await userService.getMyNotifications(1, 5); 
                setNotifications(data.data || []);
            } catch (err) {
                console.error("Failed to fetch activity:", err);
                // Optionally show a toast error here
            } finally {
                setLoading(false);
            }
        };
        fetchActivity();
    }, []); 

    // GitHub Card Style: Border, slightly rounded corners
    return (
        <div className="bg-white border border-gray-200 rounded-xl overflow-hidden shadow-md"> 
            
            {/* Header: Stronger border separation */}
            <div className="p-4 border-b border-gray-200 flex justify-between items-center bg-gray-50">
                <h2 className="text-lg font-semibold text-gray-900 tracking-tight">
                    <Zap className="w-5 h-5 inline mr-2 text-primary" /> Recent Activity
                </h2>
                <Link 
                    to="/notifications" 
                    className="text-sm font-medium text-blue-600 hover:text-blue-800 transition-colors"
                >
                    View all
                </Link>
            </div>
            
            {/* Content Area */}
            <div className="p-4">
                {loading ? (
                    <div className="flex justify-center items-center py-6">
                        <Loader2 className="w-6 h-6 animate-spin text-blue-600" />
                    </div>
                ) : notifications.length === 0 ? (
                    <p className="text-text-secondary text-center py-6 text-sm">
                        <Bell className="w-5 h-5 inline mr-1 text-gray-400" /> All clear! No recent activity.
                    </p>
                ) : (
                    <div className="space-y-1 divide-y divide-gray-100">
                        {notifications.map((notif) => (
                            <ActivityItem key={notif._id} notification={notif} />
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default RecentActivity;