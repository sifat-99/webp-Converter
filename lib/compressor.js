const sharp = require('sharp');

/**
 * Compresses an image buffer using sharp with WebP format.
 * Supports manual quality or auto binary search to meet target file size.
 * 
 * @param {Buffer} buffer - Raw image file buffer
 * @param {object} query - Query parameters (quality, minKb, maxKb)
 * @returns {Promise<{buffer: Buffer, finalQuality: number, size: number}>}
 */
async function compressImageBuffer(buffer, query = {}) {
    const qualityParam = query.quality;
    const isAuto = qualityParam === 'auto';
    const quality = isAuto ? 85 : (parseInt(qualityParam, 10) || 85);

    if (!buffer || buffer.length === 0) {
        throw new Error('No image data provided');
    }

    let compressedBuffer;
    let finalQuality = quality;

    if (isAuto) {
        const minKb = parseInt(query.minKb, 10) || 100;
        const maxKb = parseInt(query.maxKb, 10) || 110;
        const minBytes = minKb * 1024;
        const maxBytes = maxKb * 1024;

        let low = 1;
        let high = 100;
        let bestBuffer = null;
        let bestQuality = 1;

        // Check if quality 100 is already small enough
        const maxQualBuffer = await sharp(buffer)
            .webp({ quality: 100, effort: 6, smartSubsample: true })
            .toBuffer();

        if (maxQualBuffer.length <= maxBytes) {
            compressedBuffer = maxQualBuffer;
            finalQuality = 100;
        } else {
            // Binary search for ideal quality
            while (low <= high) {
                const mid = Math.floor((low + high) / 2);
                const testBuffer = await sharp(buffer)
                    .webp({ quality: mid, effort: 6, smartSubsample: true })
                    .toBuffer();

                if (testBuffer.length >= minBytes && testBuffer.length <= maxBytes) {
                    compressedBuffer = testBuffer;
                    finalQuality = mid;
                    break;
                }

                if (testBuffer.length > maxBytes) {
                    high = mid - 1;
                } else {
                    low = mid + 1;
                    bestBuffer = testBuffer;
                    bestQuality = mid;
                }
            }

            if (!compressedBuffer) {
                if (bestBuffer) {
                    compressedBuffer = bestBuffer;
                    finalQuality = bestQuality;
                } else {
                    compressedBuffer = await sharp(buffer)
                        .webp({ quality: 1, effort: 6, smartSubsample: true })
                        .toBuffer();
                    finalQuality = 1;
                }
            }
        }
    } else {
        compressedBuffer = await sharp(buffer)
            .webp({
                quality,
                effort: 6,
                smartSubsample: true
            })
            .toBuffer();
    }

    return {
        buffer: compressedBuffer,
        finalQuality,
        size: compressedBuffer.length
    };
}

module.exports = { compressImageBuffer };

