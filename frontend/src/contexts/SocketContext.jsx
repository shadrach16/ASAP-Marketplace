import React, { createContext, useContext, useEffect, useState, useRef } from 'react';
import { io } from 'socket.io-client';
import { useAuth } from './AuthContext'; // Use AuthContext to get the token

const SocketContext = createContext(null);

export const useSocket = () => useContext(SocketContext);

const SOCKET_URL = import.meta.env.VITE_SOCKET_URL || 'http://localhost:5000';

export const SocketProvider = ({ children }) => {
    const { user, isAuthenticated } = useAuth();
    const [socket, setSocket] = useState(null);
    const [isConnected, setIsConnected] = useState(false);
    const socketRef = useRef(null); // Ref to hold the socket instance

    useEffect(() => {
        // Connect only when authenticated
        if (isAuthenticated && user?.token && !socketRef.current) {
            console.log("Attempting to connect socket...");
            const newSocket = io(SOCKET_URL, {
                auth: { token: user.token },
                reconnectionAttempts: 5,
            });

            newSocket.on('connect', () => {
                console.log('Socket connected:', newSocket.id);
                setIsConnected(true);
            });

            newSocket.on('disconnect', (reason) => {
                console.log('Socket disconnected:', reason);
                setIsConnected(false);
            });

             newSocket.on('connect_error', (err) => {
                console.error('Socket connection error:', err.message);
                setIsConnected(false);
             });

            setSocket(newSocket);
            socketRef.current = newSocket; // Store in ref

        } else if (!isAuthenticated && socketRef.current) {
            // Disconnect if user logs out
            console.log("Disconnecting socket due to logout...");
            socketRef.current.disconnect();
            socketRef.current = null;
            setSocket(null);
            setIsConnected(false);
        }

        // Cleanup on component unmount
        return () => {
            if (socketRef.current) {
                console.log("Cleaning up socket connection on unmount...");
                socketRef.current.disconnect();
                socketRef.current = null;
                setSocket(null);
                setIsConnected(false);
            }
        };
    }, [isAuthenticated, user?.token]); // Re-run effect if auth state changes

    const value = { socket, isConnected };

    return (
        <SocketContext.Provider value={value}>
            {children}
        </SocketContext.Provider>
    );
};