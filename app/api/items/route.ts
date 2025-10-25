import { NextRequest, NextResponse } from 'next/server';
import { sql } from '@/lib/db';
import type { TimelineItem, CreateItemInput } from '@/lib/types';

// POST /api/items - Create new timeline item
export async function POST(request: NextRequest) {
  try {
    const body: CreateItemInput = await request.json();
    
    if (!body.board_id || !body.type || !body.content) {
      return NextResponse.json(
        { error: 'board_id, type, and content are required' },
        { status: 400 }
      );
    }

    if (!['note', 'image'].includes(body.type)) {
      return NextResponse.json(
        { error: 'type must be either "note" or "image"' },
        { status: 400 }
      );
    }

    const result = await sql<TimelineItem>`
      INSERT INTO timeline_items (board_id, type, content, position_y, position_x, width, height, time)
      VALUES (
        ${body.board_id},
        ${body.type},
        ${body.content},
        ${body.position_y || 0},
        ${body.position_x || 0},
        ${body.width || null},
        ${body.height || null},
        ${body.time || null}
      )
      RETURNING *
    `;

    return NextResponse.json({ item: result.rows[0] }, { status: 201 });
  } catch (error) {
    console.error('Error creating item:', error);
    return NextResponse.json(
      { error: 'Failed to create item' },
      { status: 500 }
    );
  }
}

