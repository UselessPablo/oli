import { put } from '@vercel/blob';

export default async function upload(request) {
    const formData = await request.formData();
    const file = formData.get('file');

    if (!file) {
        return new Response(JSON.stringify({ error: 'No file provided' }), {
            status: 400,
            headers: { 'Content-Type': 'application/json' },
        });
    }

    const blob = await put(file.name, file, {
        access: 'public',
    });

    return new Response(JSON.stringify({ url: blob.url }), {
        status: 200,
        headers: { 'Content-Type': 'application/json' },
    });
}