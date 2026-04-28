/**
 * ToolForm Constants - Elite Standard Configuration
 * Rule #14: Centralized store for all static data.
 * Ensures zero layout shift and immediate UI rendering.
 */

export const SUBMIT_TOOL_CONSTANTS = {
    hero: {
        title: "Submit New",
        highlight: "Tool",
        subtitle: "Join our curated directory. Your tool will be reviewed by our team and published to thousands of potential users.",
        breadcrumbs: [
            { label: 'Dashboard', path: '/dashboard' },
            { label: 'Submit Tool' }
        ]
    },
    steps: ["Basic Details", "Media & Content", "Features & Review"],
    sections: {
        basic: {
            title: "Basic Details",
            fields: {
                name: { label: "TOOL NAME", placeholder: "e.g. ChatGPT" },
                url: { label: "WEBSITE URL", placeholder: "https://yourapp.com" },
                category: { label: "CATEGORY" },
                pricing: { 
                    label: "PRICING MODEL",
                    options: [
                        {id:'Free', name:'Free'}, 
                        {id:'Freemium', name:'Freemium'}, 
                        {id:'Paid', name:'Paid'}, 
                        {id:'Contact', name:'Contact'}
                    ]
                },
                details: { label: "PRICE DETAILS", placeholder: "e.g. $10/mo" }
            }
        },
        media: {
            title: "Media & Content",
            upload: {
                label: "THUMBNAIL IMAGE",
                guidelines: {
                    title: "Image Guidelines",
                    text: "1200 x 630px is recommended. Supports WebP, PNG, JPG."
                },
                dropzone: "Click to select or drag thumbnail",
                uploading: "Uploading to Cloud..."
            },
            fields: {
                pitch: { label: "SHORT PITCH", placeholder: "The catchy one-liner for your tool..." },
                desc: { label: "FULL DESCRIPTION", placeholder: "Detailed breakdown of features and value proposition..." }
            }
        },
        features: {
            title: "Features & Highlights",
            label: "KEY CAPABILITIES",
            empty: {
                title: "List your best features",
                text: "What makes your tool stand out from the competition?"
            }
        }
    },
    success: {
        title: "Submission Successful!",
        desc: "Our moderators will review and publish it within 24-48 hours.",
        actions: {
            dashboard: "Go to Dashboard",
            another: "Submit Another"
        }
    },
    actions: {
        next: "Continue to Step",
        submit: "Submit Tool & Review",
        cancel: "Cancel Submission",
        prev: "Previous Step"
    },
    notifications: {
        validationError: "Verification Required: Please check the highlighted fields.",
        submitError: "Submission Failed: Please try again later.",
        limitReached: "Submission limit reached. Upgrade to Premium!"
    },
    // 5. Validation SSOT (Rule #27)
    validation: {
        name: { min: 2, error: "Name is too short" },
        url: { required: true, error: "Website URL is required" },
        category: { required: true, error: "Category required" },
        shortDesc: { min: 10, error: "Min 10 characters" },
        fullDesc: { min: 50, error: "Min 50 characters" },
        image: { required: true, error: "Thumbnail is required" }
    },
    // 6. Labels & Strings
    labels: {
        switchUpload: "Switch to Upload",
        useManual: "Use Manual URL",
        imageUrl: "IMAGE URL",
        imageUrlPlaceholder: "https://example.com/image.png",
        changeImage: "Change Image",
        addFeature: "Add Feature",
        addFirstFeature: "Add Your First Feature",
        featurePlaceholder: "e.g. Real-time collaboration"
    }
};

export const EDIT_TOOL_CONSTANTS = {
    hero: {
        title: "Edit",
        highlight: "Listing",
        subtitle: "Ensure all information is accurate to maintain listing quality.",
        breadcrumbs: [
            { label: 'Dashboard', path: '/dashboard' },
            { label: 'Edit Tool' }
        ]
    },
    steps: ["Basics", "Media", "Features"],
    sections: SUBMIT_TOOL_CONSTANTS.sections, // Reuse same sections for consistency
    actions: {
        next: "Continue to Step",
        submit: "Update Tool & Review",
        cancel: "Cancel Edits",
        prev: "Previous Step"
    },
    notifications: {
        validationError: "Verification Required: Please check the highlighted fields.",
        submitError: "Update Failed: Please try again later."
    }
};
