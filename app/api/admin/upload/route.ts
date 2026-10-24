import { NextRequest, NextResponse } from "next/server";
import { getAdminSession } from "@/lib/auth";
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

    // Ensure uploads directory exists in public/uploads
    const uploadsDir = path.join(process.cwd(), "public", "uploads");
    if (!fs.existsSync(uploadsDir)) {
      fs.mkdirSync(uploadsDir, { recursive: true });
    }

    // Generate unique safe filename
    const uniqueSuffix = `${Date.now()}-${Math.random().toString(36).substring(2, 9)}`;
    const filename = `dessert-${uniqueSuffix}${extension}`;
    const destinationPath = path.join(uploadsDir, filename);

    // Write file buffer
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);
    await fs.promises.writeFile(destinationPath, buffer);

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
