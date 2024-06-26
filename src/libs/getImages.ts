// lib/getImages.ts
import fs from "fs/promises";
import path from "path";
import sharp from "sharp";

interface ImageData {
  src: string;
  alt: string;
  width: number;
  height: number;
}

export async function getImages(): Promise<ImageData[]> {
  const imagesDirectory = path.join(process.cwd(), "public/images");
  const filenames = await fs.readdir(imagesDirectory);

  const imageExtensions = new Set([".jpeg", ".jpg", ".png", ".webp", ".svg"]);
  const imageFiles = filenames.filter((filename) =>
    imageExtensions.has(path.extname(filename).toLowerCase()),
  );

  const images: ImageData[] = await Promise.all(
    imageFiles.map(async (filename) => {
      const filePath = path.join(imagesDirectory, filename);
      const image = sharp(filePath);
      const metadata = await image.metadata();

      return {
        src: `/images/${filename}`,
        alt: filename,
        width: metadata.width || 0,
        height: metadata.height || 0,
      };
    }),
  );

  return images;
}
