import { useState, useEffect, useRef, useCallback } from 'react';
import { io } from 'socket.io-client';
import { useAuth } from './useAuth';
import chatService from '../services/chatService';

const SOCKET_URL = import.meta.env.VITE_SOCKET_URL || 'http://localhost:5000';

export const useChat = (bookingId) => {
  const { user } = useAuth();
  const [messages, setMessages] = useState([]);
  const [isConnected, setIsConnected] = useState(false);
  const [error, setError] = useState(null);
  const socketRef = useRef(null);

  // Function to add a new message, preventing duplicates
  const addMessage = useCallback((newMessage) => {
    setMessages((prevMessages) => {
      // Check if message already exists by ID
      if (newMessage._id && prevMessages.some((msg) => msg._id === newMessage._id)) {
        return prevMessages;
      }
      return [...prevMessages, newMessage];
    });
  }, []);

  // Function to update an existing message
  const updateMessage = useCallback((updatedMessage) => {
    setMessages((prevMessages) => 
      prevMessages.map((msg) => 
        msg._id === updatedMessage._id ? updatedMessage : msg
      )
    );
  }, []);


  useEffect(() => {
    if (!user || !bookingId) return;

    socketRef.current = io(SOCKET_URL, {
      auth: { token: user.token },
      reconnectionAttempts: 5,
    });

    const socket = socketRef.current;

    const handleConnect = () => {
      console.log('Socket connected:', socket.id);
      setIsConnected(true);
      setError(null);
      socket.emit('joinRoom', bookingId);
    };

    const handleDisconnect = (reason) => {
      console.log('Socket disconnected:', reason);
      setIsConnected(false);
    };

    const handleConnectError = (err) => {
      console.error('Socket connection error:', err.message);
      setError(`Connection failed: ${err.message}`);
      setIsConnected(false);
    };

    const handleNewMessage = (newMessage) => {
      console.log('Received new message:', newMessage);
      if (newMessage.booking === bookingId) {
        addMessage(newMessage);
      }
    };
    
    // NEW: Handle message updates from the server
    const handleMessageUpdate = (updatedMessage) => {
        console.log('Received message update:', updatedMessage);
        if (updatedMessage.booking === bookingId) {
            updateMessage(updatedMessage);
        }
    }

    // Add listeners
    socket.on('connect', handleConnect);
    socket.on('disconnect', handleDisconnect);
    socket.on('connect_error', handleConnectError);
    socket.on('newMessage', handleNewMessage);
    socket.on('messageUpdated', handleMessageUpdate); // NEW Listener

    // Cleanup function
    return () => {
      console.log('Cleaning up chat socket...');
      socket.emit('leaveRoom', bookingId);
      socket.off('connect', handleConnect);
      socket.off('disconnect', handleDisconnect);
      socket.off('connect_error', handleConnectError);
      socket.off('newMessage', handleNewMessage);
      socket.off('messageUpdated', handleMessageUpdate); // Clean up new listener
      socket.disconnect();
      socketRef.current = null;
      setIsConnected(false);
    };
  }, [bookingId, user, addMessage, updateMessage]);

  /**
   * Sends a message (text and/or file) via REST API.
   * @param {string} messageContent - The text content of the message.
   * @param {File | null} file - Optional file object.
   */
  const sendMessage = (messageContent, file = null) => {
    if (!messageContent.trim() && !file) {
        setError('Cannot send an empty message.');
        return;
    }
    if (!socketRef.current || !isConnected) {
        setError('Cannot send message. Chat is not connected.');
        return;
    }

    setError(null); 
    
    // Call the updated chatService.sendMessage
    chatService.sendMessage(bookingId, messageContent, file)
      .then(sentMessage => {
        console.log("Message sent successfully. Awaiting socket broadcast.", sentMessage);
      })
      .catch(err => {
          const errorMessage = err.message || "Failed to send message.";
          console.error("Failed to send message via REST:", errorMessage);
          setError(errorMessage);
      });
  };
  
  /**
   * Edits an existing message.
   * @param {string} messageId - The ID of the message to edit.
   * @param {string} newMessage - The new message content.
   */
  const editMessage = async (messageId, newMessage) => {
    setError(null);
    try {
        const updatedMessage = await chatService.editMessage(messageId, newMessage);
        // Optimistic UI update immediately after successful API call
        updateMessage(updatedMessage);
        return updatedMessage;
    } catch (err) {
        const errorMessage = err.message || "Failed to edit message.";
        setError(errorMessage);
        throw new Error(errorMessage); // Re-throw to be caught in the component
    }
  }


  return { messages, setMessages, sendMessage, editMessage, isConnected, error };
};