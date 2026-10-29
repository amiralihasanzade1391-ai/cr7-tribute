import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { seedDatabase } from "@/lib/seed";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const category = searchParams.get("category");
    const search = searchParams.get("search")?.toLowerCase();

    let moments = await prisma.moment.findMany({
      orderBy: { order: "asc" },
    });

    if (moments.length === 0) {
      await seedDatabase().catch(() => null);
      moments = await prisma.moment.findMany({
        orderBy: { order: "asc" },
      });
    }

    let filtered = moments;
    if (category && category !== "all") {
      filtered = filtered.filter((m) => m.category === category);
    }
    if (search) {
      filtered = filtered.filter(
        (m) =>
          m.title.toLowerCase().includes(search) ||
          m.description.toLowerCase().includes(search) ||
          m.opponent?.toLowerCase().includes(search) ||
          m.competition?.toLowerCase().includes(search)
      );
    }

    return NextResponse.json({ ok: true, moments: filtered, total: moments.length });
  } catch (error: any) {
    return NextResponse.json({ ok: false, error: error.message }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const {
      title,
      description,
      year,
      opponent,
      competition,
      category,
      imageUrl,
      videoId,
      tags,
      aspectRatio,
      likes,
    } = body;

    if (!title || !description || !year || !imageUrl) {
      return NextResponse.json(
        { error: "Title, description, year, and imageUrl are required" },
        { status: 400 }
      );
    }

    const id = body.id || `m-${Date.now()}`;
    const yearNum = parseInt(String(year), 10) || 2020;
    const likesNum = parseInt(String(likes), 10) || 0;
    const tagsJson = Array.isArray(tags)
      ? JSON.stringify(tags)
      : typeof tags === "string"
      ? JSON.stringify(tags.split(",").map((t: string) => t.trim()).filter(Boolean))
      : "[]";

    const totalCount = await prisma.moment.count();

    const moment = await prisma.moment.create({
      data: {
        id,
        title,
        description,
        year: yearNum,
        opponent: opponent || null,
        competition: competition || null,
        category: category || "goal",
        imageUrl,
        videoId: videoId || null,
        tags: tagsJson,
        aspectRatio: aspectRatio || "tall",
        likes: likesNum,
        order: totalCount,
      },
    });

    await prisma.activityLog.create({
      data: {
        action: "MOMENT_CREATED",
        details: `Added moment: ${title} (${yearNum})`,
        user: "Admin",
      },
    }).catch(() => null);

    return NextResponse.json({ ok: true, moment });
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
        await prisma.moment.update({
          where: { id: item.id },
          data: { order: item.order },
        });
      }
      return NextResponse.json({ ok: true, message: "Moments reordered" });
    }

    const {
      id,
      title,
      description,
      year,
      opponent,
      competition,
      category,
      imageUrl,
      videoId,
      tags,
      aspectRatio,
      likes,
      order,
    } = body;

    if (!id) {
      return NextResponse.json({ error: "Moment ID is required" }, { status: 400 });
    }

    const tagsJson = Array.isArray(tags)
      ? JSON.stringify(tags)
      : typeof tags === "string" && !tags.startsWith("[")
      ? JSON.stringify(tags.split(",").map((t: string) => t.trim()).filter(Boolean))
      : tags;

    const updated = await prisma.moment.update({
      where: { id },
      data: {
        ...(title !== undefined ? { title } : {}),
        ...(description !== undefined ? { description } : {}),
        ...(year !== undefined ? { year: parseInt(String(year), 10) } : {}),
        ...(opponent !== undefined ? { opponent: opponent || null } : {}),
        ...(competition !== undefined ? { competition: competition || null } : {}),
        ...(category !== undefined ? { category } : {}),
        ...(imageUrl !== undefined ? { imageUrl } : {}),
        ...(videoId !== undefined ? { videoId: videoId || null } : {}),
        ...(tagsJson !== undefined ? { tags: tagsJson } : {}),
        ...(aspectRatio !== undefined ? { aspectRatio } : {}),
        ...(likes !== undefined ? { likes: parseInt(String(likes), 10) } : {}),
        ...(order !== undefined ? { order: parseInt(String(order), 10) } : {}),
      },
    });

    await prisma.activityLog.create({
      data: {
        action: "MOMENT_UPDATED",
        details: `Updated moment: ${updated.title}`,
        user: "Admin",
      },
    }).catch(() => null);

    return NextResponse.json({ ok: true, moment: updated });
  } catch (error: any) {
    return NextResponse.json({ ok: false, error: error.message }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json({ error: "Moment ID is required" }, { status: 400 });
    }

    const moment = await prisma.moment.delete({ where: { id } });

    await prisma.activityLog.create({
      data: {
        action: "MOMENT_DELETED",
        details: `Deleted moment: ${moment.title}`,
        user: "Admin",
      },
    }).catch(() => null);

    return NextResponse.json({ ok: true, deleted: moment.title });
  } catch (error: any) {
    return NextResponse.json({ ok: false, error: error.message }, { status: 500 });
  }
}
