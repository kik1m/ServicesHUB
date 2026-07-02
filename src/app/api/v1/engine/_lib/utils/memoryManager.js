/**
 * memoryManager.js
 * Implements Structured Memory and Time-to-Live (TTL) context pruning
 * to prevent context window explosion and prioritize critical user directives.
 */

export class MemoryManager {
    static TTL_HOURS = {
        trivial: 1,      // Greetings, casual chat
        context: 24,     // Active project context
        core_rule: 720   // Permanent user rules (30 days)
    };

    /**
     * Filters messages based on semantic TTL
     * @param {Array} messages - Chat messages with optional metadata
     * @returns {Array} - Pruned messages
     */
    static pruneOldMemories(messages) {
        if (!Array.isArray(messages)) return [];
        const now = Date.now();
        
        return messages.filter(msg => {
            if (!msg.metadata?.timestamp) return true; // Keep recent streaming messages
            
            const ageHours = (now - msg.metadata.timestamp) / (1000 * 60 * 60);
            const type = msg.metadata.memoryType || 'context';
            const ttl = this.TTL_HOURS[type] || this.TTL_HOURS.context;
            
            return ageHours <= ttl;
        });
    }

    /**
     * Builds a structured memory block to inject into the system prompt
     */
    static formatStructuredMemory(userProfile, dbContextSummary, workspaceRules) {
        let memoryBlock = `<structured_memory>\n`;
        
        if (userProfile && (userProfile.full_name || userProfile.bio)) {
            memoryBlock += `<user_identity>\n`;
            if (userProfile.full_name) memoryBlock += `Name: ${userProfile.full_name}\n`;
            if (userProfile.bio) memoryBlock += `Bio: ${userProfile.bio}\n`;
            memoryBlock += `</user_identity>\n`;
        }

        if (workspaceRules) {
            memoryBlock += `<core_rules ttl="permanent">\n${workspaceRules}\n</core_rules>\n`;
        }

        if (dbContextSummary) {
            memoryBlock += `<active_context ttl="24h">\n${dbContextSummary}\n</active_context>\n`;
        }

        memoryBlock += `</structured_memory>\n`;
        return memoryBlock;
    }
}
