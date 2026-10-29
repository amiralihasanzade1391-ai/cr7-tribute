import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const [trophies, moments, eras, media, siteSettings, goals, quotes, records] =
      await Promise.all([
        prisma.trophy.findMany(),
        prisma.moment.findMany(),
        prisma.era.findMany(),
        prisma.media.findMany(),
        prisma.siteSetting.findMany(),
        prisma.goal.findMany().catch(() => []),
        prisma.quote.findMany().catch(() => []),
        prisma.record.findMany().catch(() => []),
      ]);

    const backupData = {
      version: "2.5",
      exportedAt: new Date().toISOString(),
      generator: "CR7 Tribute CMS Vault",
      data: {
        trophies,
        moments,
        eras,
        media,
        siteSettings,
        goals,
        quotes,
        records,
      },
    };

    const json = JSON.stringify(backupData, null, 2);

    return new NextResponse(json, {
      status: 200,
      headers: {
        "Content-Type": "application/json",
        "Content-Disposition": `attachment; filename="cr7-backup-${new Date().toISOString().split("T")[0]}.json"`,
      },
    });
  } catch (error: any) {
    return NextResponse.json({ ok: false, error: error.message }, { status: 500 });
  }
}
