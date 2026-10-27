import { NextResponse } from "next/server";
import fs from "fs/promises";
import path from "path";
import initialOrders from "@/mocks/orders.json";
import paintingsData from "@/mocks/paintings.json";
import type { Order, DashboardStats } from "@/types";

const ORDERS_FILE = path.join(process.cwd(), "src/mocks/orders.json");

export async function GET() {
  try {
    let orders: Order[] = initialOrders as Order[];
    try {
      const content = await fs.readFile(ORDERS_FILE, "utf-8");
      orders = JSON.parse(content);
    } catch {}

    const totalRevenueBDT = orders
      .filter((o) => o.status !== "Cancelled")
      .reduce((sum, o) => sum + (o.totalAmount || 0), 0);

    const pendingOrders = orders.filter((o) => o.status === "Pending").length;

    const stats: DashboardStats = {
      totalRevenueBDT,
      totalOrders: orders.length,
      pendingOrders,
      totalArtworks: paintingsData.length,
      recentOrders: orders.slice(0, 5)
    };

    return NextResponse.json(stats);
  } catch (error) {
    console.error("Error fetching dashboard stats:", error);
    return NextResponse.json({ error: "Failed to compute stats" }, { status: 500 });
  }
}
