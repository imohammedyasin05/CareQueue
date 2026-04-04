import { NextResponse } from "next/server";
import { db } from "@/lib/db";

export async function GET() {
  try {
    const predictions = await db.prediction.findMany({
      orderBy: { timestamp: "desc" },
      take: 50,
    });

    return NextResponse.json(predictions);
  } catch (error) {
    console.error("History fetch error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
