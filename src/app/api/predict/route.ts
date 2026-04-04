import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { patients, doctors, avgConsultationTime } = body;

    // Validate all inputs are present
    if (
      patients === undefined ||
      doctors === undefined ||
      avgConsultationTime === undefined
    ) {
      return NextResponse.json(
        { error: "Missing required fields: patients, doctors, avgConsultationTime" },
        { status: 400 }
      );
    }

    // Validate all inputs are positive integers
    if (
      !Number.isInteger(patients) ||
      !Number.isInteger(doctors) ||
      !Number.isInteger(avgConsultationTime)
    ) {
      return NextResponse.json(
        { error: "All inputs must be integers" },
        { status: 400 }
      );
    }

    if (patients <= 0 || doctors <= 0 || avgConsultationTime <= 0) {
      return NextResponse.json(
        { error: "All inputs must be positive integers" },
        { status: 400 }
      );
    }

    // Calculate wait time in minutes
    const estimatedWaitTime = (patients / doctors) * avgConsultationTime;

    // Determine queue status
    let queueStatus: string;
    if (estimatedWaitTime <= 15) {
      queueStatus = "Low";
    } else if (estimatedWaitTime <= 45) {
      queueStatus = "Medium";
    } else {
      queueStatus = "High";
    }

    // Save prediction to database
    const prediction = await db.prediction.create({
      data: {
        patients,
        doctors,
        avgConsultationTime,
        estimatedWaitTime: Math.round(estimatedWaitTime * 100) / 100,
        queueStatus,
      },
    });

    return NextResponse.json(
      {
        id: prediction.id,
        estimatedWaitTime: prediction.estimatedWaitTime,
        queueStatus: prediction.queueStatus,
        patients: prediction.patients,
        doctors: prediction.doctors,
        avgConsultationTime: prediction.avgConsultationTime,
        timestamp: prediction.timestamp,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Prediction error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
