import { NextResponse } from "next/server";
import data from "@/mocks/photo-to-painting.json";

export async function GET() {
  return NextResponse.json(data);
}