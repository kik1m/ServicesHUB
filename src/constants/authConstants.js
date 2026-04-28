/**
 * AUTH_UI_CONSTANTS
 * Rule #14: Centralized UI labels and SEO data for Auth Pages
 */
export const AUTH_UI_CONSTANTS = {
    login: {
        seo: {
            title: "Login | ServicesHUB Elite Access",
            description: "Log in to your ServicesHUB account to manage your tools, reviews, and professional profile."
        },
        header: {
            title: "Welcome Back",
            subtitle: "Enter your credentials to access your elite dashboard."
        },
        form: {
            emailLabel: "Email Address",
            emailPlaceholder: "name@example.com",
            passwordLabel: "Password",
            passwordPlaceholder: "••••••••",
            forgotPassword: "Forgot password?",
            submitBtn: "Sign In",
            loadingBtn: "Authenticating..."
        },
        footer: {
            text: "Don't have an account?",
            action: "Create Account"
        }
    },
    signup: {
        seo: {
            title: "Join ServicesHUB | Professional AI Directory",
            description: "Create your ServicesHUB account today and start showcasing your AI tools to a global audience."
        },
        header: {
            title: "Create Account",
            subtitle: "Join the elite circle of AI innovators and creators."
        },
        form: {
            nameLabel: "Full Name",
            namePlaceholder: "John Doe",
            emailLabel: "Email Address",
            emailPlaceholder: "name@example.com",
            passwordLabel: "Password",
            passwordPlaceholder: "Minimum 8 characters",
            confirmLabel: "Confirm Password",
            confirmPlaceholder: "Repeat password",
            submitBtn: "Create Account",
            loadingBtn: "Creating Account..."
        },
        footer: {
            text: "Already have an account?",
            action: "Sign In"
        }
    },
    forgotPassword: {
        seo: {
            title: "Reset Password | ServicesHUB",
            description: "Recover your ServicesHUB account access by resetting your password."
        },
        header: {
            title: "Reset Password",
            subtitle: "Enter your email to receive a recovery link."
        },
        form: {
            emailLabel: "Email Address",
            emailPlaceholder: "name@example.com",
            submitBtn: "Send Recovery Link",
            loadingBtn: "Sending...",
            backToLogin: "Back to Login"
        }
    },
    social: {
        divider: "Or continue with",
        google: "Google",
        github: "GitHub"
    },
    validation: {
        passwordsMatch: "Passwords do not match!",
        emailRequired: "Email is required",
        passwordLength: "Password must be at least 8 characters",
        invalidLink: "Invalid or expired reset link."
    },
    resetPassword: {
        seo: {
            title: "Set New Password | ServicesHUB",
            description: "Securely update your ServicesHUB account password."
        },
        header: {
            title: "Set New Password",
            subtitle: "Enter your new secure password below."
        },
        form: {
            newPasswordLabel: "New Password",
            newPasswordPlaceholder: "Min 6 characters",
            confirmPasswordLabel: "Confirm Password",
            confirmPasswordPlaceholder: "Repeat password",
            submitBtn: "Update & Login",
            loadingBtn: "Updating..."
        },
        success: {
            title: "Password Updated!",
            subtitle: "Your password has been changed successfully. Redirecting you to login...",
            action: "Back to Login"
        }
    }
};
