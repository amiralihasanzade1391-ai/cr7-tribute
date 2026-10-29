import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { seedDatabase } from "@/lib/seed";

export async function GET() {
  try {
    let eras = await prisma.era.findMany({
      orderBy: { order: "asc" },
    });

    if (eras.length === 0) {
      await seedDatabase().catch(() => null);
      eras = await prisma.era.findMany({
        orderBy: { order: "asc" },
      });
    }

    return NextResponse.json({ ok: true, eras });
  } catch (error: any) {
    return NextResponse.json({ ok: false, error: error.message }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const {
      name,
      years,
      description,
      primaryColor,
      accentColor,
      bgColor,
      textColor,
      images,
    } = body;

    if (!name || !years || !description) {
      return NextResponse.json(
        { error: "Name, years, and description are required" },
        { status: 400 }
      );
    }

    const id = body.id || name.toLowerCase().replace(/[^a-z0-9]+/g, "-");
    const imagesJson = Array.isArray(images)
      ? JSON.stringify(images)
      : typeof images === "string"
      ? JSON.stringify([images])
      : "[]";

    const totalCount = await prisma.era.count();

    const era = await prisma.era.create({
      data: {
        id,
        name,
        years,
        description,
        primaryColor: primaryColor || "#FEBE10",
        accentColor: accentColor || "#FEBE10",
        bgColor: bgColor || "#000000",
        textColor: textColor || "#FFFFFF",
        images: imagesJson,
        order: totalCount,
      },
    });

    await prisma.activityLog.create({
      data: {
        action: "ERA_CREATED",
        details: `Added career era: ${name} (${years})`,
        user: "Admin",
      },
    }).catch(() => null);

    return NextResponse.json({ ok: true, era });
  } catch (error: any) {
    return NextResponse.json({ ok: false, error: error.message }, { status: 500 });
  }
}

export async function PUT(req: NextRequest) {
  try {
    const body = await req.json();

    // Batch Reorder
    if (Array.isArray(body.reorder)) {
      for (const item of body.reorder) {
        await prisma.era.update({
          where: { id: item.id },
          data: { order: item.order },
        });
      }
      return NextResponse.json({ ok: true, message: "Eras reordered" });
    }

    const {
      id,
      name,
      years,
      description,
      primaryColor,
      accentColor,
      bgColor,
      textColor,
      images,
      order,
    } = body;

    if (!id) {
      return NextResponse.json({ error: "Era ID is required" }, { status: 400 });
    }

    const imagesJson = Array.isArray(images)
      ? JSON.stringify(images)
      : typeof images === "string" && !images.startsWith("[")
      ? JSON.stringify([images])
      : images;

    const updated = await prisma.era.update({
      where: { id },
      data: {
        ...(name !== undefined ? { name } : {}),
        ...(years !== undefined ? { years } : {}),
        ...(description !== undefined ? { description } : {}),
        ...(primaryColor !== undefined ? { primaryColor } : {}),
        ...(accentColor !== undefined ? { accentColor } : {}),
        ...(bgColor !== undefined ? { bgColor } : {}),
        ...(textColor !== undefined ? { textColor } : {}),
        ...(imagesJson !== undefined ? { images: imagesJson } : {}),
        ...(order !== undefined ? { order: parseInt(String(order), 10) } : {}),
      },
    });

    await prisma.activityLog.create({
      data: {
        action: "ERA_UPDATED",
        details: `Updated era: ${updated.name}`,
        user: "Admin",
      },
    }).catch(() => null);

    return NextResponse.json({ ok: true, era: updated });
  } catch (error: any) {
    return NextResponse.json({ ok: false, error: error.message }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json({ error: "Era ID is required" }, { status: 400 });
    }

    const era = await prisma.era.delete({ where: { id } });

    await prisma.activityLog.create({
      data: {
        action: "ERA_DELETED",
        details: `Deleted era: ${era.name}`,
        user: "Admin",
      },
    }).catch(() => null);

    return NextResponse.json({ ok: true, deleted: era.name });
  } catch (error: any) {
    return NextResponse.json({ ok: false, error: error.message }, { status: 500 });
  }
}
