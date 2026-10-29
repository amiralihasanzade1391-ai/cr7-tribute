import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { seedDatabase } from "@/lib/seed";

export async function GET() {
  try {
    let trophies = await prisma.trophy.findMany({
      orderBy: { order: "asc" },
    });

    if (trophies.length === 0) {
      await seedDatabase().catch(() => null);
      trophies = await prisma.trophy.findMany({
        orderBy: { order: "asc" },
      });
    }

    return NextResponse.json({ ok: true, trophies });
  } catch (error: any) {
    return NextResponse.json({ ok: false, error: error.message }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const {
      name,
      count,
      years,
      icon,
      image,
      tier,
      category,
      description,
      firstWon,
      mostRecent,
    } = body;

    if (!name) {
      return NextResponse.json({ error: "Name is required" }, { status: 400 });
    }

    const id = body.id || name.toLowerCase().replace(/[^a-z0-9]+/g, "-");
    const countNum = parseInt(String(count), 10) || 1;
    const yearsJson = Array.isArray(years)
      ? JSON.stringify(years)
      : typeof years === "string"
      ? JSON.stringify(years.split(",").map((y: string) => y.trim()).filter(Boolean))
      : "[]";

    const totalCount = await prisma.trophy.count();

    const trophy = await prisma.trophy.create({
      data: {
        id,
        name,
        count: countNum,
        years: yearsJson,
        icon: icon || "🏆",
        image: image || null,
        tier: tier || "gold",
        category: category || "club",
        description: description || "",
        firstWon: firstWon ? parseInt(String(firstWon), 10) : null,
        mostRecent: mostRecent ? parseInt(String(mostRecent), 10) : null,
        order: totalCount,
      },
    });

    await prisma.activityLog.create({
      data: {
        action: "TROPHY_CREATED",
        details: `Added trophy: ${name} (x${countNum})`,
        user: "Admin",
      },
    }).catch(() => null);

    return NextResponse.json({ ok: true, trophy });
  } catch (error: any) {
    return NextResponse.json({ ok: false, error: error.message }, { status: 500 });
  }
}

export async function PUT(req: NextRequest) {
  try {
    const body = await req.json();

    // Batch Reorder Support
    if (Array.isArray(body.reorder)) {
      for (const item of body.reorder) {
        await prisma.trophy.update({
          where: { id: item.id },
          data: { order: item.order },
        });
      }
      return NextResponse.json({ ok: true, message: "Trophies reordered" });
    }

    const {
      id,
      name,
      count,
      years,
      icon,
      image,
      tier,
      category,
      description,
      firstWon,
      mostRecent,
      order,
    } = body;

    if (!id) {
      return NextResponse.json({ error: "Trophy ID is required" }, { status: 400 });
    }

    const yearsJson = Array.isArray(years)
      ? JSON.stringify(years)
      : typeof years === "string" && !years.startsWith("[")
      ? JSON.stringify(years.split(",").map((y: string) => y.trim()).filter(Boolean))
      : years;

    const updated = await prisma.trophy.update({
      where: { id },
      data: {
        ...(name !== undefined ? { name } : {}),
        ...(count !== undefined ? { count: parseInt(String(count), 10) } : {}),
        ...(yearsJson !== undefined ? { years: yearsJson } : {}),
        ...(icon !== undefined ? { icon } : {}),
        ...(image !== undefined ? { image: image || null } : {}),
        ...(tier !== undefined ? { tier } : {}),
        ...(category !== undefined ? { category } : {}),
        ...(description !== undefined ? { description } : {}),
        ...(firstWon !== undefined ? { firstWon: firstWon ? parseInt(String(firstWon), 10) : null } : {}),
        ...(mostRecent !== undefined ? { mostRecent: mostRecent ? parseInt(String(mostRecent), 10) : null } : {}),
        ...(order !== undefined ? { order: parseInt(String(order), 10) } : {}),
      },
    });

    await prisma.activityLog.create({
      data: {
        action: "TROPHY_UPDATED",
        details: `Updated trophy: ${updated.name}`,
        user: "Admin",
      },
    }).catch(() => null);

    return NextResponse.json({ ok: true, trophy: updated });
  } catch (error: any) {
    return NextResponse.json({ ok: false, error: error.message }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json({ error: "Trophy ID is required" }, { status: 400 });
    }

    const trophy = await prisma.trophy.delete({ where: { id } });

    await prisma.activityLog.create({
      data: {
        action: "TROPHY_DELETED",
        details: `Removed trophy: ${trophy.name}`,
        user: "Admin",
      },
    }).catch(() => null);

    return NextResponse.json({ ok: true, deleted: trophy.name });
  } catch (error: any) {
    return NextResponse.json({ ok: false, error: error.message }, { status: 500 });
  }
}
