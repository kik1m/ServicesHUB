import React, { Suspense } from 'react';
import { notFound } from 'next/navigation';
import { compareService } from '../../../../services/compareService';
import { toolsService } from '../../../../services/toolsService';
import CompareClient from '../../CompareClient';

export async function generateMetadata(props) {
    const params = await props.params;
    const { id } = params;
    
    // We add noindex so these custom niche comparisons don't pollute Google's index
    return {
        title: 'Custom AI Comparison | HUBly',
        description: 'A tailored, context-aware AI comparison generated specifically for a user\'s unique use-case.',
        robots: { index: false, follow: false }
    };
}

export default async function CustomComparisonPage(props) {
    const params = await props.params;
    const { id } = params;
    
    if (!id) {
        notFound();
    }

    // Fetch the custom record
    const { data: customRecord, error: customError } = await compareService.getCustomComparisonById(id);
    
    if (customError || !customRecord) {
        notFound();
    }

    // Fetch the tools involved and common banner data
    const [t1Res, t2Res, recentRes, bannerRes] = await Promise.all([
        compareService.getToolById(customRecord.tool1_id),
        compareService.getToolById(customRecord.tool2_id),
        compareService.getRecentComparisons(),
        toolsService.getBannerTools(20)
    ]);

    const tool1 = t1Res.data;
    const tool2 = t2Res.data;

    if (!tool1 || !tool2) {
        notFound();
    }
    
    // Make sure we pass the custom userIntent so the badge appears
    const userIntent = customRecord.user_query || '';
    
    // Inject custom_id into the AI results so sharing the URL works correctly
    const aiResults = {
        ...customRecord.ai_report_json,
        custom_id: id
    };

    return (
        <Suspense fallback={null}>
            <CompareClient 
                initialTool1={tool1}
                initialTool2={tool2}
                initialRecentComparisons={recentRes.data || []}
                bannerTools={bannerRes.data || []}
                initialAiResults={aiResults}
                // We pass initialUserIntent to prepopulate if we modify CompareClient to accept it
                // Currently, setting the query in the URL might be needed, or we just rely on aiResults
            />
        </Suspense>
    );
}
