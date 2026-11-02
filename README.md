# webp-Converter

An ultra-fast, cross-browser WebP image compressor with live before/after comparison viewers, auto-target byte sizing, sequential renaming, and batch download.

## Features
- **100% Cross-Browser Support**: Works flawlessly on Chrome, Edge, Firefox, Safari (macOS & iOS), and Android browsers.
- **Dual-Engine Architecture**:
  - **⚡ In-Browser Engine (Default)**: Compresses images 100% locally via Canvas WebP encoder. Instant, private, no network latency, and zero file size limits!
  - **🖥️ Server Engine**: Uses Node.js `sharp` with `libvips` for high-precision compression.
- **Auto-Bypass for Vercel Limits**: Images larger than 4.2 MB seamlessly compress client-side to bypass Vercel's 4.5 MB Serverless Function payload limit.
- **Flexible File Input**:
  - Drag & Drop folders or loose images (uses recursive `webkitGetAsEntry` supported by Safari, Firefox, and Chrome).
  - Native "📂 Select Folder" and "🖼️ Select Images" buttons.
- **Universal Saving & Exporting**:
  - **📦 Download All as ZIP (.zip)**: Works on all browsers and mobile devices.
  - **💾 Save Directly to Folder**: Direct disk writing via File System Access API (Chrome/Edge desktop).
  - **⬇ Individual Download**: Download any converted WebP image directly from its card.
- **Interactive Before/After Viewer**: Split-screen slider with pan, zoom (wheel/pinch), and fullscreen expand.

---

## Local Development

```bash
# 1. Install dependencies
npm install

# 2. Start server
npm start
```
Open [http://localhost:3005](http://localhost:3005) in any browser.

---

## Deploying to Vercel

### Method 1: Using Vercel CLI (Fastest)

1. Open your terminal and navigate to this folder:
   ```bash
   cd "Image compressor/web-app"
   ```
2. Run Vercel deploy:
   ```bash
   npx vercel
   ```
3. Follow the prompts (accept defaults by pressing Enter).
4. For production deployment:
   ```bash
   npx vercel --prod
   ```

### Method 2: Via GitHub / Vercel Dashboard

1. Push your repository to GitHub.
2. In your [Vercel Dashboard](https://vercel.com/new), import the repository.
3. If this folder is inside a monorepo or subfolder, set:
   - **Root Directory**: `Image compressor/web-app`
   - **Framework Preset**: `Other`
   - **Build Command**: `npm run build` (or leave default)
   - **Output Directory**: Leave empty
4. Click **Deploy**!

