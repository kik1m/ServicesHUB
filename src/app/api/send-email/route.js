import { NextResponse } from 'next/server';
import { Resend } from 'resend';

// Initialize Resend
const resend = process.env.RESEND_API_KEY ? new Resend(process.env.RESEND_API_KEY) : null;

export async function POST(request) {
    if (!resend) {
        console.error('RESEND_API_KEY is missing in environment variables.');
        return NextResponse.json({ error: 'Email service is not configured.' }, { status: 500 });
    }

    try {
        const body = await request.json();
        const { to, subject, type, data } = body;

        if (!to || !subject || !type) {
            return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
        }

        let htmlContent = '';
        
        // Brand Identity Tokens
        const brandSecondary = '#00d2ff';
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
                        <p>© ${new Date().getFullYear()} HUBly Tools. All rights reserved.</p>
                        <div style="margin-top: 10px;">
                            <a href="https://hubly-tools.com" style="color: #636e72; text-decoration: none;">Visit Platform</a>
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
                        <strong>Date:</strong> ${new Date().toLocaleString()}
                    </div>
                    <div style="text-align: center;">
                        <a href="https://hubly-tools.com/settings" class="button" style="background: #ff4757; color: white !important;">Secure My Account</a>
                    </div>
                `);
                break;

            case 'subscription_success':
                const promoteFeatures = data.planName === 'Elite Tier' || data.planName === 'Featured' ? `
                    <li style="margin-bottom: 10px;">✅ <strong>Duration:</strong> 30 Days of continuous promotion</li>
                    <li style="margin-bottom: 10px;">✅ <strong>Visibility:</strong> Premium Homepage Placement</li>
                    <li style="margin-bottom: 10px;">✅ <strong>Verification:</strong> Automatic Verified Badge</li>
                ` : `
                    <li style="margin-bottom: 10px;">✅ <strong>Duration:</strong> 30 Days of continuous promotion</li>
                    <li style="margin-bottom: 10px;">✅ <strong>Visibility:</strong> High Priority Category Ranking</li>
                    <li style="margin-bottom: 10px;">✅ <strong>Verification:</strong> Automatic Verified Badge</li>
                `;
                htmlContent = getWrapper(`
                    <span class="badge" style="background: rgba(0,210,255,0.1); color: #00d2ff;">PROMOTION ACTIVATED</span>
                    <h1>Your Tool is now Promoted! 🚀</h1>
                    <p>Hello ${data.userName}, we have successfully activated the <strong>${data.planName}</strong> plan for your tool <strong>${data.toolName}</strong>.</p>
                    <p style="color: #bbb;">Your tool is now receiving priority visibility across the HUBly platform. This promotion is strictly active for the next 30 days as per our terms.</p>
                    <div class="card">
                        <ul style="list-style: none; padding: 0; margin: 0;">
                            ${promoteFeatures}
                        </ul>
                    </div>
                    <div style="text-align: center;">
                        <a href="https://hubly-tools.com/docs/promote" class="button" style="margin-right: 10px; background: #333; color: white !important;">Read Guidelines</a>
                        <a href="https://hubly-tools.com/dashboard" class="button">Go to Dashboard</a>
                    </div>
                `);
                break;

            case 'premium_upgrade':
                const isPremiumElite = data.planName === 'Elite Tier';
                const premiumFeatures = isPremiumElite ? `
                    <li style="margin-bottom: 10px;">✨ <strong>Advanced AI Limit:</strong> 500 Queries / 6 Hours</li>
                    <li style="margin-bottom: 10px;">✨ <strong>Priority Models:</strong> OpenAI o1 & Claude 3.5 Opus</li>
                    <li style="margin-bottom: 10px;">✨ <strong>Fast-Track:</strong> Instant tool submission approval</li>
                ` : `
                    <li style="margin-bottom: 10px;">✨ <strong>Pro AI Limit:</strong> 150 Queries / 6 Hours</li>
                    <li style="margin-bottom: 10px;">✨ <strong>Standard Models:</strong> Claude 3.5 Sonnet & GPT-4o</li>
                    <li style="margin-bottom: 10px;">✨ <strong>Core Features:</strong> Full access to comparison tools</li>
                `;
                htmlContent = getWrapper(`
                    <span class="badge" style="background: rgba(191,90,242,0.1); color: #bf5af2;">SUBSCRIPTION ACTIVATED</span>
                    <h1>Welcome to HUBly ${isPremiumElite ? 'Elite' : 'Pro'}! 💎</h1>
                    <p>Hello ${data.userName}, your account has been successfully upgraded to the <strong>${data.planName}</strong> subscription.</p>
                    <p style="color: #bbb;">You now have enhanced access to our AI engine and platform features.</p>
                    <div style="background: rgba(255,255,255,0.05); padding: 12px; border-radius: 8px; font-size: 13px; color: #aaa; margin-bottom: 20px;">
                        <strong>Billing Notice:</strong> Your subscription is billed monthly and will renew automatically. You can manage or cancel your subscription at any time from your <a href="https://hubly-tools.com/settings" style="color: #00d2ff; text-decoration: none;">Account Settings</a> before the next billing cycle to avoid future charges.
                    </div>
                    <div class="card" style="border-left: 4px solid #bf5af2;">
                        <ul style="list-style: none; padding: 0; margin: 0;">
                            ${premiumFeatures}
                        </ul>
                    </div>
                    <div style="text-align: center;">
                        <a href="https://hubly-tools.com/docs/premium" class="button" style="margin-right: 10px; background: #333; color: white !important;">View Policies</a>
                        <a href="https://hubly-tools.com/premium" class="button" style="background: #bf5af2; color: white !important;">Access Platform</a>
                    </div>
                `);
                break;

            case 'newsletter_broadcast':
                htmlContent = getWrapper(`
                    <span class="badge" style="background: rgba(0,210,255,0.1); color: #00d2ff;">WEEKLY SPOTLIGHT</span>
                    <h1>${data.subject}</h1>
                    <p style="font-size: 16px; color: #636e72;">${data.intro}</p>
                    ${data.tools.map(tool => `
                        <div class="card" style="margin-bottom: 15px; padding: 20px;">
                            <table width="100%" cellpadding="0" cellspacing="0" border="0">
                                <tr>
                                    <td width="90" valign="top">
                                        <img src="${tool.image_url}" alt="${tool.name}" style="width: 80px; height: 80px; object-fit: cover; border-radius: 12px; border: 1px solid #333; display: block;">
                                    </td>
                                    <td valign="top" style="padding-left: 15px;">
                                        <h2 style="margin: 0 0 5px 0; font-size: 18px;">${tool.name}</h2>
                                        <p style="margin: 0 0 10px 0; font-size: 13px; color: #888; line-height: 1.4;">${tool.short_description}</p>
                                        <a href="https://hubly-tools.com/tool/${tool.slug}" style="color: ${brandSecondary}; font-weight: 800; text-decoration: none; font-size: 12px;">VIEW TOOL →</a>
                                    </td>
                                </tr>
                            </table>
                        </div>
                    `).join('')}
                `);
                break;

            default:
                throw new Error('Unsupported email type');
        }

        const { data: resendData, error } = await resend.emails.send({
            from: 'HUBly Team <newsletter@hubly-tools.com>',
            to: [to],
            reply_to: 'support@hubly-tools.com',
            subject: subject,
            html: htmlContent,
        });

        if (error) throw error;

        return NextResponse.json({ success: true, id: resendData.id });

    } catch (err) {
        console.error('❌ [Email Engine Error]:', err);
        return NextResponse.json({ error: err.message }, { status: 500 });
    }
}
