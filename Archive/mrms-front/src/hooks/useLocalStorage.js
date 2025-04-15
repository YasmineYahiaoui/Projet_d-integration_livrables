// /hooks/useLocalStorage.js
'use client';

import { useState, useEffect } from 'react';

function useLocalStorage(key, initialValue) {
    // State to store our value
    const [storedValue, setStoredValue] = useState(initialValue);

    // Flag to indicate if component is mounted
    const [isMounted, setIsMounted] = useState(false);

    // Initialize on client-side only
    useEffect(() => {
        setIsMounted(true);
        try {
            const item = window.localStorage.getItem(key);
            setStoredValue(item ? JSON.parse(item) : initialValue);
        } catch (error) {
            console.error(error);
            setStoredValue(initialValue);
        }
    }, [key, initialValue]);

    // Return a wrapped version of useState's setter function that persists the new value to localStorage
    const setValue = (value) => {
        try {
            // Allow value to be a function so we have same API as useState
            const valueToStore = value instanceof Function ? value(storedValue) : value;

            // Save state
            setStoredValue(valueToStore);

            // Save to localStorage only on client side
            if (typeof window !== 'undefined') {
                window.localStorage.setItem(key, JSON.stringify(valueToStore));
            }
        } catch (error) {
            console.error(error);
        }
    };

    return [storedValue, setValue, isMounted];
}

export default useLocalStorage;