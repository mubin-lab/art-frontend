import { NextResponse } from "next/server";
import data from "@/mocks/rooms.json";

export async function GET() {
  return NextResponse.json(data);
}