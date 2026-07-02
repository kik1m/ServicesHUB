/**
 * HUBly AI Tools Registry
 *
 * IMPORTANT: All type values use lowercase (JSON Schema standard).
 * Gemini also accepts lowercase. OpenRouter (Claude/GPT-4o) REQUIRES lowercase.
 * Using uppercase 'OBJECT'/'STRING' breaks Claude and GPT-4o silently.
 */

export function getBaseTools() {
    return [
        {
            name: 'search_articles',
            description: 'Search for articles, blogs, and tutorials on the HUBly platform.',
            parameters: { type: 'object', properties: { query: { type: 'string' } }, required: ['query'] }
        },
        {
            name: 'lookup_user',
            description: 'Find a user by name to see their profile and the tools they published.',
            parameters: { type: 'object', properties: { name: { type: 'string' } }, required: ['name'] }
        },
        {
            name: 'search_comparisons',
            description: 'Search for existing AI tool comparisons.',
            parameters: { type: 'object', properties: { query: { type: 'string' } }, required: ['query'] }
        },
        {
            name: 'search_hubly_docs',
            description: 'Search the HUBly documentation for rules, API details, and platform guides.',
            parameters: { type: 'object', properties: { query: { type: 'string' } }, required: ['query'] }
        },
        {
            name: 'get_tool_reviews',
            description: 'Get user reviews and ratings for a specific tool by slug.',
            parameters: { type: 'object', properties: { slug: { type: 'string' } }, required: ['slug'] }
        },
        {
            name: 'get_tool_details',
            description: 'Fetch the deep, full profile of a specific tool by slug, including its rich markdown description, features, and precise pricing. ALWAYS use this BEFORE explaining or analyzing a specific tool.',
            parameters: { type: 'object', properties: { slug: { type: 'string' } }, required: ['slug'] }
        },
        {
            name: 'search_external_market',
            description: 'Search the live internet for recent news, market trends, external AI tools, and competitor analysis. Use this when the user asks about tools, news, or trends NOT found in the HUBly database.',
            parameters: { type: 'object', properties: { query: { type: 'string' } }, required: ['query'] }
        },
        {
            name: 'get_market_trends',
            description: 'Fetch live market trends, statistics, and growth rates for a specific industry or tech topic. Use this BEFORE giving strategic project advice to provide data-backed insights.',
            parameters: { type: 'object', properties: { industry: { type: 'string' }, topic: { type: 'string' } }, required: ['industry', 'topic'] }
        },
        {
            name: 'compare_tools_detailed',
            description: 'Perform a detailed, structured comparison between two specific AI tools. Returns a structured JSON containing a feature matrix, pricing comparison, and a final recommendation.',
            parameters: { type: 'object', properties: { slug1: { type: 'string' }, slug2: { type: 'string' } }, required: ['slug1', 'slug2'] }
        }
    ];
}

export function getUserTools() {
    return [
        {
            name: 'save_memory',
            description: "Save a key-value pair to the user's long-term memory for future context. Use this when the user shares long-term goals or project details.",
            parameters: { type: 'object', properties: { key: { type: 'string' }, value: { type: 'string' } }, required: ['key', 'value'] }
        },
        {
            name: 'delete_memory',
            description: "Delete a key from the user's long-term memory.",
            parameters: { type: 'object', properties: { key: { type: 'string' } }, required: ['key'] }
        },
        {
            name: 'create_user_project',
            description: 'Create a structured project profile for the user in the database. Use this when the user explicitly wants to start a new project or app.',
            parameters: { type: 'object', properties: { name: { type: 'string' }, tech_stack: { type: 'string' }, budget: { type: 'string' }, skill_level: { type: 'string' } }, required: ['name'] }
        },
        {
            name: 'get_user_projects',
            description: "Retrieve the user's structured projects from the database to give contextual advice based on their past or ongoing builds.",
            parameters: { type: 'object', properties: {} }
        }
    ];
}

export function getAdminTools() {
    return [
        {
            name: 'get_all_tools',
            description: '(ADMIN ONLY) Fetches a complete list of ALL tools in the database including their names, slugs, categories, and descriptions. ALWAYS call this first when the admin asks to analyze, list, classify, or review tools.',
            parameters: { type: 'object', properties: {} }
        },
        {
            name: 'get_operational_status',
            description: '(ADMIN ONLY) Fetch internal operational data: total users, total tools, sessions, and platform health metrics. Use to generate operational reports.',
            parameters: { type: 'object', properties: {} }
        },
        {
            name: 'analyze_platform_trends',
            description: '(ADMIN ONLY) Analyzes the most viewed and highest-rated tools on the platform to identify market trends.',
            parameters: { type: 'object', properties: {} }
        },
        {
            name: 'get_database_dictionary',
            description: '(ADMIN ONLY) Fetches the semantic Database Dictionary. Use this to understand what each table means, business logic, and how to join tables for complex queries.',
            parameters: { type: 'object', properties: {} }
        },
        {
            name: 'get_database_schema',
            description: '(ADMIN ONLY) Fetches the exact schema of the database: all tables and their columns with data types. Use this before writing SQL queries.',
            parameters: { type: 'object', properties: {} }
        },
        {
            name: 'execute_database_query',
            description: '(ADMIN ONLY) Executes a raw PostgreSQL SELECT query directly on the live database. Use get_database_dictionary and get_database_schema first to ensure correct table/column names. Do NOT include a trailing semicolon.',
            parameters: {
                type: 'object',
                properties: {
                    query: { type: 'string', description: 'A valid PostgreSQL SELECT/WITH/EXPLAIN query WITHOUT a trailing semicolon.' }
                },
                required: ['query']
            }
        },
        {
            name: 'get_platform_schema',
            description: '(ADMIN ONLY) Fetches the structured manifest of HUBly platform pages: their purpose, UI elements, and backend logic.',
            parameters: {
                type: 'object',
                properties: {
                    page_id: { type: 'string', description: 'Optional specific page path (e.g., /tools). Omit to get all pages.' }
                }
            }
        },
        {
            name: 'search_internal_strategy',
            description: '(ADMIN ONLY) Search internal HUBly documents, roadmaps, and strategic knowledge base.',
            parameters: { type: 'object', properties: { query: { type: 'string' } }, required: ['query'] }
        },
        {
            name: 'get_granular_analytics',
            description: '(ADMIN ONLY) Fetch detailed platform analytics: user journey metrics, drop-off points, and engagement rates.',
            parameters: {
                type: 'object',
                properties: {
                    metric_type: { type: 'string', description: 'Type: "user_journey", "engagement", or "drop_offs"' }
                },
                required: ['metric_type']
            }
        }
    ];
}

export function buildToolsArray(verifiedUserId, userRole) {
    let tools = getBaseTools();
    if (verifiedUserId) tools = tools.concat(getUserTools());
    if (userRole === 'admin') tools = tools.concat(getAdminTools());
    return [{ functionDeclarations: tools }];
}
