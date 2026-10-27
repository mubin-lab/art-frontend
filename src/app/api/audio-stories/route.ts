import { NextResponse } from "next/server";
import data from "@/mocks/audio-stories.json";

export async function GET() {
  return NextResponse.json(data);
}