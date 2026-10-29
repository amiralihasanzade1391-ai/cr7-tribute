import { NextRequest, NextResponse } from "next/server";
import { writeFile, mkdir } from "fs/promises";
import path from "path";
import { prisma } from "@/lib/prisma";

export async function POST(req: NextRequest) {
  try {
    const contentType = req.headers.get("content-type") || "";

    // 1. External URL registration (JSON body)
    if (contentType.includes("application/json")) {
      const body = await req.json();
      const { url, filename, type } = body;

      if (!url || typeof url !== "string") {
        return NextResponse.json({ error: "Valid URL is required" }, { status: 400 });
      }

      const inferredName =
        filename ||
        url.split("/").pop()?.split("?")[0] ||
        `external-asset-${Date.now()}`;

      const mediaType =
        type || (/\.(mp4|webm|mov|ogg)$/i.test(url) ? "video" : "image");

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
          action: "EXTERNAL_MEDIA_SAVED",
          details: `Registered external asset: ${inferredName}`,
          user: "Admin",
        },
      }).catch(() => null);

      return NextResponse.json({ ok: true, media: created, url: created.url });
    }

    // 2. Binary File Upload (Multipart Form Data)
    const formData = await req.formData();
    const file = formData.get("file") as File;
    const folder = (formData.get("folder") as string) || "uploads";

    if (!file) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 });
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // Save under public/uploads or public/images/{folder}
    const targetDir =
      folder === "uploads"
        ? path.join(process.cwd(), "public", "uploads")
        : path.join(process.cwd(), "public", "images", folder);

    await mkdir(targetDir, { recursive: true });

    const safeName = file.name.replace(/[^a-zA-Z0-9.-]/g, "_");
    const uniqueFilename = `${Date.now()}-${safeName}`;
    const filepath = path.join(targetDir, uniqueFilename);

    await writeFile(filepath, buffer);

    const publicUrl =
      folder === "uploads"
        ? `/uploads/${uniqueFilename}`
        : `/images/${folder}/${uniqueFilename}`;

    const mediaType = file.type.startsWith("video") ? "video" : "image";

    const mediaRecord = await prisma.media.create({
      data: {
        filename: file.name,
        url: publicUrl,
        type: mediaType,
        size: buffer.length,
      },
    });

    await prisma.activityLog.create({
      data: {
        action: "FILE_UPLOADED",
        details: `Uploaded ${file.name} (${(buffer.length / 1024).toFixed(1)} KB)`,
        user: "Admin",
      },
    }).catch(() => null);

    return NextResponse.json({
      ok: true,
      media: mediaRecord,
      url: publicUrl,
      filename: uniqueFilename,
    });
  } catch (error: any) {
    console.error("Upload error:", error);
    return NextResponse.json({ error: error.message || "Failed to upload" }, { status: 500 });
  }
}
