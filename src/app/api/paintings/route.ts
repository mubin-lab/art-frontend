import { NextResponse } from "next/server";
import fs from "fs/promises";
import path from "path";
import fallbackData from "@/mocks/paintings.json";
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

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  let list = await getPaintingsData();

  if (searchParams.get("bestseller") === "true") {
    list = list.filter((p) => p.bestseller);
  }
  if (searchParams.get("top100") === "true") {
    list = list.filter((p) => p.top100Rank !== undefined).sort((a, b) => (a.top100Rank || 999) - (b.top100Rank || 999));
  }
  const artist = searchParams.get("artistSlug");
  if (artist) {
    list = list.filter((p) => p.artistSlug === artist);
  }
  const movement = searchParams.get("movement");
  if (movement) {
    list = list.filter((p) => p.movement && p.movement.toLowerCase() === movement.toLowerCase());
  }
  const limit = searchParams.get("limit");
  if (limit) {
    list = list.slice(0, parseInt(limit, 10));
  }

  return NextResponse.json(list);
}

export async function POST(request: Request) {
  try {
    const body = await request.json();

    if (!body.title || !body.priceFrom) {
      return NextResponse.json(
        { error: "Title and Base Price (priceFrom) are required" },
        { status: 400 }
      );
    }

    const currentPaintings = await getPaintingsData();

    const newId = body.id || (10000 + currentPaintings.length + 1).toString();
    const newSlug = body.slug || body.title.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");

    const newPainting: Painting = {
      ...body,
      id: newId,
      slug: newSlug,
      currency: "BDT",
      freeDelivery: body.freeDelivery ?? false,
      deliveryFee: body.deliveryFee ?? 70,
      frames: body.frames || [
        { id: "gold", name: "Gold", swatch: "#d4af37" },
        { id: "white", name: "Silver white", swatch: "#f4f4f4" },
        { id: "silver", name: "Silver", swatch: "#c0c0c0" }
      ],
      descriptionImage: body.descriptionImage || [],
      customerFeedbacks: body.customerFeedbacks || [],
      descriptions: body.descriptions || [body.description || ""]
    };

    currentPaintings.unshift(newPainting);

    await fs.writeFile(DATA_FILE, JSON.stringify(currentPaintings, null, 2), "utf-8");

    return NextResponse.json(newPainting, { status: 201 });
  } catch (error) {
    console.error("Error creating painting:", error);
    return NextResponse.json({ error: "Failed to create painting" }, { status: 500 });
  }
}
