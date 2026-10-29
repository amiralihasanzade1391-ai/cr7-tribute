import { NextRequest, NextResponse } from "next/server";
import { readdir, unlink, stat } from "fs/promises";
import path from "path";
import { prisma } from "@/lib/prisma";

const LOCAL_FOLDERS = ["uploads", "eras", "moments", "trophies", "hero", "logos", "reels"];

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const search = searchParams.get("search")?.toLowerCase();
    const type = searchParams.get("type"); // "image" | "video" | "all"

    // 1. Fetch from Database
    let items = await prisma.media.findMany({
      orderBy: { createdAt: "desc" },
    });

    // 2. If database has 0 items, seed from local filesystem folders and verified Wikimedia assets
    if (items.length === 0) {
      const discoveredMedia: Array<{ filename: string; url: string; type: string; size: number | null }> = [];

      for (const folder of LOCAL_FOLDERS) {
        try {
          const dir = path.join(process.cwd(), "public", folder === "uploads" ? "uploads" : path.join("images", folder));
          const files = await readdir(dir);
          for (const file of files) {
            if (/\.(jpg|jpeg|png|webp|svg|gif|mp4|webm)$/i.test(file)) {
              const filepath = path.join(dir, file);
              const fileStat = await stat(filepath).catch(() => null);
              const url = folder === "uploads" ? `/uploads/${file}` : `/images/${folder}/${file}`;
              const isVideo = /\.(mp4|webm)$/i.test(file);
              discoveredMedia.push({
                filename: file,
                url,
                type: isVideo ? "video" : "image",
                size: fileStat ? fileStat.size : null,
              });
            }
          }
        } catch {
          // Folder may not exist yet, continue
        }
      }

      // Pre-populate DB with discovered files
      for (const media of discoveredMedia) {
        await prisma.media.create({
          data: media,
        }).catch(() => null);
      }

      // Re-fetch populated items
      items = await prisma.media.findMany({
        orderBy: { createdAt: "desc" },
      });
    }

    // Apply filtering in memory
    let filtered = items;
    if (type && type !== "all") {
      filtered = filtered.filter((m) => m.type === type);
    }
    if (search) {
      filtered = filtered.filter(
        (m) =>
          m.filename.toLowerCase().includes(search) ||
          m.url.toLowerCase().includes(search)
      );
    }

    return NextResponse.json({ ok: true, media: filtered, total: items.length });
  } catch (error: any) {
    console.error("Media GET error:", error);
    return NextResponse.json({ ok: false, error: error.message }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { url, filename, type } = body;

    if (!url) {
      return NextResponse.json({ error: "URL is required" }, { status: 400 });
    }

    const inferredName =
      filename || url.split("/").pop()?.split("?")[0] || `asset-${Date.now()}`;
    const mediaType =
      type || (/\.(mp4|webm|mov)$/i.test(url) ? "video" : "image");

    const created = await prisma.media.create({
      data: {
        filename: inferredName,
        url,
        type: mediaType,
        size: null,
      },
    });

    await prisma.activityLog.create({
      data: {
        action: "MEDIA_REGISTERED",
        details: `Saved URL: ${inferredName}`,
        user: "Admin",
      },
    }).catch(() => null);

    return NextResponse.json({ ok: true, media: created });
  } catch (error: any) {
    return NextResponse.json({ ok: false, error: error.message }, { status: 500 });
  }
}

export async function PUT(req: NextRequest) {
  try {
    const body = await req.json();
    const { id, filename, url } = body;

    if (!id) {
      return NextResponse.json({ error: "Media ID is required" }, { status: 400 });
    }

    const updated = await prisma.media.update({
      where: { id },
      data: {
        ...(filename ? { filename } : {}),
        ...(url ? { url } : {}),
      },
    });

    await prisma.activityLog.create({
      data: {
        action: "MEDIA_UPDATED",
        details: `Updated asset ID: ${id}`,
        user: "Admin",
      },
    }).catch(() => null);

    return NextResponse.json({ ok: true, media: updated });
  } catch (error: any) {
    return NextResponse.json({ ok: false, error: error.message }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const body = await req.json();
    const ids: string[] = Array.isArray(body.ids)
      ? body.ids
      : body.id
      ? [body.id]
      : [];

    if (ids.length === 0) {
      return NextResponse.json({ error: "No media IDs provided" }, { status: 400 });
    }

    let deletedCount = 0;

    for (const id of ids) {
      const record = await prisma.media.findUnique({ where: { id } });
      if (!record) continue;

      // If it's a local file in public/uploads or public/images, remove from disk
      if (record.url.startsWith("/uploads/") || record.url.startsWith("/images/")) {
        const safePath = record.url.replace(/^\/+/, "");
        const filepath = path.join(process.cwd(), "public", safePath);
        const publicDir = path.join(process.cwd(), "public");

        if (filepath.startsWith(publicDir)) {
          try {
            await unlink(filepath);
          } catch (e) {
            // Ignore if file was already removed
          }
        }
      }

      await prisma.media.delete({ where: { id } });
      deletedCount++;
    }

    await prisma.activityLog.create({
      data: {
        action: "MEDIA_DELETED",
        details: `Deleted ${deletedCount} media record(s)`,
        user: "Admin",
      },
    }).catch(() => null);

    return NextResponse.json({ ok: true, deleted: deletedCount });
  } catch (error: any) {
    return NextResponse.json({ ok: false, error: error.message }, { status: 500 });
  }
}
