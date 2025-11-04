import { NextRequest, NextResponse } from 'next/server';
import { sql } from '@/lib/db';
import type { Board, TimelineItem } from '@/lib/types';

type RouteContext = {
  params: Promise<{ id: string }>;
};

// GET /api/boards/[id] - Get board with items
export async function GET(
  request: NextRequest,
  context: RouteContext
) {
  try {
    const { id } = await context.params;
    const boardId = parseInt(id);

    if (isNaN(boardId)) {
      return NextResponse.json(
        { error: 'Invalid board ID' },
        { status: 400 }
      );
    }

    // Get board
    const boardResult = await sql<Board>`
      SELECT * FROM boards WHERE id = ${boardId}
    `;

    if (boardResult.rows.length === 0) {
      return NextResponse.json(
        { error: 'Board not found' },
        { status: 404 }
      );
    }

    // Get timeline items
    const itemsResult = await sql<TimelineItem>`
      SELECT * FROM timeline_items 
      WHERE board_id = ${boardId}
      ORDER BY position_y ASC
    `;

    return NextResponse.json({
      board: boardResult.rows[0],
      items: itemsResult.rows,
    });
  } catch (error) {
    console.error('Error fetching board:', error);
    return NextResponse.json(
      { error: 'Failed to fetch board' },
      { status: 500 }
    );
  }
}

// PATCH /api/boards/[id] - Update board
export async function PATCH(
  request: NextRequest,
  context: RouteContext
) {
  try {
    const { id } = await context.params;
    const boardId = parseInt(id);

    if (isNaN(boardId)) {
      return NextResponse.json(
        { error: 'Invalid board ID' },
        { status: 400 }
      );
    }

    const body = await request.json();

    if (!body.title || typeof body.title !== 'string') {
      return NextResponse.json(
        { error: 'Title is required and must be a string' },
        { status: 400 }
      );
    }

    const trimmedTitle = body.title.trim();
    if (trimmedTitle === '') {
      return NextResponse.json(
        { error: 'Title cannot be empty' },
        { status: 400 }
      );
    }

    if (trimmedTitle.length > 255) {
      return NextResponse.json(
        { error: 'Title must be 255 characters or less' },
        { status: 400 }
      );
    }

    // Check if board exists
    const boardCheck = await sql<Board>`SELECT id FROM boards WHERE id = ${boardId}`;
    if (boardCheck.rows.length === 0) {
      return NextResponse.json(
        { error: 'Board not found' },
        { status: 404 }
      );
    }

    const result = await sql<Board>`
      UPDATE boards 
      SET title = ${trimmedTitle}, updated_at = NOW()
      WHERE id = ${boardId}
      RETURNING *
    `;

    return NextResponse.json({ board: result.rows[0] });
  } catch (error) {
    console.error('Error updating board:', error);
    return NextResponse.json(
      { error: 'Failed to update board' },
      { status: 500 }
    );
  }
}

// DELETE /api/boards/[id] - Delete board
export async function DELETE(
  request: NextRequest,
  context: RouteContext
) {
  try {
    const { id } = await context.params;
    const boardId = parseInt(id);

    if (isNaN(boardId)) {
      return NextResponse.json(
        { error: 'Invalid board ID' },
        { status: 400 }
      );
    }

    await sql`DELETE FROM boards WHERE id = ${boardId}`;

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting board:', error);
    return NextResponse.json(
      { error: 'Failed to delete board' },
      { status: 500 }
    );
  }
}

