// src/components/common/NotificationBell.jsx

import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useSocket } from '../../contexts/SocketContext';
import { useAuth } from '../../contexts/AuthContext';
import userService from '../../services/userService';
import { Bell, Loader2, CheckCircle, Clock, Dot } from 'lucide-react'; // Updated icons

// Helper function for time display (using an external library like date-fns would be ideal, 
// but we'll use a simple placeholder for now)
const TimeAgo = ({ date }) => {
    const time = new Date(date).toLocaleString();
    return <span className="text-xs text-text-light">{time}</span>;
};

// Notification Item Component within Dropdown
const NotificationItem = ({ notification, onMarkRead }) => {
    const navigate = useNavigate();

    const handleMarkAndNavigate = (e) => {
        // Prevent default navigation to handle marking read first
        e.preventDefault();

        // Mark read and then navigate
        if (!notification.isRead) {
            onMarkRead(notification._id, notification.link);
        } else if (notification.link && notification.link !== '#') {
             // If already read, just navigate
            navigate(notification.link);
        }
        // If already read and no link, do nothing.
    };

    const isUnread = !notification.isRead;

    return (
        <a
            href={notification.link || '#'}
            onClick={handleMarkAndNavigate}
            className={`flex items-start p-4 transition duration-150 ease-in-out border-b border-border-light  hover:bg-gray-100
                ${isUnread ? 'bg-blue-50/50 hover:bg-blue-100/70' : 'bg-white'} cursor-pointer`}
            role="menuitem"
        >
            {/* Icon Placeholder (can be customized based on notification type) */}
            <div className={`p-2 rounded-full ${isUnread ? 'bg-primary-light text-primary' : 'bg-gray-100 text-text-secondary'} flex-shrink-0 mt-0.5`}>
                <Bell className="w-4 h-4" /> 
            </div>
            
            <div className="ml-3 flex-1 min-w-0">
                <p className={`text-sm break-words ${isUnread ? 'font-medium text-text-primary' : 'text-text-secondary'}`}>
                    {notification.message}
                </p>
                <TimeAgo date={notification.createdAt} />
            </div>
            
            {/* Unread Indicator Dot */}
            {isUnread && (
                 <Dot className="w-6 h-6 text-red-500 flex-shrink-0" />
            )}
        </a>
    );
};


// Main Bell Component
const NotificationBell = () => {
    const { user } = useAuth();
    const { socket, isConnected } = useSocket();
    const [isOpen, setIsOpen] = useState(false);
    const [notifications, setNotifications] = useState([]);
    const [unreadCount, setUnreadCount] = useState(0);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const dropdownRef = useRef(null);
    const navigate = useNavigate();

    const loadNotifications = useCallback(async () => {
        if (!user) return;
        setLoading(true);
        setError(null);
        try {
            // Fetch recent 10 notifications
            const data = await userService.getMyNotifications(1, 10); 
            setNotifications(data.data || []);
            setUnreadCount(data.unreadCount || 0);
        } catch (error) {
            console.error("Failed to fetch notifications:", error);
            setError("Couldn't load notifications.");
        } finally {
            setLoading(false);
        }
    }, [user]);

    useEffect(() => {
        loadNotifications();
    }, [loadNotifications]);

    // WebSocket Listeners
    useEffect(() => {
        if (socket && isConnected) {
            const handleNewNotification = ({ notification, unreadCount: newCount }) => {
                setNotifications(prev => [notification, ...prev.filter(n => n._id !== notification._id)].slice(0, 10));
                setUnreadCount(newCount); 
            };
            const handleUpdateUnreadCount = ({ unreadCount: newCount }) => {
                 setUnreadCount(newCount); 
            };

            socket.on('newNotification', handleNewNotification);
            socket.on('updateUnreadCount', handleUpdateUnreadCount);

            return () => {
                socket.off('newNotification', handleNewNotification);
                socket.off('updateUnreadCount', handleUpdateUnreadCount);
            };
        }
    }, [socket, isConnected]); 

    // Close dropdown on outside click
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (isOpen && dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setIsOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, [isOpen]); 

    // Mark a single notification as read
    const handleMarkRead = async (notificationId, link) => {
          try {
              const wasUnread = notifications.find(n => n._id === notificationId)?.isRead === false;
              
              // Optimistic UI update
              setNotifications(prev => prev.map(n => n._id === notificationId ? { ...n, isRead: true } : n));
              if (wasUnread) {
                  setUnreadCount(prev => Math.max(0, prev - 1));
              }

              // Send request to backend
              userService.markNotificationRead(notificationId)
                .catch(err => {
                    console.error("Failed to mark notification read on backend:", err);
                    // In a real app, you might revert the UI change here or use toast.error
                });

              // Navigate if a link was provided
              if (link && link !== '#') {
                  setIsOpen(false); 
                  navigate(link);
              }
          } catch (error) {
              console.error("Client-side error marking notification read:", error);
          }
    };

    // Mark all notifications as read
    const handleMarkAllRead = async () => {
        try {
             // Optimistic UI update
             setNotifications(prev => prev.map(n => ({ ...n, isRead: true })));
             setUnreadCount(0);

             // Send request to backend
             userService.markAllNotificationsRead()
                 .catch(err => {
                     console.error("Failed to mark all read on backend:", err);
                 });
        } catch (error) {
             console.error("Client-side error marking all read:", error);
        }
    };

    return (
        <div className="relative z-40" ref={dropdownRef}>
            {/* Bell Button */}
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="relative p-2 rounded-full text-gray-500 bg-gray-100 hover:bg-gray-200 hover:text-gray-700 transition duration-150 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-light"
                aria-label="View notifications"
                aria-haspopup="true"
                aria-expanded={isOpen}
            >
                <Bell className="w-6 h-6" />
                {/* Unread Count Badge */}
                {unreadCount > 0 && (
                    <span className="absolute -top-1 -right-1 block h-5 w-5 rounded-full ring-2 ring-white bg-red-600 text-white text-[12px] leading-none font-bold flex items-center justify-center p-0.5 pointer-events-none transform scale-90">
                        {unreadCount > 9 ? '9+' : unreadCount}
                    </span>
                )}
            </button>

            {/* Dropdown Panel */}
            {isOpen && (
                <div 
                    className="origin-top-right absolute right-0 mt-3 w-80 md:w-96 max-h-[70vh] flex flex-col rounded-xl shadow-2xl bg-white ring-1 ring-black ring-opacity-5 focus:outline-none transform transition-all duration-300"
                    style={{ transformOrigin: 'top right' }}
                >
                    {/* Header */}
                    <div className="p-4 border-b border-border-light flex justify-between items-center flex-shrink-0">
                        <h3 className="text-lg font-bold text-text-primary">Notifications</h3>
                        {unreadCount > 0 && (
                             <button 
                                onClick={handleMarkAllRead} 
                                className="text-xs text-primary font-medium hover:text-primary-dark transition disabled:opacity-50 disabled:cursor-not-allowed" 
                                disabled={loading || unreadCount === 0}
                            >
                                <CheckCircle className='w-4 h-4 inline-block mr-1'/> Mark all as read
                            </button>
                        )}
                    </div>
                    
                    {/* Body (Scrollable) */}
                    <div className="flex-grow overflow-y-auto divide-y divide-gray-100" role="menu" aria-orientation="vertical">
                        {loading && <p className="p-4 text-center text-sm text-text-light"><Loader2 className='w-4 h-4 inline-block animate-spin mr-2'/> Loading...</p>}
                        {error && <p className="p-4 text-center text-sm text-red-500">{error}</p>}
                        {!loading && !error && notifications.length === 0 && <p className="p-4 text-center text-sm text-text-secondary">You're all caught up!</p>}
                        {!loading && !error && notifications.length > 0 && (
                            notifications.map(notification => (
                                <NotificationItem
                                    key={notification._id}
                                    notification={notification}
                                    onMarkRead={handleMarkRead}
                                />
                            ))
                        )}
                    </div>

                    {/* Footer */}
                    <div className="p-3 border-t border-border-light text-center flex-shrink-0">
                        <Link 
                            to="/notifications" 
                            onClick={() => setIsOpen(false)} 
                            className="text-sm text-primary font-medium hover:underline flex items-center justify-center"
                        >
                            View All Notifications
                        </Link>
                    </div>
                </div>
            )}
        </div>
    );
};

export default NotificationBell;