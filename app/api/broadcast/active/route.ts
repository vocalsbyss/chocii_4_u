import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { getTodayOrUpcomingFestival } from "@/lib/festivals";

export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  try {
    // 1. Check if admin manually activated a custom campaign banner
    const activeBroadcast = await prisma.broadcast.findFirst({
      where: {
        isActiveBanner: true,
      },
      orderBy: { updatedAt: "desc" },
    });

    if (activeBroadcast) {
      return NextResponse.json({
        hasActive: true,
        broadcast: activeBroadcast,
        source: "ADMIN_CUSTOM",
      });
    }

    // 2. If no custom broadcast is active, automatically check for today's or upcoming festival
    const festivalResult = getTodayOrUpcomingFestival();
    if (festivalResult.festival) {
      const f = festivalResult.festival;
      const daysText =
        festivalResult.daysUntil === 0
          ? "Today"
          : festivalResult.daysUntil === 1
          ? "Tomorrow"
          : `in ${festivalResult.daysUntil} days`;

      return NextResponse.json({
        hasActive: true,
        broadcast: {
          id: `auto-fest-${f.id}`,
          title: `${f.headline}`,
          occasion: f.name.toUpperCase(),
          subject: `${f.emoji} ${f.headline} from chocii 4 u!`,
          message: `${f.wish}\n\n${f.significance}\n\nWishing you, your loved ones, and your family a peaceful, blessed, and joyous ${f.name} filled with sweetness, warmth, and memorable celebrations!\n\nWarm greetings from the chocii 4 u artisanal dessert kitchen team.\n\n“A Little Treat, Just for You.” ✨`,
          mediaUrl: null,
          mediaType: null,
          offerCode: null,
          discountText: null,
          validTill: null,
          ctaText: "Explore Sweet Delights",
          ctaLink: "/#full-menu-section",
          isAutoFestival: true,
          festivalDaysText: daysText,
        },
        source: "AUTO_FESTIVAL",
      });
    }

    return NextResponse.json({ hasActive: false, broadcast: null });
  } catch (error: any) {
    console.error("Error fetching active broadcast:", error);
    return NextResponse.json({ hasActive: false, broadcast: null });
  }
}
