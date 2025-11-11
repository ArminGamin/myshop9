// Generate .webp and .avif variants for local product images in /public/products/**
// Requires: sharp (installed in devDependencies)
import fs from 'fs';
import path from 'path';
import sharp from 'sharp';

const ROOT = process.cwd();
const PRODUCTS_DIR = path.join(ROOT, 'public', 'products');

async function ensureVariant(srcPath, formatExt) {
  const dir = path.dirname(srcPath);
  const base = path.basename(srcPath, path.extname(srcPath));
  const out = path.join(dir, `${base}.${formatExt}`);
  if (fs.existsSync(out)) return;
  try {
    // Resize/compress to reasonable bounds for web; keep hero slightly larger
    const isHero = /megztiniai\/red\.(png|jpe?g)$/i.test(srcPath);
    const maxWidth = isHero ? 1600 : 1200;
    const maxHeight = isHero ? 1200 : 900;
    const quality = formatExt === 'webp' ? 80 : 55; // avif can be lower quality visually similar

    const pipeline = sharp(srcPath).resize({ width: maxWidth, height: maxHeight, fit: 'inside', withoutEnlargement: true });
    await pipeline.toFormat(formatExt === 'webp' ? 'webp' : 'avif', { quality }).toFile(out);
    console.log('Generated', out.replace(ROOT, ''));
  } catch (e) {
    console.warn('Skip variant for', srcPath, e?.message || e);
  }
}

function isRaster(file) {
  return /\.(png|jpg|jpeg)$/i.test(file);
}

async function walk(dir) {
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  for (const ent of entries) {
    const p = path.join(dir, ent.name);
    if (ent.isDirectory()) {
      await walk(p);
    } else if (ent.isFile() && isRaster(ent.name)) {
      // Always generate WebP/AVIF neighbors for each raster image
      await ensureVariant(p, 'webp');
      await ensureVariant(p, 'avif');
    }
  }
}

if (fs.existsSync(PRODUCTS_DIR)) {
  walk(PRODUCTS_DIR).catch((e) => {
    console.error('Image variant generation failed:', e);
    process.exit(0); // do not fail the build
  });
} else {
  console.log('No /public/products directory found; skipping image variants.');
}


