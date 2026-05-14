import AdminDashboardClient from './AdminDashboardClient';

export const metadata = {
    title: 'System Access | HUBly',
    description: 'Secure administrative gateway.',
    robots: {
        index: false,
        follow: false,
        nocache: true,
        googleBot: {
            index: false,
            follow: false,
            noimageindex: true,
            'max-video-preview': -1,
            'max-image-preview': 'none',
            'max-snippet': -1,
        },
    },
};

/**
 * Admin Page Entry - Pure Server Component Wrapper
 */
export default function AdminPage() {
    return <AdminDashboardClient />;
}
