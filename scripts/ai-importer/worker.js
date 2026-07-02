require('dotenv').config({ path: require('path').resolve(__dirname, '../../.env.local') });
const { supabaseAdmin } = require('./supabaseClient');
const { exec } = require('child_process');

console.log("\n=======================================================");
console.log("≡اات Elite AI Worker is awake and listening in the background...");
console.log("Leave this terminal open to process AI commands from the Admin Dashboard.");
console.log("=======================================================\n");

const processJob = async (job) => {
    console.log(`\nظ│ Picked up job [${job.job_type}] for: ${job.payload?.url || job.payload?.target || 'N/A'}`);

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
                command = `node scripts/format-blog.cjs "${job.payload.url || job.payload.target}"`;
                break;
            default:
                command = `echo "Unknown job type: ${job.job_type}"`;
        }

        console.log(`ظû╢ Executing: ${command}`);

        // maxBuffer set to 10MB to prevent crashes on very large scrapes
        exec(command, { maxBuffer: 1024 * 1024 * 10 }, async (error, stdout, stderr) => {
            const finalLog = stdout + (stderr ? '\n[ERRORS/WARNINGS]\n' + stderr : '');

            // Smarter status detection: if process didn't crash (no error) but nothing was added/updated, it's a real failure
            let finalStatus = 'COMPLETED';
            if (error) {
                finalStatus = 'FAILED';
            } else if (stdout) {
                // Parse the run report to detect silent failures (skipped/failed with nothing added)
                const addedMatch = stdout.match(/≡اـ Added:\s+(\d+)/);
                const updatedMatch = stdout.match(/≡اôê Updated:\s+(\d+)/);
                const skippedMatch = stdout.match(/ظصي╕ Skipped:\s+(\d+)/);
                const failedMatch = stdout.match(/ظإî Failed:\s+(\d+)/);

                if (addedMatch && updatedMatch) {
                    const added = parseInt(addedMatch[1]);
                    const updated = parseInt(updatedMatch[1]);
                    const skipped = skippedMatch ? parseInt(skippedMatch[1]) : 0;
                    const failed = failedMatch ? parseInt(failedMatch[1]) : 0;

                    if (added === 0 && updated === 0 && (skipped > 0 || failed > 0)) {
                        finalStatus = 'FAILED'; // Nothing was actually saved ظ¤ report failure
                    }
                }
            }

            console.log(`${finalStatus === 'COMPLETED' ? 'ظ£à' : 'ظإî'} Job finished. Status: ${finalStatus}`);

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
