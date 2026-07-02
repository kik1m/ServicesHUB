import databaseDictionary from '../../../../../data/database_dictionary.json';

import { 
    search_articles, lookup_user, search_comparisons, get_tool_reviews, 
    get_tool_details, explore_database_schema, compare_tools_detailed 
} from './tools/databaseTools';


import { search_hubly_docs, get_platform_schema } from './tools/docsTools';

import { 
    save_memory, delete_memory, create_user_project, get_user_projects, 
    list_all_projects, search_external_market, get_market_trends 
} from './tools/otherTools';

import { 
    admin_get_table_data, get_all_tools, get_database_dictionary, 
    analyze_platform_trends, get_operational_status, get_granular_analytics, 
    search_internal_strategy 
} from './tools/adminTools';

import { sanitizeToolResult } from './sanitizeToolResult';

export async function executeToolCall(fnName, fnArgs, verifiedUserId, userRole) {
    let result;
    switch (fnName) {
        // Database Tools
        case 'search_articles': result = await search_articles(fnArgs); break;
        case 'lookup_user': result = await lookup_user(fnArgs, verifiedUserId, userRole); break;
        case 'search_comparisons': result = await search_comparisons(); break;
        case 'get_tool_reviews': result = await get_tool_reviews(fnArgs); break;
        case 'get_tool_details': result = await get_tool_details(fnArgs); break;
        case 'compare_tools_detailed': result = await compare_tools_detailed(fnArgs); break;
        case 'explore_database_schema': result = await explore_database_schema(fnArgs, databaseDictionary); break;
        
        // Docs Tools
        case 'search_hubly_docs': result = await search_hubly_docs(fnArgs); break;
        case 'get_platform_schema': result = await get_platform_schema(fnArgs); break;

        // Other Tools (Memory, Projects, External)
        case 'save_memory': result = await save_memory(fnArgs, verifiedUserId); break;
        case 'delete_memory': result = await delete_memory(fnArgs, verifiedUserId); break;
        case 'create_user_project': result = await create_user_project(fnArgs, verifiedUserId); break;
        case 'get_user_projects': result = await get_user_projects(fnArgs, verifiedUserId); break;
        case 'list_all_projects': result = await list_all_projects(userRole); break;
        case 'search_external_market': result = await search_external_market(fnArgs); break;
        case 'get_market_trends': result = await get_market_trends(fnArgs); break;

        // Admin Tools
        case 'admin_get_table_data': result = await admin_get_table_data(fnArgs, userRole); break;
        case 'get_all_tools': result = await get_all_tools(userRole); break;
        case 'get_database_dictionary': result = await get_database_dictionary(databaseDictionary, userRole); break;
        case 'analyze_platform_trends': result = await analyze_platform_trends(userRole); break;
        case 'get_operational_status': result = await get_operational_status(userRole); break;
        case 'get_granular_analytics': result = await get_granular_analytics(userRole); break;
        case 'search_internal_strategy': result = await search_internal_strategy(fnArgs, userRole); break;

        default:
            result = { error: "Function not found" };
    }
    
    return sanitizeToolResult(result);
}
