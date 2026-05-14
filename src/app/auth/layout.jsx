export const metadata = {
    title: 'Authentication | HUBly',
    description: 'Secure access to the HUBly platform. Manage your AI tools, collections, and professional profile.',
    robots: {
        index: false,
        follow: false,
        nocache: true,
        googleBot: {
            index: false,
            follow: false,
        },
    },
};

export default function AuthLayout({ children }) {
    return <>{children}</>;
}
