const fs = require('fs');
const readline = require('readline');

async function processLog() {
    const logPath = 'C:\\\\Users\\\\DEN STORE\\\\.gemini\\\\antigravity-ide\\\\brain\\\\d48b7470-b38c-48e8-9e3c-77d0f7e2403b\\\\.system_generated\\\\logs\\\\transcript.jsonl';
    const fileStream = fs.createReadStream(logPath);
    const rl = readline.createInterface({ input: fileStream, crlfDelay: Infinity });

    let fullFileContent = null;
    let found = false;

    for await (const line of rl) {
        if (!line.includes('Total Bytes:') || !line.includes('Total Lines:')) continue;
        
        try {
            const data = JSON.parse(line);
            const content = data.content;
            if (content && content.includes('src/app/api/v1/engine/chat/route.js')) {
                // If this step contains the full file read
                if (content.includes('The following code has been modified to include a line number before every line')) {
                    // It's a view_file output, we can extract the lines
                    let lines = content.split('\n');
                    let reconstructed = [];
                    for (let l of lines) {
                        if (/^[0-9]+: /.test(l)) {
                            reconstructed.push(l.substring(l.indexOf(': ') + 2));
                        }
                    }
                    if (reconstructed.length > 800 && reconstructed.join('\n').includes('generateStream')) {
                        fullFileContent = reconstructed.join('\n');
                        found = true;
                    }
                }
            }
        } catch(e) {}
    }

    if (found && fullFileContent) {
        fs.writeFileSync('src/app/api/v1/engine/chat/route.js.backup', fullFileContent);
        console.log('Successfully saved to route.js.backup');
    } else {
        console.log('Could not find full backup in logs.');
    }
}
processLog();
