import { NextResponse } from "next/server";
import data from "@/mocks/artists.json";

export async function GET() {
  return NextResponse.json(data);
}