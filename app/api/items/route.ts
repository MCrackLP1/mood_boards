import { NextRequest, NextResponse } from 'next/server';
import { sql } from '@/lib/db';
import type { TimelineItem, CreateItemInput } from '@/lib/types';

// POST /api/items - Create new timeline item
export async function POST(request: NextRequest) {
  try {
    const body: CreateItemInput = await request.json();
    
    // Validate required fields
    if (!body.board_id || !body.type || !body.content) {
      return NextResponse.json(
        { error: 'board_id, type, and content are required' },
        { status: 400 }
      );
    }

    // Validate board_id
    const boardId = Number(body.board_id);
    if (isNaN(boardId) || boardId <= 0 || !Number.isInteger(boardId)) {
      return NextResponse.json(
        { error: 'board_id must be a positive integer' },
        { status: 400 }
      );
    }

    // Validate type
    if (!['note', 'image'].includes(body.type)) {
      return NextResponse.json(
        { error: 'type must be either "note" or "image"' },
        { status: 400 }
      );
    }

    // Validate content
    if (typeof body.content !== 'string' || body.content.trim() === '') {
      return NextResponse.json(
        { error: 'content must be a non-empty string' },
        { status: 400 }
      );
    }

    // Validate positions (reasonable bounds, allow negative for scrolling)
    const positionX = Number(body.position_x) || 0;
    const positionY = Number(body.position_y) || 0;
    if (!Number.isFinite(positionX) || !Number.isFinite(positionY)) {
      return NextResponse.json(
        { error: 'position_x and position_y must be valid numbers' },
        { status: 400 }
      );
    }
    
    // Clamp positions to reasonable bounds and round to integers (DB requires INTEGER)
    const clampedPositionX = Math.round(Math.max(-100000, Math.min(100000, positionX)));
    const clampedPositionY = Math.round(Math.max(-100000, Math.min(100000, positionY)));

    // Validate dimensions if provided
    const width = body.width ? Number(body.width) : null;
    const height = body.height ? Number(body.height) : null;
    if (width !== null && (!Number.isFinite(width) || width <= 0 || width > 10000)) {
      return NextResponse.json(
        { error: 'width must be a positive number between 1 and 10000' },
        { status: 400 }
      );
    }
    if (height !== null && (!Number.isFinite(height) || height <= 0 || height > 10000)) {
      return NextResponse.json(
        { error: 'height must be a positive number between 1 and 10000' },
        { status: 400 }
      );
    }

    // Validate time format (HH:MM)
    const timeValue = body.time || null;
    if (timeValue !== null) {
      if (typeof timeValue !== 'string') {
        return NextResponse.json(
          { error: 'time must be a string in HH:MM format' },
          { status: 400 }
        );
      }
      const timeRegex = /^([0-1][0-9]|2[0-3]):[0-5][0-9]$/;
      if (!timeRegex.test(timeValue)) {
        return NextResponse.json(
          { error: 'time must be in HH:MM format (24-hour)' },
          { status: 400 }
        );
      }
    }

    // Verify board exists
    const boardCheck = await sql`SELECT id FROM boards WHERE id = ${boardId}`;
    if (boardCheck.rows.length === 0) {
      return NextResponse.json(
        { error: 'Board not found' },
        { status: 404 }
      );
    }

    const result = await sql<TimelineItem>`
      INSERT INTO timeline_items (board_id, type, content, position_y, position_x, width, height, time)
      VALUES (
        ${boardId},
        ${body.type},
        ${body.content.trim()},
        ${clampedPositionY},
        ${clampedPositionX},
        ${width ?? null},
        ${height ?? null},
        ${timeValue ?? null}
      )
      RETURNING *
    `;

    return NextResponse.json({ item: result.rows[0] }, { status: 201 });
  } catch (error) {
    console.error('Error creating item:', error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    return NextResponse.json(
      { error: 'Failed to create item', details: errorMessage },
      { status: 500 }
    );
  }
}

