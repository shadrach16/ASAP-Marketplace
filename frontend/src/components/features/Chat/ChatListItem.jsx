// ChatListItem.jsx

import React from 'react';
import { MessageSquare, Clock } from 'lucide-react';

/**
 * Renders a single, professional chat list item.
 * @param {object} props
 * @param {object} props.chat - The chat/booking object.
 * @param {string} props.currentUserId - The ID of the current logged-in user.
 * @param {string} props.selectedId - The ID of the currently selected chat.
 * @param {function} props.onSelect - Callback when the item is clicked.
 */
const ChatListItem = ({ chat, currentUserId, selectedId, onSelect }) => {
    
    // --- CRITICAL FIX START ---
    // Safely determine the conversation partner, handling null references from deleted users
    const otherUserRaw = chat.client?._id === currentUserId ? chat.pro : chat.client;
    
    // Use an empty object fallback if the user is null, to prevent the crash
    const otherUser = otherUserRaw || { 
        name: 'Deleted User', 
        role: 'Unknown', 
        // Use a generic ID if needed, but here we just need fallback properties
    };
    // --- CRITICAL FIX END ---
    
    const isSelected = chat._id === selectedId;
    const isUnread = chat.unreadCount > 0;

    const lastMessageText = chat.lastMessage?.message || chat.jobTitle || "No messages yet.";
    const lastMessageTime = chat.lastMessage?.createdAt ? new Date(chat.lastMessage.createdAt).toLocaleDateString() : '';
    
    // Get sender's first initial for the avatar, or '?' for a deleted user
    const avatarInitial = otherUser.name[0] || '?';

    return (
        <div
            className={`flex items-center p-3 cursor-pointer transition-colors border-l-4 ${
                isSelected
                    ? 'bg-blue-50 border-blue-600'
                    : 'bg-white border-transparent hover:bg-gray-50'
            }`}
            onClick={() => onSelect(chat._id)}
        >
            {/* Avatar Placeholder */}
            <div className={`flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center text-sm font-semibold ${
                otherUserRaw ? 'bg-gray-200 text-gray-700' : 'bg-red-100 text-red-700' // Highlight deleted user
            }`}>
                {avatarInitial}
            </div>

            <div className="ml-3 flex-grow min-w-0">
                {/* Title and Unread Count */}
                <div className="flex justify-between items-start">
                    <p className={`font-semibold truncate ${isSelected ? 'text-blue-800' : 'text-gray-900'}`}>
                        {otherUser.name} <span className="text-xs font-normal text-gray-500">({otherUser.role})</span>
                        {/* Add a marker if the user is deleted */}
                        {!otherUserRaw && <span className="ml-1 text-red-500 font-normal">(Inactive)</span>}
                    </p>
                    {isUnread && (
                        <span className="flex items-center text-xs font-bold text-white bg-red-500 rounded-full px-2 py-0.5 ml-2">
                            {chat.unreadCount}
                        </span>
                    )}
                </div>

                {/* Last Message Snippet */}
                <p 
                    className={`text-sm mt-0.5 truncate ${isUnread ? 'font-medium text-gray-800' : 'text-gray-500'}`}
                >
                    {lastMessageText}
                </p>
            </div>

            {/* Time and Icon */}
            <div className="ml-2 flex-shrink-0 text-right">
                <p className="text-xs text-gray-400">{lastMessageTime}</p>
                <MessageSquare className="h-4 w-4 text-gray-300 mt-1 ml-auto" />
            </div>
        </div>
    );
};

export default ChatListItem;