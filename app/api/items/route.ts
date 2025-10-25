import { NextRequest, NextResponse } from 'next/server';
import { createTimelineItem } from '@/lib/db';
import { CreateItemRequest } from '@/lib/types';

export async function POST(request: NextRequest) {
  try {
    const body: CreateItemRequest = await request.json();

    if (!body.board_id || !body.type || !body.content) {
      return NextResponse.json(
        { error: 'board_id, type, and content are required' },
        { status: 400 }
      );
    }

    if (!['note', 'image'].includes(body.type)) {
      return NextResponse.json(
        { error: 'Type must be either "note" or "image"' },
        { status: 400 }
      );
    }

    const item = await createTimelineItem(
      body.board_id,
      body.type,
      body.content,
      body.position_y || 0,
      body.position_x || 0
    );

    return NextResponse.json(item, { status: 201 });
  } catch (error) {
    console.error('Error creating timeline item:', error);
    return NextResponse.json(
      { error: 'Failed to create timeline item' },
      { status: 500 }
    );
  }
}
