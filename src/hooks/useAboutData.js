import { useState, useEffect } from 'react';

/**
 * Hook for managing the About page state and loading behavior
 */
export const useAboutData = () => {
    // Static content should render instantly (Elite Performance Rule)
    return {
        loading: false
    };
};
