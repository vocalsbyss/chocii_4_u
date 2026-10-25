import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const setting = await prisma.storeSetting.findUnique({
      where: { key: "homepage_style" },
    });
    return NextResponse.json({
      success: true,
      style: setting?.value || "classic",
    });
  } catch (error) {
    return NextResponse.json({ success: true, style: "classic" });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const style = body.style === "cooldock" ? "cooldock" : "classic";

    await prisma.storeSetting.upsert({
      where: { key: "homepage_style" },
      update: { value: style },
      create: {
        key: "homepage_style",
        value: style,
        description: "Homepage Showcase Style: classic or cooldock",
      },
    });

    return NextResponse.json({
      success: true,
      style,
      message: `Homepage style updated to ${style}`,
    });
  } catch (error) {
    console.error("Error setting preview style:", error);
    return NextResponse.json(
      { error: "Failed to update style" },
      { status: 500 }
    );
  }
}
