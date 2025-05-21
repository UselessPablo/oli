// pages/api/upload.js
import { put } from '@vercel/blob';

export const config = {
    api: {
        bodyParser: false, // Necesario para manejar FormData
    },
};

export default async function handler(req, res) {
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    try {
        // Usamos un parser manual para FormData
        const chunks = [];
        for await (const chunk of req) {
            chunks.push(chunk);
        }
        const buffer = Buffer.concat(chunks);

        const blob = await put(`product-${Date.now()}.jpg`, buffer, {
            access: 'public',
            token: process.env.BLOB_READ_WRITE_TOKEN,
        });

        return res.status(200).json({
            success: true,
            url: blob.url,
        });
    } catch (error) {
        console.error('Upload error:', error);
        return res.status(500).json({
            success: false,
            error: error.message
        });
    }
}