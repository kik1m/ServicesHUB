import { toolsService } from './src/services/toolsService';
import { categoriesService } from './src/services/categoriesService';

async function testSearch() {
    console.log("--- Testing Category Search ---");
    const { data: categories } = await categoriesService.getAllCategories();
    console.log(`Loaded ${categories?.length} categories`);

    const query = "AI"; // Change to a known category
    console.log(`Searching for: "${query}"`);

    const res = await toolsService.getToolsPaginated({
        searchQuery: query,
        categories: categories || []
    });

    if (res.error) {
        console.error("Search Error:", res.error);
    } else {
        console.log(`Found ${res.data?.length} results`);
        res.data?.forEach(t => {
            console.log(` - ${t.name} (Cat: ${t.categories?.name})`);
        });
    }
}

// Note: This script needs to be run in an environment with Supabase initialized
// For now, I'll just check the logic one more time.
