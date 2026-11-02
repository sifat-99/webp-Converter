const express = require('express');
const path = require('path');
const { compressImageBuffer } = require('./lib/compressor');

const app = express();
const PORT = process.env.PORT || 3005;

// Serve public static directory
app.use(express.static(path.join(__dirname, 'public')));

// Raw body parser for compression endpoint up to 50mb (accepts any content-type)
app.use('/api/compress', express.raw({ type: () => true, limit: '50mb' }));

app.post('/api/compress', async (req, res) => {
    try {
        const buffer = req.body;
        if (!buffer || buffer.length === 0) {
            return res.status(400).send('No image data provided');
        }

        const result = await compressImageBuffer(buffer, req.query);

        res.set('Access-Control-Expose-Headers', 'X-File-Size, X-Final-Quality');
        res.set('X-File-Size', result.size);
        res.set('X-Final-Quality', result.finalQuality);
        res.type('image/webp');
        res.send(result.buffer);
    } catch (err) {
        console.error('Compression error:', err);
        res.status(500).send(err.message || 'Compression failed');
    }
});

// Start local server if run directly
if (require.main === module) {
    app.listen(PORT, () => {
        console.log(`Server running at http://localhost:${PORT}`);
    });
}

module.exports = app;
