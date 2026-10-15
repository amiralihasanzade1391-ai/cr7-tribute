import { NextResponse } from "next/server";
import { readdir, unlink } from "fs/promises";
import path from "path";

const FOLDERS = ["eras", "moments", "trophies", "hero", "logos", "reels"];

export async function GET() {
  const result: Record<string, string[]> = {};
  for (const folder of FOLDERS) {
    try {
      const dir = path.join(process.cwd(), "public", "images", folder);
      const files = await readdir(dir);
      result[folder] = files.filter((f) => /\.(jpg|jpeg|png|webp|svg)$/i.test(f));
    } catch {
      result[folder] = [];
    }
  }
  return NextResponse.json(result);
}

export async function DELETE(req: Request) {
  try {
    const { paths } = await req.json();
    if (!Array.isArray(paths)) {
      return NextResponse.json({ error: "paths must be array" }, { status: 400 });
    }
    for (const p of paths) {
      const safePath = p.replace(/^\/+/, "");
      const filepath = path.join(process.cwd(), "public", safePath);
      const publicDir = path.join(process.cwd(), "public");
      if (!filepath.startsWith(publicDir)) continue;
      try { await unlink(filepath); } catch {}
    }
    return NextResponse.json({ ok: true, deleted: paths.length });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
