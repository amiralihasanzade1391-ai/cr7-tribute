import { NextRequest, NextResponse } from "next/server";
import { readFile, writeFile, mkdir } from "fs/promises";
import path from "path";

const FILE = path.join(process.cwd(), "src", "data", "site-overrides.json");

export async function GET() {
  try {
    const data = await readFile(FILE, "utf-8");
    return NextResponse.json(JSON.parse(data));
  } catch {
    return NextResponse.json({ eras: {}, moments: {} });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const dir = path.dirname(FILE);
    await mkdir(dir, { recursive: true });
    await writeFile(FILE, JSON.stringify(body, null, 2));
    return NextResponse.json({ ok: true });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
