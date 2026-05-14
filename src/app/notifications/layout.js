export const metadata = {
    title: 'Notifications | HUBly',
    description: 'View your private notifications and activity updates on HUBly.',
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

export default function NotificationsLayout({ children }) {
    return <>{children}</>;
}
