import { NextRequest, NextResponse } from 'next/server';
import { synchronizeHistory } from 'lib/study/synchronizeHistory';
import { GameHistory } from 'lib/study/GameHistory';

export async function POST(request: NextRequest) {
  try {
    const text = await request.text();
    if (!text || text.trim() === '') {
      console.log('Empty request body received');
      return NextResponse.json({ success: false, error: 'Empty request body' }, { status: 400 });
    }
    const history: GameHistory = JSON.parse(text);
    await synchronizeHistory(history);
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error processing history upload:', error);
    return NextResponse.json({ success: false, error: 'Failed to process history' }, { status: 500 });
  }
}
