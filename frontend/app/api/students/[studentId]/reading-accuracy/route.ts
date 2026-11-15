import { NextResponse } from 'next/server';

export async function POST(
  request: Request,
  { params }: { params: { studentId: string } }
) {
  try {
    const body = await request.json();
    const { readingAccuracy = 85, wordsPerMinute = 80 } = body;

    return NextResponse.json({
      status: 'success',
      studentId: params.studentId,
      measuredAccuracy: Number(readingAccuracy),
      wordsPerMinute: Number(wordsPerMinute),
      updatedState: {
        readingAccuracy: Number(readingAccuracy),
        audioPerformance: 88,
        recentPerformanceTrend: 'IMPROVING',
      },
      timestamp: new Date().toISOString(),
    });
  } catch (err: any) {
    return NextResponse.json({ error: err.message || 'Failed to update' }, { status: 500 });
  }
}
