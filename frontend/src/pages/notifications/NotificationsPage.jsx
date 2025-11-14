// src/pages/notifications/NotificationsPage.jsx

import React, { useState, useEffect, useCallback } from 'react';
import { Helmet } from 'react-helmet-async';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { Loader2, Bell, ArrowLeft, ArrowRight, CheckCircle, Clock,Dot  } from 'lucide-react';

import userService from '../../services/userService'; // Re-use the service
import Button from '../../components/common/Button'; // Assuming you have a Button component

// Helper component for time
const TimeAgo = ({ date }) => {
    const time = new Date(date).toLocaleString();
    return <span className="text-xs text-text-light">{time}</span>;
};

// Component for a single notification item on the page
const PageNotificationItem = ({ notification, onMarkRead }) => {
    const isUnread = !notification.isRead;
    const navigate = useNavigate();

    const handleClick = () => {
        // Mark read if necessary and navigate
        if (isUnread) {
            onMarkRead(notification._id);
        }
        if (notification.link && notification.link !== '#') {
            navigate(notification.link);
        }
    };

    return (
        <div
            onClick={handleClick}
            className={`flex items-start p-4 border-b border-border-light cursor-pointer transition duration-150 ease-in-out hover:bg-gray-50 
                ${isUnread ? 'bg-blue-50/50' : 'bg-white'}`}
        >
            {/* Icon (Optional - keep consistent with bell) */}
            <div className={`p-3 rounded-lg ${isUnread ? 'bg-primary-light text-primary' : 'bg-gray-100 text-text-secondary'} flex-shrink-0 mt-0.5`}>
                <Bell className="w-5 h-5" /> 
            </div>
            
            <div className="ml-4 flex-1 min-w-0">
                <p className={`text-base break-words ${isUnread ? 'font-semibold text-text-primary' : 'text-text-primary'}`}>
                    {notification.message}
                </p>
                <TimeAgo date={notification.createdAt} />
            </div>
            
            {/* Action button or unread indicator */}
            <div className="flex-shrink-0 ml-4 flex flex-col items-end space-y-2">
                {isUnread && (
                    <span className="text-sm font-medium text-red-600 flex items-center">
                        <Dot className="w-5 h-5 -ml-1 text-red-500" /> New
                    </span>
                )}
                {!isUnread && notification.link && (
                    <Link to={notification.link} className='text-sm text-primary hover:underline border p-2 rounded-md'>
                        View Details
                    </Link>
                )}
            </div>
        </div>
    );
};


const NotificationsPage = () => {
    const [notifications, setNotifications] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [unreadCount, setUnreadCount] = useState(0);
    const LIMIT = 15; // Notifications per page

    const fetchNotifications = useCallback(async (pageNumber) => {
        setLoading(true);
        setError(null);
        try {
            const data = await userService.getMyNotifications(pageNumber, LIMIT);
            setNotifications(data.data || []);
            setTotalPages(data.totalPages || 1);
            setUnreadCount(data.unreadCount || 0);
            setPage(data.currentPage || pageNumber);
        } catch (err) {
            setError(err.message || 'Failed to load notifications.');
            toast.error(err.message || 'Failed to load notifications.');
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchNotifications(page);
    }, [page, fetchNotifications]);

    // Handler for marking read (will update the local state)
    const handleMarkRead = async (notificationId) => {
        try {
            // Optimistic UI update
            setNotifications(prev => prev.map(n => n._id === notificationId ? { ...n, isRead: true } : n));
            setUnreadCount(prev => Math.max(0, prev - 1));

            // Send request to backend (don't block the UI)
            userService.markNotificationRead(notificationId)
                .catch(err => console.error("Failed to mark read on backend:", err));

        } catch (error) {
            toast.error("Error marking notification as read.");
        }
    };

    const handleMarkAllRead = async () => {
        setNotifications(prev => prev.map(n => ({ ...n, isRead: true })));
        setUnreadCount(0);
        try {
            await userService.markAllNotificationsRead();
            toast.success("All notifications marked as read.");
        } catch (error) {
            toast.error("Failed to mark all as read. Please try again.");
            // Re-fetch to revert to actual state on failure
            fetchNotifications(page); 
        }
    }


    return (
        <>
            <Helmet>
                <title>All Notifications</title>
            </Helmet>

            
            <div className="container mx-auto py-8 px-4 sm:px-6 lg:px-8">
                <div className="max-w-7xl mx-auto bg-white rounded-xl   border ">

                    {/* Action Bar */}
                    <div className="p-4 border-b border-border-light flex justify-between items-center bg-gray-50 rounded-t-xl">
                        <h2 className="text-xl font-semibold text-text-primary">
                            Inbox ({unreadCount} Unread)
                        </h2>
                        {unreadCount > 0 && (
                            <Button className='flex items-center justify-center' variant="secondary" onClick={handleMarkAllRead} disabled={loading || unreadCount === 0}>
                                <CheckCircle className='w-4 h-4 mr-2'/> Mark All Read
                            </Button>
                        )}
                    </div>


                    {loading ? (
                        <div className="p-12 text-center">
                            <Loader2 className="w-8 h-8 animate-spin text-primary mx-auto" />
                            <p className="mt-2 text-text-secondary">Loading notifications...</p>
                        </div>
                    ) : error ? (
                        <div className="p-8 text-center text-red-600 bg-red-50">
                            {error}
                        </div>
                    ) : notifications.length === 0 ? (
                        <div className="p-12 text-center text-text-secondary">
                            <Bell className='w-12 h-12 mx-auto text-gray-300 mb-3' />
                            <p className="text-lg">No notifications yet.</p>
                            <p className='text-sm mt-1'>We'll let you know when something important happens.</p>
                        </div>
                    ) : (
                        <>
                            {/* Notification List */}
                            <div className="divide-y divide-gray-100">
                                {notifications.map(notification => (
                                    <PageNotificationItem
                                        key={notification._id}
                                        notification={notification}
                                        onMarkRead={handleMarkRead}
                                    />
                                ))}
                            </div>

                            {/* Pagination */}
                            <div className="p-4 flex justify-between items-center border-t border-border-light">
                                <Button 
                                    onClick={() => setPage(prev => Math.max(1, prev - 1))}
                                    disabled={page === 1}
                                    variant="secondary" className='flex items-center justify-center'
                                >
                                    <ArrowLeft className="w-4 h-4 mr-2" /> Previous
                                </Button>
                                <span className="text-sm text-text-secondary">
                                    Page {page} of {totalPages}
                                </span>
                                <Button 
                                    onClick={() => setPage(prev => Math.min(totalPages, prev + 1))}
                                    disabled={page >= totalPages}
                                    variant="secondary"  className='flex items-center justify-center'
                                >
                                    Next <ArrowRight className="w-4 h-4 ml-2" />
                                </Button>
                            </div>
                        </>
                    )}
                </div>
            </div>
        </>
    );
};

export default NotificationsPage;