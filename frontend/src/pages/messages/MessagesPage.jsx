// MessagesPage.jsx (Updated with URL parameter check)

import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { useLocation } from 'react-router-dom'; // 💡 NEW IMPORT
import { useAuth } from '../../hooks/useAuth';
import chatService from '../../services/chatService';
import ChatWindow from '../../components/features/ProjectWorkspace/ChatWindow';
import ChatListItem from '../../components/features/Chat/ChatListItem';
import { Loader2, MessageSquare, Inbox, BookOpen, Clock, Dot } from 'lucide-react';

// Define the tabs for filtering the chat list
const TABS = [
    { key: 'all', label: 'All Messages', icon: Inbox },
    { key: 'unread', label: 'Unread', icon: Dot },
    { key: 'active', label: 'Active Bookings', icon: BookOpen },
    { key: 'archived', label: 'Completed/Archived', icon: Clock }, 
];

/**
 * Main Messages Page component with a two-column layout:
 * Chat List (Left) and Chat Window (Right).
 */
const MessagesPage = () => {
    const { user } = useAuth();
    const location = useLocation(); // 💡 NEW HOOK CALL
    const [chatList, setChatList] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [selectedBookingId, setSelectedBookingId] = useState(null);
    const [activeTab, setActiveTab] = useState('all');

useEffect(() => {
        const params = new URLSearchParams(location.search);
        const urlBookingId = params.get('bookingId');
        const urlProposalId = params.get('proposalId'); // 💡 NEW

        if (urlBookingId) {
            // Priority 1: If bookingId is explicitly in URL, use it immediately
            setSelectedBookingId(urlBookingId);
        } else if (urlProposalId) {
            // Priority 2: If proposalId is in URL, resolve the booking ID
            const resolveBooking = async () => {
                try {
                    const booking = await chatService.getBookingByProposalId(urlProposalId);
                    
                    if (booking && booking._id) {
                        // Found booking, set it as selected
                        setSelectedBookingId(booking._id);
                    } else {
                        // Booking not found (e.g., proposal not accepted yet)
                        console.log(`Booking for proposal ${urlProposalId} does not exist yet.`);
                        // Keep selectedBookingId as null, showing the "Select a Conversation" message
                    }
                } catch (err) {
                    console.error("Failed to resolve booking by proposal ID:", err);
                    // Optionally set an error state here
                }
            };
            resolveBooking();
        }
        
        // IMPORTANT: We only want this effect to run when the URL changes.
    }, [location.search]);
    // --- Data Fetching ---
    const fetchChatList = useCallback(async () => {
        if (!user) return;
        setLoading(true);
        setError(null);
        try {
            const data = await chatService.getChatList();
            setChatList(data);
            
            // Auto-select the first chat IF no chat is selected (either by URL or click)
            if (data.length > 0 && !selectedBookingId) {
                // If selectedBookingId was set from the URL, this condition is false, 
                // preserving the URL selection. Otherwise, select the first chat.
                setSelectedBookingId(data[0]._id);
            }
        } catch (err) {
            setError(err.message || 'Failed to load your messages.');
        } finally {
            setLoading(false);
        }
    }, [user, selectedBookingId]);

    // --- Side effect for fetching list (runs on mount) ---
    useEffect(() => {
        fetchChatList();
    }, [fetchChatList]);

    // --- Side effect to mark chat as read when selectedBookingId changes ---
    useEffect(() => {
        if (!selectedBookingId) return;

        // Optimistically update the frontend list
        setChatList(prevList => 
            prevList.map(chat => 
                chat._id === selectedBookingId ? { ...chat, unreadCount: 0 } : chat
            )
        );

        // Call the backend service to mark the chat as read
        chatService.markChatAsRead(selectedBookingId).catch(err => {
            console.error('Failed to mark chat as read:', err);
            // Optionally, revert the optimistic update or show an error banner
        });

    }, [selectedBookingId]);


    // --- Filtering Logic ---
    const filteredChatList = useMemo(() => {
        return chatList.filter(chat => {
            switch (activeTab) {
                case 'unread':
                    return chat.unreadCount > 0; 
                case 'active':
                    return chat.status === 'active' || chat.status === 'in_progress' || chat.status === 'pending';
                case 'archived':
                    return chat.status === 'completed' || chat.status === 'cancelled';
                case 'all':
                default:
                    return true;
            }
        });
    }, [chatList, activeTab]);


    // --- Inner Component for Chat List Content ---
    const ChatListContent = () => {
        if (loading) {
            return (
                <div className="flex items-center justify-center h-full text-gray-500">
                    <Loader2 className="h-5 w-5 animate-spin mr-2" /> Loading chats...
                </div>
            );
        }

        if (error) {
            return (
                <div className="p-4 text-red-600 bg-red-50 font-medium">
                    <p>⚠️ Error loading chats: {error}</p>
                </div>
            );
        }

        // Check if the URL-selected ID is in the current filtered list, 
        // if not, it will still show ChatWindow, but the list won't highlight it.
        if (filteredChatList.length === 0 && !selectedBookingId) {
            return (
                <div className="p-8 text-center text-gray-500">
                    <MessageSquare className="h-10 w-10 mx-auto mb-3 text-gray-400" />
                    <p className="font-semibold">No messages found.</p>
                    <p className="text-sm">Try selecting a different filter tab.</p>
                </div>
            );
        }

        return (
            <div className="divide-y divide-gray-100">
                {filteredChatList.map(chat => (
                    <ChatListItem
                        key={chat?._id}
                        chat={chat}
                        currentUserId={user?._id}
                        selectedId={selectedBookingId}
                        onSelect={setSelectedBookingId}
                    />
                ))}
            </div>
        );
    };

    return (
        <div className="h-screen flex bg-gray-100 p-4 md:p-6 lg:p-8">
            <div className="flex w-full max-w-7xl mx-auto bg-white rounded-xl border overflow-hidden">
                
                {/* --- Left Panel: Chat List --- */}
                <div className="flex flex-col w-full md:w-96 border-r border-gray-200 bg-white flex-shrink-0">
                    
                    <div className="p-5 border-b border-gray-200">
                        <h1 className="text-2xl font-bold text-gray-800">Messages</h1>
                    </div>

                    {/* Tabs for Filtering (SCROLLABLE) */}
                  {/* Tabs for Filtering (SCROLLABLE FIX APPLIED HERE) */}
<div className="flex border-b border-gray-100 bg-gray-50 overflow-scroll custom-scroll ">
    {TABS.map(tab => {
        const isActive = activeTab === tab.key;
        return (
            <button
                key={tab.key}
                onClick={() => setActiveTab(tab.key)}
                // 'flex-shrink-0' is the key here. It prevents the button content from wrapping/shrinking,
                // forcing the container to scroll horizontally via 'overflow-x-auto'.
                className={`flex-shrink-0 flex items-center justify-center px-4 py-3 text-xs sm:text-sm font-medium transition-colors border-b-2 ${
                    isActive
                        ? 'text-primary-600 border-primary-600 bg-white'
                        : 'text-gray-500 border-transparent hover:bg-gray-100 hover:text-gray-700'
                }`}
            >
                <tab.icon className="h-4 w-4 mr-1 sm:mr-1.5" />
                <span className="truncate">{tab.label}</span>
                {/* Unread count badge for the 'unread' tab */}
                {tab.key === 'unread' && chatList.filter(c => c.unreadCount > 0).length > 0 && (
                    <span className="ml-1 sm:ml-2 text-xs font-bold text-white bg-red-500 rounded-full px-1.5 py-0.5">
                        {chatList.filter(c => c.unreadCount > 0).length}
                    </span>
                )}
            </button>
        );
    })}
</div>

                    {/* Chat List Content Area */}
                 <div className="flex-grow overflow-y-auto custom-scroll"> {/* 💡 Applied custom-scroll class */}
    <ChatListContent />
</div>
                </div>

                {/* --- Right Panel: Chat Window --- */}
                <div className="flex-grow flex flex-col">
                    {selectedBookingId ? (
                        <ChatWindow bookingId={selectedBookingId} />
                    ) : (
                        <div className="flex flex-col items-center justify-center h-full p-10 text-gray-500 bg-gray-50">
                            <MessageSquare className="h-12 w-12 text-gray-400 mb-4" />
                            <h2 className="text-xl font-semibold mb-2">Select a Conversation</h2>
                            <p className="text-center">Click on a chat thread on the left to start viewing and replying to messages.</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default MessagesPage;