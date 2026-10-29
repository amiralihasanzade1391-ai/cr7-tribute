import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { seedDatabase } from "@/lib/seed";

export async function GET() {
  try {
    let settings = await prisma.siteSetting.findMany();

    if (settings.length === 0) {
      await seedDatabase().catch(() => null);
      settings = await prisma.siteSetting.findMany();
    }

    const settingsMap: Record<string, string> = {};
    for (const s of settings) {
      settingsMap[s.key] = s.value;
    }

    return NextResponse.json({ ok: true, settings: settingsMap });
  } catch (error: any) {
    return NextResponse.json({ ok: false, error: error.message }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const settings: Record<string, string> = body.settings || body;

    if (!settings || typeof settings !== "object") {
      return NextResponse.json({ error: "Invalid settings object" }, { status: 400 });
    }

    for (const [key, value] of Object.entries(settings)) {
      await prisma.siteSetting.upsert({
        where: { key },
        update: { value: String(value) },
        create: { key, value: String(value) },
      });
    }

    await prisma.activityLog.create({
      data: {
        action: "SETTINGS_UPDATED",
        details: `Updated ${Object.keys(settings).length} site settings`,
        user: "Admin",
      },
    }).catch(() => null);

    return NextResponse.json({ ok: true, message: "Settings saved successfully" });
  } catch (error: any) {
    return NextResponse.json({ ok: false, error: error.message }, { status: 500 });
  }
}
