import { NextRequest, NextResponse } from "next/server";
import { getTodayOrUpcomingFestival, INDIAN_FESTIVALS } from "@/lib/festivals";

export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  try {
    const todayResult = getTodayOrUpcomingFestival();

    const enrichedFestival = todayResult.festival
      ? {
          ...todayResult.festival,
          greeting: todayResult.festival.headline,
          description: todayResult.festival.wish,
          date: todayResult.celebrationDateStr,
          isToday: todayResult.isToday,
          daysUntil: todayResult.daysUntil,
        }
      : null;

    return NextResponse.json({
      hasFestival: Boolean(todayResult.festival),
      festival: enrichedFestival,
      isToday: todayResult.isToday,
      daysUntil: todayResult.daysUntil,
      celebrationDateStr: todayResult.celebrationDateStr,
      allFestivals: INDIAN_FESTIVALS,
    });
  } catch (error: any) {
    console.error("Error fetching today's festival:", error);
    return NextResponse.json({
      hasFestival: false,
      festival: null,
      isToday: false,
      daysUntil: -1,
      celebrationDateStr: "",
      allFestivals: INDIAN_FESTIVALS,
    });
  }
}
