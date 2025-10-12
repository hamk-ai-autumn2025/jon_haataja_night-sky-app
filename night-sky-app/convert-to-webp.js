import sharp from "sharp";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const assetsDir = path.join(__dirname, "src", "assets");

// Get all PNG files in the assets directory
const files = fs.readdirSync(assetsDir).filter((file) => file.endsWith(".png"));

console.log(`Found ${files.length} PNG files to convert...\n`);

// Convert each PNG to WebP
Promise.all(
  files.map(async (file) => {
    const inputPath = path.join(assetsDir, file);
    const outputPath = path.join(assetsDir, file.replace(".png", ".webp"));

    try {
      await sharp(inputPath)
        .webp({ quality: 85 }) // High quality with good compression
        .toFile(outputPath);

      const inputStats = fs.statSync(inputPath);
      const outputStats = fs.statSync(outputPath);
      const reduction = (
        (1 - outputStats.size / inputStats.size) *
        100
      ).toFixed(1);

      console.log(`✓ ${file} → ${file.replace(".png", ".webp")}`);
      console.log(
        `  ${(inputStats.size / 1024).toFixed(1)}KB → ${(outputStats.size / 1024).toFixed(1)}KB (${reduction}% smaller)\n`,
      );
    } catch (error) {
      console.error(`✗ Error converting ${file}:`, error.message);
    }
  }),
)
  .then(() => {
    console.log("Conversion complete! ✨");
    console.log(
      "\nNote: Original PNG files are kept. You can delete them after verifying the WebP versions work correctly.",
    );
  })
  .catch((error) => {
    console.error("Conversion failed:", error);
  });
