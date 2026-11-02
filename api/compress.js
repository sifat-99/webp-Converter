const { compressImageBuffer } = require('../lib/compressor');

module.exports = async (req, res) => {
    // Helper for cross-environment response handling (Vercel, Express, standard Node http)
    const send = (statusCode, data, contentType = 'text/plain') => {
        if (typeof res.status === 'function') {
            res.status(statusCode);
        } else {
            res.statusCode = statusCode;
        }

        if (contentType && !res.getHeader('Content-Type')) {
            res.setHeader('Content-Type', contentType);
        }

        if (typeof res.send === 'function') {
            return res.send(data);
        } else {
            return res.end(data);
        }
    };

    // CORS headers
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, X-File-Size, X-Final-Quality');
    res.setHeader('Access-Control-Expose-Headers', 'X-File-Size, X-Final-Quality');

    if (req.method === 'OPTIONS') {
        if (typeof res.status === 'function') res.status(200);
        else res.statusCode = 200;
        return res.end();
    }

    if (req.method !== 'POST') {
        return send(405, 'Method Not Allowed');
    }

    try {
        let buffer;
        if (Buffer.isBuffer(req.body)) {
            buffer = req.body;
        } else if (typeof req.body === 'string') {
            buffer = Buffer.from(req.body);
        } else {
            // Read raw buffer from readable stream
            const chunks = [];
            for await (const chunk of req) {
                chunks.push(typeof chunk === 'string' ? Buffer.from(chunk) : chunk);
            }
            buffer = Buffer.concat(chunks);
        }

        if (!buffer || buffer.length === 0) {
            return send(400, 'No image data provided');
        }

        // Query parameters (from req.query or parsing req.url)
        let query = req.query;
        if (!query && req.url) {
            const parsedUrl = new URL(req.url, 'http://localhost');
            query = Object.fromEntries(parsedUrl.searchParams);
        }

        const result = await compressImageBuffer(buffer, query || {});

        res.setHeader('X-File-Size', result.size);
        res.setHeader('X-Final-Quality', result.finalQuality);
        return send(200, result.buffer, 'image/webp');
    } catch (err) {
        console.error('Serverless compression error:', err);
        return send(500, err.message || 'Compression failed');
    }
};

// Disable Vercel's default JSON body parser to receive raw binary image stream
module.exports.config = {
    api: {
        bodyParser: false,
    },
};
