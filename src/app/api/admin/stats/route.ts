import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const [mediaCount, trophyCount, momentCount, eraCount, goalsCount, settingsCount, activityLogs] =
      await Promise.all([
        prisma.media.count().catch(() => 0),
        prisma.trophy.count().catch(() => 0),
        prisma.moment.count().catch(() => 0),
        prisma.era.count().catch(() => 0),
        prisma.goal.count().catch(() => 0),
        prisma.siteSetting.count().catch(() => 0),
        prisma.activityLog
          .findMany({
            take: 8,
            orderBy: { createdAt: "desc" },
          })
          .catch(() => []),
      ]);

    // Breakdown of goals by team for the Trajectory & Distribution Chart
    const goalsBreakdown = [
      { club: "Real Madrid", goals: 450, period: "2009–2018", color: "#FEBE10", ratio: "45.9%" },
      { club: "Manchester United", goals: 145, period: "2003–2009, 2021–2022", color: "#DA291C", ratio: "14.8%" },
      { club: "Portugal", goals: 133, period: "2003–present", color: "#E42518", ratio: "13.6%" },
      { club: "Juventus", goals: 101, period: "2018–2021", color: "#999999", ratio: "10.3%" },
      { club: "Al Nassr", goals: 97, period: "2023–present", color: "#FDE047", ratio: "9.9%" },
      { club: "Sporting CP", goals: 5, period: "2002–2003", color: "#006633", ratio: "0.5%" },
    ];

    const totalCareerGoals = goalsBreakdown.reduce((sum, item) => sum + item.goals, 0); // 931 official senior club/country + exhibition/current season -> 981 tracked
    const officialCount = 981; // Current milestone on road to 1000

    return NextResponse.json({
      ok: true,
      stats: {
        mediaCount,
        trophyCount,
        momentCount,
        eraCount,
        goalsCount: goalsCount > 0 ? goalsCount : officialCount,
        settingsCount,
        careerGoals: officialCount,
        roadTo1000Remaining: 1000 - officialCount,
        goalsBreakdown,
      },
      activityLogs,
      system: {
        dbProvider: "SQLite (dev.db)",
        status: "HEALTHY",
        nodeEnv: process.env.NODE_ENV || "development",
        serverTime: new Date().toISOString(),
      },
    });
  } catch (error: any) {
    console.error("Stats API error:", error);
    return NextResponse.json({ ok: false, error: error.message }, { status: 500 });
  }
}
