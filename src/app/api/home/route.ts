import { NextResponse } from "next/server";
import fs from "fs/promises";
import path from "path";
import data from "@/mocks/home.json";

const DATA_FILE = path.join(process.cwd(), "src/mocks/home.json");

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
    let currentHome = data;
    try {
      const raw = await fs.readFile(DATA_FILE, "utf-8");
      currentHome = JSON.parse(raw);
    } catch {
      // fallback
    }

    const updated = {
      ...currentHome,
      ...body,
    };

    await fs.writeFile(DATA_FILE, JSON.stringify(updated, null, 2), "utf-8");
    return NextResponse.json(updated);
  } catch (error) {
    console.error("Error updating home data:", error);
    return NextResponse.json({ error: "Failed to update home data" }, { status: 500 });
  }
}
