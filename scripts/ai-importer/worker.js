require('dotenv').config({ path: require('path').resolve(__dirname, '.env') });
const { supabaseAdmin } = require('./supabaseClient');
const { exec } = require('child_process');

console.log("\n=======================================================");
console.log("🟢 Elite AI Worker is awake and listening in the background...");
console.log("Leave this terminal open to process AI commands from the Admin Dashboard.");
console.log("=======================================================\n");

const processJob = async (job) => {
    console.log(`\n⏳ Picked up job [${job.job_type}] for: ${job.payload?.url || job.payload?.target || 'N/A'}`);
    
    // Mark as processing
    await supabaseAdmin
        .from('ai_jobs')
        .update({ status: 'PROCESSING', updated_at: new Date().toISOString() })
        .eq('id', job.id);

    return new Promise((resolve) => {
        let command = '';
        
        switch (job.job_type) {
            case 'IMPORT_TOOL':
                command = `node scripts/ai-importer/index.js "${job.payload.url}"`;
                break;
            case 'UPDATE_PRICING':
                command = `node scripts/ai-importer/index.js "PRICING_ONLY: ${job.payload.url}"`;
                break;
            case 'FIX_SEO':
                command = `node scripts/ai-importer/fixSeo.js`;
                break;
            case 'FIX_SINGLE_SEO':
                command = `node scripts/ai-importer/fixSingleSeo.js "${job.payload.url || job.payload.target}"`;
                break;
            case 'FORMAT_BLOG':
                command = `echo "Blog formatting script not yet implemented. Received URL: ${job.payload.url}"`;
                break;
            default:
                command = `echo "Unknown job type: ${job.job_type}"`;
        }

        console.log(`▶ Executing: ${command}`);
        
        // maxBuffer set to 10MB to prevent crashes on very large scrapes
        exec(command, { maxBuffer: 1024 * 1024 * 10 }, async (error, stdout, stderr) => {
            const finalLog = stdout + (stderr ? '\n[ERRORS/WARNINGS]\n' + stderr : '');
            const finalStatus = error ? 'FAILED' : 'COMPLETED';
            
            console.log(`✅ Job finished. Status: ${finalStatus}`);
            
            await supabaseAdmin
                .from('ai_jobs')
                .update({ 
                    status: finalStatus,
                    logs: finalLog,
                    updated_at: new Date().toISOString() 
                })
                .eq('id', job.id);
                
            resolve();
        });
    });
};

const pollJobs = async () => {
    try {
        const { data: jobs, error } = await supabaseAdmin
            .from('ai_jobs')
            .select('*')
            .eq('status', 'PENDING')
            .order('created_at', { ascending: true })
            .limit(1);

        if (error) {
            if (error.code !== '42P01') { // 42P01 means table does not exist yet
                console.error("Supabase Error:", error.message);
            }
        } else if (jobs && jobs.length > 0) {
            await processJob(jobs[0]);
        }
    } catch (err) {
        // Keep worker alive
    }

    setTimeout(pollJobs, 3000); // Check every 3 seconds
};

// Start the polling loop
pollJobs();
