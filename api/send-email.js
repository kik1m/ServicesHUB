import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

export default async function handler(req, res) {
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method Not Allowed' });
    }

    const { to, subject, type, data } = req.body;

    if (!to || !subject || !type) {
        return res.status(400).json({ error: 'Missing required fields' });
    }

    try {
        let html = '';

        // 🏗️ Professional Email Template Builder
        const brandColor = '#00ffa2';
        const logoUrl = 'https://hubly-tools.com/logo.png';
        
        const header = `
            <div style="text-align: center; padding: 20px 0; background-color: #0a0a0a;">
                <img src="${logoUrl}" alt="HUBly" style="height: 40px; margin-bottom: 10px;">
                <h1 style="color: white; font-family: sans-serif; font-size: 24px; margin: 0;">HUBly Tools</h1>
            </div>
        `;

        const footer = `
            <div style="text-align: center; padding: 20px; font-family: sans-serif; font-size: 12px; color: #666; background-color: #f9f9f9; border-top: 1px solid #eee;">
                <p>&copy; ${new Date().getFullYear()} HUBly Tools. All rights reserved.</p>
                <p>You're receiving this because you're a valued member of our AI community.</p>
                <div style="margin-top: 10px;">
                    <a href="https://hubly-tools.com/privacy" style="color: #666; text-decoration: underline;">Privacy Policy</a> | 
                    <a href="https://hubly-tools.com/unsubscribe" style="color: #666; text-decoration: underline;">Unsubscribe</a>
                </div>
            </div>
        `;

        if (type === 'welcome') {
            html = `
                <div style="max-width: 600px; margin: 0 auto; border: 1px solid #eee; border-radius: 8px; overflow: hidden;">
                    ${header}
                    <div style="padding: 30px; font-family: sans-serif; line-height: 1.6; color: #333;">
                        <h2 style="color: #000;">Welcome to the Elite Community! 🚀</h2>
                        <p>Hi ${data.name || 'there'},</p>
                        <p>We're thrilled to have you on board. HUBly is the world's most advanced directory for AI tools, designed to help you find exactly what you need in seconds.</p>
                        <div style="margin: 30px 0; text-align: center;">
                            <a href="https://hubly-tools.com/search" style="background-color: ${brandColor}; color: #000; padding: 12px 25px; text-decoration: none; border-radius: 6px; font-weight: bold; display: inline-block;">Start Exploring Tools</a>
                        </div>
                        <p>If you have any questions, just hit reply. We're here to help.</p>
                        <p>Best regards,<br>The HUBly Team</p>
                    </div>
                    ${footer}
                </div>
            `;
        } else if (type === 'contact_confirmation') {
            html = `
                <div style="max-width: 600px; margin: 0 auto; border: 1px solid #eee; border-radius: 8px; overflow: hidden;">
                    ${header}
                    <div style="padding: 30px; font-family: sans-serif; line-height: 1.6; color: #333;">
                        <h2 style="color: #000;">Message Received! ✅</h2>
                        <p>Hi ${data.name},</p>
                        <p>Thanks for reaching out to HUBly Tools. We've received your message regarding "<strong>${subject}</strong>" and our team will get back to you within 24-48 hours.</p>
                        <div style="background-color: #f5f5f5; padding: 15px; border-radius: 8px; margin: 20px 0;">
                            <p style="margin: 0; font-style: italic;">"${data.message}"</p>
                        </div>
                        <p>Talk soon!</p>
                    </div>
                    ${footer}
                </div>
            `;
        }

        const { data: resendData, error } = await resend.emails.send({
            from: 'HUBly Tools <noreply@hubly-tools.com>',
            to: [to],
            subject: subject,
            html: html,
        });

        if (error) {
            console.error('[Resend Error]:', error);
            return res.status(500).json({ error: error.message });
        }

        return res.status(200).json({ success: true, id: resendData.id });

    } catch (err) {
        console.error('[Email API Error]:', err);
        return res.status(500).json({ error: err.message });
    }
}
