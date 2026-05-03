import { Resend } from 'resend';

let resend;
if (process.env.RESEND_API_KEY) {
    resend = new Resend(process.env.RESEND_API_KEY);
}

/**
 * HUBly Elite Email Engine
 * Supports Transactional, Operational, and Marketing emails with dynamic injection.
 */
export default async function handler(req, res) {
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method Not Allowed' });
    }

    if (!resend) {
        console.error('RESEND_API_KEY is missing in environment variables.');
        return res.status(500).json({ error: 'Email service is not configured. Missing API Key.' });
    }

    const { to, subject, type, data } = req.body;

    if (!to || !subject || !type) {
        return res.status(400).json({ error: 'Missing required fields' });
    }

    try {
        let htmlContent = '';
        
        // Brand Identity Tokens
        const brandColor = '#00ffa2';
        const brandSecondary = '#00d2ff';
        const brandDark = '#0a0a0a';
        const logoUrl = 'https://hubly-tools.com/logo.png';
        
        // 🏗️ Master Wrapper Template (Elite Design)
        const getWrapper = (content) => `
            <!DOCTYPE html>
            <html>
            <head>
                <meta charset="utf-8">
                <style>
                    body { margin: 0; padding: 0; background-color: #0a0a0a; font-family: 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; }
                    .container { max-width: 600px; margin: 20px auto; background: #121212; border-radius: 24px; overflow: hidden; box-shadow: 0 10px 30px rgba(0,0,0,0.5); border: 1px solid #222; }
                    .header { background-color: #050505; padding: 40px 20px; text-align: center; border-bottom: 1px solid #222; }
                    .logo { height: 45px; margin-bottom: 15px; }
                    .content { padding: 40px; color: #e0e0e0; line-height: 1.7; }
                    .footer { background-color: #050505; padding: 30px; text-align: center; color: #888; font-size: 13px; border-top: 1px solid #222; }
                    .button { display: inline-block; padding: 16px 32px; background: ${brandSecondary}; color: #000 !important; text-decoration: none; border-radius: 12px; font-weight: 800; margin: 20px 0; text-transform: uppercase; letter-spacing: 0.5px; }
                    .badge { display: inline-block; padding: 4px 12px; background: rgba(0,250,162,0.1); color: #00b894; border-radius: 6px; font-size: 12px; font-weight: 800; margin-bottom: 15px; }
                    .card { background: #1a1a1a; border-radius: 16px; padding: 25px; margin: 25px 0; border: 1px solid #222; }
                    h1, h2 { color: #ffffff; margin-top: 0; }
                </style>
            </head>
            <body>
                <div class="container">
                    <div class="header">
                        <img src="${logoUrl}" alt="HUBly" class="logo">
                        <div style="font-weight: 900; font-size: 24px; letter-spacing: 1px;"><span style="color: white">HUB</span><span style="color: ${brandSecondary}">ly</span></div>
                    </div>
                    <div class="content">
                        ${content}
                    </div>
                    <div class="footer">
                        <p>© ${new Date().getFullYear()} HUBly Tools Ecosystem. All rights reserved.</p>
                        <p>123 AI Boulevard, Silicon Valley, CA 94025</p>
                        <div style="margin-top: 15px;">
                            <a href="https://hubly-tools.com/settings" style="color: #636e72; text-decoration: underline;">Settings</a> • 
                            <a href="https://hubly-tools.com/support" style="color: #636e72; text-decoration: underline;">Support</a> • 
                            <a href="https://hubly-tools.com/unsubscribe" style="color: #636e72; text-decoration: underline;">Unsubscribe</a>
                        </div>
                    </div>
                </div>
            </body>
            </html>
        `;

        // 🧬 Dynamic Type Handling
        switch(type) {
            case 'welcome':
                htmlContent = getWrapper(`
                    <span class="badge">MEMBERSHIP ACTIVATED</span>
                    <h1>Welcome to the Future, ${data.name || 'Explorer'}! 🚀</h1>
                    <p>You've just gained access to the world's most elite directory of AI-powered solutions. Whether you're a developer, creator, or entrepreneur, HUBly is your new headquarters for growth.</p>
                    <div style="text-align: center;">
                        <a href="https://hubly-tools.com/search" class="button">Start Your Journey</a>
                    </div>
                    <p>Pro Tip: Add your favorite tools to your collection to get personalized updates on their performance and status.</p>
                `);
                break;

            case 'tool_status':
                const isApproved = data.status === 'approved';
                htmlContent = getWrapper(`
                    <span class="badge" style="background: ${isApproved ? 'rgba(0,250,162,0.1)' : 'rgba(255,80,80,0.1)'}; color: ${isApproved ? '#00b894' : '#ff4757'};">
                        SUBMISSION ${data.status.toUpperCase()}
                    </span>
                    <h1>Status Update: ${data.toolName}</h1>
                    <p>Our editorial board has completed the strategic review of your submission.</p>
                    
                    <div class="card">
                        <strong>Decision:</strong> ${isApproved ? 'Approved & Live ✅' : 'Requires Modification ❌'}<br>
                        ${data.feedback ? `<p style="margin-top:15px; font-style:italic; color: #555;">" ${data.feedback} "</p>` : ''}
                    </div>

                    <p>${isApproved 
                        ? 'Your tool is now being indexed and featured across our global network. Millions of eyes are waiting!' 
                        : 'Don\'t worry! We believe in your tool\'s potential. Please address the feedback above and re-submit for a priority review.'}</p>
                    
                    <div style="text-align: center;">
                        <a href="https://hubly-tools.com/${isApproved ? 'tool/'+data.slug : 'dashboard'}" class="button">
                            ${isApproved ? 'View Live Tool' : 'Modify Submission'}
                        </a>
                    </div>
                `);
                break;

            case 'security_alert':
                htmlContent = getWrapper(`
                    <span class="badge" style="background: rgba(255,160,0,0.1); color: #ff9f43;">SECURITY PULSE</span>
                    <h1>Security Update Detected</h1>
                    <p>Hello ${data.name}, this is an automated alert to inform you that your <strong>${data.action}</strong> was successfully updated.</p>
                    
                    <div class="card" style="border-left: 4px solid #ff9f43;">
                        <strong>Action:</strong> ${data.action}<br>
                        <strong>Date:</strong> ${new Date().toLocaleString()}<br>
                        <strong>Location:</strong> ${data.location || 'Unknown'}
                    </div>

                    <p style="color: #ff4757; font-weight: bold;">If you did not perform this action, please secure your account immediately by resetting your password and contacting our elite support team.</p>
                    
                    <div style="text-align: center;">
                        <a href="https://hubly-tools.com/settings" class="button" style="background: #ff4757; color: white !important;">Secure My Account</a>
                    </div>
                `);
                break;

            case 'new_review':
                htmlContent = getWrapper(`
                    <span class="badge">SOCIAL FEEDBACK</span>
                    <h1>New Review on ${data.toolName}</h1>
                    <p>Great news! A community member has shared their experience with your tool.</p>
                    
                    <div class="card">
                        <div style="font-size: 20px; margin-bottom: 10px;">${'★'.repeat(data.rating)}${'☆'.repeat(5-data.rating)}</div>
                        <p style="margin: 0; font-style: italic;">"${data.comment}"</p>
                        <p style="margin-top: 15px; font-size: 12px; color: #888;">— Posted by ${data.userName}</p>
                    </div>

                    <p>Engaging with your reviewers increases your tool's strategic visibility by up to 40%. Respond now to build trust!</p>
                    
                    <div style="text-align: center;">
                        <a href="https://hubly-tools.com/tool/${data.slug}" class="button">Reply to Review</a>
                    </div>
                `);
                break;

            case 'newsletter_broadcast':
                htmlContent = getWrapper(`
                    <span class="badge" style="background: rgba(0,210,255,0.1); color: #00d2ff;">WEEKLY SPOTLIGHT</span>
                    <h1>${data.subject}</h1>
                    <p style="font-size: 16px; color: #636e72;">${data.intro}</p>
                    
                    <!-- 🛠️ Dynamic Tools Loop -->
                    ${data.tools.map(tool => `
                        <div class="card" style="display: block; text-decoration: none; color: inherit;">
                            <img src="${tool.image_url}" alt="${tool.name}" style="width: 100%; height: 200px; object-fit: cover; border-radius: 12px; margin-bottom: 15px;">
                            <h2 style="margin: 0 0 10px 0; font-size: 20px;">${tool.name}</h2>
                            <p style="margin: 0 0 15px 0; font-size: 14px; color: #888;">${tool.short_description}</p>
                            <a href="https://hubly-tools.com/tool/${tool.slug}" style="color: ${brandSecondary}; font-weight: 800; text-decoration: none; font-size: 14px;">VIEW TOOL DETAILS →</a>
                        </div>
                    `).join('')}

                    <!-- 🎁 Special Offer Section (Optional) -->
                    ${data.specialOffer ? `
                        <div style="background: linear-gradient(135deg, #6c5ce7, #a29bfe); border-radius: 20px; padding: 30px; margin-top: 30px; color: white; text-align: center;">
                            <span style="background: rgba(255,255,255,0.2); padding: 4px 12px; border-radius: 6px; font-size: 12px; font-weight: 800;">EXCLUSIVE OFFER</span>
                            <h2 style="color: white; margin: 15px 0 10px 0;">${data.specialOffer.title}</h2>
                            <p style="margin-bottom: 20px; opacity: 0.9;">${data.specialOffer.description}</p>
                            <a href="${data.specialOffer.link}" style="display: inline-block; padding: 12px 24px; background: white; color: #6c5ce7; text-decoration: none; border-radius: 10px; font-weight: 800;">REDEEM OFFER</a>
                        </div>
                    ` : ''}

                    <p style="margin-top: 40px; font-size: 14px; color: #888; text-align: center;">
                        Join 10,000+ creators. Get the latest AI tools and exclusive deals to your inbox.
                    </p>
                `);
                break;

            default:
                throw new Error('Unsupported email type');
        }

        // ✉️ Send via Resend (Using Verified Domain)
        const { data: resendData, error } = await resend.emails.send({
            from: 'HUBly Team <newsletter@hubly-tools.com>',
            to: [to],
            reply_to: 'support@hubly-tools.com',
            subject: subject,
            html: htmlContent,
        });

        if (error) throw error;

        console.log(`✅ [Email Engine] Sent ${type} to ${to}`);
        return res.status(200).json({ success: true, id: resendData.id });

    } catch (err) {
        console.error('❌ [Email Engine Error]:', err);
        return res.status(500).json({ error: err.message });
    }
}
