// src/hooks/useDebounce.js
import { useState, useEffect } from 'react';

/**
 * Custom hook to debounce a value.
 * @param {any} value The value to debounce (e.g., the input text).
 * @param {number} delay The debounce delay in milliseconds (e.g., 500).
 * @returns {any} The debounced value.
 */
export function useDebounce(value, delay) {
    // State to hold the debounced value
    const [debouncedValue, setDebouncedValue] = useState(value);

    useEffect(() => {
        // Set up a timer (timeout) to update the debounced value
        const handler = setTimeout(() => {
            setDebouncedValue(value);
        }, delay);

        // Cleanup function: If 'value' changes before the delay, 
        // clear the previous timeout and start a new one.
        return () => {
            clearTimeout(handler);
        };
    }, [value, delay]); // Only re-run if value or delay changes

    return debouncedValue;
}