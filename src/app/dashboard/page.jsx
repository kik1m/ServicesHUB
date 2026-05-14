import DashboardClient from './DashboardClient';

export const metadata = {
    title: 'User Analytics & Dashboard | HUBly',
    description: 'Private area for managing your tools, analytics, and favorites on HUBly.',
    robots: {
        index: false,
        follow: false,
    }
};

export default function DashboardPage() {
    return <DashboardClient />;
}
