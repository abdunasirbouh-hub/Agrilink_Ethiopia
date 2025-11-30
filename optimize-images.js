const imagemin = require('imagemin');
const imageminMozjpeg = require('imagemin-mozjpeg');
const imageminPngquant = require('imagemin-pngquant');
const fs = require('fs');
const path = require('path');

async function optimizeImages() {
    // Create dist/images directory if it doesn't exist
    const distDir = path.join(__dirname, 'dist', 'images');
    if (!fs.existsSync(distDir)) {
        fs.mkdirSync(distDir, { recursive: true });
    }

    try {
        const files = await imagemin(['images/*.{jpg,jpeg,png}'], {
            destination: distDir,
            plugins: [
                imageminMozjpeg({
                    quality: 80,
                    progressive: true
                }),
                imageminPngquant({
                    quality: [0.6, 0.8],
                    speed: 4
                })
            ]
        });

        console.log(`✅ Optimized ${files.length} images`);
        console.log(`📁 Output directory: ${distDir}`);
    } catch (error) {
        console.error('❌ Error optimizing images:', error);
        process.exit(1);
    }
}

optimizeImages();

