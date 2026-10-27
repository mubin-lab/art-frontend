import { NextResponse } from "next/server";
import data from "@/mocks/navigation.json";

export async function GET() {
  return NextResponse.json(data);
}