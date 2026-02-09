/**
 * Generates lightweight WebP versions of homepage images (300px wide).
 * Run: node scripts/optimize-home-images.js
 * Used by: npm run build (prebuild)
 */
import { existsSync } from "fs";
import { dirname, join } from "path";
import sharp from "sharp";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = join(__dirname, "..");
const publicDir = join(root, "public");
const WIDTH = 300;
const WEBP_QUALITY = 78;

const tasks = [
  { input: "photo.jpg", output: "photo-home.webp" },
  { input: "epsteined_photo.png", output: "epsteined_photo-home.webp" },
];

for (const { input, output } of tasks) {
  const inputPath = join(publicDir, input);
  const outputPath = join(publicDir, output);
  if (!existsSync(inputPath)) {
    console.warn(`Skip ${input}: file not found`);
    continue;
  }
  try {
    await sharp(inputPath)
      .resize(WIDTH, null, { withoutEnlargement: true })
      .webp({ quality: WEBP_QUALITY })
      .toFile(outputPath);
    console.log(`Created ${output}`);
  } catch (err) {
    console.error(`Error processing ${input}:`, err.message);
    process.exitCode = 1;
  }
}
