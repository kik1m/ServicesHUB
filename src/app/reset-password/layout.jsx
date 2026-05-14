export const metadata = {
    title: 'Reset Password | HUBly',
    description: 'Securely reset your HUBly account password.',
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

export default function ResetPasswordLayout({ children }) {
    return <>{children}</>;
}
