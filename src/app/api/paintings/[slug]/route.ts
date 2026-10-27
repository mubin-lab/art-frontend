import { NextResponse } from "next/server";
import fs from "fs/promises";
import path from "path";
import fallbackData from "@/mocks/paintings.json";
import { parsePaintingParam } from "@/lib/utils/paintingUrl";
import type { Painting } from "@/types";

const DATA_FILE = path.join(process.cwd(), "src/mocks/paintings.json");

async function getPaintingsData(): Promise<Painting[]> {
  try {
    const raw = await fs.readFile(DATA_FILE, "utf-8");
    return JSON.parse(raw);
  } catch {
    return fallbackData as Painting[];
  }
}

export async function GET(
  request: Request,
  { params }: { params: Promise<{ slug: string }> }
) {
  const { slug: rawParam } = await params;
  const { id, slug } = parsePaintingParam(rawParam);

  const paintings = await getPaintingsData();

  const painting = paintings.find((p) => {
    if (id && p.id.toLowerCase() === id.toLowerCase()) return true;
    if (slug && p.slug.toLowerCase() === slug.toLowerCase()) return true;
    return (
      p.id.toLowerCase() === rawParam.toLowerCase() ||
      p.slug.toLowerCase() === rawParam.toLowerCase()
    );
  });

  if (!painting) {
    return NextResponse.json({ error: "Painting not found" }, { status: 404 });
  }
  return NextResponse.json(painting);
}

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug: rawParam } = await params;
    const body = await request.json();
    const currentPaintings = await getPaintingsData();

    const index = currentPaintings.findIndex(
      (p) => p.slug.toLowerCase() === rawParam.toLowerCase() || p.id === rawParam
    );

    if (index === -1) {
      return NextResponse.json({ error: "Painting not found" }, { status: 404 });
    }

    currentPaintings[index] = {
      ...currentPaintings[index],
      ...body,
    };

    await fs.writeFile(DATA_FILE, JSON.stringify(currentPaintings, null, 2), "utf-8");

    return NextResponse.json(currentPaintings[index]);
  } catch (error) {
    console.error("Error updating painting:", error);
    return NextResponse.json({ error: "Failed to update painting" }, { status: 500 });
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug: rawParam } = await params;
    const currentPaintings = await getPaintingsData();

    const filtered = currentPaintings.filter(
      (p) => p.slug.toLowerCase() !== rawParam.toLowerCase() && p.id !== rawParam
    );

    if (filtered.length === currentPaintings.length) {
      return NextResponse.json({ error: "Painting not found" }, { status: 404 });
    }

    await fs.writeFile(DATA_FILE, JSON.stringify(filtered, null, 2), "utf-8");

    return NextResponse.json({ success: true, message: "Painting deleted successfully" });
  } catch (error) {
    console.error("Error deleting painting:", error);
    return NextResponse.json({ error: "Failed to delete painting" }, { status: 500 });
  }
}
