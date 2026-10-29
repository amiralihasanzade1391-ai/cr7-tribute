import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const backup = body.data || body;

    let restoredCount = 0;

    // Restore Trophies
    if (Array.isArray(backup.trophies)) {
      for (const t of backup.trophies) {
        await prisma.trophy.upsert({
          where: { id: t.id },
          update: {
            name: t.name,
            count: t.count,
            years: t.years,
            icon: t.icon,
            image: t.image,
            tier: t.tier,
            category: t.category,
            description: t.description,
            firstWon: t.firstWon,
            mostRecent: t.mostRecent,
            order: t.order,
          },
          create: {
            id: t.id,
            name: t.name,
            count: t.count,
            years: t.years,
            icon: t.icon,
            image: t.image,
            tier: t.tier,
            category: t.category,
            description: t.description,
            firstWon: t.firstWon,
            mostRecent: t.mostRecent,
            order: t.order,
          },
        });
        restoredCount++;
      }
    }

    // Restore Moments
    if (Array.isArray(backup.moments)) {
      for (const m of backup.moments) {
        await prisma.moment.upsert({
          where: { id: m.id },
          update: {
            title: m.title,
            description: m.description,
            year: m.year,
            opponent: m.opponent,
            competition: m.competition,
            category: m.category,
            imageUrl: m.imageUrl,
            videoId: m.videoId,
            tags: m.tags,
            likes: m.likes,
            aspectRatio: m.aspectRatio,
            order: m.order,
          },
          create: {
            id: m.id,
            title: m.title,
            description: m.description,
            year: m.year,
            opponent: m.opponent,
            competition: m.competition,
            category: m.category,
            imageUrl: m.imageUrl,
            videoId: m.videoId,
            tags: m.tags,
            likes: m.likes,
            aspectRatio: m.aspectRatio,
            order: m.order,
          },
        });
        restoredCount++;
      }
    }

    // Restore Eras
    if (Array.isArray(backup.eras)) {
      for (const e of backup.eras) {
        await prisma.era.upsert({
          where: { id: e.id },
          update: {
            name: e.name,
            years: e.years,
            description: e.description,
            primaryColor: e.primaryColor,
            accentColor: e.accentColor,
            bgColor: e.bgColor,
            textColor: e.textColor,
            images: e.images,
            order: e.order,
          },
          create: {
            id: e.id,
            name: e.name,
            years: e.years,
            description: e.description,
            primaryColor: e.primaryColor,
            accentColor: e.accentColor,
            bgColor: e.bgColor,
            textColor: e.textColor,
            images: e.images,
            order: e.order,
          },
        });
        restoredCount++;
      }
    }

    // Restore Settings
    if (Array.isArray(backup.siteSettings)) {
      for (const s of backup.siteSettings) {
        await prisma.siteSetting.upsert({
          where: { key: s.key },
          update: { value: s.value },
          create: { key: s.key, value: s.value },
        });
        restoredCount++;
      }
    }

    await prisma.activityLog.create({
      data: {
        action: "BACKUP_RESTORED",
        details: `Restored ${restoredCount} records from JSON backup`,
        user: "Admin",
      },
    }).catch(() => null);

    return NextResponse.json({ ok: true, restored: restoredCount });
  } catch (error: any) {
    return NextResponse.json({ ok: false, error: error.message }, { status: 500 });
  }
}
