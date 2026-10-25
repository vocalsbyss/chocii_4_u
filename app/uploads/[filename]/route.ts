import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import fs from "fs";
import path from "path";

export const dynamic = "force-dynamic";

export async function GET(
  req: NextRequest,
  { params }: { params: { filename: string } }
) {
  try {
    const { filename } = params;
    // Prevent directory traversal
    const safeFilename = path.basename(filename);

    const ext = path.extname(safeFilename).toLowerCase();
    let contentType = "application/octet-stream";
    if (ext === ".jpg" || ext === ".jpeg") contentType = "image/jpeg";
    else if (ext === ".png") contentType = "image/png";
    else if (ext === ".webp") contentType = "image/webp";
    else if (ext === ".gif") contentType = "image/gif";
    else if (ext === ".avif") contentType = "image/avif";
    else if (ext === ".svg") contentType = "image/svg+xml";
    else if (ext === ".mp4") contentType = "video/mp4";
    else if (ext === ".webm") contentType = "video/webm";
    else if (ext === ".mov") contentType = "video/quicktime";
    else if (ext === ".ogg") contentType = "video/ogg";


    // 1. Check local /tmp/uploads (fastest in serverless)
    const tmpFilePath = path.join("/tmp", "uploads", safeFilename);
    if (fs.existsSync(tmpFilePath)) {
      try {
        const fileBuffer = await fs.promises.readFile(tmpFilePath);
        return new NextResponse(fileBuffer, {
          status: 200,
          headers: {
            "Content-Type": contentType,
            "Cache-Control": "public, max-age=31536000, immutable",
          },
        });
      } catch (_) {}
    }

    // 2. Check public/uploads (local development & pre-bundled assets)
    const publicFilePath = path.join(process.cwd(), "public", "uploads", safeFilename);
    if (fs.existsSync(publicFilePath)) {
      try {
        const fileBuffer = await fs.promises.readFile(publicFilePath);
        return new NextResponse(fileBuffer, {
          status: 200,
          headers: {
            "Content-Type": contentType,
            "Cache-Control": "public, max-age=31536000, immutable",
          },
        });
      } catch (_) {}
    }

    // 3. Check database persistence for serverless instance sharing
    try {
      const dbImage = await prisma.uploadedImage.findUnique({
        where: { filename: safeFilename },
      });

      if (dbImage && dbImage.base64) {
        const fileBuffer = Buffer.from(dbImage.base64, "base64");

        // Cache locally in /tmp for future instant requests on this instance
        try {
          const tmpDir = path.join("/tmp", "uploads");
          if (!fs.existsSync(tmpDir)) fs.mkdirSync(tmpDir, { recursive: true });
          fs.writeFileSync(tmpFilePath, fileBuffer);
        } catch (_) {}

        return new NextResponse(fileBuffer, {
          status: 200,
          headers: {
            "Content-Type": dbImage.mimeType || contentType,
            "Cache-Control": "public, max-age=31536000, immutable",
          },
        });
      }
    } catch (dbErr) {
      console.warn("Could not query uploadedImage from database:", dbErr);
    }

    return new NextResponse("Image not found", { status: 404 });
  } catch (error) {
    console.error("Error serving uploaded image:", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}
