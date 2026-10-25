import { NextRequest, NextResponse } from "next/server";
import { getAdminSession } from "@/lib/auth";
import prisma from "@/lib/prisma";
import fs from "fs";
import path from "path";

export const dynamic = "force-dynamic";

export async function POST(req: NextRequest) {
  try {
    const admin = await getAdminSession();
    if (!admin) {
      return NextResponse.json({ error: "Unauthorized access" }, { status: 401 });
    }

    const formData = await req.formData();
    const file = formData.get("file") as File | null;

    if (!file) {
      return NextResponse.json(
        { error: "No image file provided for upload" },
        { status: 400 }
      );
    }

    // Validate MIME type
    if (!file.type.startsWith("image/")) {
      return NextResponse.json(
        { error: "Only image files (JPEG, PNG, WEBP, GIF, AVIF) can be uploaded" },
        { status: 400 }
      );
    }

    // Maximum file size: 12MB
    const MAX_SIZE = 12 * 1024 * 1024;
    if (file.size > MAX_SIZE) {
      return NextResponse.json(
        { error: "Image file is too large. Maximum allowed size is 12MB." },
        { status: 400 }
      );
    }

    // Determine extension
    let extension = path.extname(file.name || "").toLowerCase();
    if (!extension || extension === ".") {
      if (file.type === "image/png") extension = ".png";
      else if (file.type === "image/webp") extension = ".webp";
      else if (file.type === "image/gif") extension = ".gif";
      else extension = ".jpg";
    }

    // Generate unique safe filename
    const uniqueSuffix = `${Date.now()}-${Math.random().toString(36).substring(2, 9)}`;
    const filename = `dessert-${uniqueSuffix}${extension}`;

    // Convert file to buffer
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);
    const base64Data = buffer.toString("base64");

    // 1. Try to save locally in public/uploads if writable (local development)
    try {
      const publicUploadsDir = path.join(process.cwd(), "public", "uploads");
      if (!fs.existsSync(publicUploadsDir)) {
        fs.mkdirSync(publicUploadsDir, { recursive: true });
      }
      const publicDestPath = path.join(publicUploadsDir, filename);
      await fs.promises.writeFile(publicDestPath, buffer);
    } catch (_) {
      // Ignored on read-only serverless filesystems (e.g. Vercel /var/task)
    }

    // 2. Always save to /tmp/uploads for fast serverless local caching
    try {
      const tmpUploadsDir = path.join("/tmp", "uploads");
      if (!fs.existsSync(tmpUploadsDir)) {
        fs.mkdirSync(tmpUploadsDir, { recursive: true });
      }
      const tmpDestPath = path.join(tmpUploadsDir, filename);
      await fs.promises.writeFile(tmpDestPath, buffer);
    } catch (tmpErr) {
      console.warn("Could not cache upload to /tmp:", tmpErr);
    }

    // 3. Persist image in database so all serverless instances can serve it
    try {
      await prisma.uploadedImage.upsert({
        where: { filename },
        create: {
          filename,
          mimeType: file.type || "image/jpeg",
          base64: base64Data,
          size: file.size,
        },
        update: {
          mimeType: file.type || "image/jpeg",
          base64: base64Data,
          size: file.size,
        },
      });
    } catch (dbErr) {
      console.warn("Could not save uploaded image to database:", dbErr);
    }

    const publicUrl = `/uploads/${filename}`;

    return NextResponse.json({
      success: true,
      url: publicUrl,
      filename,
      size: file.size,
      type: file.type,
    });
  } catch (error: any) {
    console.error("Admin image upload error:", error);
    return NextResponse.json(
      { error: error?.message || "Failed to process image upload from gallery" },
      { status: 500 }
    );
  }
}
