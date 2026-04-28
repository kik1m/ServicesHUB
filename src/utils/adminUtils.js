/**
 * Admin Utility Functions
 */

/**
 * Compares old and new tool data to find changed fields for the review modal
 * Rule #14: High-Fidelity Comparison with Partial Support
 */
export const getChangedFields = (oldVal, newVal, categories = []) => {
    if (!oldVal || !newVal) return [];
    
    const mapping = {
        name: 'Tool Name', 
        url: 'Website URL', 
        category_id: 'Category',
        short_description: 'Marketing Tagline',
        description: 'Full Description', 
        image_url: 'Visual Identity',
        pricing_type: 'Pricing Model', 
        pricing_details: 'Pricing Notes',
        features: 'Core Capabilities'
    };
    
    const resolveValue = (key, val) => {
        if (key === 'category_id' && categories.length > 0) {
            const cat = categories.find(c => c.id === val);
            return cat ? cat.name : val;
        }
        if (Array.isArray(val)) return val;
        return val || '—';
    };
    
    return Object.keys(mapping)
        .map(key => {
            const oldRaw = oldVal[key];
            // If newVal is a partial object (pending_changes), it might not have the key
            const isProposed = key in newVal;
            const newRaw = isProposed ? newVal[key] : oldRaw;
            
            const hasChanged = isProposed && JSON.stringify(oldRaw) !== JSON.stringify(newRaw);
            
            return {
                key, 
                label: mapping[key], 
                oldValue: resolveValue(key, oldRaw), 
                newValue: resolveValue(key, newRaw),
                hasChanged,
                isImage: key === 'image_url', 
                isArray: Array.isArray(newRaw)
            };
        });
};
