/**
 * CONTACT_UI_CONSTANTS
 * Rule #14: Centralized UI labels and SEO data for Contact Page
 */
export const CONTACT_UI_CONSTANTS = {
    seo: {
        title: "Contact Us | Get in Touch with ServicesHUB",
        description: "Have questions or feedback? Contact the ServicesHUB team for support, partnership inquiries, or general help."
    },
    hero: {
        title: "Get in",
        highlight: "Touch",
        subtitle: "Have a question or feedback? We are here to help you get the most out of our platform.",
        breadcrumbs: [
            { label: 'Home', path: '/' },
            { label: 'Contact' }
        ]
    },
    info: {
        title: "Contact Information",
        email: {
            title: "Email Us",
            value: "support@serviceshub.com"
        },
        chat: {
            title: "Live Chat",
            value: "Available Mon-Fri, 9am-6pm"
        },
        location: {
            title: "Location",
            value: "Global Remote Team"
        },
        social: {
            title: "Follow our journey"
        }
    },
    form: {
        fields: {
            name: {
                label: "Full Name",
                placeholder: "John Doe"
            },
            email: {
                label: "Email Address",
                placeholder: "john@example.com"
            },
            subject: {
                label: "Subject",
                placeholder: "Select subject",
                options: [
                    { value: 'General Inquiry', label: 'General Inquiry' },
                    { value: 'Tool Submission Question', label: 'Tool Submission Question' },
                    { value: 'Partnership/Advertising', label: 'Partnership/Advertising' },
                    { value: 'Technical Bug Report', label: 'Technical Bug Report' }
                ]
            },
            message: {
                label: "Message",
                placeholder: "How can we help you today?"
            }
        },
        submit: "Send Message",
        messages: {
            success: "Message sent! We will get back to you soon.",
            error: "Failed to send message. Please try again."
        }
    }
};
