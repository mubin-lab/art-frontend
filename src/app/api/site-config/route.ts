import { NextResponse } from "next/server";
import fs from "fs/promises";
import path from "path";
import data from "@/mocks/site-config.json";

const DATA_FILE = path.join(process.cwd(), "src/mocks/site-config.json");

export async function GET() {
  try {
    const raw = await fs.readFile(DATA_FILE, "utf-8");
    return NextResponse.json(JSON.parse(raw));
  } catch {
    return NextResponse.json(data);
  }
}

export async function PUT(request: Request) {
  try {
    const body = await request.json();
    let currentConfig = data;
    try {
      const raw = await fs.readFile(DATA_FILE, "utf-8");
      currentConfig = JSON.parse(raw);
    } catch {
      // fallback to mock
    }

    const updated = {
      ...currentConfig,
      ...body,
    };

    await fs.writeFile(DATA_FILE, JSON.stringify(updated, null, 2), "utf-8");
    return NextResponse.json(updated);
  } catch (error) {
    console.error("Error updating site config:", error);
    return NextResponse.json({ error: "Failed to update site config" }, { status: 500 });
  }
}
