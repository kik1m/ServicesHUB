import { useState, useEffect } from 'react';

/**
 * Shared hook for legal pages (Privacy, Terms)
 * Manages simple loading states and common logic
 */
export const useLegalData = () => {
    // Instant render for static legal content
    return { loading: false };
};
