import { NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { patients, doctors, avgConsultationTime } = body;

    // 1. Validate Input
    if (patients === undefined || doctors === undefined || avgConsultationTime === undefined) {
      return NextResponse.json(
        { error: 'Missing required fields: patients, doctors, avgConsultationTime' },
        { status: 400 }
      );
    }

    if (typeof doctors !== 'number' || doctors <= 0) {
      return NextResponse.json(
        { error: 'Doctors must be a valid number greater than 0' },
        { status: 400 }
      );
    }

    // 2. Logic: wait_time = (patients / doctors) * avgConsultationTime
    const estimatedWaitTime = Number(((patients / doctors) * avgConsultationTime).toFixed(1));

    let queueStatus = 'Low';
    if (estimatedWaitTime > 60) {
      queueStatus = 'High';
    } else if (estimatedWaitTime > 30) {
      queueStatus = 'Medium';
    }

    // 3. Save to Supabase DB using Prisma
    const predictionRecord = await db.prediction.create({
      data: {
        patients,
        doctors,
        avgConsultationTime,
        estimatedWaitTime,
        queueStatus,
      },
    });

    // 4. Return the record directly
    return NextResponse.json(predictionRecord, { status: 201 });
  } catch (error: any) {
    console.error('Prediction API Error:', error);
    return NextResponse.json(
      { error: 'Internal server error while creating prediction', details: error.message },
      { status: 500 }
    );
  }
}
