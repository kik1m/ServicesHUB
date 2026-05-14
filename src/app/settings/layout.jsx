export const metadata = {
    title: 'Account Settings | HUBly',
    description: 'Manage your profile, security, and preferences on HUBly.',
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

export default function SettingsLayout({ children }) {
    return <>{children}</>;
}
