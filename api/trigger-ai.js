export default async function handler(req, res) {
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method Not Allowed' });
    }

    const { urls } = req.body;
    
    if (!urls) {
        return res.status(400).json({ error: 'No URLs provided' });
    }

    // GITHUB_PAT must be set in your Vercel Environment Variables
    const GITHUB_PAT = process.env.GITHUB_PAT;
    
    if (!GITHUB_PAT) {
        return res.status(500).json({ error: 'GITHUB_PAT is not configured on the server.' });
    }

    try {
        const response = await fetch('https://api.github.com/repos/kik1m/ServicesHUB/actions/workflows/ai-daily-import.yml/dispatches', {
            method: 'POST',
            headers: {
                'Accept': 'application/vnd.github.v3+json',
                'Authorization': `Bearer ${GITHUB_PAT}`,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                ref: 'main',
                inputs: { urls: urls }
            })
        });

        if (!response.ok) {
            const errorText = await response.text();
            throw new Error(`GitHub API Error: ${response.status} - ${errorText}`);
        }

        return res.status(200).json({ success: true, message: 'Agent deployed successfully.' });

    } catch (error) {
        console.error('Trigger AI Error:', error);
        return res.status(500).json({ error: error.message });
    }
}
