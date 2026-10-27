import { NextResponse } from "next/server";
import fs from "fs/promises";
import path from "path";
import data from "@/mocks/artists.json";
import type { Artist } from "@/types";

const DATA_FILE = path.join(process.cwd(), "src/mocks/artists.json");

export async function GET() {
  return NextResponse.json(data);
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    if (!body.name) {
      return NextResponse.json({ error: "Artist name is required" }, { status: 400 });
    }

    const currentArtists: Artist[] = JSON.parse(await fs.readFile(DATA_FILE, "utf-8"));
    const slug = body.slug || body.name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");

    const newArtist: Artist = {
      name: body.name,
      slug,
      avatar: body.avatar || "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=160&h=160&fit=crop",
      artworkCount: body.artworkCount || 0,
      bio: body.bio || "",
      movement: body.movement || "Master Artist"
    };

    currentArtists.push(newArtist);
    await fs.writeFile(DATA_FILE, JSON.stringify(currentArtists, null, 2), "utf-8");

    return NextResponse.json(newArtist, { status: 201 });
  } catch (error) {
    console.error("Error creating artist:", error);
    return NextResponse.json({ error: "Failed to create artist" }, { status: 500 });
  }
}
