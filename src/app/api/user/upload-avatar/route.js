import { NextResponse } from 'next/server';
import { supabaseAdmin } from '../../../../lib/supabaseAdmin';

export const dynamic = 'force-dynamic';

export async function POST(request) {
    try {
        // 1. Authenticate the user
        const authHeader = request.headers.get('Authorization');
        if (!authHeader?.startsWith('Bearer ')) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const token = authHeader.slice(7);
        const { data: { user }, error: authError } = await supabaseAdmin.auth.getUser(token);
        if (authError || !user) {
            return NextResponse.json({ error: 'Unauthorized: Invalid token' }, { status: 401 });
        }

        // 2. Parse the file from the form data
        const formData = await request.formData();
        const file = formData.get('file');

        if (!file) {
            return NextResponse.json({ error: 'No file provided.' }, { status: 400 });
        }

        // 3. Validate file size (2MB max)
        const MAX_SIZE = 2 * 1024 * 1024;
        if (file.size > MAX_SIZE) {
            return NextResponse.json({ error: 'Image must be under 2MB.' }, { status: 400 });
        }

        // 4. Validate mime type
        const allowedTypes = ['image/png', 'image/jpeg', 'image/gif', 'image/webp'];
        if (!allowedTypes.includes(file.type)) {
            return NextResponse.json({ error: 'Only PNG, JPG, GIF and WebP images are allowed.' }, { status: 400 });
        }

        // 5. Deterministic file path — one file per user, always overwritten
        const ext = file.name.split('.').pop().toLowerCase();
        const filePath = `${user.id}.${ext}`;

        // 6. Convert file to ArrayBuffer for upload
        const arrayBuffer = await file.arrayBuffer();
        const fileBuffer = new Uint8Array(arrayBuffer);

        // 7. Upload using the ADMIN client — bypasses RLS entirely
        const { error: uploadError } = await supabaseAdmin.storage
            .from('avatars')
            .upload(filePath, fileBuffer, {
                upsert: true,
                contentType: file.type,
                cacheControl: '3600'
            });

        if (uploadError) {
            console.error('❌ Avatar upload error:', uploadError);
            return NextResponse.json({ error: uploadError.message }, { status: 500 });
        }

        // 8. Get the public URL with a cache-busting timestamp
        const { data: urlData } = supabaseAdmin.storage
            .from('avatars')
            .getPublicUrl(filePath);

        const publicUrl = `${urlData.publicUrl}?t=${Date.now()}`;

        // 9. Sync the new avatar URL to the user's Auth Metadata
        await supabaseAdmin.auth.admin.updateUserById(user.id, {
            user_metadata: { ...user.user_metadata, avatar_url: publicUrl }
        });

        // 10. Update the profiles table as well
        await supabaseAdmin
            .from('profiles')
            .update({ avatar_url: publicUrl, updated_at: new Date().toISOString() })
            .eq('id', user.id);

        return NextResponse.json({ url: publicUrl });
    } catch (err) {
        console.error('❌ [Upload Avatar Route Error]:', err.message);
        return NextResponse.json({ error: err.message }, { status: 500 });
    }
}
