import React from 'react';
import SuccessClient from './SuccessClient';

// Rule #34: Success pages must never be indexed or cached
export const metadata = {
    title: 'Success | HUBly',
    description: 'Operation completed successfully.',
    robots: {
        index: false,
        follow: false,
        nocache: true,
        googleBot: {
            index: false,
            follow: false,
            noimageindex: true,
        },
    },
};

export default function SuccessPage() {
    return <SuccessClient />;
}
