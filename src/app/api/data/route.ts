import { NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function GET() {
  try {
    // Return all queue_data records ordered by creation date
    const allRecords = await db.queue_data.findMany({
      orderBy: {
        created_at: 'desc',
      },
    });

    return NextResponse.json(allRecords, { status: 200 });
  } catch (error: any) {
    console.error('Fetch API Error:', error);
    return NextResponse.json(
      { error: 'Internal server error while fetching data', details: error.message },
      { status: 500 }
    );
  }
}
